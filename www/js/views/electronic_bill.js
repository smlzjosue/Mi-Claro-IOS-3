$(function() {

    // Register step 1 View
    // ---------------

    app.views.ElectronicBillView = app.views.CommonView.extend({

        name: 'electronic_bill',

        // The DOM events specific.
        events: {
            'pagecreate':                               'pageCreate',

            // Content
            'change #select-account':                   'simpleChangeAccount',
            'change #paperless-switch':                 'changePaperless',
        },

        // Render the template elements
        render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            var accountInfo = app.utils.Storage.getSessionItem('account-info');
            var paperless = accountInfo.paperlessField;

            var self = this,
                variables = {
                    paperless: paperless,
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
        },

        pageCreate: function(e) {
            var self = this;
            self.activateMenu(e);
        },

        changePaperless: function(e) {
            var self = this;

            var check = $('#paperless-switch').is(':checked');
            if (check) {
                setTimeout(function() {
                    var account = app.utils.Storage.getSessionItem('selected-account-value');
                    self.options.customerModel.updateBillParameters(account,
                        function (success) {
                            if (!success.HasError) {
                                var selectedAccount = app.utils.Storage.getSessionItem('selected-account');
                                self.getAccountDetails(selectedAccount,
                                    function (response) {
                                        self.render(function(){
                                            $.mobile.activePage.trigger('pagecreate');
                                        });
                                    },
                                    app.utils.network.errorRequest
                                );
                            } else {
                                $('#paperless-switch').prop('checked', false);
                                showAlert('Error', success.ErrorDesc, 'Aceptar');
                            }
                        },
                        function (data, status) {
                            $('#paperless-switch').prop('checked', false);
                            app.utils.network.errorRequest(data, status);
                        }
                    );
                }, 500);
            }
        },
    });

});
