$(function() {

	// Payment Step 1 View
	// ---------------
	
	app.views.PaymentStep4View = app.views.CommonView.extend({

		name:'payment_step_4',
		
		// The DOM events specific.
		events: {
        
        	// events
            'active': 'active',
			
			//header
			'click .btn-back': 'back',
			
			// content
			'click .close-aditional-data-payment': 'paymentConfirmation',

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
				variables = {
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
		
		},
		
		paymentConfirmation: function(e){
			
			app.router.navigate('payment_confirmation',{trigger: true});
		}
	
	});
});
