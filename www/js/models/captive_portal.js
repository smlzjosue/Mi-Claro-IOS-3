$(function() {

	// Captive Portal Model
	// ----------
	
	app.models.CaptivePortal = Backbone.Model.extend({
		
		initialize: function() {
	    },
                                                     
        listAutomaticRenewal: function (accountNumber, successCB, errorCB) {
                          
            // Remove
            // ************************************
			subscriber = '17873779306';
            // ************************************
                                                     
            var method = 'Service/DataPack/AccountPackagesInfo',
            	type = 'POST',
            	parameters = {
                	accountNumber: accountNumber
				};
           
            //requesting Account
            app.utils.network.requestCaptivePortal(method, type, JSON.stringify(parameters), authenticated, successCB, errorCB);
        },

        addAutomaticRenewal: function (subscriber, offerId, baseOfferId, successCB, errorCB) {
                                                     
            // Remove
            // ************************************
			subscriber = '17873779306';
			offerId = 'RUP250';
			baseOfferId = '';
            // ************************************
                                                     
            var method = 'Service/DataPack/SubscriptionAutomaticRenewal',
            	type = 'POST',
            	parameters = {
                	SubscriberId: '1'+subscriber,
                	OfferID: offerId,
                    BaseOfferId: baseOfferId
				};
           
            //requesting
            app.utils.network.requestCaptivePortal(method, type, JSON.stringify(parameters), authenticated, successCB, errorCB);
        },
        
        removeAutomaticRenewal: function (subscriber, offerId, baseOfferId, successCB, errorCB) {
                                                     
            // Remove
            // ************************************
			subscriber = '17873779306';
			offerId = '';
			baseOfferId = 'BA10GBO';
            // ************************************
                                                     
            var method = 'Service/DataPack/SubscriptionAutomaticRenewal',
            	type = 'POST',
            	parameters = {
                	SubscriberId: '1'+subscriber,
                    BaseOfferId: baseOfferId
				};
           
            //requesting
            app.utils.network.requestCaptivePortal(method, type, JSON.stringify(parameters), authenticated, successCB, errorCB);
        },
                                        
	});
	
});

