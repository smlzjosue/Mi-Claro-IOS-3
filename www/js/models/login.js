$(function() {

    // Application Model
    // ----------
    app.models.Login = Backbone.Model.extend({

        initialize: function() {
            //...
        },

        login: function(username, password, successCB, errorCB){

            const method = 'authenticate';
            const parameters = JSON.stringify({
                Username: btoa(username),
                Password: btoa(password),
                method: method
            });

            app.utils.network.processRequest(parameters, successCB, errorCB, true);
        },

        validateSubscriber: function(subscriber, successCB, errorCB) {

            const method = 'validateSubscriber';

            const parameters = JSON.stringify({
                subscriber: subscriber,
                method: method
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        validateSSNAndEmail: function(subscriber, code, ssn, email, successCB, errorCB){

            const method = 'registerUserValidateSSNAndEmail';

            const parameters = JSON.stringify({
                Subscriber: subscriber,
                SSN: ssn,
                code: code,
                Email: email,
                method: method
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        validatePassword: function(subscriber, code, ssn, email, password, successCB, errorCB){

            const method = 'registerUser';

            const parameters = JSON.stringify({
                Subscriber: subscriber,
                SSN: ssn,
                code: code,
                Email: email,
                Password: password,
                method: method
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        /*
        * INIT GUEST METHODS
        */
        validateUser: function(subscriber, successCB, errorCB) {

            const parameters = JSON.stringify({
                subscriber: subscriber
            });

            const method = 'validateUser';

            app.utils.network.requestLogin(method, parameters, successCB, errorCB);
        },

        loginGuest: function(subscriber, successCB, errorCB){

            const parameters = JSON.stringify({
                subscriber: subscriber,
                device: app.device,
                deviceToken: app.uuid
            });

            const method = 'authenticateAsGuest';

            app.utils.network.requestLogin(method, parameters, successCB, errorCB);
        },

        registerGuest: function(subscriber, successCB, errorCB) {

            const parameters = JSON.stringify({
                subscriber: subscriber,
                device: app.device,
                deviceToken: app.uuid
            });

            const method = 'registerGuestUser';

            app.utils.network.requestLogin(method, parameters, successCB, errorCB);
        },

        resendGuestCode: function(subscriber, successCB, errorCB){

            const parameters = JSON.stringify({
                subscriber: subscriber
            });

            const method = 'updateUserGetCode';

            app.utils.network.requestLogin(method, parameters, successCB, errorCB);
        },

        updateGuest: function(code, subscriber, successCB, errorCB) {

            const parameters = JSON.stringify({
                subscriber: subscriber,
                device: app.device,
                code: code,
                deviceToken: app.uuid
            });

            const method = 'updateUserSetToken';

            app.utils.network.requestLogin(method, parameters, successCB, errorCB);
        },
        /*
        * END GUEST METHODS
        */

        getSecurityQuestions: function(subscriber, successCB, errorCB){

            const method = 'getChallengeQuestions';

            const parameters = JSON.stringify({
                subscriber: subscriber,
                method: method
            });

            app.utils.network.processRequest(parameters, successCB, errorCB, true);
        },

        answerSecurityQuestions: function(subscriber, questions, successCB, errorCB){

            const method = 'getpasswordrecovery';

            const parameters = JSON.stringify({
                subscriber: subscriber,
                ResponseList: questions,
                method: method
            });

            app.utils.network.processRequest(parameters, successCB, errorCB, true);
        },

        recoveryPasswordBySubscriber: function(subscriber, sms, email, successCB, errorCB){

            const method = 'getPasswordRecoveryBySubscriber';

            const parameters = JSON.stringify({
                subscriber: subscriber,
                sms: sms,
                email: email,
                method: method
            });

            app.utils.network.processRequest(parameters, successCB, errorCB, true);
        }
    });
});