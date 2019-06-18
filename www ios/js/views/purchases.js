$(function() {

    // Register step 1 View
    // ---------------

    app.views.PurchasesView = app.views.CommonView.extend({

        name: 'purchases',

        // The DOM events specific.
        events: {
            // events
            'pagecreate':                           'pageCreate',
            'click #store':                         'openStore',
            'click #data-additional':               'navigatePurchaseData',
            'click #service-additional':            'navigatePurchaseService',
            'click #gift-1gb':                      'navigateGift1gb',
            'click #gift-recharge':                 'navigateGiftRecharge'
        },

        // Render the template elements
        render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            const selectedAccount = app.utils.Storage.getSessionItem('selected-account');

            const isTelephony = app.utils.tools.accountIsTelephony(
                selectedAccount.mAccountType,
                selectedAccount.mAccountSubType,
                selectedAccount.mProductType
            );

            var self = this,
                variables = {
                    isTelephony: isTelephony,
                    accounts: this.getSelectTabAccounts(),
                    selectedTab: app.utils.Storage.getSessionItem('selected-tab'),
                    selectedAccount: selectedAccount,
                    accountSections: this.getUserAccess(),
                    showBackBth: true
                };
            app.TemplateManager.get(self.name, function(code) {
                var template = cTemplate(code.html());
                $(self.el).html(template(variables));
                callback();
                return this;
            });
        },

        pageCreate: function(e) {
            var self = this;
            self.activateMenu(e);
        }

    });

});
