$(function() {

    // Register step 1 View
    // ---------------

    app.views.SupportView = app.views.CommonView.extend({

        name: 'support',

        // The DOM events specific.
        events: {
            // events
            'pagecreate':                           'pageCreate',

            'click #questions':                     'faq'
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
        },

        faq: function(e){
            if (analytics != null){
                analytics.trackEvent('button', 'click', 'faq');
            }
            app.router.navigate('faq', {trigger: true});

        },

    });

});
