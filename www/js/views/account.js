$(function() {

    // Profile View
    // ---------------

    app.views.AccountView = app.views.CommonView.extend({

        name:'account',

        // The DOM events specific.
        events: {

            // evets
            'active': 'active',

            // header
            'click .btn-back': 'menu',
            'click .btn-menu': 'menu',
            'click .btn-chat': 'chat',

            // content
            'change #select-account': 'changeAccount',
            'click .select-subscriber':	'changeSubscriber',
            'click .inp-arrow': 'selectArrow',
            'click #btn-change-plan': 'changePlan',
            'click #btn-add-accounts': 'addAccounts',

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

        render:function (callback) {

            var  self = this,
                subscriber = null,
                variables = null,
                selectedAccount = app.utils.Storage.getSessionItem('selected-account'),
                newAmountValue;

            // user hasn't logged in
            if(app.utils.Storage.getSessionItem('token') == null){

                document.location.href = 'index.jsp';

            } else {

                // New format amount value
                var totalRate = (app.utils.Storage.getSessionItem('selected-subscriber') !== undefined )? parseFloat(app.utils.Storage.getSessionItem('selected-subscriber').TotalRate.replace('$','')).toFixed(2) : 0;

                if (totalRate != null && totalRate != '' && totalRate.indexOf('.') >= 0) {
                    newAmountValue = totalRate.split('.');
                } else {
                    newAmountValue = parseFloat(app.utils.Storage.getSessionItem('selected-account').AmtDue.replace('$','')).toFixed(2).split('.');
                }

                variables = {
                    accounts: app.utils.Storage.getSessionItem('accounts-list'),
                    selectedAccountValue: app.utils.Storage.getSessionItem('selected-account-value'),
                    selectedAccount: app.utils.Storage.getSessionItem('selected-account'),
                    subscribers: app.utils.Storage.getSessionItem('subscribers') ,
                    selectedSubscriber: app.utils.Storage.getSessionItem('selected-subscriber'),
                    expirationDate: selectedAccount.BillDateEnd,
                    planName: selectedAccount.AccountName,
                    lastPayment: this.formatAmount(selectedAccount.LastPayment),
                    amtDue: (selectedAccount.AmtDue.indexOf('CR') >0 ) ? selectedAccount.AmtDue.replace('$','') : this.formatAmount(selectedAccount.AmtDue),
                    pastAmtDue: this.formatAmount(selectedAccount.PastDueAmt),
                    wirelessAccount: (app.utils.Storage.getSessionItem('selected-account').prodCategory=='WLS')?true:false,
                    newAmountValue: newAmountValue,
                    typeOfTelephony: app.utils.tools.typeOfTelephony,
                    accountAccess: this.getUserAccess(),
                    convertCaseStr: app.utils.tools.convertCase,
                    showBackBth: true
                };

                app.TemplateManager.get(self.name, function(code){
                    var template = cTemplate(code.html());
                    $(self.el).html(template(variables));
                    callback();
                    return this;
                });

            }

        },

        changeAccount: function(e){

            var self = this,
                analytics = null;

            app.utils.Storage.setSessionItem('selected-account-value', $.mobile.activePage.find('#select-account').val());
            var accountNumber = app.utils.Storage.getSessionItem('selected-account-value');

            if (analytics != null) {
                // send GA statistics
                analytics.trackEvent('select', 'change', 'select account number', accountNumber);
            }

            app.utils.Storage.setSessionItem('selected-account', app.utils.Storage.getSessionItem(accountNumber));

            $.each(app.utils.Storage.getSessionItem('accounts-list'), function (index, value) {
                if (value.Account === app.utils.Storage.getSessionItem('selected-account-value')) {
                    app.utils.Storage.setSessionItem('selected-account', value);
                }
            });

            if (app.utils.Storage.getSessionItem(accountNumber) == null) {

                this.options.accountModel.getAccountInfo(
                    //parameter
                    app.utils.Storage.getSessionItem('token'),

                    accountNumber,

                    //success callback
                    function (data) {
                        console.log(data);

                        if (!data.HasError) {

                            // session
                            app.utils.Storage.setSessionItem('selected-account', data);

                            // cache
                            //app.cache.Accounts[accountNumber] = data;
                            app.utils.Storage.setSessionItem(accountNumber, data);

                            app.utils.Storage.setSessionItem('subscribers', data.Subscribers);
                            app.utils.Storage.setSessionItem('selected-subscriber', data.Subscribers[0]);

                            var accountSuspend = false;

                            for (var i = 0; i < data.Subscribers.length; i++) {
                                if (data.Subscribers[i].status == 'S') {
                                    accountSuspend = true;
                                    break;
                                }
                            }

                            // cache
                            app.utils.Storage.setSessionItem('subscribers-' + accountNumber, data.Subscribers);

                            if (!app.utils.Storage.getSessionItem('suspend-account') && accountSuspend) {

                                self.showSuspendedAccount();

                            }

                            self.render(function () {
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
                // cache
                app.utils.Storage.setSessionItem('selected-account', app.utils.Storage.getSessionItem(accountNumber));
                var selectedAccount = app.utils.Storage.getSessionItem('selected-account');

                // search if the subscriber dont exists
                //if(typeof app.cache.Subscribers[accountNumber] == 'undefined'){
                if (app.utils.Storage.getSessionItem('subscribers-' + accountNumber) == null) {
                    this.options.accountModel.getAccountSubscribers(
                        //parameter
                        app.utils.Storage.getSessionItem('token'),
                        selectedAccount.Account,

                        //success callback
                        function (data) {

                            if (!data.HasError) {

                                app.utils.Storage.setSessionItem('subscribers', data.Subscribers);
                                app.utils.Storage.setSessionItem('selected-subscriber', data.Subscribers[0]);

                                // cache
                                app.utils.Storage.setSessionItem('subscribers-' + accountNumber, data.Subscribers);

                                // render view
                                self.render(function () {
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
                    self.render(function () {
                        $.mobile.activePage.trigger('pagecreate');
                    });

                }

            }

        },

        changeSubscriber:function(e){

            var analytics = null,
                self = this;

            app.utils.Storage.setSessionItem('selected-subscriber-value', $(e.currentTarget).data('value'));
            $.each(app.utils.Storage.getSessionItem('subscribers'), function (index, value) {
                if (value.subscriber == app.utils.Storage.getSessionItem('selected-subscriber-value')) {
                    app.utils.Storage.setSessionItem('selected-subscriber', value);
                }
            });

            if (analytics != null) {
                // send GA statistics
                analytics.trackEvent('select', 'change', 'select subscriber', app.utils.Storage.getSessionItem('selected-subscriber'));
            }

            // New code E
            var selectedSubscriber = app.utils.Storage.getSessionItem('selected-subscriber'),
                currentIndex = $(e.currentTarget).data('index');

            if($(e.currentTarget).hasClass('mon')){
                //$(e.currentTarget).attr("aria-expanded", "false");
            }else{
                $('#planName'+currentIndex).html(selectedSubscriber.Plan + '-' + parseFloat(selectedSubscriber.PlanRate.replace('$','')).toFixed(2));
                $('#PlanRate'+currentIndex).html('$' + parseFloat(selectedSubscriber.PlanRate.replace('$','')).toFixed(2));
                //$('#totalPlanRate'+currentIndex).html(parseFloat(selectedSubscriber.TotalRate.replace('$','')).toFixed(2));

                // New format amount value
                var newAmountValue;
                var totalRate = parseFloat(app.utils.Storage.getSessionItem('selected-subscriber').TotalRate.replace('$','')).toFixed(2);

                if (totalRate != null && totalRate != '' && totalRate.indexOf('.') >= 0) {
                    newAmountValue = totalRate.split('.');
                } else {
                    newAmountValue = parseFloat(app.utils.Storage.getSessionItem('selected-account').AmtDue.replace('$','')).toFixed(2).split('.');
                }

                $('#totalPlanRate'+currentIndex).html(
                    '<span class="tmed-s din-b f-red">$</span>'+
                    '<span class="big-s din-b f-red">'+newAmountValue[0]+'</span>'+
                    '<span class="tmed-s din-b f-red"><span class="tabcell">'+newAmountValue[1]+'</span></span>'
                );

                var html = '';
                if (selectedSubscriber.hasSVAs) {
                    html += '<div class="autobar">'+
                        '<div class="container">'+
                        '<div class="basicrow f-little din-b f-gray">Servicios Adicionales</div>';

                    $.each(selectedSubscriber.SVAs, function (index, sva) {
                        html += '<div class="basicrow m-top-ii">'+
                            '<div class="contspace f-med f-black text-left f-bold">'+
                            sva.PlanName +
                            '</div>'+
                            '<div class="phonespace f-lmed f-red din-b text-right">'+
                            parseFloat(sva.Rent.replace('$','')).toFixed(2) +
                            '</div>'+
                            '</div>';
                    });

                    html += '</div>'+
                        '</div>';
                }

                $('#selectedSubscriberSvas'+currentIndex).html(html);

            };

        },

        selectArrow: function(e){
            console.log('click select');
            $(e.currentTarget).parent().find('select').fire('click');
        }

    });
});