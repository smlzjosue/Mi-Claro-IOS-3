$(function() {

    app.views.Gift1gbView = app.views.CommonView.extend({

        name: 'gift_1gb',

        amount: 9.99,

        // The DOM events specific.
        events: {
            // events
            'pagecreate':                           'pageCreate',

            // content
            'click #btn-click':                     'validateData',
            'click .link-terms':                    'showTerms',
            'click #close-terms':                   'closeTerms',
            'click #return':                        'return',

            'input #textnum_amigo':                 'numberChanged',
            'input #text_mensaje':                  'textChanged',
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
                    scrollTop: $(e.currentTarget).offset().top-60
                }, 1000);
            });
        },

        numberChanged: function(e) {
            var number = $(e.currentTarget).val();

            if (number.length > 10) {
                number = number.slice(0,10);
                $(e.currentTarget).val(number);
            }
        },

        textChanged: function(e) {
            var text = $(e.currentTarget).val();

            if (text.length > 200) {
                text = text.slice(0,200);
                $(e.currentTarget).val(text);
            }
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
            
            $('#textnum_amigo').blur();
            $('#textnum_mensaje').blur();

           self.getSubscriber(numAmigo, text_mensaje);
        },


        getSubscriber: function(num, message){
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
                            if (app.utils.tools.accountIsPostpaid(success.AccountType, success.AccountSubType, 'G')) {
                                self.validateCredit(0,  self.amount, accountTo, message, num);
                            } else {
                                showAlert('Error', "El número de teléfono ingresado no es pospago.", 'Aceptar');
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
            var account = accountInfo.bANField +"";

            self.options.offerModel.validateCreditLimit(account, accountTotalRent, productPrice,
                function (success) {
                    if (!success.HasError) {
                        const data = self.createParameters(accountTo, message, num);
                        var availableCredit = parseFloat(success.AvailableCredit).toFixed(2);
                        var subscriberHasAvailableCredit = parseFloat(availableCredit)>=parseFloat(productPrice);
                        if(subscriberHasAvailableCredit){
                            self.sendRecharge(data);
                        }else{
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

            var confirmMessage = 'Estimado cliente este regalo no califica ' +
                'para cargo en factura, debe efectuar el pago del mismo usando su tarjeta de crédito.';

            showConfirm('Pago con tarjeta de crédito', confirmMessage, ['Aceptar', 'Cancelar'],

                function(result){
                    // redirect to credit card view
                    if(result == 1) {

                        const details = [
                            {
                                name        : 'Producto',
                                description : 'Regala 1GB'
                            }
                        ];
                        const accountInfo = app.utils.Storage.getSessionItem('account-info');

                        const selectedAccount = app.utils.Storage.getSessionItem('selected-account');

                        app.utils.Storage.setSessionItem('payment-data_details', details);
                        app.utils.Storage.setSessionItem('payment-data_amount', String(self.amount));
                        app.utils.Storage.setSessionItem('payment-data_subscriber', selectedAccount.DefaultSubscriber);
                        app.utils.Storage.setSessionItem('payment-data_subscriber_type', selectedAccount.mProductType);
                        app.utils.Storage.setSessionItem('payment-data_account', accountInfo.bANField);
                        app.utils.Storage.setSessionItem('payment-data_email', accountInfo.emailField);
                        app.utils.Storage.setSessionItem('payment-data_description', 'Regala 1GB');
                        app.utils.Storage.setSessionItem('payment-data_type', self.PAY.SEND_1GB);

                        app.utils.Storage.setSessionItem('payment-data_gift-1GB-data', data);

                        app.router.navigate('payment_step_1', {trigger: true});
                    }
                });
        },

        createParameters: function(accountTo, message, subscriberTo) {

            const selectedAccount = app.utils.Storage.getSessionItem('selected-account');
            const nameSender = app.utils.Storage.getSessionItem('name');

            const accountSender = String(selectedAccount.Account);
            const accountReceiver = String(accountTo);

            const subscriberSender = String(selectedAccount.DefaultSubscriber);
            const subscriberReceiver = String(subscriberTo);

            return {
                BANReceiver: accountReceiver,
                BANSender: accountSender,
                Charge: "1", // 0 credito - 1 pago factura contra factura
                Message: message,
                NameSender: nameSender,
                PaymentID: "",
                SubscriberReceiver: subscriberReceiver,
                SubscriberSender: subscriberSender
            };
        },

        sendRecharge: function(data) {
            const self = this;
            self.options.customerModel.sendGift1GB(data,
                function (success) {
                    if (!success.HasError) {
                        app.utils.Storage.setSessionItem('gift-send-text',
                            'Gracias: El regalo se ha enviado con <span class="roboto-b">Éxito</span>');
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
    
            self.navigateHome(e);
        },
    });
});