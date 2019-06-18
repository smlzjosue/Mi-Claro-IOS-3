$(function () {

    // Payment Step 2 View
    // ---------------

    app.views.PaymentStep2View = app.views.CommonView.extend({

        name: 'payment_step_2',

        // The DOM events specific.
        events: {

            // event
            'pagecreate': 'pageCreate',
            'active': 'active',

            // content
            'click #btn-print':					            'print',
            'click #btn-return':                            'back'
        },

        // Render the template elements
        render: function (callback) {

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

            $('#nav-open').hide();
            $('#btn-back').click(function() { self.back(); });

            self.supplyPayment();
        },

        supplyPayment: function() {
            var self = this;

            const payType = app.utils.Storage.getSessionItem('payment-data_type');
            if (payType === self.PAY.ADDITIONAL_DATA) {
                self.payAdditionalData();
            } else if (payType === self.PAY.SEND_1GB) {
                self.paySend1GB();
            } else if (payType === self.PAY.SEND_RECHARGE) {
                self.paySendRecharge();
            }
        },

        payAdditionalData: function() {
            var self = this;

            const offerData = app.utils.Storage.getSessionItem('payment-data_offer-data');

            const payment = app.utils.Storage.getSessionItem('payment-data_pay-object');

            offerData.paymentID = payment.paymentId;

            self.options.offerModel.addOfferToSubscriber(
                offerData,
                function(response){
                    if(!response.HasError){
                        app.utils.Storage.setSessionItem('invoice-charge', true);

                        app.utils.Storage.setSessionItem('data-plan_order-id', response.PCRFTransaID);
                        app.utils.Storage.setSessionItem('data-plan_payment-id', payment.paymentId);

                        app.router.navigate('data_plan_success', {
                            trigger: true,
                            replace: true
                        });
                    } else {
                        showAlert('Error', response.ErrorDesc, 'Aceptar');
                    }
                },
                // error callback
                app.utils.network.errorRequest
            );
        },

        paySend1GB: function () {
            var self = this;

            const giftData = app.utils.Storage.getSessionItem('payment-data_gift-1GB-data');

            const payment = app.utils.Storage.getSessionItem('payment-data_pay-object');

            giftData.PaymentID = payment.paymentId;
            giftData.Charge = 0; // 0 credito - 1 pago factura contra factura

            self.options.customerModel.sendGift1GB(giftData,
                function (success) {
                    if (!success.HasError) {
                        app.utils.Storage.setSessionItem('gift-send-text',
                            'Gracias: El regalo se ha enviado con <span class="roboto-b">éxito</span>');
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

        paySendRecharge: function () {
            const self = this;

            const giftData = app.utils.Storage.getSessionItem('payment-data_gift-recharge-data');

            const payment = app.utils.Storage.getSessionItem('payment-data_pay-object');

            giftData.PaymentID = payment.paymentId;
            giftData.Charge = 0; // 0 credito - 1 pago factura contra factura

            self.options.customerModel.sendGiftRecharge(giftData,
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
        }
    });
});