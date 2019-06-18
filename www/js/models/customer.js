$(function() {

    // Application Model
    // ----------
    app.models.Customer = Backbone.Model.extend({

        initialize: function() {
            //...
        },

        validateAccount: function(account, accountType, accountSubType, subscriber, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');

            const method = 'validateAccount';

            const parameters = JSON.stringify({
                suscriber: subscriber,
                ban: account,
                currentAccountSubType: accountSubType,
                currentAccountType: accountType,
                newAccountSubType: accountSubType,
                newAccountType: accountType,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        validateGuest: function(token, code, subscriber, successCB, errorCB) {

            const parameters = JSON.stringify({
                subscriber: subscriber,
                code: code,
                device: app.device
            });

            const headers = { 'Authorization': 'Bearer ' + token};

            const method = 'validateGuestAccount';

            app.utils.network.requestCustomers(method, headers, parameters, successCB, errorCB);
        },

        accountDetails: function(subscriber, account, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'getaccountdetails';
            const parameters = JSON.stringify({
                subscriber: btoa(subscriber),
                account: btoa(account),
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        userAccess: function(subscriber, account, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'getaccess';
            const parameters = JSON.stringify({
                subscriber: subscriber,
                account: account,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        updateToken: function(subscriber, account, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'updateToken';
            const parameters = JSON.stringify({
                subscriber: subscriber,
                account: account,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        passwordUpdate: function(currentPassword, newPassword, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');

            const method = 'setPasswordUpdate';

            const parameters = JSON.stringify({
                currentPassword: currentPassword,
                newPassword: btoa(newPassword),
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        getBan: function(account, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');

            const parameters = JSON.stringify({
                BAN: account,
                method: 'getBan',
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        updateBillParameters: function(account, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');

            const parameters = JSON.stringify({
                Ban: account,
                method: 'updateBillParameters',
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        getSubscriber: function(subscriber, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');

            const parameters = JSON.stringify({
                Subscriber: subscriber,
                method: 'GetSubscriber',
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        //-------------------------------------------------------------------

        getMember: function(account, successCB, errorCB){

            const parameters = JSON.stringify({
                account: account,
            });

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const headers = { 'Authorization': 'Bearer ' + tokenSession};

            const method = 'getMember';

            app.utils.network.requestCustomers(method, headers, parameters, successCB, errorCB);
        },

        addMember: function(data, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const headers = { 'Authorization': 'Bearer ' + tokenSession};
            data.token = tokenSession;
            const parameters = JSON.stringify(data);

            const method = 'addMember';

            app.utils.network.requestCustomers(method, headers, parameters, successCB, errorCB);
        },

        addCampaignAlerts: function(account, subscriber, emails, userLink, successCB, errorCB){

            const parameters = JSON.stringify({
                account: account,
                emails: emails,
                subscriber: subscriber,
                userLink: userLink
            });

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const headers = { 'Authorization': 'Bearer ' + tokenSession};

            const method = 'addCampaignAlerts';

            app.utils.network.requestCustomers(method, headers, parameters, successCB, errorCB);
        },

        sendGift1GB: function(data, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'AddGift1GB';

            data.token = tokenSession;
            data.method = method;

            const parameters = JSON.stringify(data);

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        sendGiftRecharge: function(data, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'giftRecharge';

            data.token = tokenSession;
            data.method = method;

            const parameters = JSON.stringify(data);

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        getGift1GBSend: function(account, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');

            const parameters = JSON.stringify({
                BAN: account,
                method: 'GetGift1GBSend',
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        getGift1GBByGUI: function (account, gui, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');

            const parameters = JSON.stringify({
                BAN: account,
                GUI:gui,
                method: 'GetGift1GBByGUI',
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        }

    });

});