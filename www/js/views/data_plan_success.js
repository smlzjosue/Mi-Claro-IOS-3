$(function() {

    // Register step 1 View
    // ---------------

    app.views.DataPlanSuccessView = app.views.CommonView.extend({

        name: 'data_plan_success',

        // The DOM events specific.
        events: {

            // events
            'pagecreate':                               'pageCreate',

            // Content
            'click #close':                             'navigateHome',
        },

        // Render the template elements
        render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            var orderId = app.utils.Storage.getSessionItem('data-plan_order-id');
            var subscriber = app.utils.Storage.getSessionItem('selected-subscriber');
            var selectedPlanName = app.utils.Storage.getSessionItem('data-plan_selected-offer-name');
            var selectedPlanPrice = app.utils.Storage.getSessionItem('data-plan_selected-offer-price');

            var self = this,
                variables = {
                    orderId: orderId,
                    subscriberObj: subscriber,
                    selectedPlan: selectedPlanName,
                    selectedRent: app.utils.tools.formatAmount(selectedPlanPrice),
                    typeOfTelephony: app.utils.tools.typeOfTelephony,
                    accounts: this.getSelectTabAccounts(),
                    formatNumber: app.utils.tools.formatSubscriber,
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
        }
    });

});
