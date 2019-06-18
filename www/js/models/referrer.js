$(function() {

    // Application Model
    // ----------
    app.models.Referrer = Backbone.Model.extend({

        initialize: function() {
            //...
        },

        getHobbies: function(account, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');

            const method = 'gethobbies';
            const parameters = JSON.stringify({
                account: account,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        getValidateReferrer: function(account, subscriber, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');

            const method = 'getValidateReferrer';

            const parameters = JSON.stringify({
                account: account,
                subscriber: subscriber,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        getSharingMediaByUser: function(successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');

            const method = 'getSharingMediaByUser';

            const parameters = JSON.stringify({
                method: method,
                token: tokenSession,
                memberID: 1,
                campaignID: 1,
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        getCredits: function(account, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');

            const method = 'getCreditsByAccount';

            const parameters = JSON.stringify({
                Account: account,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
            // $.getJSON("js/pojo/get-credits.json", function(json) {
            //     var data = json;
            //     successCB(data);
            // });
        },

        applyCredits: function(account, subscriber, amount, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');

            const method = 'RedeemCuponsByAccount';

            const parameters = JSON.stringify({
                account: account,
                subscriber: subscriber,
                total: amount,
                applyDiscountID:1,
                strcomentario: 'dashboard',
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
            // $.getJSON("js/pojo/redeem-cupons.json", function(json) {
            //     var data = json;
            //     successCB(data);
            // });
        },

        getReferrerAccountsAllStatus: function(account, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');

            const method = 'getReferrAccountsAllStatus';

            const parameters = JSON.stringify({
                account: account,
                subscriber: '',
                campaignID: 1,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        sharedCoupons: function(memberID, account, subscriber, emails, userLink, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');

            const method = 'sharedCupons';

            const parameters = JSON.stringify({
                account: account,
                subscriber: subscriber,
                memberID: memberID,
                email: emails,
                link: userLink,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        }
    });
});