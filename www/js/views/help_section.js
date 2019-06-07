$(function() {

	// Help Section View
	// ---------------
	
	app.views.HelpSectionView = app.views.CommonView.extend({

		name:'help_section',
		
		// The DOM events specific.
		events: {
			
			// header
			'click #btn-back'					:'back',
			
			// content
			'click #btn-about'					:'about',
			'click #btn-failure-report'			:'failureReport',
			'click #btn-improvement'			:'improvement',
			'click #btn-faq'					:'faq',
            'click #btn-contact-us'             :'contactUs',
            'click #btn-support-chat'			:'chat',
            'click #btn-locations'				:'locations',
		},

		// Render the template elements        
		render: function(callback) {

			//validate if logued
			var isLogued = false;
			var wirelessAccount = null;

			if(app.utils.Storage.getSessionItem('selected-account') != null){
			    isLogued = true;
			    wirelessAccount = (app.utils.Storage.getSessionItem('selected-account').prodCategory=='WLS')?true:false;
			}

			var self = this,
				variables = {
				    isLogued: isLogued,
				    wirelessAccount: wirelessAccount,
                    convertCaseStr: app.utils.tools.convertCase,
                    showBackBth: true
				};
			
			app.TemplateManager.get(self.name, function(code){
		    	var template = cTemplate(code.html());
		    	$(self.el).html(template(variables));	
		    	
		    	callback();	
		    	return this;
		    });
            $(document).scrollTop();
		},
		
		about: function(e){
			
			if(analytics !=null ){
				// send GA statistics
				analytics.trackEvent('button', 'click', 'about');
			}
			
			app.router.navigate('about', {trigger: true});
			
		},
		
		faq: function(e){
			
			if(analytics !=null ){
				// send GA statistics
				analytics.trackEvent('button', 'click', 'faq');
			}
			
			app.router.navigate('faq', {trigger: true});
			
		},		
	
		failureReport: function(e){
            app.router.navigate('failure_report', {trigger: true});
		},	
		
		improvement: function(e){
			app.router.navigate('improvement', {trigger: true});
		},
		
        contactUs: function(e){
            
            app.router.navigate('contact_us', {trigger: true});
        
        },
        
        locations:function(e){
        	
            var userLocation = '',
	            defaultStoreType = 1,
	            distanceMeasure = '',
	            self = this; 
        	
        	// Show loading
        	app.utils.loader.show();
        	
            navigator.geolocation.getCurrentPosition(
          		   
	        	function(position){
	        		console.log('-----------------------------');
	        		console.log(position);
	        		if(position!=null){
	        			
	                	userLocation = {
	                			
	                        'latitude'	:position.coords.latitude,
	                        'longitude'	:position.coords.longitude
	                    }; 
	                        
	                    app.utils.Storage.setSessionItem('user-location', userLocation);      
	                    
	                    // get store distance measure
	                    distanceMeasure = app.distanceMeasure; 
	        			
	        		}   
	        		
	                self.options.storeModel.getStores(
	
	                    // parameters
	                    defaultStoreType, 
	
	                    userLocation,
	
	                    distanceMeasure,
	
	                    // success callback
	                    function(data){
	
	                        if(!data.HasError){
	
	                            //  save stores and current type on storage
	                            app.utils.Storage.setSessionItem('stores', data.object.stores);
	                            app.utils.Storage.setSessionItem('active-store-type', data.object.stores[0].type);
	
	                            app.router.navigate('locations', {trigger: true});
	                        }
	
	                    },
	
	                    // error function
						app.utils.network.errorRequest
	
	                 );                		
	           }, 
	           
                // error callback
				function(error){
                
                    self.options.storeModel.getStores(
	
	                    // parameters
	                    defaultStoreType, 
	
	                    userLocation,
	
	                    distanceMeasure,
	
	                    // success callback
	                    function(data){
	
	                        if(!data.HasError){
	
	                            //  save stores and current type on storage
	                            app.utils.Storage.setSessionItem('stores', data.object.stores);
	                            app.utils.Storage.setSessionItem('active-store-type', data.object.stores[0].type);
                                
                                app.router.navigate('locations', {trigger: true});
	
	                        }
	
	                    },
	
	                    // error function
						app.utils.network.errorRequest
	
	                 );
                	
                },

                {maximumAge:600000, timeout:5000, enableHighAccuracy: true}
                   
              );        	
        
        }        

	});
});
