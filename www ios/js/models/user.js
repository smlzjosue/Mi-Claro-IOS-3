$(function() {

	// Application Model
	// ----------

	app.models.User = Backbone.Model.extend({

		initialize: function() {
			//...
	    },

        getUserProfile: function(accountNumber, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'GetPersonalData';

            const parameters = JSON.stringify({
                BAN: accountNumber,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        updatePersonalData: function(data, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'UpdatePersonalData';

            data.method = method;
            data.token = tokenSession;

            const parameters = JSON.stringify(data);

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        updatePersonalAddress: function(data, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'UpdatePersonalDir';

            data.method = method;
            data.token = tokenSession;

            const parameters = JSON.stringify(data);

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        updatePassword: function(data, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'changePassword';

            data.method = method;
            data.token = tokenSession;

            const parameters = JSON.stringify(data);

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        updateUsername: function(email, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'changeUser';

            const parameters = JSON.stringify({
                email: email,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        getQuestions: function(successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');

            const method = 'getquestions';

            const parameters = JSON.stringify({
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        getChallengeQuestions: function(successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');

            const method = 'getChallengeQuestions2';

            const parameters = JSON.stringify({
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        setChallengeQuestions: function(questionId, response, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');

            const method = 'setchallengequestions';

            const parameters = JSON.stringify({
                questionID: questionId,
                response: response,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        getVerifyEmail: function(email, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');

            const method = 'getVerifyEmail';

            const parameters = JSON.stringify({
                email: email,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        getPersonalAlertsStatus: function(accountNumber, subscriber, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'GetPersonalAlertsAndNTCStatus';

            const parameters = JSON.stringify({
                BAN: accountNumber,
                Subscriber: subscriber,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        updateNotToCall: function(accountNumber, subscriber, action, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'NotToCall';

            const parameters = JSON.stringify({
                BAN: accountNumber,
                Subscriber: subscriber,
                Action: action,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        updateAlerts: function(accountNumber, subscriber, alerts, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'UpdateAlerts';

            const parameters = JSON.stringify({
                BAN: accountNumber,
                Subscriber: subscriber,
                alertList: alerts,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        updateNotification: function(idMessage, accountNumber, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'updMessageStatus';

            const parameters = JSON.stringify({
                id_message: idMessage,
                account: accountNumber,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequestNotDialog(parameters, successCB, errorCB);
        }
	});

});
