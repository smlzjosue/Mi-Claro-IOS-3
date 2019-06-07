$(function() {

    // Register step 1 View
    // ---------------

    app.views.RechargePrepaidSuccessView = app.views.CommonView.extend({

        name: 'recharge_prepaid_success',

        // The DOM events specific.
        events: {
            // events
            'pagecreate':                           'pageCreate',

            'click #close':                         'back',
        },

        // Render the template elements
        render: function(callback) {

            const recharge = app.utils.Storage.getSessionItem('prepaid-recharge_select-product');
            const payment = app.utils.Storage.getSessionItem('prepaid-recharge_data-payment');

            var self = this,
                variables = {
                    selectedSubscriberValue: app.utils.Storage.getSessionItem('selected-subscriber-value'),
                    transactionId: payment.transactionId,
                    rechargeId: payment.rechargeId,
                    paymentDate: new Date(payment.dateTransaction).toLocaleString(),
                    amount: recharge.amount,
                    totalAmount: recharge.totalAmount,
                    accounts: this.getSelectTabAccounts(),
                    prepaidBalance: this.getCurrentAccountPrepaidBalance(),
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
            app.router.history	= ['menu', 'recharge_prepaid_success'];

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
    });

});
