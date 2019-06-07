$(function() {

	// Data storage utils
	// ---------------
	
	app.utils.Storage = {
		
		localStorageTime: 9999,	
		sessionStorageTime:  10,
		
		// Detect localStorage support 
        supportsLocalStorage: function() {
        	try {
        		return 'localStorage' in window && window['localStorage'] !== null;
        	} catch (e) {
        		return false;
        	}
		},
		
		// detect sessionStorage support 
        supportsSessionStorage: function() {
        	try {
        		return 'sessionStorage' in window && window['sessionStorage'] !== null;
        	} catch (e) {
        		return false;
        	}
		},		
		
		// local storage
		setLocalItem: function(key, value) {
			
			// serialize json
			if(this.isJSON(value)){
				value = JSON.stringify(value);
			}
			
			// check support
			if(this.supportsLocalStorage()) {
				window.localStorage.setItem(key,value);
			} else {
				this.setCookie(key, value, this.localStorageTime);
			}
			
		},
		
		getLocalItem: function(key) {
			
			var value = null;
			
			// check support
			if(this.supportsLocalStorage()) {
				value = window.localStorage.getItem(key);
			} else {
				value = this.getCookie(key);
			}
			
			// parse to json
			if(this.isJSON(value)){
				value = JSON.parse(value);
			}
			
			return value;
			
		},
		
		removeLocalItem: function(key) {
			
			// check support
			if(this.supportsLocalStorage()) {
				window.localStorage.removeItem(key);
			} else {
				this.removeCookie(key);
			}
			
		},
		
		// session storage
		setSessionItem: function(key, value) {
			
			var now = new Date();
			
			// serialize json
			if($.type(value)=='object' ||$.type(value)=='array'){
				value = JSON.stringify(value);
			}
			
			// check support
			if(this.supportsSessionStorage()) {
				window.sessionStorage.setItem(key,value);
			} else {
				this.setCookie(key, value, this.sessionStorageTime);
			}	
			
			//session update
			now.setTime(now.getTime() + (1000 * 60 * this.sessionStorageTime));
			window.sessionStorage.setItem('time',now.getTime());
			
		},
		
		getSessionItem: function(key){
			var value = null;
				time = window.sessionStorage.getItem('time'),
				now = new Date(),
				expire = new Date(); 
			
			// set expire time
			expire.setTime(time);

			if(window.sessionStorage.getItem('token') != null && now.getTime() > time){
				document.location.href='#login';
				//this.cleanCache();
			}
			
			// check support
			if(this.supportsSessionStorage()) {
				value = window.sessionStorage.getItem(key);
			} else {
				value = this.getCookie(key);
			}
			
			// parse to json
			if(this.isJSON(value)){
				value = JSON.parse(value);
			}
			
			//session update
			now.setTime(now.getTime() + (1000 * 60 * this.sessionStorageTime));
			window.sessionStorage.setItem('time',now.getTime());
			
			return value;
		},
		
		removeSessionItem: function(key) {
			
			var now = new Date();
			
			// check support
			if(this.supportsSessionStorage()) {
				window.sessionStorage.removeItem(key);
			} else {
				this.removeCookie(key);
			}
			
			//session update
			now.setTime(now.getTime() + (1000 * 60 * this.sessionStorageTime));
			window.sessionStorage.setItem('time',now.getTime());
			
		},
  
		isActiveSession: function() {
            var value = null;
            time = window.sessionStorage.getItem('time'),
            now = new Date(),
            expire = new Date();

            // set expire time
            expire.setTime(time);

            return !(window.sessionStorage.getItem('token') != null && now.getTime() > time);
  
        },
		
		// cookie storage
		setCookie: function(key, value, time) {
            var expires = new Date();
            expires.setTime(expires.getTime() + (1000 * 60 * time));
            document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
        },		
		
        getCookie: function(key){
			 var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
	         return keyValue ? keyValue[2] : null;
		},
		
		removeCookie: function(key){
			//this.setCookie(key,'',0);
			var expires = new Date();
			var value = '';
            expires.setTime(expires.getTime() + (0 * 24 * 60 * 60 * 1000));
            document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
		},
		
		// clear local storage
		clearLocalStorage: function(){

			// check support
			if(this.supportsLocalStorage()) {
				window.localStorage.clear();
			} else {
				this.clearCookieStorage();
			}
			
		},
		
		// clear session storage
		clearSessionStorage: function(){
			
			// check support
			if(this.supportsLocalStorage()) {
				window.sessionStorage.clear();
			} else {
				this.clearCookieStorage();
			}
			
		},
		
		// clear cookie storage
		clearCookieStorage: function(){
			var cookies = document.cookie;
			
			for (var i = 0; i < cookies.split(";").length; ++i){
			    var myCookie = cookies[i];
			    var pos = myCookie.indexOf("=");
			    var name = pos > -1 ? myCookie.substr(0, pos) : myCookie;
			    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
			}
		},
		
		isJSON: function(str) {
		    try {
		        JSON.parse(str);
		    } catch (e) {
		        return false;
		    }
		    return true;
		},

		cleanCache: function() {
		    console.log('CLEAN CACHE');

            //Save session values
            var self = this,
                username = window.sessionStorage.getItem('username'),
                token = window.sessionStorage.getItem('token'),
			    accounts = window.sessionStorage.getItem('accounts-list'),
				selectedAccountValue = window.sessionStorage.getItem('selected-account-value'),
				selectedAccount = window.sessionStorage.getItem('selected-account'),
				gift1GB = window.sessionStorage.getItem('gifts');

			//Clean session
			this.clearSessionStorage();

			//Restore session
			//Save username on session
            app.utils.Storage.setSessionItem('username', username);

            //Save token on session
            app.utils.Storage.setSessionItem('token', token);

            //Save accounts on session
            app.utils.Storage.setSessionItem('accounts-list', accounts);

            //Save default account value on session
            app.utils.Storage.setSessionItem('selected-account-value', selectedAccountValue);

            //Save default account on session
            app.utils.Storage.setSessionItem('selected-account', selectedAccount);

            //Gift 1GB
            app.utils.Storage.setSessionItem('gifts', gift1GB);
		}
		
	};
	
});
