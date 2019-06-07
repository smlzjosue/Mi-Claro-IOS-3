$(function() {

    // Register step 1 View
    // ---------------

    app.views.NetflixSubscriptionView = app.views.CommonView.extend({

        name: 'netflix_subscription',

        // The DOM events specific.
        events: {
            // events
            'pagecreate':                           'pageCreate',

            'click .select-account':                'changeAccount',
            'click .select-subscriber':             'changeSubscriber',
            'click #next':                          'continue',
            'click #cancel':                        'back',
        },

        // Render the template elements
        render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            var accounts = [];

            if (app.utils.Storage.getSessionItem('netflix-accounts-subscribers-is-loaded') == true) {
                accounts = app.utils.Storage.getSessionItem('netflix-accounts-list-subscribers');
            }

            var self = this,
                variables = {
                    fullAccounts: accounts,
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

            if (app.utils.Storage.getSessionItem('netflix-accounts-subscribers-is-loaded') == false) {
                self.getAccount(e);
            } else {
                const accounts = app.utils.Storage.getSessionItem('accounts-list');
                if (accounts.length == 1) {
                    //$('.select-account').eq(0).trigger('click');
                }
            }
        },

        getAccount: function(e) {
            var self = this;
            self.options.accountModel.getAccounts(
                function (response) {
                    if (!response.hasError) {
                        self.checkAccount(e, response.accounts);
                    } else {
                        showAlert('Error', response.errorDisplay, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            );
        },

        checkAccount: function(e, accountsSubscribers) {
            const self = this;

            if (accountsSubscribers == undefined || accountsSubscribers == null || accountsSubscribers.length == 0) {
                message = 'En este momento estamos presentado inconvenientes o nuestro sistema están en ' +
                    'mantenimiento. Por favor intente nuevamente en unos minutos.';
                showAlert('Error', message, 'Aceptar',
                    function(){
                        self.back(e);
                    });
                return;
            } else if (accountsSubscribers.length == 1
                && accountsSubscribers[0].subscribers.length == 1
                && accountsSubscribers[0].subscribers[0].netFlixBlackListed == 'true') {
                message = '¡Gracias por su interés en subscribirse a Netflix, al momento su cuenta no cumple ' +
                    'con los requisitos para completar su subscripción.  Para información adicional comuníquese con ' +
                    'unos de nuestros Coordinadores de Servicio al Cliente a través de nuestro CHAT.';
                showConfirm('', message, ['Salir', 'Chat'],
                    function(btnIndex){
                        if(btnIndex==1){
                            self.back(e);
                        }
                        if(btnIndex==2){
                            app.router.history = ['menu'];
                            self.chat(e);
                        }
                    });
                return;
            } else if (accountsSubscribers.length == 1
                && accountsSubscribers[0].subscribers.length == 1
                && accountsSubscribers[0].subscribers[0].netFlixBlackListed != 'true'
                && accountsSubscribers[0].subscribers[0].netFlixBlackListed != 'false') {
                message = 'En este momento estamos presentado inconvenientes o nuestro sistema están en ' +
                    'mantenimiento. Por favor intente nuevamente en unos minutos.';
                showAlert('Error', message, 'Aceptar',
                    function(){
                        self.back(e);
                    });
                return;
            }

            const accountsN = [];
            accountsSubscribers.forEach(function(account) {
                const accountN = JSON.parse(JSON.stringify(account));
                console.log(accountN);
                accountN.subscribers = [];
                account.subscribers.forEach(function(subscriber) {
                    if (subscriber.netFlixBlackListed == 'false') {
                        accountN.subscribers.push(subscriber);
                    }
                });
                if (accountN.subscribers.length > 0) {
                    accountsN.push(accountN);
                }
            });
            if (accountsN.length > 0) {
                app.utils.Storage.setSessionItem('netflix-accounts-list-subscribers', accountsN);
                app.utils.Storage.setSessionItem('netflix-accounts-subscribers-is-loaded', true);
                self.render(function(){
                    $.mobile.activePage.trigger('pagecreate');
                });
            } else {
                message = '¡Gracias por su interés en subscribirse a Netflix, al momento su cuenta no cumple ' +
                    'con los requisitos para completar su subscripción.  Para información adicional comuníquese con ' +
                    'unos de nuestros Coordinadores de Servicio al Cliente a través de nuestro CHAT.';
                showConfirm('', message, ['Salir', 'Chat'],
                    function(btnIndex){
                        if(btnIndex==1){
                            self.back(e);
                        }
                        if(btnIndex==2){
                            app.router.history = ['menu'];
                            self.chat(e);
                        }
                    });
            }
        },

        changeAccount: function (e) {
            var self = this;

            var currentIndex = $(e.currentTarget).data('index'),
                accounts = app.utils.Storage.getSessionItem('netflix-accounts-list-subscribers'),
                account = accounts[currentIndex];

            var htmlID = '#account'+currentIndex;

            // if click on open selector
            if ($(e.currentTarget).hasClass("on")) {
                // remove selection on account
                $('#radio'+currentIndex).prop("checked", false);
                $(e.currentTarget).removeClass('on');
                // remove selection on subscriber
                $(htmlID).find('.select-subscriber').removeClass('on');
                $(htmlID).find('.css-radio').prop("checked", false);
                return;
            }

            // collapse others
            $.each(accounts, function(index, acc) {
                if (index != currentIndex) {
                    var isExpanded = $('#account'+index).hasClass("in");
                    if (isExpanded) { // Only if account is expanded
                        // disable other selected accounts
                        $('#container-account'+index).removeClass('on');
                        $('#container-account'+index).find('.css-radio').prop("checked", false);
                        // disable selected subscribers in other accounts
                        $('#account'+index).find('.select-subscriber').removeClass('on');
                        $('#account'+index).find('.css-radio').prop("checked", false);
                        // collapse others account
                        $('#account'+index).collapse('hide');
                    }
                }
            });

            // add selection to this account
            $(e.currentTarget).addClass('on');
            $('#radio'+currentIndex).prop("checked", true);
        },

        changeSubscriber: function (e) {
            // remove old selected subscriber
            $('.select-subscriber').removeClass('on');
            // add selection to this subscriber
            $(e.currentTarget).addClass('on');
            $(e.currentTarget).find('.css-radio').prop("checked", true);
        },

        continue: function (e) {

            var account = $('input[type="radio"].radio-account:checked').data('account');
            var subscriber = $('input[type="radio"].radio-subscriber:checked').data('subscriber');

            if (account == undefined || subscriber == undefined) {
                showAlert("Error", "Debe seleccionar un número de cuenta y suscriptor para poder agregar el Servicio Netflix.", "ok");
                return
            }

            app.utils.Storage.setSessionItem('netflix-subscription-account-number', account);
            app.utils.Storage.setSessionItem('netflix-subscription-subscriber-number', subscriber);

            app.router.navigate('netflix_redirect', {
                trigger: true,
            });
        }

    });

});
