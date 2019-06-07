$(function() {

    // Sva View
    // ---------------

    app.views.MyOrderView = app.views.CommonView.extend({

        name: 'my_order',

        selectedOffer: {
            'offerId': '',
            'displayName': '',
            'price': ''
        },

        // The DOM events specific.
        events: {

            // evets
            'active': 'active',
            'pagecreate': 'pageCreate',
            

            //header
            'click .btn-back': 'back',
            'click .btn-menu': 'menu',
            'click .btn-chat': 'chat',

            'change #select-account': 'changeAccount',

            // toggle
            'click .sectbar': 'toggleClass',
            'click .phonebar': 'toggleClass',

            // nav menu
            'click #close-nav':							'closeMenu',
            'click .close-menu':						'closeMenu',
            'click .open-menu':						    'openMenu',
            'click .btn-account':                       'account',
            'click .btn-consumption':                   'consumption',
            'click .btn-service':                       'service',
            'click .btn-change-plan':                   'changePlan',
            'click .btn-add-aditional-data':            'aditionalDataPlan',
            'click .btn-device':                        'device',
            'click .btn-profile':                       'profile',
            'click .btn-gift':                          'giftSend',
            'click .btn-invoice':                       'invoice',
            'click .btn-notifications':	                'notifications',
            'click .btn-sva':                           'sva',
            'click .btn-gift-send-recharge':            'giftSendRecharge',
            'click .btn-my-order':                      'myOrder',
            'click .btn-logout':                        'logout',
            'click .select-menu':						'clickMenu',

            // footer
            'click #btn-help': 'helpSection'

        },

        // Render the template elements
        render: function(callback) {

            var self = this,
                variables = null;

            // user hasn't logged in
            if (app.utils.Storage.getSessionItem('token') == null) {

                document.location.href = 'index.html';

            } else {

                var subscribers = app.utils.Storage.getSessionItem('subscribers'),
                    selectedAccountValue = app.utils.Storage.getSessionItem('selected-subscriber-value'),
                    selectedAccount = app.utils.Storage.getSessionItem('selected-account');

                $.each(subscribers, function(index, value) {
                    //switches
                    $('[name="'+value.subscriber+'"]').bootstrapSwitch();
                });
                                                        
                if (selectedAccountValue != null) {
                    app.utils.Storage.setSessionItem('selected-subscriber-value', selectedAccountValue);
                } else {
                    app.utils.Storage.setSessionItem('selected-subscriber-value', subscribers[0].subscriber);
                }

                var variables = {
                    accounts: app.utils.Storage.getSessionItem('accounts-list'),
                    selectedAccountValue: app.utils.Storage.getSessionItem('selected-account-value'),
                    selectedAccount: app.utils.Storage.getSessionItem('selected-account'),
                    subscribers: app.utils.Storage.getSessionItem('subscribers'),
                    selectedSubscriberValue: app.utils.Storage.getSessionItem('selected-subscriber-value'),
                    selectedOfferId: app.utils.Storage.getSessionItem('selected-offer-id'),
                    availableOffers: app.utils.Storage.getSessionItem('select-offer-to-subscriber'),
                    wirelessAccount: (selectedAccount.prodCategory == 'WLS'),
                    typeOfTelephony: app.utils.tools.typeOfTelephony,
                    accountAccess: this.getUserAccess(),
                    convertCaseStr: app.utils.tools.convertCase,
                    showBackBth: true
                };

                app.TemplateManager.get(self.name, function(code) {
                    var template = cTemplate(code.html());
                    $(self.el).html(template(variables));
                    callback();
                    return this;
                });

            }

        },
        
        pageCreate: function() {
                                                        
            var self = this,
                account = app.utils.Storage.getSessionItem('selected-account'),
                notificationsState = app.utils.Storage.getSessionItem('notifications-state'),
                subscribers = app.utils.Storage.getSessionItem('subscribers');
                               
            $.each(subscribers, function(index, value) {
                //switches
                $('#'+value.subscriber).bootstrapSwitch();
            });
                                                        
        },

        changeAccount: function(e) {

            var self = this,
                analytics = null;


            app.utils.Storage.setSessionItem('selected-account-value', $.mobile.activePage.find('#select-account').val());
            var accountNumber = app.utils.Storage.getSessionItem('selected-account-value');

            if (analytics != null) {
                // send GA statistics
                analytics.trackEvent('select', 'change', 'select account number', accountNumber);
            }

            app.utils.Storage.setSessionItem('selected-account', app.utils.Storage.getSessionItem(accountNumber));

            $.each(app.utils.Storage.getSessionItem('accounts-list'), function(index, value) {
                if (value.Account === app.utils.Storage.getSessionItem('selected-account-value')) {
                    app.utils.Storage.setSessionItem('selected-account', value);
                }
            });

            if (app.utils.Storage.getSessionItem(accountNumber) == null) {

                this.options.accountModel.getAccountSubscribers(
                    //parameter
                    app.utils.Storage.getSessionItem('token'),

                    accountNumber,

                    //success callback
                    function(data) {

                        if (!data.HasError) {

                            // session
                            app.utils.Storage.setSessionItem('selected-account', data);

                            // cache
                            //app.cache.Accounts[accountNumber] = data;
                            app.utils.Storage.setSessionItem(accountNumber, data);

                            self.options.accountModel.getAccountSubscribers(
                                //parameter
                                app.utils.Storage.getSessionItem('token'),
                                data.Account,

                                //success callback
                                function(dataSubscriber) {
                                    console.log('#success ws service');

                                    if (!data.HasError) {

                                        app.utils.Storage.setSessionItem('subscribers', dataSubscriber.Subscribers);
                                        app.utils.Storage.setSessionItem('selected-subscriber', dataSubscriber.Subscribers[0]);
                                        
                                        // cache
                                        app.utils.Storage.setSessionItem('subscribers-' + data.Account, dataSubscriber.Subscribers);

                                        // render view
                                        self.render(function() {
                                            $.mobile.activePage.trigger('pagecreate');
                                        });

                                    } else {

                                        showAlert('Error', data.Desc, 'Aceptar');

                                    }

                                },

                                // error function
                                app.utils.network.errorFunction
                            );

                        } else {

                            showAlert('Error', data.Desc, 'Aceptar');

                        }

                    },

                    // error function
                    app.utils.network.errorFunction
                );


            } else {

                // cache
                app.utils.Storage.setSessionItem('selected-account', app.utils.Storage.getSessionItem(accountNumber));
                var selectedAccount = app.utils.Storage.getSessionItem('selected-account');

                // search if the subscriber dont exists
                if (app.utils.Storage.getSessionItem('subscribers-' + accountNumber) == null) {
                    this.options.accountModel.getAccountSubscribers(
                        //parameter
                        app.utils.Storage.getSessionItem('token'),
                        selectedAccount.Account,

                        //success callback
                        function(data) {

                            if (!data.HasError) {

                                app.utils.Storage.setSessionItem('subscribers', data.Subscribers);
                                app.utils.Storage.setSessionItem('selected-subscriber', data.Subscribers[0]);
                                app.utils.Storage.setSessionItem('subscribers-' + selectedAccount.Account, data.Subscribers);
                                                                    
                                // render view
                                self.render(function() {
                                    $.mobile.activePage.trigger('pagecreate');
                                });


                            } else {

                                showAlert('Error', data.Desc, 'Aceptar');

                            }

                        },

                        // error function
                        app.utils.network.errorFunction
                    );

                } else {

                    //load cache
                    var subscribers = app.utils.Storage.getSessionItem('subscribers-' + accountNumber);

                    // set cache
                    app.utils.Storage.setSessionItem('subscribers', subscribers);
                    app.utils.Storage.setSessionItem('selected-subscriber', subscribers[0]);

                    // render view
                    self.render(function() {
                        $.mobile.activePage.trigger('pagecreate');
                    });

                }

            }

        }

    });
});
