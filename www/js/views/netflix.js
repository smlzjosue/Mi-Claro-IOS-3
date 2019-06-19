$(function() {

    app.views.NetflixView = app.views.CommonView.extend({

        name: 'netflix',

        // The DOM events specific.
        events: {
            // events
            'pagecreate':                           'pageCreate',

            // content
            'click #subscription':					'subscription',
            'click #show-terms':                    'showTerms',
            'click #faq':					        'faq',
            'click #support':					    'support',
            'click #recover-email':					'recoverEmail',
            'click #recover-password':			    'recoverPassword'
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

        subscription: function(e) {
            app.utils.Storage.setSessionItem('netflix-accounts-subscribers-is-loaded', false);
            app.router.navigate('netflix_subscription', {trigger: true});
        },

        showTerms: function(e) {
            app.router.navigate('netflix_terms', {trigger: true});
        },

        faq: function (e) {
            app.router.navigate('netflix_faq', {trigger: true});
        },

        support: function(e) {
            app.router.navigate('netflix_support', {trigger: true});
        },

        recoverEmail: function(e) {
            app.utils.Storage.setSessionItem('netflix-accounts-subscribers-is-loaded', false);
            app.router.navigate('netflix_subscription', {trigger: true});
        },

        recoverPassword: function(e) {
            const url = 'https://www.netflix.com/co/LoginHelp';
            var browser = app.utils.browser.show(url, true);
            app.utils.loader.show();

            // success event load url
            browser.addEventListener('loadstop', function(e) {
                app.utils.loader.hide();
                browser.show();
            });

            // error event load url
            browser.addEventListener('loaderror', function(e) {
                app.utils.loader.hide();
                browser.close();
                showAlert('Error', 'No se puede cargar la pagina, compruebe su conexion a Internet.', 'OK');
            });
        }
    });
});
