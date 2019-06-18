$(function() {

	// Application Model
	// ----------
	
	app.models.Subscriber = Backbone.Model.extend({				
		
		initialize: function() {							
			
	    },        
	    
        getSVA : function(token, account, subscriber, offerID, successCB, errorCB){
        	
        	if(!token || !account){
	    		return;
	    	}

    		method = 'SVA';
    		parameters = "{token:'" + token+ "', account: '" + account + "', subscriber: '" + subscriber + "', offerID: '" + offerID + "'}";
    		
    		// requesting subscribe info
    		app.utils.network.request(method, parameters, successCB, errorCB);
        	
        },

        getStatusGuarantee : function(subscriber, successCB, errorCB){

            var method = 'user/ticket',
                 type = 'POST',
                 authenticated = true;

            var parameters = {
                                 subscriber: subscriber
                               };

             //requesting
            app.utils.network.requestAPI(method, type, JSON.stringify(parameters), authenticated, successCB, errorCB);
        },

        sendFailure: function(parameters, successCB, errorCB) {
           var method = 'fixed-fault-report/reportFailure',
             type = 'POST',
             authenticated = true;

           //requesting Account
           app.utils.network.requestnewAPI(method, type, JSON.stringify(parameters), authenticated, successCB, errorCB);
        },

        getFailure: function(parameters, successCB, errorCB) {
           var method = 'fixed-fault-report/getFailure',
                 type = 'POST',
                 authenticated = true;

           app.utils.network.requestnewAPI(method, type, JSON.stringify(parameters), authenticated, successCB, errorCB);
        },

        sendQuotasDevice: function(parameters, successCB, errorCB) {
           var method = 'installment/create',
             type = 'POST',
             authenticated = true;

           app.utils.network.requestnewAPI(method, type, JSON.stringify(parameters), authenticated, successCB, errorCB);
        },

        svaBuy: function(parameters, successCB, errorCB) {
           var method = 'sva/buy',
             type = 'POST',
             authenticated = true;

           app.utils.network.requestnewAPI(method, type, JSON.stringify(parameters), authenticated, successCB, errorCB);
        }
        
	});
	
});