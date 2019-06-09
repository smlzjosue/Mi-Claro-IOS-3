$(function() {

	// Util For Tools
	// ---------------

	app.utils.Tools = {

		typeOfTelephony: function(productType){
            //O = wireline - fijo, I = IPTV - fijo, V = VOIP - fijo, N = ISP -fijo, J = DTH - fijo, S = DISH nuevo - fijo
            //C = cellular - móvil, G = GSM - móvil

            var telephony;
            if(productType=="O" || productType=="I" || productType=="V" || productType=="N" || productType=="J" || productType=="S"){
                telephony = "Fijo";
            }
            else if(productType=="C" || productType=="G"){
                telephony = "Móvil";
            }
            return telephony;
        },

        convertCase: function (str) {
            var lower = String(str).toLowerCase();
            return lower.replace(/(^| )(\w)/g, function(x) {
                return x.toUpperCase();
            });
        },

        dateForTimePassword: function () {
		    var now = new Date();
            now.setTime(now.getTime() + (1000 * 60 * app.sessionPasswordTime));
            return now;
        },

        validateEmail: function(email) {
            var expr = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return expr.test(String(email).toLowerCase());
        },

        transformAvailable: function (remaining) { // receive in kilobytes

            var remainingMB = (remaining / 1024) / 1024;
            var remainingGB = ((remaining / 1024) / 1024) / 1024;

		    var text = remainingMB.toFixed(2) + ' MB';
            if (remainingMB > 2048) {
                text = remainingGB.toFixed(2) + ' GB';
            }
            return text;
        },

        formatSubscriber: function (number) { // for subscriber
            number = number+""; // transform to string
            var newNumber = "(" + splice(number, 3, 0, ") ");
            newNumber = splice(newNumber, 9, 0, "-");
            return newNumber;
        },

        formatAmount: function(num) {
		    if (num == undefined || num == null || num == '' || num == 'not_set') {
		        num = '0.00';
            }
            num = parseFloat(String(num).replace('$', '')).toFixed(2);
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        },

        isSessionActive: function () {
            var time = window.sessionStorage.getItem('time'),
                now = new Date(),
                expire = new Date();

            var currentPage = app.router.history[app.router.history.length-1];
            if (currentPage == 'login' || currentPage == 'login_guest') {
                return true;
            }
            // set expire time
            expire.setTime(time);

            return !(now.getTime() > time);
        },

        accountIsPostpaid: function (accountType, accountSubType, productType) {
            return (accountType == 'I2' && accountSubType == '4') ||
                (accountType == 'I' && accountSubType == 'R') ||
                (accountType == 'I' && accountSubType == '4') ||
                (accountType == 'I' && accountSubType == 'E') ||
                (accountType == 'I' && accountSubType == 'S' && productType == 'G');

        },

        accountIsPrepaid: function (accountType, accountSubType, productType) {
            return (accountType == 'I' && accountSubType == 'P') ||
                (accountType == 'I3' && accountSubType == 'P');
        },

        accountIsTelephony: function (accountType, accountSubType, productType) {
            return (accountType == 'I' && accountSubType == 'W') ||
                (accountType == 'I' && accountSubType == 'S' && productType == 'O') ||
                (accountType == 'I' && accountSubType == 'S' && productType == 'V') ||
                (accountType == 'F' && accountSubType == '4');
        },
	};

    function splice(text, start, delCount, newSubStr) {
        return text.slice(0, start) + newSubStr + text.slice(start + Math.abs(delCount));
    }
});
