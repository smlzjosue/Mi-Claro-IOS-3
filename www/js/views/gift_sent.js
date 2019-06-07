$(function() {

    // Register step 1 View
    // ---------------

    app.views.GiftSentView = app.views.CommonView.extend({

        name: 'gift_sent',

        // The DOM events specific.
        events: {

            // events
            'pagecreate':                               'pageCreate',

            // Content
            'click #close':                             'navigateHome',
        },

        // Render the template elements
        render: function(callback) {

            var text  = app.utils.Storage.getSessionItem('gift-send-text');

            var self = this,
                variables = {
                    description: text,
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
        },
    });

});
