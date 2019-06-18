$(function() {

	// Profile View
	// ---------------

	app.views.AddAccountView = app.views.CommonView.extend({

		name : 'add_accounts',

		// The DOM events specific.
		events : {
			'pagecreate' : 'pageCreate',

            'click .select-account':                 'changeAccount',
            'click #show-add-account':               'expandAddAccount',
            'click #close-add-account':              'collapseAddAccount',
            'click #save-account':                   'saveAccount',
            'input #ssn':                            'ssnChanged',
            'input #number':                         'numberChanged',
            'click .select-default':                 'changeDefaultAccount',
            'click .delete-account':                 'deleteAccount',
            'click .save-changes':                   'changeDefaultSubscriber'
		},

        // Render the template elements
        render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            const subscribers = app.utils.Storage.getSessionItem('subscribers-info');
            var accounts = [];

            if (app.utils.Storage.getSessionItem('accounts-subscribers-is-loaded') == true) {
                const accountsSubscribers = app.utils.Storage.getSessionItem('accounts-list-subscribers');
                accountsSubscribers.forEach(function(account) {
                    var productType = '';
                    account.subscribers.forEach(function(subscriber) {
                        if (subscriber.defaultSubcriber) {
                            account.productType = subscriber.productType;
                            account.defaultSubsriber = subscriber.subscriber;
                        }
                        subscriber.show = subscriber.subscriber.substring(0,3) != '100';
                    });
                    if (app.utils.tools.accountIsPostpaid(account.accountType, account.accountSubType, account.productType)) {
                        account.typeField = 'Pospago';
                    } else if (app.utils.tools.accountIsPrepaid(account.accountType, account.accountSubType, account.productType)) {
                        account.typeField = 'Prepago';
                    } else if (app.utils.tools.accountIsTelephony(account.accountType, account.accountSubType, account.productType)) {
                        account.typeField = 'Servicio Fijo';
                    } else {
                        account.typeField = 'Indefinida';
                    }
                });
                accounts = accountsSubscribers;
                app.utils.Storage.setSessionItem('accounts-list-subscribers', accountsSubscribers);
            }
            var self = this,
                variables = {
                    typeOfTelephony: app.utils.tools.typeOfTelephony,
                    subscribers: subscribers,
                    fullAccounts: accounts,
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

            $('#number').on('click focus', function (e) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $("#number").offset().top-50
                }, 1000);
            });

            $('#ssn').on('click focus', function (e) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $("#ssn").offset().top-50
                }, 1000);
            });

            if (app.utils.Storage.getSessionItem('accounts-subscribers-is-loaded') == false) {
                self.getAccount();
            } else {
                const accounts = app.utils.Storage.getSessionItem('accounts-list');
                if (accounts.length == 1) {
                    $('.select-account').eq(0).trigger('click');
                }
            }
        },

        getAccount: function() {
            var self = this;
            self.options.accountModel.getAccounts(
                function (response) {
                    if (!response.hasError) {
                        app.utils.Storage.setSessionItem('accounts-list-subscribers', response.accounts);
                        app.utils.Storage.setSessionItem('accounts-subscribers-is-loaded', true);
                        self.render(function(){
                            $.mobile.activePage.trigger('pagecreate');
                        });
                    } else {
                        showAlert('Error', response.errorDisplay, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            );
        },

        expandAddAccount: function (e) {
            $('#container_show-add-account').hide();
            $('#container_close-add-account').show();
        },

        collapseAddAccount: function (e) {
            $('#container_show-add-account').show();
            $('#container_close-add-account').hide();
        },

        ssnChanged: function(e) {
            self = this;

            var number = $.mobile.activePage.find('#ssn').val();

            if (number.length > 4) {
                number = number.slice(0,4);
                $.mobile.activePage.find('#ssn').val(number);
            }
            self.availableNext(e);
        },

        numberChanged: function(e) {
            self = this;

            var number = $.mobile.activePage.find('#number').val();

            if (number.length > 9) {
                number = number.slice(0,9);
                $.mobile.activePage.find('#number').val(number);
            }
            self.availableNext(e);
        },

        availableNext: function(e) {

		    var ssn = $.mobile.activePage.find('#ssn').val();
            var number = $.mobile.activePage.find('#number').val();

            if (ssn.length == 4 && number.length == 9) {
                $('#save-account').removeClass('gray');
                $('#save-account').addClass('red');
                $('#save-account').addClass('rippleR');
            } else {
                $('#save-account').removeClass('red');
                $('#save-account').removeClass('rippleR');
                $('#save-account').addClass('gray');
            }
        },

        saveAccount: function (e) {
		    var self = this;

            var ssn = $.mobile.activePage.find('#ssn').val();
            var account = $.mobile.activePage.find('#number').val();

            if (ssn.length != 4) {
                message = 'Debe ingresar los datos solicitados.';
                showAlert('Error', message, 'Aceptar');
                return;
            }

            if (account.length < 9) {
                message = 'Debe ingresar los datos solicitados.';
                showAlert('Error', message, 'Aceptar');
                return;
            }

            var check = $('#check-main').is(':checked');

            self.options.accountModel.addAccount(account, ssn, check,
                function (response) {
                    if (!response.hasError) {
                        app.utils.Storage.setSessionItem('accounts-subscribers-is-loaded', false);
                        showAlert('', 'Se ha agreado la cuenta con exito.', 'Aceptar', function () {
                            self.render(function(){
                                $.mobile.activePage.trigger('pagecreate');
                            });
                        });
                    } else {
                        showAlert('Error', response.errorDisplay, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            );
        },

        changeDefaultAccount: function (e) {
            e.stopPropagation();

            var self = this;

            var currentIndex = $(e.currentTarget).data('index'),
                accounts = app.utils.Storage.getSessionItem('accounts-list-subscribers'),
                account = accounts[currentIndex];

            var htmlID = '#star'+currentIndex;

            if (document.getElementById('star'+currentIndex).classList.contains("on")) {return;}

            var serviceProductType = account.mProductType;
            if (app.utils.tools.accountIsPostpaid(account.accountType, account.accountSubType, account.productType)) {
                serviceProductType = 'Postpago';
            } else if (app.utils.tools.accountIsPrepaid(account.accountType, account.accountSubType, account.productType)) {
                serviceProductType = 'Prepago';
            } else if (app.utils.tools.accountIsTelephony(account.accountType, account.accountSubType, account.productType)) {
                serviceProductType = 'TelefoniaFijo';
            }

            showConfirm(
                'Cambio de Cuenta Principal',
                '¿Seguro que desea seleccionar el BAN ' + account.account + ' como cuenta principal?',
                ['Si', 'No'],
                function(btnIndex){
                    if(btnIndex==1){
                        self.options.accountModel.setDefaultAccount(
                            account.account+'',
                            account.defaultSubsriber+'',
                            account.accountType,
                            account.accountSubType,
                            serviceProductType,
                            function (response) {
                                if (!response.hasError) {

                                    $('.select-default').removeClass('on');
                                    $(htmlID).addClass('on');

                                    const accountsSubscribers = app.utils.Storage.getSessionItem('accounts-list-subscribers');
                                    accountsSubscribers.forEach(function(accountWithSubs) {
                                        accountWithSubs.defaultAccount = account.account == accountWithSubs.account ? true : false;
                                    });
                                    app.utils.Storage.setSessionItem('accounts-list-subscribers', accountsSubscribers);

                                    showAlert('', 'Su cuenta principal ha sido modificada con exito.', 'Aceptar', function () {
                                        self.render(function(){
                                            $.mobile.activePage.trigger('pagecreate');
                                        });
                                    });
                                } else {
                                    showAlert('Error', response.errorDisplay, 'Aceptar');
                                }
                            },
                            app.utils.network.errorRequest
                        );
                    }
                });
        },

        deleteAccount: function(e) {
            var self = this;

            var currentIndex = $(e.currentTarget).data('index'),
                accounts = app.utils.Storage.getSessionItem('accounts-list-subscribers'),
                account = accounts[currentIndex];

            var htmlID = '#delete'+currentIndex;

            showConfirm(
                'Eliminar Cuenta',
                '¿Seguro que desea eliminar la cuenta ' + account.account + '?',
                ['Si', 'No'],
                function(btnIndex){
                    if(btnIndex==1){
                        self.options.accountModel.deleteAccount(
                            account.account+'',
                            function (response) {
                                if (!response.hasError) {
                                    const accountsSubscribers = app.utils.Storage.getSessionItem('accounts-list-subscribers');
                                    accountsSubscribers.splice(currentIndex, 1);
                                    app.utils.Storage.setSessionItem('accounts-list-subscribers', accountsSubscribers);
                                    showAlert('', 'La cuenta se ha eliminado con exito.', 'Aceptar', function () {
                                        self.render(function(){
                                            $.mobile.activePage.trigger('pagecreate');
                                        });
                                    });
                                } else {
                                    showAlert('Error', response.errorDisplay, 'Aceptar');
                                }
                            },
                            app.utils.network.errorRequest
                        );
                    }
                });
        },

        changeDefaultSubscriber: function(e) {
            var self = this;

            var currentIndex = $(e.currentTarget).data('index'),
                accounts = app.utils.Storage.getSessionItem('accounts-list-subscribers'),
                account = accounts[currentIndex];

            var radioName = 'group'+currentIndex;

            const subscriberDefault = $('input[name='+radioName+']:checked').data('subscriber');
            const subscriberTypeDefault = $('input[name='+radioName+']:checked').data('product');

            var serviceProductType = account.mProductType;
            if (app.utils.tools.accountIsPostpaid(account.accountType, account.accountSubType, subscriberTypeDefault)) {
                serviceProductType = 'Postpago';
            } else if (app.utils.tools.accountIsPrepaid(account.accountType, account.accountSubType, subscriberTypeDefault)) {
                serviceProductType = 'Prepago';
            } else if (app.utils.tools.accountIsTelephony(account.accountType, account.accountSubType, subscriberTypeDefault)) {
                serviceProductType = 'TelefoniaFijo';
            }

            self.options.accountModel.setDefaultAccount(
                account.account+'',
                subscriberDefault+'',
                account.accountType,
                account.accountSubType,
                serviceProductType,
                function (response) {
                    if (!response.hasError) {
                        app.utils.Storage.setSessionItem('accounts-subscribers-is-loaded', false);
                        showAlert('', 'Su cuenta y subscriptor principal han sido modificados con exito.', 'Aceptar', function () {
                            self.render(function(){
                                $.mobile.activePage.trigger('pagecreate');
                            });
                        });
                    } else {
                        showAlert('Error', response.errorDisplay, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            );
        },

        changeAccount: function(e) {
            var self = this;

            var accounts = app.utils.Storage.getSessionItem('accounts-list'),
                currentIndex = $(e.currentTarget).data('index'),
                account = accounts[currentIndex];

            var htmlID = '#ban'+currentIndex;

            $(e.currentTarget).toggleClass('mon');

            if ($(e.currentTarget).data('search-info') == true) {
                $(e.currentTarget).data('search-info', false);
                return;
            }
            $(e.currentTarget).data('search-info', true);
        }
		
	});
});