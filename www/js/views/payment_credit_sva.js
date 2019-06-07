$(function() {

    // Payment Step 3 View
    // ---------------

    app.views.PaymentCreditSvaView = app.views.CommonView.extend({

        name: 'payment_credit_sva',

        // The DOM events specific.
        events: {

            // events
            'active': 'active',

            //header
            'click .btn-back': 'backToPaymentStep2',
            'click .btn-menu': 'menu',

            // content
            'click .payment-step-4': 'goToMenu',

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

            'click select': 'fixedSelectInput',

            // footer
            'click #btn-help': 'helpSection'

        },

        // Render the template elements
        render: function(callback) {

            if ((app.utils.Storage.getSessionItem('payment-data') != null || app.utils.Storage.getSessionItem('invoice-charge') == true) &&
                (app.utils.Storage.getSessionItem('selected-offer-id') !== null || app.utils.Storage.getSessionItem('selected-offer') !== null)) {

                var self = this,
                    variables = {
                        selectedAccountValue: app.utils.Storage.getSessionItem('selected-account-value'),
                        selectedOffer: app.utils.Storage.getSessionItem('selected-offer'),
                        wirelessAccount: (app.utils.Storage.getSessionItem('selected-account').prodCategory == 'WLS'),
                        accountAccess: this.getUserAccess(),
                        convertCaseStr: app.utils.tools.convertCase,
                        showBackBth: false
                    };

                // Delete sessions variables
                app.utils.Storage.removeSessionItem('selected-offer-id');
                app.utils.Storage.removeSessionItem('selected-offer');
                app.utils.Storage.removeSessionItem('payment-data');

                app.TemplateManager.get(self.name, function(code) {
                    var template = cTemplate(code.html());
                    $(self.el).html(template(variables));
                    callback();
                    return this;
                });

            } else {
                app.router.navigate('data_plan', {
                    trigger: true
                });
            }

        },

        goToMenu: function(e) {

            app.router.navigate('menu', {
                trigger: true
            });

        },

        backToPaymentStep2: function(e) {

            app.router.navigate('payment_step_2', {
                trigger: true
            });

        }

    });
});