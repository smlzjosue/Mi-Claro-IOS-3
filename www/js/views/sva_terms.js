$(function() {

    // About View
    // ---------------

    app.views.SvaTermsView = app.views.CommonView.extend({

        name: 'sva_terms',

        // The DOM events specific.
        events: {

            // header
            'click .btn-back': 'back',
            'click .chat-btn': 'chat',

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

            //validate if logued
            var isLogued = false;
            var wirelessAccount = null;

            if (app.utils.Storage.getSessionItem('selected-account') != null) {
                isLogued = true;
                wirelessAccount = (app.utils.Storage.getSessionItem('selected-account').prodCategory == 'WLS') ? true : false;
            }

            var self = this,
                variables = {
                    version: app.version,
                    isLogued: isLogued,
                    wirelessAccount: wirelessAccount,
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

        },

    });
});
