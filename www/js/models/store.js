$(function() {

	// Store Model
	// ----------
	
	app.models.Store = Backbone.Model.extend({				
		
		initialize: function() {							
			
	    }, 
        
	    getStores:function(storeType, userLocation, distanceMeasure, successCB, errorCB){
            
            var jsonUrl,
                method = 'store/list',
                parameters;
            
                if(distanceMeasure==''){
                    
                    parameters = '{' +
                                    '"type":"' + storeType + '"' +
                                '}';  
                    
                }else{
                    
                    parameters = '{' +
                                '"type":"' + storeType + '",' +
                                '"latitude":"' + userLocation.latitude + '",' +
                                '"longitude":"' + userLocation.longitude + '",' +
                                '"measureUnit":"' + distanceMeasure + '"' +
                            '}';                            
                
                }
            
           app.utils.network.apiRequest(method, parameters, successCB, errorCB );
	    	
	    },        
	    

        
	});
	
});