$(function() {

	// Service View
	// ---------------
	
	app.views.ServiceView = app.views.CommonView.extend({

		name:'service',
		
		serviceSwiper: null,
		
		// The DOM events specific.
		events: {
			
			// events
			'pagecreate': 							'pageCreate',
			'active': 								'active',

			// header
			'click .btn-back': 						'menu',
	        'click .btn-menu':						'menu',
	        'click .btn-chat': 						'chat',
            'click .plan-detail': 					'planDetail',
				
			// content
			'change #select-account':				'changeAccountInfo',
			//'click .circle':						'changeSubscriber',
			'click #btn-change-plan': 				'changePlan',

            // toggle
			'click .sectbar':						'toggleClass',
            'click .phonebar':						'toggleClass',

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
			
			selectedAccount = app.utils.Storage.getSessionItem('selected-account');
                					
			var self = this,
				variables = {
                    account: selectedAccount,
                    accounts: app.utils.Storage.getSessionItem('accounts-list'),
                    subscribers: app.utils.Storage.getSessionItem('subscribers'),
                    selectedSubscriberValue: app.utils.Storage.getSessionItem('selected-subscriber-value'),
                    selectedAccountValue: app.utils.Storage.getSessionItem('selected-account-value'),
                    wirelessAccount: (selectedAccount.prodCategory=='WLS'),
                    typeOfTelephony: app.utils.tools.typeOfTelephony,
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
		
		pageCreate: function(e){
			
			var self = this,
				analytics = null;
			
		},		
		
		changeAccountInfo: function(e){
			
			var self = this,
				accountNumber = null,
				analytics = null;

			app.utils.Storage.setSessionItem('selected-account-value',$.mobile.activePage.find('#select-account').val());
			accountNumber = app.utils.Storage.getSessionItem('selected-account-value');

			$.each(app.utils.Storage.getSessionItem('accounts-list'), function(index, value){
				if(value.Account==app.utils.Storage.getSessionItem('selected-account-value')){
					app.utils.Storage.setSessionItem('selected-account',value);
				}
			});
			
			if(analytics != null ){
				// send GA statistics
				analytics.trackEvent('select', 'change', 'select account', accountNumber);
			}
			
			if(app.utils.Storage.getSessionItem('subscribers-'+accountNumber) == null){
				
				this.options.accountModel.getAccountSubscribers(
						//parameter
						app.utils.Storage.getSessionItem('token'),
						app.utils.Storage.getSessionItem('selected-account-value'),
						
						//success callback
						function(data){
							
							if(!data.HasError){					
								/*self.serviceSwiper.destroy();
								self.serviceSwiper = null;*/
								app.utils.Storage.setSessionItem('subscribers', data.Subscribers);
								
								//cache
								app.utils.Storage.setSessionItem('subscribers-'+accountNumber, data.Subscribers);
								
								self.render(function(){
									$.mobile.activePage.trigger('pagecreate');
								});
								
							}else{
								
								showAlert('Error', data.Desc, 'Aceptar');
								
							}
							
						},
						
						// error function
						app.utils.network.errorFunction	
				);	
				
			}else{
				
				//cache
				/*self.serviceSwiper.destroy();
				self.serviceSwiper = null;*/
				app.utils.Storage.setSessionItem('subscribers', app.utils.Storage.getSessionItem('subscribers-'+accountNumber));
				
				self.render(function(){
					$.mobile.activePage.trigger('pagecreate');
				});
				
			}
			
		},
		
		planDetail: function(e){

			var subscriber = $(e.currentTarget).data('subscriber');

			var offerID = 0,
				analytics = null;
			
			if(analytics != null){
				// send GA statistics
				analytics.trackEvent('button', 'click', 'plan detail', app.utils.Storage.getSessionItem('selected-account-value'));
			}
			
			this.options.subscriberModel.getSVA(
				//parameter
				app.utils.Storage.getSessionItem('token'),
				app.utils.Storage.getSessionItem('selected-account-value'),
				subscriber, 
				offerID,
				
				//success callback
				function(data){
					
					//TOPs
					app.utils.Storage.setSessionItem('tops', data.TOPs);

					//SVAs
					//app.session.SVAs = data.SVAs;
					app.utils.Storage.setSessionItem('svas',data.SVAs);
					
					//Subscriber
					$.each(app.utils.Storage.getSessionItem('subscribers'), function(index, value){
						if(value.subscriber==subscriber){
							app.utils.Storage.setSessionItem('selected-subscriber-result', value);
						}
					});
					
					//Go to plan detail
					app.router.navigate('plan_detail', {trigger: true});
					
				},
				
				// error function
				app.utils.network.errorFunction	
			);
			
		},
		
		changeSubscriber: function(e){
			
			var subscriber = $(e.currentTarget).data('subscriber'),
				index = $(e.currentTarget).data('index');
			
			//this.serviceSwiper.swipeTo(index,1000);
			
		}	
		
	});
	
});