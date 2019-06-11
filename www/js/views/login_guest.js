$(function() {

	// Login View
	// ---------------

	app.views.LoginGuestView = app.views.CommonView.extend({

		name:'login_guest',

		// The DOM events specific.
		events: {

            // event
			'pagecreate':                           	'pageCreate',

			// content
			'click #btn-login': 						'login',
			'click #btn-forgot': 						'forgot',
			'click #btn-register': 						'register',
            'click #btn-normal':                        'activeLoginNormal',
            'input #number':                            'numberChanged',

			// footer
			'click #btn-help':							'helpSection'

		},

		// Render the template elements
		render:function (callback) {
            var self = this;
            var user = (app.utils.Storage.getLocalItem('user') != null) ? app.utils.Storage.getLocalItem('user') : '',
                passw = (app.utils.Storage.getLocalItem('password') != null) ? app.utils.Storage.getLocalItem('password') : '',
                variables = {
                    login: (user != null)? user: '',
                    password: passw,
                    remember: (app.utils.Storage.getLocalItem('remember') !== null),
                };

            var navegationPath = app.utils.Storage.getSessionItem('navegation-path');

            //clear session
            app.utils.Storage.clearSessionStorage();

            // set navegation path
            app.utils.Storage.setSessionItem('navegation-path', navegationPath);

            //Delete Register Data
            app.utils.Storage.removeSessionItem('register-data');
            app.utils.Storage.removeSessionItem('register-alert');

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
            const isConnectionActive = !app.utils.Storage.getLocalItem('connection-inactive');
            if (isConnectionActive) {
                const isLogged = app.utils.Storage.getLocalItem('isLogged');
                if (isLogged) {
                    const subscriber = app.utils.Storage.getLocalItem('logged-subscriber-used');
                    if (subscriber != null) {
                        self.signOnGuest(subscriber);
                    } else {
                        const isGuest = app.utils.Storage.getLocalItem('logged-guest');
                        if (!isGuest) {
                            app.router.navigate('login', {
                                trigger: true
                            });
                        }
                    }
                } else {
                    var loginGuest = true;
                    var loginModeGuest = app.utils.Storage.getLocalItem('loginModeGuest');
                    if (loginModeGuest != null) {
                        loginGuest = loginModeGuest;
                    }
                    if (!loginGuest) {
                        app.router.navigate('login', {
                            trigger: true
                        });
                    }
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

            $('#number').on('click focus', function (e) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $("#number").offset().top-20
                }, 1000);
            });
		},

        activeLoginNormal: function(){
            app.utils.Storage.setLocalItem('loginModeGuest', false);
            app.router.navigate('login', {
                trigger: true
            });
        },

        numberChanged: function() {
            var number = $.mobile.activePage.find('#number').val();

            if (number.length > 10) {
                number = number.slice(0,10);
                $.mobile.activePage.find('#number').val(number);
            }
        },

		login: function(){
            var self = this;

            const number = $.mobile.activePage.find('#number').val();
            // validate
            if (number == null || !number.length > 0) {
                message = 'Debe ingresar un número de suscriptor válido.';
                showAlert('Error', message, 'Aceptar');
                return;
            } else if (number.length < 10) {
                message = 'Debe ingresar un número de suscriptor válido.';
                showAlert('Error', message, 'Aceptar');
                return;
            }
            $('#number').blur();

            self.options.loginModel.loginGuest(number,
                function (response) {
                    if(response.hasError) {
                        self.validateUser(number);
                    } else {
                        self.onSignonSuccess(response, number);
                    }
                },
                app.utils.network.errorRequest
            );
		},

        validateUser: function(number) {
            var self = this;
            self.options.loginModel.validateUser(number,
                function (response) {
                    if(response.hasError){
                        app.removeSession();
                        app.utils.network.errorRequest(response, 200, response.errorDisplay);
                    } else {
                        if (!response.AccountExist) {
                            message = 'El número de teléfono ingresado no se encuentra registrado en nuestros sistemas, ' +
                                'su formato es incorrecto o no pertenece a nuestra red. Por favor intente nuevamente.';
                            showAlert('Error', message, 'Aceptar');
                        } else {
                            if (response.userExist) {
                                if (response.isGuest) {
                                    self.signOnGuest(number);
                                } else {
                                    self.updateGuestUser(number);
                                }
                            } else {
                                self.registerGuestUser(number);
                            }
                        }
                    }
                },
                app.utils.network.errorRequest
            );
        },

        signOnGuest: function(number) {
            var self = this;
            self.options.loginModel.loginGuest(number,
                function (response) {
                    if(response.hasError) {
                        app.removeSession();
                        if (response.errorDesc == 'device token incorrecto') {
                            self.updateGuestUser(number);
                        } else {
                            app.utils.network.errorRequest(response, 200, response.errorDisplay);
                        }
                    } else {
                        self.onSignonSuccess(response, number);
                    }
                },
                app.utils.network.errorRequest
            );
        },

        onSignonSuccess: function(response, number) {
            var self = this;

            app.utils.Storage.setSessionItem('token', response.token);
            app.utils.Storage.setLocalItem('isLogged', true);
            app.utils.Storage.setLocalItem('logged-is-active', true);
            app.utils.Storage.setLocalItem('logged-subscriber', response.subscriber);
		    app.utils.Storage.setLocalItem('logged-guest', true);
            app.utils.Storage.setLocalItem('username', response.username);

            app.utils.Storage.setLocalItem('logged-subscriber-used', number);

            const loginAccounts = [];
            const postpagoLoginAccounts = [];
            const prepagoLoginAccounts = [];
            const fijoLoginAccounts = [];

            loginAccounts[0] = {
                Account: response.account,
                DefaultSubscriber: response.subscriber,
                mAccountType: response.accountType,
                mAccountSubType: response.accountSubType,
                mProductType: response.productType,
                registerDate: response.registerDate,
                userName: response.userName,
                prodCategory: (response.productType=='G'
                    || response.productType=='C')? 'WLS' : 'WRL',
                postpago: app.utils.tools.accountIsPostpaid(response.accountType, response.accountSubType, response.productType),
                prepago: app.utils.tools.accountIsPrepaid(response.accountType, response.accountSubType, response.productType),
                telefonia: app.utils.tools.accountIsTelephony(response.accountType, response.accountSubType, response.productType)
            };

            app.utils.Storage.setSessionItem('confirmed-password-time',
                app.utils.tools.dateForTimePassword().getDate());

            var defaultAccount = loginAccounts[0];
            for (var i = 0; i < loginAccounts.length; i++) {
                if (loginAccounts[i].Account == response.account) { // default login account
                    defaultAccount = loginAccounts[i];
                    loginAccounts[i].isDefault = true;
                    i = loginAccounts.length; // para salir del for
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

            app.utils.Storage.setSessionItem('required-updates', {
                requiredAccountUpdate: response.requiredAccountUpdate,
                requiredEmailUpdate: response.requiredEmailUpdate,
                requiredQuestions: response.requiredQuestions,
                requiredPaperless: response.requiredPaperless
            });

            self.getAccountDetails(defaultAccount,
                function (response) {
                    app.utils.Storage.setLocalItem('skip_signin', false);
                    app.router.navigate('menu',{trigger: true});
                },
                app.utils.network.errorRequest
            );
        },

        registerGuestUser: function(number) {
            var self = this;
            self.options.loginModel.registerGuest(number,
                function (response) {
                    if(response.hasError){
                        app.utils.network.errorRequest(response, 200, response.errorDisplay);
                    } else {
                        app.utils.Storage.setLocalItem('register-number', number);
                        app.utils.Storage.setLocalItem('register-token', response.token);
                        app.utils.Storage.setLocalItem('register-guest-update', false);
                        // navigate to validate account
                        app.router.navigate('signin_guest', {
                            trigger: true
                        });
                    }
                },
                app.utils.network.errorRequest
            );
        },

        updateGuestUser: function(number) {
            var self = this;
            self.options.loginModel.resendGuestCode(number,
                function (response) {
                    if(response.hasError){
                        app.utils.network.errorRequest(response, 200, response.errorDisplay);
                    } else {
                        app.utils.Storage.setLocalItem('register-number', number);
                        app.utils.Storage.setLocalItem('register-token', response.token);
                        app.utils.Storage.setLocalItem('register-guest-update', true);
                        // navigate to validate account
                        app.router.navigate('signin_guest', {
                            trigger: true
                        });
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
		},

	});

});
