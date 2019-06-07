$(function() {

    app.views.NetflixView = app.views.CommonView.extend({

        name: 'netflix',

        // The DOM events specific.
        events: {
            // events
            'pagecreate':                           'pageCreate',

            // content
            'click #subscription':					'subscription',
            'click #support':					    'support',
            'click #claims':					    'claims',
            'click #show-terms':                    'showTerms',
            'click #close-terms':                   'closeTerms',
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

        subscription: function(e){
            app.utils.Storage.setSessionItem('netflix-accounts-subscribers-is-loaded', false);
            app.router.navigate('netflix_subscription', {trigger: true});
        },

        support: function(e){
            app.router.navigate('netflix_support', {trigger: true});
        },

        claims: function (e) {
            app.router.navigate('netflix_claims', {trigger: true});
        },

        showTerms: function(e) {
            $('.popupbg').show();
        },

        closeTerms: function(e) {
            $('.popupbg').hide();
        },

    });

});
