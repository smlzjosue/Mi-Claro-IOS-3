$(function() {

    // Register step 3 View
    // ---------------

    app.views.PaymentStep3View = app.views.CommonView.extend({

        name: 'payment_step_3',

        // The DOM events specific.
        events: {

            // events
            'pagecreate':                               'pageCreate',

            // Content
            'click #close':                             'back',
        },

        // Render the template elements
        render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            const payment = app.utils.Storage.getSessionItem('payment-data_pay-object');
            const subscriberType = app.utils.Storage.getSessionItem('payment-data_subscriber_type');
            const subscriberNumber = app.utils.Storage.getSessionItem('payment-data_subscriber');

            var self = this,
                variables = {
                    subscriberType: subscriberType,
                    subscriberNumber: subscriberNumber,
                    amount: payment.amount,
                    transactionId: payment.paymentId,
                    confirmationNumber: payment.referenceId,
                    paymentDate: payment.date.toString(),
                    typeOfTelephony: app.utils.tools.typeOfTelephony,
                    formatNumber: app.utils.tools.formatSubscriber,
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

            // reset navigation history
            app.router.history	= ['menu', 'payment_step_3'];

            self.reloadAccount(e);
        },

        reloadAccount: function(e){
            var self = this;

            var selectedAccount = app.utils.Storage.getSessionItem('selected-account');

            self.getAccountDetails(selectedAccount,
                function () {
                    // nothing to do;
                },
                app.utils.network.errorRequest
            );
        },

        return: function (e) {
            var self = this;

            self.back(e);
        }
    });

});
