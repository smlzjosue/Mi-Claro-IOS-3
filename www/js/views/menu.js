$(function() {

	// Menu View
	// ---------------
	
	app.views.MenuView = app.views.CommonView.extend({

		name:'menu',

        rechargeAmount: 0,

        dataGiftReceived: null,

        TotalAvailable: 0,
        CreditAsReferer: 0,
        CreditAsRefererCount: 0,
        TempAvailableCredits: 0,
        CheckAvailableCredits: false,

        // The DOM events specific.
		events: {
            // events
        	'active':                                       'active',
        	'pagecreate':                                   'pageCreate',

            'change #select-account':					    'simpleChangeAccount',
            'change #select-subscriber':					'changeSubscriber',
            'click .btn-bill': 					            'billPayment',
            'click #btn-recharge': 					        'recharge',
            'click #btn-apply': 					        'applyCredits',
            'click .dashdirect-chat':                       'chat',
            'click #paperless-switch':                      'changePaperless',
            'click #close-1gb':                             'closePopup1GB',
            'click #netflix-subscription':                  'netflixSubscription',

            'show.bs.popover div[data-toggle="popover"]':   'showPopOver'
		},
		
		// Render the template elements
		render:function (callback) {
			var self = this,
				variables = {};

			// user hasn't logged in
			if(app.utils.Storage.getSessionItem('token') == null){
                document.location.href = 'index.html';
			} else {

			    var selectedAccount = app.utils.Storage.getSessionItem('selected-account');
                var accountInfo = app.utils.Storage.getSessionItem('account-info');
                var qualification = app.utils.Storage.getSessionItem('qualification');

                var amountDue = accountInfo.billBalanceField;
                var lastPaymentAmount = accountInfo.lastPaymentAmountField;
                lastPaymentAmount = parseFloat(String(lastPaymentAmount)).toFixed(2);
                lastPaymentAmount = app.utils.tools.formatAmount(lastPaymentAmount);
                var amountPayable = amountDue.includes('CR') ? '0' : amountDue;
                amountPayable = parseFloat(String(amountPayable.replace(',',''))).toFixed(2);
                var redeemProgram = qualification.RefererResponse.registerUpdated && qualification.RefererResponse.paperless;
                var paperless = accountInfo.paperlessField;

                // if is prepaid
                var nextRecharge = '';
                if (self.isCurrentAccountPrepaid()) {
                    amountDue = self.getCurrentAccountPrepaidBalance();
                    nextRecharge = self.getCurrentAccountPrepaidPlanInfo().endDateField;
                    if (nextRecharge == null || nextRecharge == undefined || nextRecharge == "") {
                        nextRecharge = "N/A";
                    }
                }

                variables = {
                    isPrepaid: self.isCurrentAccountPrepaid(),
                    selectedTab: app.utils.Storage.getSessionItem('selected-tab'),
                    requiredAssociate: app.utils.Storage.getSessionItem('required-associate-account'),
                    accounts: this.getSelectTabAccounts(),
                    selectedAccountValue: app.utils.Storage.getSessionItem('selected-account-value'),
                    selectedSubscriberValue: app.utils.Storage.getSessionItem('selected-subscriber-value'),
                    selectedAccount: selectedAccount,
                    wirelessAccount: selectedAccount.prodCategory === 'WLS',
                    name: accountInfo.firstNameField,
                    billDate: accountInfo.billDateField,
                    nextRecharge: nextRecharge,
                    billDueDate: accountInfo.billDueDateField,
                    lastPaymentDate: accountInfo.lastPaymentDateField,
                    amountDue: amountDue,
                    lastPaymentAmount: lastPaymentAmount,
                    amountPayable: amountPayable,
                    redeemProgramAvailable: redeemProgram,
                    paperless: paperless,
                    currentSubscribers: app.utils.Storage.getSessionItem('subscribers-info'),
                    referralSystemEnabled: true,
					guest: app.utils.Storage.getLocalItem('logged-guest'),
                    typeOfTelephony: app.utils.tools.typeOfTelephony,
                    account: app.utils.Storage.getSessionItem('account'),
                    access: app.utils.Storage.getSessionItem('access-list'),
                    accountSections: this.getUserAccess(),
                    convertCaseStr: app.utils.tools.convertCase,
                    showBackBth: false
                };
				
				app.TemplateManager.get(self.name, function(code){
			    	var template = cTemplate(code.html());
			    	$(self.el).html(template(variables));
			    	callback();	
			    	return this;
			    });
			}
			$(document).scrollTop();
		},

		pageCreate: function(e) {
            var self = this;
            // removing any enter event
            $('body').unbind('keypress');
            self.activateMenu(e);

            $('.due-amount').on('click focus', function (e) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $(".due-amount").offset().top-50
                }, 1000);
            });

            $('.recharge-amount').on('click focus', function (e) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $(".recharge-amount").offset().top-50
                }, 1000);
            });
			
            if (app.utils.Storage.getSessionItem('selected-account-is-suspend')) {
            	
                showConfirm(
                	'Alerta',
                    'Su cuenta esta suspendida. Para activar la misma, favor realice su pago.',
                    ['Cancelar', 'Pagar'],
                    function(button){
                    
	                    // var accountModel = new app.models.Account();
                        // update suspend account value
                        app.utils.Storage.setSessionItem('suspend-account', true);
                    
    	                if(button==2) {
                            self.navigateInvoiceSummary();
                        }
                    });
            }

            // enable tooltips
            $('[data-toggle="popover"]').popover({
                animation: false
            });

            $.mobile.activePage.on("show.bs.popover", ".tooltip-amount", function(event) {
                //event.stopPropagation();
                setTimeout(function(){
                    $.mobile.activePage.find('[data-toggle="popover"]').popover('hide');
                },3000);
            });

            self.setupNotifications();

	        /* obtain credits for user */
            self.getUserCredits();

            /* check gifts if is postpaid */
            const selectedAccount = app.utils.Storage.getSessionItem('selected-account');
            if (app.utils.tools.accountIsPostpaid(
                    selectedAccount.mAccountType,
                    selectedAccount.mAccountSubType,
                    selectedAccount.mProductType)) {
                self.get1GBReceived();
            }
		},

        setupNotifications: function() {
            var notifications = app.utils.Storage.getSessionItem('notifications');
            if (notifications.hasError == false) {
                var countMessages = 0;
                if (notifications.newMessageCounter != null
                    && notifications.newMessageCounter != ""
                    && notifications.newMessageCounter > 0) {
                    countMessages = notifications.newMessageCounter;
                }
                if (countMessages > 0) {
                    $('#bag-not-count').show();
                    $('#count-notifications').html(String(countMessages));
                } else {
                    $('#bag-not-count').hide();
                }
            } else {
                $('#bag-not-count').hide();
            }
        },

        changeSubscriber: function(e) {
            var self = this;
            const subscriberNumber = $.mobile.activePage.find('#select-subscriber').val();
            var selectedAccount = app.utils.Storage.getSessionItem('selected-account');
            app.utils.Storage.setSessionItem('selected-subscriber-value', subscriberNumber);
            self.registerPrepaidToken(selectedAccount, subscriberNumber,
                function () {
                    self.render(function(){
                        $.mobile.activePage.trigger('pagecreate');
                    });
                },
                // app.utils.network.errorRequest // TODO, esta debe ser la funciona original
                function () { // TODO, esta funcion on error mientras
                    self.render(function(){
                        $.mobile.activePage.trigger('pagecreate');
                    });
                }
            );
        },

        getUserCredits : function() {
            var self = this;
            const selectedAccount = app.utils.Storage.getSessionItem('selected-account');
            self.options.referrerModel.getCredits(String(selectedAccount.Account),
                function (response) {
                    if (!response.hasError) {
                        console.log(response);
                        if (response.CreditAsReferer !== null &&
                            response.CreditAsReferer.CuponStatus === 'Disponible' &&
                            response.CreditAsReferer.referrID !== 0 &&
                            response.CreditAsReferer.referrID !== null) {

                            self.CreditAsReferer = true;
                            self.CreditAsRefererCount = response.CreditAsReferer.discount;
                            self.TotalAvailable = response.CreditItems[0].TotalAvailable;

                            if (app.utils.tools.accountIsTelephony(selectedAccount.mAccountType, selectedAccount.mAccountSubType, selectedAccount.mProductType)) {
                                if (self.TotalAvailable > 0) {
                                    $('#sumAvialable').html('50 %');
                                } else {
                                    $('#sumAvialable').html('0 %');
                                }
                            } else {
                                $('#sumAvialable').html('$'+app.utils.tools.formatAmount(self.TotalAvailable));
                            }
                            var mountToCompare = 50;
                            if (app.utils.tools.accountIsPostpaid(selectedAccount.mAccountType, selectedAccount.mAccountSubType, selectedAccount.mProductType)) {
                                mountToCompare = 50;
                            } else if (app.utils.tools.accountIsPrepaid(selectedAccount.mAccountType, selectedAccount.mAccountSubType, selectedAccount.mProductType)) {
                                mountToCompare = 25;
                            }
                            if (self.TotalAvailable >= mountToCompare) {
                                $('#credit-amount').val('$'+mountToCompare+'.00');
                            } else {
                                $('#credit-amount').val('$0.00');
                            }

                            if (self.CheckAvailableCredits) {
                                self.CheckAvailableCredits = false;
                                if (self.TempAvailableCredits == self.TotalAvailable) {
                                    showAlert('', 'Gracias por su interés en nuestro Programa Refiere y Gana! Su ' +
                                        'balance se estará actualizando próximamente.', 'Aceptar');
                                } else {
                                    self.reloadCurrentAccountDetails();
                                }
                            }
                            self.TempAvailableCredits = self.TotalAvailable;
                        }
                    } else {
                        showAlert('Error', response.errorDisplay, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            );
        },

        get1GBReceived: function() {
            var self = this;
            var selectedAccountValue = app.utils.Storage.getSessionItem('selected-account-value');
            self.options.customerModel.getGift1GBSend(selectedAccountValue,
                function (response) {
                    if (!response.HasError) {
                        if (response.Gift1GBsents.length > 0) {
                            const product = response.Gift1GBsents[0];
                            self.dataGiftReceived = product;
                            $('.popup-1gb').show();
                            $('.popup-1gb').find('.sender-name').html(product.NameSender);
                            $('.popup-1gb').find('.sender-message').html(product.Message);
                        }
                    } else {
                        showAlert('Error', response.ErrorDesc, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            );
        },

        closePopup1GB: function(e) {
            $('.popup-1gb').hide();

            var self = this;
            self.options.customerModel.getGift1GBByGUI(
                self.dataGiftReceived.BANReceiver,
                self.dataGiftReceived.GUI,
                function (response) {
                    if (!response.HasError) {
                        showAlert('', 'El Regalo ha sido aceptado con Éxito', 'ok',
                            function () {
                                self.render(function(){
                                    $.mobile.activePage.trigger('pagecreate');
                                });
                            }
                        );
                    } else {
                        showAlert('Error', response.ErrorDesc, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            );
        },

        applyCredits: function() {
            var self = this;

            const selectedAccount = app.utils.Storage.getSessionItem('selected-account');
            const postpaid = app.utils.tools.accountIsPostpaid(selectedAccount.mAccountType, selectedAccount.mAccountSubType, selectedAccount.mProductType);
            const prepaid = app.utils.tools.accountIsPrepaid(selectedAccount.mAccountType, selectedAccount.mAccountSubType, selectedAccount.mProductType);
            const telephony = app.utils.tools.accountIsTelephony(selectedAccount.mAccountType, selectedAccount.mAccountSubType, selectedAccount.mProductType);

            const accountInfo = app.utils.Storage.getSessionItem('account-info');
            const paperless = accountInfo.paperlessField;

            const creditAmount = $('#credit-amount').val();
            var amount = 50;
            if (!telephony) {
                amount = parseFloat(String(creditAmount.replace('$', '')));
            }

            const billBalance = accountInfo.billBalanceField;
            var debt = billBalance.includes('CR') ? 0 : billBalance;
            var creditsAvailable = self.TotalAvailable;
            debt = parseFloat(String(debt));
            creditsAvailable = parseFloat(String(creditsAvailable));

            if (!paperless) {
                showAlert('Error', 'Para participar en nuestro Programa Refiere y Gana, debe suscribirse a facturación electrónica. Para detalles, verifique los términos y condiciones de este Programa.', 'ok');
            } else if ((postpaid || telephony) && (billBalance.includes('CR') || parseFloat(billBalance) == 0)) {
                showAlert('Error', 'Para aplicar su cupón de descuento deberá tener un balance pendiente.', 'ok');
            } else if (creditsAvailable == 0) {
                showAlert('Error', 'En estos momentos no cuenta con cupones disponibles.', 'ok');
            } else if (telephony) {
                showConfirm(
                    'Confirmación',
                    'Usted recibira un descuento de 50% aplicado a su balance.',
                    ['Regresar','Aplicar'],
                    function(button){
                        if(button == 2) {
                            self.applyCreditsToAccount(amount);
                        }
                    }
                );
            } else if (creditsAvailable < amount) {
                showAlert('Error', 'En estos momentos no cuenta con suficientes cupones disponibles.', 'ok');
            } else if (prepaid) {
                showConfirm(
                    'Confirmación',
                    'El valor del cupón sera aplicado a su balance.',
                    ['Regresar','Aplicar'],
                    function(button){
                        if(button == 2) {
                            self.applyCreditsToAccount(amount);
                        }
                    }
                );
            } else if (amount > debt) {
                showConfirm(
                    'Confirmación',
                    'El valor del cupón (descuento) redimido es mayor al balance pendiente de su factura, al redimir este cupón usted perderá el valor del descuento restante.',
                    ['Regresar','Aplicar'],
                    function(button){
                        if(button == 2) {
                            self.applyCreditsToAccount(amount);
                        }
                    }
                );
            } else if (amount < debt) {
                showConfirm(
                    'Confirmación',
                    'El valor del cupón (descuento) redimido es menor al balance pendiente de su factura. Favor de realizar el pago remanente de su factura en o antes de la fecha de vencimiento.',
                    ['Regresar','Aplicar'],
                    function(button){
                        if(button == 2) {
                            self.applyCreditsToAccount(amount);
                        }
                    }
                );
            }
        },

        applyCreditsToAccount: function(amount) {
            var self = this;
            const selectedAccount = app.utils.Storage.getSessionItem('selected-account');
            self.options.referrerModel.applyCredits(
                String(selectedAccount.Account),
                String(selectedAccount.DefaultSubscriber),
                amount,
                function (response) {
                    if (!response.hasError) {
                        showAlert('', response.errorDisplay, 'Continuar', function () {
                            self.CheckAvailableCredits = true;
                            self.getUserCredits();
                        });
                    } else {
                        showAlert('Error', response.errorDisplay, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            );
        },

        billPayment: function(e){
            var self = this,
                accountInfo = app.utils.Storage.getSessionItem('account-info'),
                amountDue = parseFloat($('.due-amount').val()),
                creditAmountDue = accountInfo.billBalanceField.includes('CR') ? accountInfo.billBalanceField.replace('CR','') : 0,
                billBalance = accountInfo.billBalanceField.includes('CR') ? 0 : accountInfo.billBalanceField,
                selectedAccountValue = app.utils.Storage.getSessionItem('selected-account-value');
            creditAmountDue = parseFloat(String(creditAmountDue).replace(',',''));
            billBalance = parseFloat(String(billBalance).replace(',',''));

            console.log("amountDue: "+amountDue);
            console.log("creditAmountDue: "+creditAmountDue);
            console.log("billBalance: "+billBalance);

            // Escape, if the loader it's showing
            if(app.utils.loader.isVisible()){
                return;
            }

            $('.due-amount').val(parseFloat(String(amountDue)).toFixed(2));

            if (!$.isNumeric(amountDue)){
                showAlert('Error','El monto a pagar no es un número válido.','Aceptar');
                return;
            } else if (amountDue < 5) {
                showAlert('Error','El monto no puede ser menor a $5.00','Aceptar');
                return;
            } else if (amountDue > 800) {
                showAlert('Error','El monto no puede ser mayor a $800.00','Aceptar');
                return;
            } else if (creditAmountDue > 0){
                if ((creditAmountDue + amountDue) > 800) {
                    showAlert('Error','El monto total abonado en su cuenta no puede ser mayor a $800.00','Aceptar');
                    return;
                }
                self.doPayment(amountDue, selectedAccountValue);
            } else if (amountDue > billBalance) {
                showConfirm(
                    'Confirmación',
                    'La cantidad ingresada es mayor al balance de su factura, la diferencia será acreditada a su cuenta.',
                    ['Cancelar','Pagar'],
                    function(button){
                        if(button == 2) {
                            self.doPayment(amountDue, selectedAccountValue);
                        }
                    }
                );
            } else {
                self.doPayment(amountDue, selectedAccountValue);
            }
        },

        recharge: function(e) {
            var self = this,
                amountDue = parseFloat($('.recharge-amount').val());

            if(app.utils.loader.isVisible()){
                return;
            }

            $('.recharge-amount').val(parseFloat(String(amountDue)).toFixed(2));

            if (!$.isNumeric(amountDue)){
                showAlert('Error','El monto de recarga no es un número válido.','Aceptar');
                return;
            } else if (amountDue < 5) {
                showAlert('Error','El monto de recarga no puede ser menor a $5.00','Aceptar');
                return;
            } else if (amountDue > 150) {
                showAlert('Error','El monto de recarga no puede ser mayor a $150.00','Aceptar');
                return;
            }

            showConfirm(
                'Confirmación',
                '¿Desea proceder a recargar $'+app.utils.tools.formatAmount(amountDue)+'?',
                ['Si, Recargar', 'No, Cancelar'],
                function(button){
                    if(button == 1) {
                        self.rechargeAmount = amountDue;
                        self.getAddress(e);
                    }
                }
            );
        },

        changePaperless: function(e) {
            var self = this;

            var check = $('#paperless-switch').is(':checked');
            if (check) {
                setTimeout(function() {
                    var account = app.utils.Storage.getSessionItem('selected-account-value');
                    self.options.customerModel.updateBillParameters(account,
                        function (success) {
                            if (!success.HasError) {
                                self.reloadCurrentAccountDetails();
                            } else {
                                $('#paperless-switch').prop('checked', false);
                                showAlert('Error', success.ErrorDesc, 'Aceptar');
                            }
                        },
                        function (data, status) {
                            $('#paperless-switch').prop('checked', false);
                            app.utils.network.errorRequest(data, status);
                        }
                    );
                }, 500);
            }
        },

        getAddress: function(e) {
            var self = this;
            const selectedSubscriberValue = app.utils.Storage.getSessionItem('selected-subscriber-value');
            self.options.paymentModel.listPrepaidAddress(
                selectedSubscriberValue,
                function (response) {
                    if (response.success == true) {
                        app.utils.Storage.setSessionItem('prepaid-address', response.address);
                        self.getPaymentsType(e);
                    } else {
                        showAlert('Error', 'Disculpe, no cuenta con recargas disponibles.',
                            'Aceptar');
                    }
                },
                function () {
                    showAlert('Error', 'Disculpe, no se puede obtener su informacion para la recarga.',
                        'Aceptar');
                }
            );
        },

        getPaymentsType: function(e) {
            var self = this;
            const selectedSubscriberValue = app.utils.Storage.getSessionItem('selected-subscriber-value');
            self.options.paymentModel.listPrepaidPaymentsType(
                selectedSubscriberValue,
                function (response) {
                    if (response.success == true) {
                        app.utils.Storage.setSessionItem('prepaid-payments-type', response.formPaymentTypes);
                        self.getProducts(e);
                    } else {
                        showAlert('Error', 'Disculpe, no cuenta con recargas disponibles.',
                            'Aceptar');
                    }
                },
                function () {
                    showAlert('Error', 'Disculpe, no se puede obtener su informacion para la recarga.',
                        'Aceptar');
                }
            );
        },

        getProducts: function(e) {
            var self = this;
            const selectedSubscriberValue = app.utils.Storage.getSessionItem('selected-subscriber-value');
            self.options.paymentModel.listProductService(
                selectedSubscriberValue, 2,
                function (response) {
                    if (response.success == true) {
                        app.utils.Storage.setSessionItem('prepaid-products', response.formProducts);
                        self.goRecharge(response.formProducts);
                    } else {
                        showAlert('Error', 'Disculpe, no cuenta con recargas disponibles.',
                            'Aceptar');
                    }
                },
                function () {
                    showAlert('Error', 'Disculpe, no se puede obtener su informacion para la recarga.',
                        'Aceptar');
                }
            );
        },

        goRecharge: function(listProducts) {
		    var self = this;

            var iva = 0.115;
            var id = 24;
            listProducts.forEach(function(product) {
                if (product.productName == 'Otro monto') {
                    iva = product.ivuState;
                    id = product.idProduct;
                }
            });

            var accountInfo = app.utils.Storage.getSessionItem('account-info');
            var subscriber = self.getCurrentPrepaidSubscriber();

            var amount = self.rechargeAmount;
            const recharge = {
                subscriber: subscriber.subscriberNumberField,
                account: String(accountInfo.bANField),
                iva: iva,
                id: id,
                amount: app.utils.tools.formatAmount(amount),
                amountIvu: app.utils.tools.formatAmount(amount*iva),
                totalAmount: app.utils.tools.formatAmount((amount*iva)+amount)
            };

            app.utils.Storage.setSessionItem('prepaid-recharge_select-product', recharge);

            app.router.navigate('recharge_prepaid_confirm', {
                trigger: true,
                replace: true
            });
        },

        showPopOver: function(e) {
            setTimeout(function(){
                $.mobile.activePage.find('[data-toggle="popover"]').popover('hide');
            },4000);
        },

        netflixSubscription: function (e) {
            //app.utils.Storage.setSessionItem('netflix-accounts-subscribers-is-loaded', false);
            app.router.navigate('netflix', {trigger: true});
        },

        mascaraDescuentosDisponibles: function(){
		    var self = this;

            var montoTemp = parseFloat(self.TotalAvailable).toFixed(2);
            var montoTxt = String(montoTemp).trim();

            if (self.CreditAsReferer && self.CreditAsRefererCount > parseInt(montoTemp)) {
                // Ajuste cuando CreditItens es vacio y cupon disponible
                montoTemp = parseFloat(self.CreditAsRefererCount).toFixed(2);
                montoTxt = String(montoTemp).trim();

                if (montoTemp > 1000) {
                    return montoTxt.substr(0, 1) + ',' + montoTxt.substr(1, montoTxt.length, 1);
                } else {
                    if (montoTemp > 0) {
                        return montoTemp;
                    } else {
                        return '0.00';
                    }
                }

            } else if (montoTemp > 1000) {
                return montoTxt.substr(0, 1) + ',' + montoTxt.substr(1, montoTxt.length, 1);
            } else {
                if (montoTemp > 0) {
                    return montoTemp;
                } else {
                    return '0.00';
                }
            }
        },

	});
});
