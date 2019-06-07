$(function() {

    // Register step 1 View
    // ---------------

    app.views.ChangePlanSuccessView = app.views.CommonView.extend({

        name: 'change_plan_success',

        // The DOM events specific.
        events: {

            // events
            'pagecreate':                               'pageCreate',

            // Content
            'click #close':                             'navigateHome'
        },

        // Render the template elements
        render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            var orderId = app.utils.Storage.getSessionItem('change-plan_order-id');
            //var orderId = '000001'; // TODO, change by real order id
            var subscriber = app.utils.Storage.getSessionItem('change-plan_subscriber');
            var selectedPlan = app.utils.Storage.getSessionItem('change-plan_selected-plan');

            var self = this,
                variables = {
                    orderId: orderId,
                    subscriberObj: subscriber,
                    currentPlan: subscriber.planInfoField.sOCDescriptionField,
                    currentRent: subscriber.planInfoField.socRateField,
                    selectedPlan: selectedPlan.description,
                    selectedRent: selectedPlan.rent,
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
