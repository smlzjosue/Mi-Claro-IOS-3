$(function() {

    // Register step 1 View
    // ---------------

    app.views.MyOrdersView = app.views.CommonView.extend({

        name: 'my_orders',

        // The DOM events specific.
        events: {
            // events
            'pagecreate':                           'pageCreate',

            'change #select-account':               'simpleChangeAccount',
        },

        // Render the template elements
        render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            var listHistory = [];
            if (app.utils.Storage.getSessionItem('account-orders-is-loaded') == true) {
                listHistory = app.utils.Storage.getSessionItem('account-list-orders');
            }

            var count = 0;
            if (listHistory != null && listHistory != undefined && listHistory.length > 0) {
                listHistory.forEach(function(subscriber) {
                    count += subscriber.Packages.length;
                });
            }

            var self = this,
                variables = {
                    showOrders: (count > 0),
                    subscribersHistory: listHistory,
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

            if (app.utils.Storage.getSessionItem('account-orders-is-loaded') == false) {
                self.getOrders();
            } else {
                app.utils.Storage.setSessionItem('account-orders-is-loaded', false);
            }
        },

        getOrders: function (e) {
            var self = this;
            const selectedAccount = app.utils.Storage.getSessionItem('selected-account')
            self.options.accountModel.getHistoryOrders(selectedAccount.Account,
                function (response) {
                    if (!response.hasError) {
                        app.utils.Storage.setSessionItem('account-list-orders', response.Subscribers);
                        app.utils.Storage.setSessionItem('account-orders-is-loaded', true);
                        self.render(function(){
                            $.mobile.activePage.trigger('pagecreate');
                        });
                    } else {
                        showAlert('Error', response.errorDisplay, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            );
        }

    });

});
