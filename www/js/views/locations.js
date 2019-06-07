$(function() {

	// Locations View
	// ---------------
	
	app.views.LocationsView = app.views.CommonView.extend({

		name:'locations',
		
		// The DOM events specific.
		events: {
            
              // event
			'pagecreate'                        :'pageCreate',
            'active'                            :'active',
			
			// content
            'click #btn-back'					:'back',
            'click .btn-store'                  :'changeStoreList',
            'click .btn-store-detail'           :'storeDetail',
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
                    stores          :app.utils.Storage.getSessionItem('stores'),
                	activeStoreType :app.utils.Storage.getSessionItem('active-store-type'),
                    isLogued        :isLogued,
                    wirelessAccount :wirelessAccount,
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
        
        pageCreate: function(e) {

        },
        
        changeStoreList: function(e){
            
            var storeType,
                stores,
                self = this,
                distanceMeasure = '',
                userLocation = {
                'latitude': '',
                'longitude': ''
                };  
                
            
            // get store type
            storeType = $(e.currentTarget).data('storeType');
            
            // get location
            if(app.utils.Storage.getSessionItem('user-location')!=null) {
                
                userLocation = app.utils.Storage.getSessionItem('user-location');
                
                // get store distance measure
                distanceMeasure = app.distanceMeasure; 
            
            }

            self.options.storeModel.getStores(
                    
                //parameters
                storeType, 
                
                userLocation,
                
                distanceMeasure,

                // success callback
                function(data){
                    
                    if(!data.HasError) {
                        
                        app.utils.Storage.setSessionItem('stores', data.object.stores);
                        app.utils.Storage.setSessionItem('active-store-type', storeType);

                        // render view with new stores data
                        self.render(function(){});                         
                    
                    }

                },

                // error callback
                // Replace with the generic error function
                function(error){
					showAlert('Error', 'Disculpe, no fue posible establecer la comunicación', 'Aceptar');
                	app.router.navigate('help_section',{trigger: true});
                }

            );	              
        
        },
        
        storeDetail: function (e){
        
            var storeId,
                stores; 
        
            storeId = $(e.currentTarget).data('storeId');
            
            stores = app.utils.Storage.getSessionItem('stores');
            
			$.each(stores, function(index, store){
				if(store.id==storeId){
					app.utils.Storage.setSessionItem('store', store);
                    app.router.navigate('location_detail',{trigger: true});
				}
			});

            
        }
	});
});
