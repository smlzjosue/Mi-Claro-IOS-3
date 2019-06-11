$(function () {

    // Payment Model
    // ----------

    app.models.Payment = Backbone.Model.extend({

        initialize: function () {

        },

        getCountries: function (successCB, errorCB) {

            var jsonUrl = 'data/countries.json';

            // requesting countries JSON
            app.utils.network.requestJSON(jsonUrl, successCB, errorCB);

        },
        
        getStates: function (successCB, errorCB) {

            var jsonUrl = 'js/data/states.json';

            // requesting countries JSON
            app.utils.network.requestJSON(jsonUrl, successCB, errorCB);

        },        

        addPayment: function (paymentData, successCB, errorCB) {

            var parameters = {
                cardNum: paymentData.cardNumber,
                expDate: paymentData.cardExpirationDate,
                nameOnCard: paymentData.fullName,
                amount: paymentData.amount,
                zip: paymentData.postalCode,
                street: paymentData.address1 + ' / ' + paymentData.address2,
                cvNum: paymentData.securityCode,
                aplicationID: app.gatewayAppId,
                pcrftransaID: paymentData.pcrftransaID,
                accountNumber: paymentData.accountNumber
            };
  			console.log(parameters);
            window.sendPaymentInfo(app.pcrfUrl, JSON.stringify(parameters), successCB, errorCB);

        },

        checkTransaction: function (transactionData, successCB, errorCB) {

            var method = '/payment/transaction/checkTransaction';

            var parameters = '{' +
                '"transactionId":"' + transactionData.transactionId + '",' +
                '"aplicationId":"' + transactionData.aplicationId + '"' +
                '}';


            app.utils.network.requestPCRF(method, parameters, successCB, errorCB);

        },




        // new services
        doPayment : function(account, amount, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'DoPayment';

            const parameters = JSON.stringify({
                Account: account,
                Amount: amount,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);

        },

        paymentHistory : function(account, year, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'PaymentHistory';

            const parameters = JSON.stringify({
                Ban: account,
                year: year,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        getHistoricoFacturas : function(account, year, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'GetHistoricoFacturas';
            const format = 'pdf';

            const parameters = JSON.stringify({
                Ban: account,
                year: year,
                format: format,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        prepaidHistory : function(subscriber, idCustomerCard, index, year, month, status, type, successCB, errorCB){

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'refillHistory';

            const parameters = JSON.stringify({
                suscriber: subscriber,
                idCustomerCard: idCustomerCard,
                index: index,
                year: year,
                month: month,
                status: status,
                type: type,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        getDirectDebitInfo: function (account, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'getDirectDebitInfo2';

            const parameters = JSON.stringify({
                accountNumber: account,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        updateDirectDebit: function (data, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'updateDirectDebit';

            data.token = tokenSession;
            data.method = method;

            const parameters = JSON.stringify(data);

            app.utils.network.processRequestOld(parameters, successCB, errorCB); // TODO change to new process (processRequest)
        },

        makePayment: function (data, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'makePayment';

            data.token = tokenSession;
            data.method = method;

            const parameters = JSON.stringify(data);

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        makePaymentRecharge : function (data, subscriber, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'prepaidPayment';

            data.suscriber = subscriber;
            data.token = tokenSession;
            data.method = method;

            const parameters = JSON.stringify(data);

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        makePaymentRechargeAth : function (data, subscriber, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'prepaidPaymentATH';

            data.suscriber = subscriber;
            data.token = tokenSession;
            data.method = method;

            const parameters = JSON.stringify(data);

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        doRecharge: function (data, subscriber, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'minutesRecharge';


            data.suscriber = subscriber;
            data.token = tokenSession;
            data.method = method;

            const parameters = JSON.stringify(data);

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        listProductService: function (subscriber, idProduct, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'productserviceList';

            const parameters = JSON.stringify({
                suscriber: subscriber,
                idProductType: idProduct,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        listPrepaidAddress: function (subscriber, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'prepaidAddress';

            const parameters = JSON.stringify({
                suscriber: subscriber,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        },

        listPrepaidPaymentsType: function (subscriber, successCB, errorCB) {

            const tokenSession = app.utils.Storage.getSessionItem('token');
            const method = 'listTypesPayments';

            const parameters = JSON.stringify({
                suscriber: subscriber,
                method: method,
                token: tokenSession
            });

            app.utils.network.processRequest(parameters, successCB, errorCB);
        }

    });

});