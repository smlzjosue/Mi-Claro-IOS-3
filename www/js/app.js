var app = {

    // App Information
    id: '775322054',
    country: 'pr',
    os: 'IOS',
    device: 'iphone',
    version: null,
    build: null,
    uuid: 0,
    connectionType: '',
    registrationId: null,
    rate: null,
    enableAppRate: true,
    enableCheckAppVersion: true,
    pnToken: '',
    sessionPasswordTime: 10,

    // Gateway Application ID
	gatewayAppId: 'At01bMi0aXhr6ktmTaow',

	 // Debug mode
    debug: true,

    newUrl: 'http://mcloginws.claroinfo.com/api/',
    // Procesos url
    processURL: 'http://mcloginapp.claroinfo.com/proccess/procesos2.aspx',
    processOLD: 'http://miclarouatend.claropr.com/proccess/procesos.aspx',
    // Production URL
    url: 'https://miclaro.clarotodo.com/ClaroMobileServicesV2.0.0/',
    //url: 'https://miclaro.clarotodo.com/ClaroMobileServicesV1.5.0QA23/',
    alterUrl: 'https://miclaro.clarotodo.com/ClaroMobileServicesV2.0.0/',
    //alterUrl: 'https://miclaro.clarotodo.com/ClaroMobileServicesV1.5.0QA23/',

    // MiClaro API
    // Production-Active
    // apiUrl: 'https://wsclarorprodnew.claropr.com/api-miclaro-services-prod-new/miclaro/',
    //apiUrl: 'https://miclaroapi.claropr.com/v2.1/miclaro/', // production-OLD
    apiUrl: 'http://184.106.10.165:9080/api-miclaro-services/miclaro/',  // develop
    apiKey: '6af3982a-ce65-41a0-93d9-52bd172685cd',

    //MiClaro services
    // Prod-Active
    // v3URL: 'https://miclarowsuidsprod.claropr.com/Service/v3/',
    v3URL: 'http://50.56.55.63/Service/v3/', // DEV

    // Payment Prod
    pcrfUrl: 'https://paymentswstransact.clarotodo.com/payment/creditcard/process',

    // Help URL
    helpURL: 'http://soporteapps.speedymovil.com:8090/appFeedback/service/feedback/application',

    // Chat URL
    chatURL: 'https://chat.clarotodo.com/newversion/chat_movil.html',

    // Register App URL
    // registerAppUrl: 'https://registro.claropr.com/',
    registerAppUrl: 'http://184.106.10.165:9090/claro-registro/', // QA

    // Prepaid URL
    // prepaidURL: 'https://miclaroprepago.claropr.com/',
    prepaidURL: 'http://184.106.10.165:8880/', //QA

    // 1Gb Gift
    giftSendUrl: 'https://miclaro.clarotodo.com/Regala1GBv2/landing.html?',
    giftAcceptUrl: 'https://miclaro.clarotodo.com/Regala1GBv2/activacion.html?',

    // R1R
    // PROD Active
    // giftSendR1R: 'https://miclaro.clarotodo.com/r1r/enviar-1-recarga',
    giftSendR1R: 'http://184.106.10.165:9090/r1r/enviar-1-recarga', //QA
    
    // Captive Portal
    captivePortalURL: 'http://datapaqqa-ws.clarotodo.com/',

    // App group
    // appGroup: 'group.com.claro.pr.MiClaro', // Prod
    appGroup: 'group.com.todoclaro.miclaroapp.test', // Test
    

    // Touch ID
    isTouchIdAvailable: false,

    // Application Data
    cache: {},
    session: {},

    // Application Containers
    collections: {},
    models: {},
    daos: {},
    views: {},
    utils: {},
    router: null,

    // Update email
    updateEmailTime: 1,

    //Google Analitycs
    gaPlugin: null,
    gaAccountID: 'UA-44057429-1',

    // Database
    db : null,

    // Application boolena
    isApplication: true,

    // Application Constructor
    initialize: function() {

        //Debug mode
        if(!app.debug){
            console.log = console.info = console.error = console.warn = function(){};
        }

        // Bind events
        app.bindEvents();

        // Global utils
        app.utils.network = app.utils.Network;
        app.utils.browser = app.utils.Browser;
        app.utils.tools = app.utils.Tools;
        app.utils.loader = app.utils.Loader;

        // create $.mobile variable for web version
        if($.mobile===undefined){
        	$.mobile = {};
        	$.mobile.activePage = null;
        	$.mobile.changePage = function(){};
        }

        // Preload views
        app.TemplateManager.preload(function(){
            console.log('#preload complete');
        });

        // Bootstrap the application
        app.router = new app.AppRouter();
        Backbone.history.start();

    	// save init session time
    	this.utils.Storage.setSessionItem('init-session',new Date());

        // init loader
        app.utils.Loader.initialize();

    },

    // Bind Event Listeners
    //
    bindEvents: function() {

        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('resume', this.onResume, false);

    },

    // deviceready Event Handler
    onDeviceReady: function() {

        app.connectionType = navigator.connection.type;

        if(app.uuid == null){
            app.uuid = device.uuid;
        }

    	app.initializeGoogleAnalytics();

        //Device informations
        window.build('', function(build){
             app.build = build;
             app.initializeGoogleAnalytics();
        });

        window.version('', function(version){
            app.version = version;
            app.initializeGoogleAnalytics();
            // check if app version is enabled
            if(app.enableCheckAppVersion){
               app.checkAppVersion(app.version);
            }
        });

        window.plugins.touchid.isAvailable(
			// success handler: TouchID available
        	function(msg) {
            	app.isTouchIdAvailable = true;
            },
            // error handler: no TouchID available
        	function(msg) {
            	app.isTouchIdAvailable = false;
            }
        );

        // Enhance click event
        FastClick.attach(document.body);

        // Initialize Apple Push Notification
        app.initializeAPN();

        // show app rate message
        if(app.enableAppRate && !app.utils.Storage.getLocalItem('outdated-app')){
            app.showAppRate();
        }
        
		var prefs = plugins.appPreferences.iosSuite(app.appGroup);

        // set url
        prefs.store(
            // success callback
            function(e) {},
            // error callback
            function(e) {},
            app.appGroup,
            'api-url',
            app.apiUrl + 'widgets/getInvoiceInfo'
        );

    },

    removeSession: function() {
        app.utils.Storage.removeLocalItem('username');
        app.utils.Storage.removeLocalItem('password');

        app.utils.Storage.removeLocalItem('isLogged');
        app.utils.Storage.removeLocalItem('logged-guest');
        app.utils.Storage.removeLocalItem('logged-subscriber');
    },

    // Resume Event Handler for retrieved from the background.
    onResume: function(e) {
        var time = window.sessionStorage.getItem('time'),
        now = new Date(),
        expire = new Date();

        // set expire time
        expire.setTime(time);

        if(now.getTime() > time){
            document.location.href='#login';
        }

        // reset touch id
        app.utils.Storage.setSessionItem('touch-id-enabled', true);

        // trigger an active event if touch id it enable
        if(app.utils.Storage.getLocalItem('password') !== null) {
        	$.mobile.activePage.trigger('active');
        }

    },

    initializeGoogleAnalytics: function(){

        var states = {};

        states[Connection.UNKNOWN]  = 'Unknow connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = '2G connection';
        states[Connection.CELL_3G]  = '3G connection';
        states[Connection.CELL_4G]  = '4G connection';
        states[Connection.NONE]     = 'None';

        if(app.version!=null && app.build!=null){

            analytics.startTrackerWithId(
                 app.gaAccountID,
                 function(success){
                    console.log('success google analitycs')
                 },
                 function(error){
                    console.log('error google analitycs')
                 }
             );

            // send google statistics
            analytics.trackEvent('init', 'connection', 'change device', states[navigator.connection.type]);

        }

    },

    initializeSideMenu: function(e){

    	console.log('init menu...');

    	var sideMenu = new app.views.SideMenuView();

		// Render HTML content
		sideMenu.render(function(e){
			// Trigger pageload event
			$(sideMenu.el).trigger('pagecreate');
		});

		// Append html
		$('#sidemenu').append($(sideMenu.el));
    },

 	// APN Initializer
    //
    initializeAPN: function(){

    	console.log('#APN initialize...');

        app.pushNotification = window.PushNotification.init({
            ios: {
				alert: 'true',
				badge: 'true',
				sound: 'true'
			}
        });

        app.pushNotification.on('registration', function(data) {
            app.registrationId = data.registrationId;
            console.log('APNS token '+app.registrationId);

        });

        app.pushNotification.on('notification', function(data) {
            navigator.notification.alert(
                    data.message,							// message
                    function(){},        					// callback
                    'Mi Claro PR',         				 	// title
                    'Ok'                  					// buttonName
                );

        });

        app.pushNotification.on('error', function(e) {
            console.log('#error MSG:'+e.message);
        });


    },
    // Apple Push Notification Event handler
    //
    onNotificationAPN: function(e) {

        if (e.alert) {
            navigator.notification.alert(
                    e.alert,							// message
                    function(){},        				// callback
                    'Message',         				 	// title
                    'Done'                  			// buttonName
                );
        }

        if (e.sound) {
            var snd = new Media(e.sound);
            snd.play();
        }

        if (e.badge) {
            pushNotification.setApplicationIconBadgeNumber(
                // success handler
                function(){
                },
                // error handler
                function(){
                },
                e.badge
            );
        }

    },

    checkAppVersion: function(version) {

        var method = 'app/getVersion',
            parameters,
            outdatedApp = app.utils.Storage.getLocalItem('outdated-app');

            // if device hasn't connection
            if(navigator.connection.type==Connection.NONE || navigator.connection.type==Connection.UNKNOWN){

                if(outdatedApp!=null && outdatedApp){

                    app.router.navigate('update_app',{trigger: true});

                }else{

                    app.router.navigate('login',{trigger: true});
                }

            }else{

                parameters = '{' +
                    '"appId":"' + app.id + '",' +
                    '"version":"' + version + '",' +
                    '"osType":"' + app.os + '"' +
                    '}';

                app.utils.network.checkRequest(method, parameters,

                    //success function
                    function(response){

                        console.log(response);

                        //hide splash screen
                        navigator.splashscreen.hide();

                        if(!response.hasError){
                            if(response.object.enabled=='Y'){
                                app.utils.Storage.setLocalItem('outdated-app', false);
                                app.router.navigate('login',{trigger: true});
                            }else{
                                app.utils.Storage.setLocalItem('outdated-app', true);
                                app.router.navigate('update_app',{trigger: true});

                            }
                        }else{
                            app.utils.Storage.setLocalItem('outdated-app', true);
                            app.router.navigate('update_app',{trigger: true});
                        }
                    },

                    // error function
                    function(error){

                        //hide splash screen
                        navigator.splashscreen.hide();

                        if(outdatedApp!=null && outdatedApp){

                            app.router.navigate('update_app',{trigger: true});

                        }else{

                            app.router.navigate('login',{trigger: true});
                        }

                    }
                );

            }

    },

    showAppRate: function() {

        app.rate = AppRate;

        // set properties
        app.rate.preferences.storeAppURL.ios = app.id;
        app.rate.preferences.useLanguage = 'es';
        app.rate.preferences.displayAppName = 'Mi Claro';

        // open app rate prompt
        if (app.utils.Storage.getLocalItem('app-rated') == null || !app.utils.Storage.getLocalItem('app-rated')) {
        	app.rate.promptForRating(false);
        }
    },

    handleOpenURL: function(url) {

        app.utils.Storage.setSessionItem('navegation-path', url);
        $.mobile.activePage.trigger('active');

    }

};

//Extend underscore's template() to allow inclusions
function cTemplate(str) {

	// match "<% include template-id %>"
	var tempStr = str.replace(
        /<%\s*include\s*(.*?)\s*%>/g,
        function(match, templateId) {
        	var el = app.TemplateManager.templates[templateId];
        	if(el){
        		return el.html();
        	}else{
        		return '';
        	}
        });

    return _.template(tempStr);
}
