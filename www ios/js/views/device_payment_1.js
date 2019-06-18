$(function() {

    // Device View
    // ---------------

    app.views.DevicePayment1View = app.views.CommonView.extend({

        name: 'device_payment_1',

        // The DOM events specific.
        events: {

            // events
            'pagecreate':                               'pageCreate',

            // content
            'click #plus-quote':                        'addQuote',
            'click #minus-quote':                       'minusQuote',
            'change #pay1':                             'payTotal',
            'change #pay2':                             'payByQuote',
            'click #cancel':                            'toReturn',
            'click #next':                              'goPay',
        },

        // Render the template elements
        render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            const subscriberInfo = app.utils.Storage.getSessionItem('selected-subscriber');
            const equipmentInfo = subscriberInfo.equipmentInfoField;

            var amountTotal = parseFloat(equipmentInfo.installmentValueField) * parseFloat(equipmentInfo.installmentsField);

            var self = this,
                variables = {
                    subscriberType: app.utils.tools.typeOfTelephony(subscriberInfo.productTypeField),
                    selectedSubscriber: app.utils.tools.formatSubscriber(subscriberInfo.subscriberNumberField),
                    remainingQuotas: equipmentInfo.installmentsField,
                    equipmentName: equipmentInfo.itemDescriptionField,
                    equipmentImage: equipmentInfo.itemImageField,
                    amountQuota: app.utils.tools.formatAmount(equipmentInfo.installmentValueField),
                    amountTotal: app.utils.tools.formatAmount(amountTotal),
                    accounts: this.getSelectTabAccounts(),
                    selectedTab: app.utils.Storage.getSessionItem('selected-tab'),
                    selectedAccount: app.utils.Storage.getSessionItem('selected-account'),
                    accountSections: this.getUserAccess(),
                    showBackBth: true
                };

            app.TemplateManager.get(self.name, function(code){
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
            self.setTotalToPay();
        },

        setTotalToPay: function() {
            const subscriberInfo = app.utils.Storage.getSessionItem('selected-subscriber');
            const equipmentInfo = subscriberInfo.equipmentInfoField;

            var quotes = $('#quotes-to-pay').data('value');
            var amountToPay = parseFloat(equipmentInfo.installmentValueField) * parseFloat(quotes);
            var amountToPayString = '$'+app.utils.tools.formatAmount(amountToPay);
            $('#total-to-pay').html(amountToPayString);
        },

        addQuote: function (e) {
            var self = this;
            var quotes = $('#quotes-to-pay').data('value');
            const subscriberInfo = app.utils.Storage.getSessionItem('selected-subscriber');
            const equipmentInfo = subscriberInfo.equipmentInfoField;
            const totalQuotes = equipmentInfo.installmentsField;
            if (parseFloat(quotes) < totalQuotes) {
                quotes = parseFloat(quotes) + 1;
                $('#quotes-to-pay').data('value', String(quotes));
                $('#quotes-container').html(String(quotes));
            }
            self.setTotalToPay();
        },

        minusQuote: function (e) {
            var self = this;
            var quotes = $('#quotes-to-pay').data('value');
            if (parseFloat(quotes) > 1) {
                quotes = parseFloat(quotes) - 1;
                $('#quotes-to-pay').data('value', String(quotes));
                $('#quotes-container').html(String(quotes));
            }
            self.setTotalToPay();
        },

        payTotal: function (e) {
            $('#select-quotes').hide();

            const subscriberInfo = app.utils.Storage.getSessionItem('selected-subscriber');
            const equipmentInfo = subscriberInfo.equipmentInfoField;
            var amountTotal = parseFloat(equipmentInfo.installmentValueField) * parseFloat(equipmentInfo.installmentsField);
            var amountToPayString = '$'+app.utils.tools.formatAmount(amountTotal);
            $('#total-to-pay').html(amountToPayString);
        },

        payByQuote: function (e) {
            var self = this;
            $('#select-quotes').show();
            self.setTotalToPay();
        },

        goPay: function (e) {

            const subscriberInfo = app.utils.Storage.getSessionItem('selected-subscriber');
            const equipmentInfo = subscriberInfo.equipmentInfoField;

            var quotes = 0;
            if (document.getElementById('pay1').checked) {
                quotes = equipmentInfo.installmentsField;
            } else {
                quotes = $('#quotes-to-pay').data('value');
            }
            var amount = parseFloat(equipmentInfo.installmentValueField) * parseFloat(quotes);

            const details = [
                {
                    name        : 'Equipo',
                    description : equipmentInfo.itemDescriptionField
                },
                {
                    name        : 'Cuotas',
                    description : quotes+""
                }
            ];
            const accountInfo = app.utils.Storage.getSessionItem('account-info');

            app.utils.Storage.setSessionItem('payment-data_details', details);
            app.utils.Storage.setSessionItem('payment-data_amount', String(amount));
            app.utils.Storage.setSessionItem('payment-data_subscriber', subscriberInfo.subscriberNumberField);
            app.utils.Storage.setSessionItem('payment-data_account', accountInfo.bANField);
            app.utils.Storage.setSessionItem('payment-data_email', accountInfo.emailField);
            app.utils.Storage.setSessionItem('payment-data_description', "Pago de equipo");
            app.utils.Storage.setSessionItem('payment-data_redirect-success', 'device');

            app.router.navigate('payment_step_1', {trigger: true});
        }

    });
});
