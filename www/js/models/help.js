$(function() {

	// Help Model
	// ----------
	
	app.models.Help = Backbone.Model.extend({				
		
		initialize: function() {							
			
	    },        
	    
	    sendFailure:function(info,message,successCB, errorCB){
        	
        	var parameters, 
        		commentInfo,
        		commentType,
        		countryId,
        		appId;
        	
        	commentType = 'failure';
        	countryId = 'pr';
        	appId = ''; 

        	commentInfo = {commentType:commentType, countryId: countryId, appId: appId};
        	        	
        	parameters = "{userMail:'" + info.userMail+ "', " +
        				   "info: '{" +
        				   		"userAgent:'" + info.userAgent + 
        				   		"', versionCode: '" + info.versionCode + 
        				   		"', versionName: '" + info.versionName + 
        				   		"', soVersion: '" + info.soVersion + 
        				   		"', userId: '" + info.userId + 
        				   	"'},"+
        				   	"message:'" + message+"'"+ 
        				   	"}";

    		
    		// requesting subscribe info
    		app.utils.network.sendComment(countryId, commentType, parameters, successCB, errorCB);
        	
        },
	    
	    sendImprovement:function(info,message,successCB, errorCB){
	    	
        	var parameters, 
	    		commentInfo,
	    		commentType,
	    		countryId,
	    		appId;
    	
	    	commentType = 'improvement';
	    	countryId = 'pr';
	    	appId = ''; 

	    	commentInfo = {commentType:commentType, countryId: countryId, appId: appId};
	    	        	
	    	parameters = "{userMail:'" + info.userMail+ "', " +
	    				   "info: '{" +
	    				   		"userAgent:'" + info.userAgent + 
	    				   		"', versionCode: '" + info.versionCode + 
	    				   		"', versionName: '" + info.versionName + 
	    				   		"', soVersion: '" + info.soVersion + 
	    				   		"', userId: '" + info.userId + 
	    				   	"'},"+
	    				   	"message:'" + message+"'"+ 
	    				   	"}";
	    	
	    	console.log(parameters); 
			
			// requesting subscribe info
			app.utils.network.sendComment(countryId, commentType, parameters, successCB, errorCB);
	    	
	    }
        
	});
	
});