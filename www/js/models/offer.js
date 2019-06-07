$(function () {

    // Offer Model
    // ----------

    app.models.Offer = Backbone.Model.extend({

        initialize: function () {

        },
        
        getOffers: function (soc, technology, customerType, customerSubType, price, creditClass, successCB, errorCB) {
        	
        	// fixed text bugs
        	soc = soc.replace(/\'/g,'');
        	
            var method = 'soc/getSoc',
	            parameters = '{' +
	            	'"soc":"' + soc + '",' +
	            	'"tecnology":"' + technology + '",' +
	            	'"customerType":"' + customerType + '",' +	 
	            	'"customerSubType":"' + customerSubType + '",' +	 
	            	'"price":"' + price.replace('$','') + '",' +
	            	'"creditClass":"' + creditClass + '"' +
	            '}';
            
            // requesting subscribe info
            app.utils.network.apiRequest(method, parameters, successCB, errorCB);

        },

        getOffersDSL: function (token, phoneNumber, successCB, errorCB) {

            //https://miclaro.clarotodo.com/ClaroMobileServicesV1.5.0QA23/Services.aspx?Service=DSLCatalog
            var method = 'DSLCatalog',
                parameters = '{' +
                    '"token":"' + token + '",' +
                    '"phoneNumber":"' + phoneNumber + '"' +
                '}';

            // requesting subscribe info
            app.utils.network.request(method, parameters, successCB, errorCB);

        },
        
        getOfferDescription: function (soc,successCB, errorCB) {
        	
        	// fixed text bugs
        	soc = soc.replace(/\'/g,'');
        	
            var method = 'soc/getSocDetails',
	            parameters = '{' +
	            	'"soc":"' + soc + '"' +
	            '}';
            
            // requesting subscribe info
            app.utils.network.apiRequest(method, parameters, successCB, errorCB);

        },        
        
        updateSubscriberPlanSocs: function (oldSoc, newSoc, subscriber, term, successCB, errorCB) {
        	
            var method = (term=='now') ? 'updateSubscriberPricePlanSocs' : 'updateSubscriberPricePlanSocsNextCicle',
	            parameters = '{' +
	            	'"token":"' + app.utils.Storage.getSessionItem('token') + '",' +
	            	'"OldSocCode":"' + oldSoc.replace(/\'/g,'') + '",' +
	            	'"NewSocCode":"' + newSoc.replace(/\'/g,'')  + '",' +	            	
	            	'"mProductType":"G",' +
	            	'"mSubscriberNo":"' + subscriber + '"' +
	            '}';
            console.log(parameters);
            // requesting subscribe info
            app.utils.network.request(method, parameters, successCB, errorCB);

        },

        updateSubscriberPlanSocsDSL: function (dslPhoneNumber, ProductType, alphaCodeContract, contract, dslBan, oldSocPrice, productId, successCB, errorCB) {

            //https://miclaro.clarotodo.com/ClaroMobileServicesV1.5.0QA23/Services.aspx?Service=AdaDslPackageChange
            var method = 'AdaDslPackageChange',
            parameters = '{' +
                '"token":"' + app.utils.Storage.getSessionItem('token') + '",' +
                '"dslPhoneNumber":"' + dslPhoneNumber + '",' +
                '"ProductType":"' + ProductType + '",' +
                '"alphaCodeContract":"' + alphaCodeContract  + '",' +
                '"contract":"' + contract  + '",' +
                '"dslBan":"' + dslBan  + '",' +
                '"oldSocPrice":"' + oldSocPrice + '",' +
                '"productId":"' + productId + '"' +
            '}';

            // requesting subscribe info
            app.utils.network.request(method, parameters, successCB, errorCB);

        },

        getOffersToSubscriber: function (token, subscriberId, successCB, errorCB) {

            if (!token) {
                return;
            }

            //var subscriberId = '7873125427';

            var TransactionId = Math.floor(Math.random() * 90000) + 10000,
                //subscriberId

                method = 'OffersToSubscriber';

            var parameters = '{' +
                '"TransactionId":"' + TransactionId + '",' +
                '"SubscriberId":"' + subscriberId + '"' +
                '}';

            // requesting subscribe info
            app.utils.network.request(method, parameters, successCB, errorCB);

        },

        // validateCreditLimit: function (creditData, successCB, errorCB) {
        //
        //     var method = 'ValidateCreditLimit';
        //
        //     var parameters = '{' +
        //         '"Ban":"' + creditData.ban + '",' +
        //         '"ProductPrice":"' + creditData.productPrice + '",' +
        //         '"AccountType":"' + creditData.accountType + '"' +
        //         '}';
        //
        //
        //     app.utils.network.request(method, parameters, successCB, errorCB);
        //
        // },

        closeTransaction: function (transactionData, successCB, errorCB) {

            var method = 'CloseTransaction';

            var parameters = '{' +
                '"PCRFTransaID":"' + transactionData.PCRFTransaID + '",' +
                '"transactionId":"' + transactionData.transactionId + '"' +
                '}';


            app.utils.network.request(method, parameters, successCB, errorCB);

        },

        // addOfferToSubscriber: function (offerData, successCB, errorCB) {
        //
        //     var method = 'AddOffersToSubscriber',
        //     	offerResponse = app.utils.Storage.getSessionItem('add-scubsriber-data');
        //
        //     var subscriberId = '7873125427';
        //
        //     var parameters = '{' +
        //         '"SubscriberId":"' + offerData.subscriberId + '",' +
        //         '"OfferId":"' + offerData.offerId + '",' +
        //         '"Charge":"' + offerData.charge + '",' +
        //         '"Cicle":"' + offerData.cicle + '"' +
        //         '}';
        //
	    //     if(offerResponse !== null){
	    //     	successCB(offerResponse);
	    //     } else {
	    //     	app.utils.network.request(method, parameters, successCB, errorCB);
	    //     }
        //
        // },
        
        getOffersDesc: function (successCB, errorCB) {

            var jsonUrl = 'data/plants.json';

            // requesting countries JSON
            app.utils.network.requestJSON(jsonUrl, successCB, errorCB);

        },

        listSVA: function(socs, tier, effectiveDate, successCB, errorCB) {
            var method = 'sva/list',
                type = 'POST',
                authenticated = true;
            var parameters = { socs : socs, tier: tier, date: effectiveDate};

            app.utils.network.requestnewAPI(method, type, JSON.stringify(parameters), authenticated, successCB, errorCB);
        },





        // new services
        getPlans: function(creditClass, customerSubType, customerType, price, soc, technology, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'getPlanes2';

            const parameters = JSON.stringify({
                creditClass: creditClass,
                customerSubType: customerSubType,
                customerType: customerType,
                price: price,
                soc: soc,
                tecnology: technology,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        getPlansPrepaid: function(subscriberToken, customerType, technology, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'getChangePlanPrepago';

            const parameters = JSON.stringify({
                accountType: customerType,
                tech: technology,
                method: method,
                token: tokenSession+subscriberToken
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        getPlansDSL: function(subscriber, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'DSLCatalog';

            const parameters = JSON.stringify({
                phoneNumber: subscriber,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        updateSubscriberPlan: function(newSoc, oldSoc, productType, subscriber, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'updateSubscriberPricePlanSocs';

            const parameters = JSON.stringify({
                NewSocCode: newSoc,
                OldSocCode: oldSoc,
                mProductType: productType,
                mSubscriberNo: subscriber,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        updateSubscriberPlanNextCycle: function(newSoc, oldSoc, productType, subscriber, account, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'updateSubscriberPricePlanSocsNextCicle';

            const parameters = JSON.stringify({
                BAN: account,
                NewSocCode: newSoc,
                OldSocCode: oldSoc,
                mProductType: productType,
                mSubscriberNo: subscriber,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        updateSubscriberDSLPlan: function (productId, oldSocPrice, contract, alphaCodeContract, productType, subscriber, account, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'adaDslPackageChange';

            const parameters = JSON.stringify({
                ProductType: productType,
                alphaCodeContract: alphaCodeContract,
                contract: contract,
                dslBan: account,
                dslPhoneNumber: subscriber,
                oldSocPrice: oldSocPrice,
                productId: productId,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        updatePrepaidSubscriberPlan: function(amount, planName, rechargeMinutes, newSoc, currentSoc, accountType, accountSubType, account, subscriber, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'changePrepaidAccount';

            const parameters = JSON.stringify({
                amount: amount,
                ban: account,
                currentAccountSubType: accountSubType,
                currentAccountType: accountType,
                currentSoc: currentSoc,
                newAccountSubType: accountSubType,
                newAccountType: accountType,
                newSoc: newSoc,
                planName: planName,
                rechargeMinutes: rechargeMinutes,
                method: method,
                token: tokenSession+subscriber
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        getDataPackets: function(groupID, transactionId, subscriber, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'GetOffersToSubscriber';

            const parameters = JSON.stringify({
                OfferGroup: '',
                SubscriberId: subscriber,
                TransactionId: transactionId,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        getReadSubscriber: function(subscriber, transactionId, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'GetReadSubscriber';

            const parameters = JSON.stringify({
                IdSubscriber: subscriber,
                TransactionId: transactionId,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        validateCreditLimit: function (account, accountTotalRent, productPrice, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'ValidateCreditLimit';

            const parameters = JSON.stringify({
                Ban: btoa(account),
                ProductPrice: btoa(productPrice),
                AccountTotalRent: btoa(accountTotalRent),
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        addOfferToSubscriber: function (data, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'AddOffersToSubscriber';

            data.method = method;
            data.token = tokenSession;

            const parameters = JSON.stringify(data);

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        // addOfferToSubscriber: function (offerData, successCB, errorCB) {
        //
        //     var method = 'AddOffersToSubscriber',
        //         offerResponse = app.utils.Storage.getSessionItem('add-scubsriber-data');
        //
        //     var subscriberId = '7873125427';
        //
        //     var parameters = '{' +
        //         '"SubscriberId":"' + offerData.subscriberId + '",' +
        //         '"OfferId":"' + offerData.offerId + '",' +
        //         '"Charge":"' + offerData.charge + '",' +
        //         '"Cicle":"' + offerData.cicle + '"' +
        //         '}';
        //
        //     if(offerResponse !== null){
        //         successCB(offerResponse);
        //     } else {
        //         app.utils.network.request(method, parameters, successCB, errorCB);
        //     }
        //
        // },
    });

});