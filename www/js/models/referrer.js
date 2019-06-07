$(function() {

    // Application Model
    // ----------
    app.models.Referrer = Backbone.Model.extend({

        initialize: function() {
            //...
        },

        getHobbies: function(account, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const parameters = JSON.stringify({
                token: tokenSession,
                account: account,
            });

            const headers = { 'Authorization': 'Bearer ' + tokenSession};

            const method = 'getHobbies';
            app.utils.network.requestReferrer(method, headers, parameters, successCB, errorCB);
        },

        getValidateReferrer: function(account, subscriber, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const parameters = JSON.stringify({
                token: tokenSession,
                account: account,
                subscriber: subscriber
            });

            const headers = { 'Authorization': 'Bearer ' + tokenSession};

            const method = 'getValidateReferrer';
            app.utils.network.requestReferrer(method, headers, parameters, successCB, errorCB);
        },

        getSharingMediaByUser: function(successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const parameters = JSON.stringify({
                ejecutar: 'GetSharingMediaByUser',
                token: tokenSession,
                memberID: 1,
                campaignID: 1,
            });

            const headers = { 'Authorization': 'Bearer ' + tokenSession};

            const method = 'getSharingMediaByUser';
            app.utils.network.requestReferrer(method, headers, parameters, successCB, errorCB);
        },

        getCredits: function(account, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const parameters = JSON.stringify({
                token: tokenSession,
                account: account,
            });

            const headers = { 'Authorization': 'Bearer ' + tokenSession};

            const method = 'getCredits';
            app.utils.network.requestReferrer(method, headers, parameters, successCB, errorCB);
        },

        getReferrerAccountsAllStatus: function(account, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const parameters = JSON.stringify({
                token: tokenSession,
                account: account,
                subscriber: '',

            });

            const headers = { 'Authorization': 'Bearer ' + tokenSession};

            const method = 'getReferrAccountsAllStatus';
            app.utils.network.requestReferrer(method, headers, parameters, successCB, errorCB);
        },

        getValidateReferrer: function(account, subscriber, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const parameters = JSON.stringify({
                token: tokenSession,
                account: account,
                subscriber: subscriber
            });

            const headers = { 'Authorization': 'Bearer ' + tokenSession};

            const method = 'getValidateReferrer';
            app.utils.network.requestReferrer(method, headers, parameters, successCB, errorCB);
        },

    });
});