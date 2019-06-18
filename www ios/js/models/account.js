$(function() {

	// Application Model
	// ----------
	
	app.models.Account = Backbone.Model.extend({				
		
		initialize: function() {							
			
	    },   
	    
	    /**********************************NEW METHODS****************************/
        getAccountsList: function (successCB, errorCB) {
            var method = 'user/accounts',
            	type = 'GET',
            	authenticated = true,
            	parameters = {};
           
            //requesting Account
            app.utils.network.requestAPI(method, type, parameters, authenticated, successCB, errorCB);
        },
        
        // setDefault: function (accountNumber, subscriberNumber, successCB, errorCB) {
        //     var method = 'user/account/default/' + accountNumber + '/' + subscriberNumber,
        //     	type = 'PUT',
        //     	authenticated = true,
        //     	parameters = {};
        //
        //     //setting Default Account
        //     app.utils.network.requestAPI(method, type, parameters, authenticated, successCB, errorCB);
        // },

        // deleteAccount: function (accountNumber, successCB, errorCB) {
        //     var method = 'user/account/' + accountNumber,
        //     	type = 'DELETE',
        //     	authenticated = true,
        //     	parameters = {};
        //
        //     //deleting Account
        //     app.utils.network.requestAPI(method, type, parameters, authenticated, successCB, errorCB);
        // },
        
        // addAccount: function (accountNumber, ssn, defaultAccount, successCB, errorCB) {
        // 	var method = 'user/account',
        //     	type = 'POST',
        //     	authenticated = true,
        //     	parameters = '{' + '"accountNumber": "' + accountNumber + '", "ssn": "'  + ssn + '", "defaultAccount":' + defaultAccount + '}';
        //
        // 		console.log(parameters);
        //
        //     //http://184.106.10.165:9081/api-miclaro-services-dev/miclaro/user/account
        //
        //     //deleting Account
        //     app.utils.network.requestAPI(method, type, parameters, authenticated, successCB, errorCB);
        // },
        /*****************************END NEW METHODS*****************************/	    
	    
	    // getAccounts: function(token, successCB, errorCB){
	    //
        // 	if(!token){
	    // 		return;
	    // 	}
        //
    	// 	method = 'Accounts';
    	// 	parameters = '{token:"' + token+ '"}';
    	//
    	// 	// requesting Accounts
    	// 	app.utils.network.request(method, parameters, successCB, errorCB);
     	//
	    // },
	    
//	    getAccountsList : function(token, successCB, errorCB){
//	    	
//	    	if(!token){
//	    		return;
//	    	}
//
//    		method = 'AccountsList';
//    		parameters = '{token:"' + token+ '"}';    		
//
//			// requesting account info
//			app.utils.network.request(method, parameters, successCB, errorCB);
//        	
//        },	          
	    
	    getAccountInfo : function(token, account, successCB, errorCB){	   
	    	
	    	if(!token || !account){
	    		return;
	    	}

    		method = 'MyAccount';
    		parameters = "{token:'" + token+ "', account: '" + account + "' }";    		

			// requesting account info
			app.utils.network.request(method, parameters, successCB, errorCB );
        	
        },
        
        getAccountUsage : function(token, account, subscriber, successCB, errorCB){
        	
        	if(!token || !account){
	    		return;
	    	}

    		method = 'Usage';
    		parameters = "{token:'" + token+ "',account:'" + account + "',subscriber:'" + subscriber + "'}";
    		
    		// requesting account info
    		app.utils.network.request(method, parameters, successCB, errorCB);
        	
        },

        getAccountSubscribers : function(token, account, successCB, errorCB){
        	
        	if(!token || !account){
	    		return;
	    	}

            method = 'MySubscribers';
            parameters = "{token:'" + token+ "', account: '" + account + "'}";
            
            // requesting account info
            app.utils.network.request(method, parameters, successCB, errorCB);
            
        },          
        
        doPayment : function(token, account, amount, successCB, errorCB){
        	
        	if(!token || !account){
	    		return;
	    	}
        	
    		method = 'DoPayment';
    		parameters = "{token:'" + token+ "', account: '"+account+"', amount: '" + amount + "'}";
    		
    		// requesting account info
    		app.utils.network.request(method, parameters, successCB, errorCB);
        	
        },    

        getPaymentInfo : function(token, paymentId, successCB, errorCB){
        	
        	if(!token || !paymentId){
	    		return;
	    	}
            
            method = 'PaymentInfo';
            parameters = "{token:'" + token+ "', PaymentId: '" + paymentId + "'}";
            
            // requesting account info
            app.utils.network.request(method, parameters, successCB, errorCB);
                
        },        
        
        validateSuscriber : function(subscriber, successCB, errorCB){
        	
        	if(!subscriber){
	    		return;
	    	}
        	
        	method = 'RegisterValidateSubscriber';
            parameters = "{subscriber: '" + subscriber + "'}";
            
            // requesting account info
            app.utils.network.request(method, parameters, successCB, errorCB);
        },

        getAccountDefaultSubscriber: function (account, successCB, errorCB) {
            var method = 'user/account/'+account+'/default-subscriber',
            	type = 'GET',
            	authenticated = true,
            	parameters = {};

            //requesting Account
            app.utils.network.requestAPI(method, type, parameters, authenticated, successCB, errorCB);
        },

         sendFailure: function (data, successCB, errorCB) {
             var method = 'fixed-fault-report/reportFailure',
                type = 'POST',
                authenticated = true,
                parameters = {
                             accountNumber: data.accountNumber,
                             accountType: data.accountType,
                             accountSubType: data.accountSubType,
                             subscriber: data.subscriber,
                             token: data.token,
                             failureInfo: {
                                     type: data.failureType,
                                     detail: data.failureDetail
                             }
                         };

             //requesting Account
             app.utils.network.requestnewAPI(method, type, JSON.stringify(parameters), authenticated, successCB, errorCB);
         },

         getFailure: function (data, successCB, errorCB) {
             var method = 'fixed-fault-report/getFailure',
                type = 'POST',
                authenticated = true,
                parameters = {
                             subscriber: data.subscriber
                             };

             //requesting Account
             app.utils.network.requestnewAPI(method, type, JSON.stringify(parameters), authenticated, successCB, errorCB);
         },





        // new services
        getAccountBill: function(account, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'Bill';

            const parameters = JSON.stringify({
                Account: account,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        addAccount: function (accountNumber, ssn, defaultAccount, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'addAccounts';

            const parameters = JSON.stringify({
                account: accountNumber,
                ssn: ssn,
                setAsDefaultAccount: defaultAccount,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        setDefaultAccount: function (accountNumber, subscriber, accountType, accountSubType, productType, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'SetAsDefaultAccount';

            const parameters = JSON.stringify({
                account: accountNumber,
                subscriber: subscriber,
                accountType: accountType,
                accountSubType: accountSubType,
                productType: productType,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        getAccounts: function(successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');

            const method = 'getAcounts';

            const parameters = JSON.stringify({
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        deleteAccount: function (accountNumber, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'deleteAccount2';

            const parameters = JSON.stringify({
                account: accountNumber,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        setDefaultSubscriber: function (accountNumber, subscriber, accountType, accountSubType, productType, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'SetAsDefaultAccount';

            const parameters = JSON.stringify({
                account: accountNumber,
                subscriber: subscriber,
                accountType: accountType,
                accountSubType: accountSubType,
                productType: productType,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        getHistoryOrders: function (account, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'accountPackagesInfo';

            const parameters = JSON.stringify({
                Ban: account,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        subscribeNetflix: function(account, subscriber, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'suscribirNeflix';

            const parameters = JSON.stringify({
                account: account,
                subscriber: subscriber,
                customerType: "",
                mdeviceSerialNumber: "",
                moperatorUrlError: "",
                mpromotionId: "",
                msalesChannel: "",
                productId: "",
                subProductId: "",
                method: method,
                token: tokenSession,
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

    });
	
});