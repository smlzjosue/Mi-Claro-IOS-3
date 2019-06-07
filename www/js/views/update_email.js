$(function() {

    // Chat View
    // ---------------

    app.views.UpdateEmailView = app.views.CommonView.extend({

        name: 'update_email',

        // The DOM events specific.
        events: {

            //header
            'click .btn-back': 'back',
            'click .btn-menu': 'back',

            // evets
            'active': 'active',

            //event
            'iframeload': 'resizeIframe',

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

            var self = this;

            var variables = {
                url: app.chatURL,
                showBackBtn: (app.router.history[app.router.history.length - 1] !== 'help_section' && app.router.history[app.router.history.length - 1] !== 'login'),
                isLogued: app.utils.Storage.getSessionItem('token') != null,
                accountAccess: this.getUserAccess(),
                convertCaseStr: app.utils.tools.convertCase,
                showBackBth: true
            };

            app.TemplateManager.get(self.name, function(code) {
                var template = cTemplate(code.html());
                $(self.el).html(template(variables));
                app.router.refreshPage();
                callback();
                return this;
            });

        },

        resizeIframe: function(e) {

            $('html, body').css('height', '100%');

        }

    });

});