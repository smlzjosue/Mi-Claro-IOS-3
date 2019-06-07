$(function() {

	// Email Update View
	// ---------------
	
	app.views.EmailUpdateView = app.views.CommonView.extend({

		name:'email_update',
		
		// The DOM events specific.
		events: {
			
			//header
			'click .btn-back': 'back',
            'click .btn-menu': 'back',
            
        	// evets
            'active': 'active',
            'pagecreate': 'pageCreate',
			
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
		render:function (callback) {
			
			var self = this;
            var token = app.utils.Storage.getSessionItem('token');
            var defaultEmail = 'example@claro.pr';
            var now = new Date();
			
			var variables = {
				url: app.registerAppUrl + '#update_email/' + token + '/android/' + defaultEmail + '?time=' + now.getTime(),
                isLogued: true,
                accountAccess: this.getUserAccess(),
                convertCaseStr: app.utils.tools.convertCase,
                showBackBth: false
			};
			
			app.TemplateManager.get(self.name, function(code){
		    	var template = cTemplate(code.html());
		    	$(self.el).html(template(variables));	
		    	app.router.refreshPage();
		    	callback();	
		    	return this;
		    });
			
		},
        
        pageCreate: function(e) {
			window.addEventListener(
            	'message',
				function (e) {
              		if(e.origin !== 'http://localhost:3000' &&
                        e.origin !== 'http://184.106.10.165:9090'){
                        return;
                    }

                    /*
                    if(e.origin.indexOff(app.registerAppUrl)<=-1){
                                            return;
                                        }
                                        */
                    
                    var now = new Date();
                    //now.setTime(now.getTime() + (1000 * 60 * 60 * 24 * app.updateEmailTime));
                    now.setTime(now.getTime() + (1000 * 60  * app.updateEmailTime));
                    
                    // set time variable
                    app.utils.Storage.setLocalItem('email-update-time', now.getTime());
                    
                    // go to menu
                    app.router.navigate('menu', {trigger: true});

	          	},
                false
            );
        },
		
		resizeIframe: function(e){
			
			$('html, body').css('height','100%');
			
		}
	
	});

});
