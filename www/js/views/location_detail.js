$(function() {

	// Location Detail View
	// ---------------
	
	app.views.LocationDetailView = app.views.CommonView.extend({

		name:'location_detail',
		
		// The DOM events specific.
		events: {
            
             // event
			'pagecreate'                        :'pageCreate',
			'active'                            :'active',
			            
			// content
			'click #btn-back'                   :'back',
            'click .store-route'                :'showStoreRoute'
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
				    store: app.utils.Storage.getSessionItem('store'),
				    isLogued: isLogued,
				    wirelessAccount: wirelessAccount,
                    convertCaseStr: app.utils.tools.convertCase,
                    showBackBth: true
				};
            
            app.TemplateManager.get(self.name, function(code){
                var template = cTemplate(code.html());
                $(self.el).html(template(variables));
                callback();	
            });
            $(document).scrollTop();
		},
        
        pageCreate: function(e) {
			
            var store = app.utils.Storage.getSessionItem('store');
			            
            if(store.latitude!='' && store.longitude!=''){
                
                // map options
                var myLatlng = new google.maps.LatLng(store.latitude, store.longitude);

                var mapOptions = {
                    center: myLatlng,
                    zoom: 15,
                    scaleControl: false,
                    draggable: false
                };

                // define custom marker
                var image = new google.maps.MarkerImage(
                    'images/claro-pin.png',
                    null,
                    null, 
                    null,
                    new google.maps.Size(40, 40)
                );

                var map = new google.maps.Map(document.getElementById('store-map'), mapOptions);

                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    icon: image
                });                   
            
            }

        },
        
        showStoreRoute: function(e){
            
            var activeStore = app.utils.Storage.getSessionItem('store');

            console.log(activeStore);

            launchnavigator.navigate([activeStore.latitude, activeStore.longitude], {
                start: activeStore.latitude+', '+ activeStore.longitude
            });
            
            // launchnavigator.navigate(
            // 	[activeStore.latitude, activeStore.longitude],
            //   	null,
            //   	function(){
            //       	console.log('Show maps sucess');
            //   	},
            //   	function(error){
            //     	console.log('Show maps error = ' + error);
            //   	}
            // );
        
        }
        
	});
});
