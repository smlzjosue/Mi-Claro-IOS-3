$(function() {

	// Login View
	// ---------------

	app.views.LoginView = app.views.CommonView.extend({

		name:'login',

        question: 'error',
        subscriber: null,
        account: null,
		// The DOM events specific.
		events: {

            // event
			'pagecreate':                           	'pageCreate',

			// content
			'click #btn-login': 						'login',
			'click #btn-forgot': 						'forgot',
			'click #btn-register': 						'register',
            'click #btn-guest':                         'activeLoginGuest',
            'input #login':                             'userTextSizeChanged',
            'click #open-chat':                         'openChat',
            'click #cancel-chat':                       'cancelChat',

			// footer
			'click #btn-help':							'helpSection'

		},

		// Render the template elements
		render:function (callback) {
            var self = this;
            var variables = {};

            app.TemplateManager.get(self.name, function(code){
                var template = cTemplate(code.html());
                $(self.el).html(template(variables));

                callback();
                return this;
            });
            $(document).scrollTop();
		},

		pageCreate: function(){
            var self = this;
		    // removing any enter event
            $('body').unbind('keypress');
            /**
             * if is logged
             */
            const isLogged = app.utils.Storage.getLocalItem('isLogged');
            console.log("isLogged: "+isLogged);
            if (isLogged) {
                const skipLogin = app.utils.Storage.getLocalItem('skip_signin');
                console.log("skip_signin: "+skipLogin);
                if (!skipLogin) {
                    const isGuest = app.utils.Storage.getLocalItem('logged-guest');
                    if (isGuest) {
                        app.router.navigate('login_guest', {
                            trigger: true
                        });
                    } else {
                        var username = app.utils.Storage.getLocalItem('username-used');
                        $('#login').val(username);
                    }
                } else {
                    const number = app.utils.Storage.getLocalItem('logged-subscriber');
                    $('#login').val(number);
                    $('#password').focus();

                    $([document.documentElement, document.body]).animate({
                        scrollTop: $("#password").offset().top - 20
                    }, 1000);
                }
            } else {
                var loginGuest = true;
                var loginModeGuest = app.utils.Storage.getLocalItem('loginModeGuest');
                if (loginModeGuest != null) {
                    loginGuest = loginModeGuest;
                }
                if (loginGuest) {
                    app.router.navigate('login_guest', {
                        trigger: true
                    });
                }
            }

            /**
             * set enter event
             */
			$('body').on('keypress', function(e){
				if (e.which === 13 || e.keyCode === 13) {
			    	self.login();
			    }
			});

            $('#login').on('click focus', function () {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $('#login').offset().top-20
                }, 1000);
            });

            $('#password').on('click focus', function () {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $('#login').offset().top-20
                }, 1000);
            });
		},

        userTextSizeChanged: function() {
            var user = $.mobile.activePage.find('#login').val();

            if (user.length > 40) {
                user = user.slice(0,40);
                $.mobile.activePage.find('#login').val(user);
            }
        },

        help: function(){
            app.router.navigate('help', {
                trigger: true
            });
        },

        activeLoginGuest: function(){
            app.utils.Storage.setLocalItem('loginModeGuest', true);
            app.router.navigate('login_guest', {
                trigger: true
            });
        },

		login: function(){
            var self = this;
            var username = $.mobile.activePage.find('#login').val();
            username = username.trim();
            var password = $.mobile.activePage.find('#password').val();
            password = password.trim();

            /**
             * validate
             */
            if(!username.length > 0){
                showAlert('Error', 'Debe ingresar su usuario y contraseña.', 'Aceptar');
                return;
            } else if(!password.length > 0){
                showAlert('Error', 'Debe ingresar su usuario y contraseña.', 'Aceptar');
                return;
            }
            /**
             * password encrypt
             */
            // const cipherPassword = window.aes(password, function(cipherText){
            //     return cipherText;
            // });

            /**
             * call login service
             */
            $('#login').blur();
            $('#password').blur();
            self.signOn(username, password);
		},

        cancelChat: function(e) {
            $('.popup-chat').hide();
        },

        openChat: function() {
		    const self = this;
            var url = app.chatURL;
            $('.popup-chat').hide();

            url += '?BAN='+self.account;
            url += '&subcriptor='+self.subscriber;
            url += '&Department=2';
            url += '&firstname=Error';
            url += '&lastname=Acceso';
            url += '&Question='+self.question;

            console.log(url);
            var browser = app.utils.browser.show(url, true);

            app.utils.loader.show();

            // success event load url
            browser.addEventListener('loadstop', function(e) {

                // hiden loader
                app.utils.loader.hide();

                // show navegator
                browser.show();
            });

            // error event load url
            browser.addEventListener('loaderror', function(e) {

                // hiden loader
                app.utils.loader.hide();

                // close browser
                browser.close();

                showAlert('Error' , 'No se puede cargar la pagina, compruebe su conexion a Internet.', 'OK');
            });
        },

        signOn: function(username, password) {
            const self = this;
            self.options.loginModel.login(
                username,
                password,
                function (response) {
                    if(response.hasError) {
                        if (response.errorNum > 0) {
                            $('#chatText').html('<b>Incidencia:</b> '+response.errorDisplay);
                            $('.popup-chat').show();
                            self.question = 'Error%20de%20acceso';
                            if (response.errorNum == 30) {
                                self.question = 'Error%20de%20contraseña';
                            } else if (response.errorNum == 32) {
                                self.question = 'Usuario%20Bloqueado';
                            }
                            self.account = response.account;
                            self.subscriber = response.subscriber;
                        } else {
                            app.utils.network.errorRequest(response, 200, response.errorDisplay);
                        }
                    } else {
                        self.checkRequiredUpdatePassword(response, username, password);
                    }
                },
                app.utils.network.errorRequest
            );
        },

        checkRequiredUpdatePassword: function(response, username, password) {
            if (response.requiredPasswordReset) {
                app.utils.Storage.setSessionItem('token', response.token);
                app.router.navigate('change_password', {
                    trigger: true
                });
            } else {
                this.onSignonSuccess(response, username, password);
            }
        },

        onSignonSuccess: function(response, username, password) {
            var self = this;

            app.utils.Storage.setSessionItem('token', response.token);
            app.utils.Storage.setLocalItem('isLogged', true);
            app.utils.Storage.setLocalItem('logged-is-active', true);
            app.utils.Storage.setLocalItem('logged-subscriber', response.subscriber);
		    app.utils.Storage.setLocalItem('logged-guest', response.guest);
            app.utils.Storage.setLocalItem('username', response.username);

            app.utils.Storage.setLocalItem('username-used', username);
		    app.utils.Storage.setLocalItem('password', password);

            const loginAccounts = [];
            const postpagoLoginAccounts = [];
            const prepagoLoginAccounts = [];
            const fijoLoginAccounts = [];

            if (response.accounts
                && response.accounts.AccountList
                && response.accounts.AccountList.length > 0) {
                $.each(response.accounts.AccountList, function (i, object) {

                    loginAccounts[i] = {
                        Account: object.account,
                        DefaultSubscriber: object.subsriberByDefault,
                        mAccountType: object.accountType,
                        mAccountSubType: object.accountSubType,
                        mProductType: object.productType,
                        registerDate: object.registerDate,
                        userName: object.userName,
                        isDefault: false,
                        prodCategory: (object.productType=='G'
                            || object.productType=='C')? 'WLS' : 'WRL',
                        active: object.active,
                        postpago: app.utils.tools.accountIsPostpaid(object.accountType, object.accountSubType, object.productType),
                        prepago: app.utils.tools.accountIsPrepaid(object.accountType, object.accountSubType, object.productType),
                        telefonia:  app.utils.tools.accountIsTelephony(object.accountType, object.accountSubType, object.productType)
                    };
                });
            } else {

                loginAccounts[0] = {
                    Account: response.account,
                    DefaultSubscriber: response.subscriber,
                    mAccountType: response.accountType,
                    mAccountSubType: response.accountSubType,
                    mProductType: response.productType,
                    registerDate: response.registerDate,
                    userName: response.userName,
                    isDefault: false,
                    prodCategory: (response.productType=='G'
                        || response.productType=='C')? 'WLS' : 'WRL',
                    postpago: app.utils.tools.accountIsPostpaid(response.accountType, response.accountSubType, response.productType),
                    prepago: app.utils.tools.accountIsPrepaid(response.accountType, response.accountSubType, response.productType),
                    telefonia: app.utils.tools.accountIsTelephony(response.accountType, response.accountSubType, response.productType)
                };
            }
            app.utils.Storage.setSessionItem('confirmed-password-time',
                app.utils.tools.dateForTimePassword().getDate());

            var defaultAccount = loginAccounts[0];
            for (var i = 0; i < loginAccounts.length; i++) {
                if (loginAccounts[i].Account == response.account) { // default login account
                    defaultAccount = loginAccounts[i];
                    loginAccounts[i].isDefault = true;
                    i = loginAccounts.length; // para salir
                }
            }

            $.each(loginAccounts, function (i, account) {
                if (account.postpago) {
                    postpagoLoginAccounts[postpagoLoginAccounts.length] = account;
                } else if (account.prepago) {
                    prepagoLoginAccounts[prepagoLoginAccounts.length] = account;
                } else if (account.telefonia) {
                    fijoLoginAccounts[fijoLoginAccounts.length] = account;
                }
            });

            // accounts
            app.utils.Storage.setSessionItem('accounts-list', loginAccounts);
            app.utils.Storage.setSessionItem('accounts-list-postpago', postpagoLoginAccounts);
            app.utils.Storage.setSessionItem('accounts-list-prepago', prepagoLoginAccounts);
            app.utils.Storage.setSessionItem('accounts-list-telefonia', fijoLoginAccounts);

            app.utils.Storage.setSessionItem('default-account', defaultAccount);

            app.utils.Storage.setSessionItem('required-updates', {
                requiredAccountUpdate: /*response.requiredAccountUpdate*/false,
                requiredEmailUpdate: response.requiredEmailUpdate,
                requiredQuestions: response.requiredQuestions,
                requiredPaperless: response.requiredPaperless
            });

            self.getAccountDetails(defaultAccount,
                function () {
                    app.utils.Storage.setLocalItem('skip_signin', false);
                    if (response.requiredAccountUpdate) {
                        app.router.navigate('profile_update_username', {trigger: true});
                    } else if (response.requiredEmailUpdate) {
                        self.navigateChangeEmail();
                    } else if (response.requiredPaperless) {
                        self.navigateElectronicBill();
                    } else if (response.requiredQuestions) {
                        showConfirm('', 'Por tu seguridad, debes configurar tus Preguntas de Seguridad.',
                            ['Configurar ahora', 'Configurar luego'],
                            function (index) {
                                if (index == 1) {
                                    app.router.navigate('profile_update_questions', {trigger: true});
                                } else {
                                    app.router.navigate('menu',{trigger: true});
                                }
                            });
                    } else {
                        app.router.navigate('menu',{trigger: true});
                    }
                },
                app.utils.network.errorRequest
            );
        },

		forgot: function(){
            app.router.navigate('password_step_1', {
                trigger: true
            });
		},

        register: function(){
            app.router.navigate('signin_step_1', {
                trigger: true
            });
		}
	});

});
