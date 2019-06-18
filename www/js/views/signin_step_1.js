$(function() {

    // Register step 1 View
    // ---------------

    app.views.SigninStep1View = app.views.CommonView.extend({

        name: 'signin_step_1',

        // The DOM events specific.
        events: {
            // event
            'pagecreate':                           	'pageCreate',

            // content
            'click #btn-validate':                      'validateNumber',
            'click #btn-login':                         'login',
            'input #register_number':                   'numberChanged',
            'click #register_number':                   'onClickNumber',

            // footer
            'click #btn-help':		                    'helpSection',
        },

        // Render the template elements
        render: function(callback) {
            var self = this,
                variables = {
                    showBackBth: true
                };
            app.TemplateManager.get(self.name, function(code) {
                var template = cTemplate(code.html());
                $(self.el).html(template(variables));
                callback();
                return this;
            });
        },

        pageCreate: function(){
            var self = this;
            // removing any enter event
            $('body').unbind('keypress');

            /**
             * set enter event
             */
            $('body').on('keypress', function(e){
                if (e.which === 13 || e.keyCode === 13) {
                    self.validateNumber();
                }
            });

            $('#register_number').on('click focus', function (e) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $("#register_number").offset().top-20
                }, 1000);
            });
        },

        numberChanged: function() {
            var number = $.mobile.activePage.find('#register_number').val();

            if (number.length > 10) {
                number = number.slice(0,10);
                $.mobile.activePage.find('#register_number').val(number);
            }
        },

        onClickNumber: function(e) {
            console.log('click number');
        },

        login: function(e) {
            
            //Go to next
            app.router.navigate('login', {
                trigger: true
            });

        },

        validateNumber: function(e) {
            self = this;

            var number = $.mobile.activePage.find('#register_number').val();

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

            /**
             * Register User
             */
            $('#register_number').blur();
            self.options.loginModel.validateSubscriber(number,
                function (response) {
                    if(response.hasError){
                        if (response.errorDisplay.includes('cuenta ya existente')) {
                            showConfirm('Aviso', 'Hemos detectado que está intentando registrar una cuenta ya existente en nuestro sistema. Por favor presione la opción Olvido Contraseña para recuperar su acceso al sistema.', ['Olvido Contraseña', 'Cerrar'],
                                function (result) {
                                console.log(result);
                                    if(result == 1) {
                                        app.router.navigate('password_step_1', {
                                            trigger: true
                                        });
                                    }
                                }
                            );
                        } else {
                            showAlert('Error', response.errorDisplay, 'Aceptar');
                        }
                    } else {
                        app.utils.Storage.setSessionItem('register-number-is-prepago', false);
                        app.utils.Storage.setSessionItem('register-number-is-postpago', false);
                        if ((response.accountType === 'I' && response.accountSubType === 'P') ||
                            (response.accountType === 'I3' && response.accountSubType === 'P') ){
                            app.utils.Storage.setSessionItem('register-number-is-prepago', true);
                        } else if ((response.accountType === 'I2' && response.accountSubType === '4') ||
                                    (response.accountType === 'I' && response.accountSubType === 'R') ||
                                    (response.accountType === 'I' && response.accountSubType === '4') ||
                                    (response.accountType === 'I' && response.accountSubType === 'E') ) {
                            app.utils.Storage.setSessionItem('register-number-is-postpago', true);
                        }
                        app.utils.Storage.setLocalItem('register-number', number);
                        app.router.navigate('signin_step_2', {
                            trigger: true
                        });
                    }
                },
                app.utils.network.errorRequest
            );
        }

    });

});
