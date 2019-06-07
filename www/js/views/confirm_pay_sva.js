$(function() {

    // Confirm Pay SVA View
    // ---------------

    app.views.ConfirmPaySvaView = app.views.CommonView.extend({

        name: 'confirm_pay_sva',

        // The DOM events specific.
        events: {

            //event
            'pagecreate': 'pageCreate',

            // header
            'click .btn-back': 'back',
            'click .btn-menu': 'menu',
            'click .btn-chat': 'chat',

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
                                                              
			'click .btn-close': 'menu',                                                              

            // footer
            'click #btn-help': 'helpSection'

        },

        // Render the template elements        
        render: function(callback) {

            if ((app.utils.Storage.getSessionItem('payment-data') != null || app.utils.Storage.getSessionItem('invoice-charge') == true) &&
                (app.utils.Storage.getSessionItem('selected-offer-id') !== null || app.utils.Storage.getSessionItem('selected-offer') !== null)) {

                var today = moment().format('M-D-YY');
                var detailTransaction = '';

                detailTransaction = {
                    transactionId: app.utils.Storage.getSessionItem('pay-sva-transactionId'),
                    confirmationNumber: app.utils.Storage.getSessionItem('pay-sva-transactionInfo').confirmationNumber,
                    //createdDate:app.utils.Storage.getSessionItem('pay-sva-transactionInfo').createdDate
                    createdDate: today
                };

                var self = this,
                    variables = {
                        selectedAccountValue: app.utils.Storage.getSessionItem('selected-account-value'),
                        selectedSubscriberValue: app.utils.Storage.getSessionItem('selected-subscriber-value'),
                        selectedOffer: app.utils.Storage.getSessionItem('selected-offer'),
                        detailTransaction: detailTransaction,
                        wirelessAccount: (app.utils.Storage.getSessionItem('selected-account').prodCategory == 'WLS'),
                        accountAccess: this.getUserAccess(),
                        convertCaseStr: app.utils.tools.convertCase,
                        showBackBth: false,
                    };


                // Delete sessions variables
                app.utils.Storage.removeSessionItem('selected-offer-id');
                app.utils.Storage.removeSessionItem('selected-offer')
                app.utils.Storage.removeSessionItem('payment-data');

                app.TemplateManager.get(self.name, function(code) {
                    var template = cTemplate(code.html());
                    $(self.el).html(template(variables));
                    callback();
                    return this;
                });

            } else {
                app.router.navigate('sva_sell', {
                    trigger: true
                });
            }

        },

        pageCreate: function(e) {

            console.log('pagecreate...');

            var self = this;

        }

    });

});
