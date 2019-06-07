$(function() {

    // Register step 1 View
    // ---------------

    app.views.RechargePrepaidConfirmView = app.views.CommonView.extend({

        name: 'recharge_prepaid_confirm',

        // The DOM events specific.
        events: {
            // events
            'pagecreate':                           'pageCreate',

            'click #next':                          'continue',
            'click #cancel':                        'navigateHome'
        },

        // Render the template elements
        render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            const amountPlan = this.getCurrentAccountPrepaidPlanInfo().socRateField;
            const recharge = app.utils.Storage.getSessionItem('prepaid-recharge_select-product');

            var self = this,
                variables = {
                    selectedSubscriberValue: app.utils.Storage.getSessionItem('selected-subscriber-value'),
                    amount: recharge.amount,
                    amountIvu: recharge.amountIvu,
                    totalAmount: recharge.totalAmount,
                    amountPlan: app.utils.tools.formatAmount(amountPlan),
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
        },

        continue: function (e) {
            app.router.navigate('recharge_prepaid_payment', {
                trigger: true,
                replace: true
            });
        }

    });

});
