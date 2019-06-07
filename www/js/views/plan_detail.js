$(function() {

	// Plan detail View
	// ---------------
	
	app.views.PlanDetailView = app.views.CommonView.extend({

		name:'plan_detail',
		
		// The DOM events specific.
		events: {
			
        	// events
            'active': 								'active',
            
			// header
			'click .btn-back': 						'back',
	        'click .btn-menu':						'menu',
	        'click .btn-chat': 						'chat',

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

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }
				
			var self = this,
			variables = {
				tops: app.utils.Storage.getSessionItem('tops'),
				svas: app.utils.Storage.getSessionItem('svas'),
				selectedSubscriberValue: app.utils.Storage.getSessionItem('selected-subscriber-result'),
				accountSections: this.getUserAccess(),
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
	
	});
	
});