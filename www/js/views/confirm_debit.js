$(function() {

  // Confirm Pay SVA View
  // ---------------

  app.views.ConfirmDebitView = app.views.CommonView.extend({

    name: 'confirm_debit',

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
        account = app.utils.Storage.getSessionItem('selected-account');;

      var detailDebit = app.utils.Storage.getSessionItem('pay-debit-direct');

      var self = this,
        variables = {
          detailTransaction: detailDebit,
          typeTransaction: detailDebit.type,
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

    pageCreate: function(e) {

      console.log('pagecreate...');

      var self = this;

    }

  });

});
