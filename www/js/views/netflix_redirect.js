$(function() {

    // Register step 1 View
    // ---------------

    app.views.NetflixRedirectView = app.views.CommonView.extend({

        name: 'netflix_redirect',

        // The DOM events specific.
        events: {
            // events
            'pagecreate':                           'pageCreate',

            'click #next':                          'continue',
            'click .link-terms':                    'showTerms',
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

        continue: function (e) {
            var self = this;

            var check = $('#checkbox-terms').is(':checked');

            if (!check) {
                showAlert('Error' , 'Debe seleccionar los términos y condiciones para poder continuar.', 'OK');
                return
            }

            const account = app.utils.Storage.getSessionItem('netflix-subscription-account-number');
            const subscriber = app.utils.Storage.getSessionItem('netflix-subscription-subscriber-number');

            self.options.accountModel.subscribeNetflix(account+"", subscriber+"",
                function (response) {
                    if (!response.hasErrorField) {
                        const url = response.urlField;
                        browser = app.utils.browser.show(url, true);

                        app.utils.loader.show();

                        // success event load url
                        browser.addEventListener('loadstop', function(e) {

                            // hiden loader
                            app.utils.loader.hide();

                            // show navegator
                            browser.show();
                        });

                        // error event load url
                        browser.addEventListener('loaderror', function(e) {

                            // hiden loader
                            app.utils.loader.hide();

                            // close browser
                            browser.close();
                        });

                        browser.addEventListener('exit', function(e) {
                            self.navigateHome();
                        });
                    } else {
                        showAlert('Error', response.errorDescField, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            );
        },

        showTerms: function(e) {
            $('.popupbg').show();
        },

        closeTerms: function(e) {
            $('.popupbg').hide();
        },

    });

});
