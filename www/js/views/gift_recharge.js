$(function() {

    app.views.GiftRechargeView = app.views.CommonView.extend({

        name: 'gift_recharge',

        // The DOM events specific.
        events: {
            // events
            'pagecreate':                           'pageCreate',

            // content
            'click #btn-click':                     'validateData',
            'click .link-terms':                    'showTerms',
            'click #close-terms':                   'closeTerms',
            'click #return':                        'return',
        },

        // Render the template elements
        render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            var self = this,
                variables = {
                    accounts: this.getSelectTabAccounts(),
                    selectedTab: app.utils.Storage.getSessionItem('selected-tab'),
                    selectedAccount: app.utils.Storage.getSessionItem('selected-account'),
                    accountSections: this.getUserAccess(),
                    showBackBth: true
                };
            app.TemplateManager.get(self.name, function(code) {
                var template = cTemplate(code.html());
                $(self.el).html(template(variables));
                callback();
                return this;
            });
            $(document).scrollTop();
        },

        pageCreate: function(e) {
            var self = this;
            self.activateMenu(e);

            $('.recarga-opts').on('click', function (e) {
                $('.recarga-opts').removeClass('on');
                $(e.currentTarget).addClass('on');
                $(e.currentTarget).find('input').prop("checked", true);
            });

            $('#textnum_amigo').on('input', function (e) {
                var number = $(e.currentTarget).val();
                if (number.length > 10) {
                    number = number.slice(0,10);
                    $(e.currentTarget).val(number);
                }
            });

            $('#text_mensaje').on('input', function (e) {
                var number = $(e.currentTarget).val();
                if (number.length > 200) {
                    number = number.slice(0,200);
                    $(e.currentTarget).val(number);
                }
            });

            // enable tooltips
            $('[data-toggle="popover"]').popover({
                animation: false
            });

            $.mobile.activePage.on("show.bs.popover", ".q-t", function() {
                setTimeout(function(){
                    $.mobile.activePage.find('[data-toggle="popover"]').popover('hide');
                },3000);
            });

            $('input.inp-f').on('click focus', function (e) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $(e.currentTarget).offset().top-40
                }, 1000);
            });
        },

        validateData: function(e) {
            var self = this;

            var numAmigo = $.mobile.activePage.find('#textnum_amigo').val();
            var text_mensaje = $.mobile.activePage.find('#text_mensaje').val();

            // validate

            var check = $('#checkbox-terms').is(':checked');

            if (!check) {
                showAlert('Error' , 'Debe seleccionar los términos y condiciones para poder continuar.', 'OK');
                return
            }

            if(numAmigo.length != 10){
                message = 'Debe ingresar un numero valido.';
                showAlert('Error', message, 'Aceptar');
                return
            }
            if(numAmigo.length == 0){
                message = 'Debe ingresar el numero al que desea recaragar.';
                showAlert('Error', message, 'Aceptar');
                return
                
            }

            if(text_mensaje.length > 200){
                message = 'El mensaje no puede contener mas de 200 caracteres.';
                showAlert('Error', message, 'Aceptar');
                
            }

            var money = $('input[name=recarga]:checked').val();

            if (money == undefined) {
                showAlert('Error', 'Por favor seleccione el monto de la recarga.', 'ok');
                return;
            }
            
            $('#textnum_amigo').blur();
            $('#textnum_mensaje').blur();

            console.log('the value selected to send is: ' + money);
        
            self.getSubscriber(numAmigo, text_mensaje, money);

        },

        getSubscriber: function(num, message, amount){
            var self = this;

            self.options.customerModel.getSubscriber(num,
                function (success) {
                    if (!success.HasError) {
                        var accountTo = success.Account;
                        if (accountTo === "" || accountTo == null) {
                            showAlert('Error', "El número de teléfono ingresado no se encuentra registrado" +
                                " en nuestros sistemas, su formato es incorrecto o no pertenece a nuestra red.",
                                'Aceptar');
                        } else {
                            if (app.utils.tools.accountIsPrepaid(success.AccountType, success.AccountSubType, 'G')) {
                                self.validateCredit(0, amount, accountTo, message, num);
                            } else {
                                showAlert('Error', "El número de teléfono ingresado no es prepago.", 'Aceptar');
                            }
                        }
                    } else {
                        showAlert('Error', success.ErrorDesc, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            )
        },

        validateCredit: function(accountTotalRent, productPrice, accountTo, message, num){
            var self = this;
            //to this service:
            var accountInfo = app.utils.Storage.getSessionItem('account-info');
            var account = accountInfo.bANField + "";
            productPrice = parseFloat(productPrice);
            productPrice = productPrice +"";
            // to next services:

            self.options.offerModel.validateCreditLimit(account, accountTotalRent, productPrice,
                function (success) {
                    if (!success.HasError) {
                        const data = self.createParameters(accountTo, productPrice, message, num);
                        var availableCredit = parseFloat(success.AvailableCredit).toFixed(2);
                        var subscriberHasAvailableCredit = parseFloat(availableCredit)>=parseFloat(productPrice);
                        if(subscriberHasAvailableCredit){ // TODO, para probar
                            self.sendRecharge(data);
                        } else {
                            self.goToPaymentStep(data);
                        }
                    } else {
                        showAlert('Error', success.ErrorDesc, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            )
        },

        goToPaymentStep: function(data) {
            var self = this;

            var confirmMessage = 'Estimado cliente esta recarga no califica ' +
                'para cargo en factura, debe efectuar el pago de la misma usando su tarjeta de crédito.';

            showConfirm('Pago con tarjeta de crédito', confirmMessage, ['Aceptar', 'Cancelar'],

                function(result){
                    // redirect to credit card view
                    if(result == 1) {

                        const details = [
                            {
                                name        : 'Producto',
                                description : 'Regala una Recarga de $'+app.utils.tools.formatAmount(data.amount)
                            }
                        ];
                        const accountInfo = app.utils.Storage.getSessionItem('account-info');

                        const selectedAccount = app.utils.Storage.getSessionItem('selected-account');

                        app.utils.Storage.setSessionItem('payment-data_details', details);
                        app.utils.Storage.setSessionItem('payment-data_amount', String(data.amount));
                        app.utils.Storage.setSessionItem('payment-data_subscriber', selectedAccount.DefaultSubscriber);
                        app.utils.Storage.setSessionItem('payment-data_subscriber_type', selectedAccount.mProductType);
                        app.utils.Storage.setSessionItem('payment-data_account', accountInfo.bANField);
                        app.utils.Storage.setSessionItem('payment-data_email', accountInfo.emailField);
                        app.utils.Storage.setSessionItem('payment-data_description', 'Regala una Recarga');
                        app.utils.Storage.setSessionItem('payment-data_type', self.PAY.SEND_RECHARGE);

                        app.utils.Storage.setSessionItem('payment-data_gift-recharge-data', data);

                        app.router.navigate('payment_step_1', {trigger: true});
                    }
                });
        },

        createParameters: function(accountTo, amount, message, subscriberTo) {

            const selectedAccount = app.utils.Storage.getSessionItem('selected-account');
            const username = app.utils.Storage.getLocalItem('username');

            const accountSender = String(selectedAccount.Account);
            const accountReceiver = String(accountTo);

            const subscriberSender = String(selectedAccount.DefaultSubscriber);
            const subscriberReceiver = String(subscriberTo);

            return {
                UserName: username,
                accountFrom: accountSender,
                accountTo: accountReceiver,
                amount: app.utils.tools.formatAmount(amount),
                message: message,
                source: 'mobile',
                subscriberFrom: subscriberSender,
                subscriberTo: subscriberReceiver,
            };
        },

        sendRecharge: function(data){
            const self = this;
            self.options.customerModel.sendGiftRecharge(data,
                function (success) {
                    if (!success.HasError) {
                        app.utils.Storage.setSessionItem('gift-send-text',
                            'Gracias: La recarga se ha enviado con <span class="roboto-b">éxito</span>');
                        app.router.navigate('gift_sent', {
                            trigger: true,
                            replace: true
                        });
                    } else {
                        showAlert('Error', success.ErrorDesc, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            )
        },


        showTerms: function(e) {
            $('.popupbg').show();
        },

        closeTerms: function(e) {
            $('.popupbg').hide();
        },

        return: function (e) {
            var self = this;
    
            self.back(e);
        },
    });
});