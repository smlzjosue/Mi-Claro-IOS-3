$(function() {

    // Confirm Pay Quota View
    // ---------------

    app.views.ConfirmPayQuotaView = app.views.CommonView.extend({

        name: 'confirm_pay_quota',

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

            var self = this,
                account = app.utils.Storage.getSessionItem('selected-account'),
                variables = {};

            var dataSubscriber = app.utils.Storage.getSessionItem('selected-subscriber-info');
            var detailTransaction = '';

            detailTransaction = {
                device: dataSubscriber.Divice,
                quotas: app.utils.Storage.getSessionItem('pay-quotas-num'),
                amount: app.utils.Storage.getSessionItem('pay-quotas-amount'),
                transactionId: app.utils.Storage.getSessionItem('pay-quotas-transactionDetail').object.transactionId,
                confirmationNumber: app.utils.Storage.getSessionItem('pay-quotas-transactionDetail').object.confirmationNumber,
                createdDate: app.utils.Storage.getSessionItem('pay-quotas-transactionDetail').object.createdDate
            };

            // Delete sessions variables
            app.utils.Storage.removeSessionItem('pay-quotas-num');
            app.utils.Storage.removeSessionItem('pay-quotas-amount');
            app.utils.Storage.removeSessionItem('pay-quotas-type');
            app.utils.Storage.removeSessionItem('pay-quotas-transactionDetail');

            variables = {
                detailTransaction: detailTransaction,
                wirelessAccount: (app.utils.Storage.getSessionItem('selected-account').prodCategory == 'WLS'),
                accountAccess: this.getUserAccess(),
                convertCaseStr: app.utils.tools.convertCase,
                showBackBth: false
            };

            app.TemplateManager.get(self.name, function(code) {
                var template = cTemplate(code.html());
                $(self.el).html(template(variables));
                app.router.refreshPage();
                callback();
                return this;
            });

        },

        pageCreate: function(e) {

            console.log('pagecreate...');

            var self = this;

        }

    });

});
