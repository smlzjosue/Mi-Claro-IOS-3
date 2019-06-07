$(function() {

    // Passport View
    // ---------------

    app.views.PassportView = app.views.CommonView.extend({

        name: 'passport',

        // The DOM events specific.
        events: {

            //header
            'click .btn-back': 'back',
            'click .btn-menu': 'back',

            // evets
            'active': 'active',

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

            'show.bs.offcanvas .navmenu': 'openMenu',
            'click .btn-passport': 'openPassport',




            // footer
            'click #btn-help': 'helpSection'
        },


        // Render the template elements        
        render: function(callback) {

            var self = this;
            var accounts = app.utils.Storage.getSessionItem('accounts-list');

            var variables = {
                accounts: accounts,
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

        },

        openPassport: function(e) {

            console.log('subscriber=' + $(e.currentTarget).data('subscriber'));
            console.log('account=' + $(e.currentTarget).data('account'));
            console.log('accountSubtype=' + $(e.currentTarget).data('accountSubtype'));

        }

    });

});