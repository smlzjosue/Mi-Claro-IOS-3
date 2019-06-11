$(function() {

	// Menu View
	// ---------------
	
	app.views.MenuView = app.views.CommonView.extend({

		name:'menu',

        rechargeAmount: 0,

        dataGiftReceived: null,
				
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
            var selectedAccountValue = app.utils.Storage.getSessionItem('selected-account-value');
            self.options.referrerModel.getCredits(selectedAccountValue,
                function (success) {
                    if (!success.hasError) {

                        var sumAvialable = '$0';
                        if (success.PayOutsDetailsItems.length > 0) {
                            sumAvialable = success.PayOutsDetailsItems[0].SumAvialable;
                        }
                        var accountInfo = app.utils.Storage.getSessionItem('account-info');
                        var dsl = accountInfo.accountSubtypeField == 'W' && accountInfo.accountTypeField == 'I';
                        if (dsl) {
                            sumAvialable = '0 %';
                        } else {
                            if (sumAvialable >= 50) {
                                $('#credit-amount').val('&#36;50.00');
                            }
                        }
                        app.utils.Storage.setSessionItem('credits-available', sumAvialable.replace("$", ""));
                        $('#sumAvialable').html(sumAvialable+'');
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

        changePaperless: function(e) {
            var self = this;

            var check = $('#paperless-switch').is(':checked');
            if (check) {
                setTimeout(function() {
                    var account = app.utils.Storage.getSessionItem('selected-account-value');
                    self.options.customerModel.updateBillParameters(account,
                        function (success) {
                            if (!success.HasError) {
                                var selectedAccount = app.utils.Storage.getSessionItem('selected-account');
                                self.getAccountDetails(selectedAccount,
                                    function (response) {
                                        self.render(function(){
                                            $.mobile.activePage.trigger('pagecreate');
                                        });
                                    },
                                    app.utils.network.errorRequest
                                );
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
        
		invoice: function(e){
            var self = this;

			self.options.accountModel.getAccountBill(
				//parameters
				app.utils.Storage.getSessionItem('token'),
				app.utils.Storage.getSessionItem('selected-account-value'),

				//success callback
				function(data){

					if(!data.HasError || data.Desc.toLowerCase().search('pdf') > 0){

						// account info
						app.utils.Storage.setSessionItem('accounts-bill-info', data);

						app.router.navigate('invoice', {trigger: true});

					}else{

						var message = 'En este momento no está disponible esta factura';

						showAlert('Error', message, 'Aceptar');
					}
				},

				// error function
				app.utils.network.errorFunction
			);

			return false;
		},

        applyCredits: function() { // TODO, aun no funciona todo
            var self = this;

            const accountInfo = app.utils.Storage.getSessionItem('account-info');
            const dsl = accountInfo.accountSubtypeField == 'W' && accountInfo.accountTypeField == 'I';

            var amount = 0;
            if (!dsl) {
                const creditAmount = $('#credit-amount').val();
                amount = parseFloat(String(creditAmount.replace("$", "")));
            }

            const amountDue = accountInfo.billBalanceField;
            var amtDue = amountDue.includes('CR') ? 0 : amountDue;
            var creditsAvailable = app.utils.Storage.getSessionItem('credits-available');
            amtDue = parseFloat(String(amtDue));
            creditsAvailable = parseFloat(String(creditsAvailable));
            console.log('creditsAvailable: '+creditsAvailable);
            console.log('amount: '+amount);

            if (creditsAvailable < amount) {
                showAlert('Error', 'No posee suficientes créditos para aplicar.', 'ok');
            } else if (amount > amtDue) {
                showConfirm(
                    'Confirmación',
                    'El monto del descuento a aplicar es mayor al balance pendiente de su factura, al aplicar este monto usted perdera el valor del descuento restante.',
                    ['Regresar','Aplicar'],
                    function(button){
                        if(button == 2) {
                            showAlert('', 'Credito aplicado', 'OK');
                        }
                    }
                );
            } else if (amount < amtDue) {
                showConfirm(
                    'Confirmación',
                    'El valor del credito a aplicar es menor al balance pendiente de su factura. Favor realizar el pago del remanente de su factura antes de la fecha de vencimiento.',
                    ['Regresar','Aplicar'],
                    function(button){
                        if(button == 2) {
                            showAlert('', 'Credito aplicado', 'OK');
                        }
                    }
                );
            }
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

	});
});
