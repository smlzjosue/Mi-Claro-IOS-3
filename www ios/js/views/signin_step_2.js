$(function() {

    // Register step 1 View
    // ---------------

    app.views.SigninStep2View = app.views.CommonView.extend({

        name: 'signin_step_2',

        // The DOM events specific.
        events: {
            // event
            'pagecreate':                           	    'pageCreate',

            // content
            'click #btn-validate':                          'validateData',
            'click #btn-login':                             'login',
            'click #btn-resend':                            'send',
            'change #checkbox-terms':                       'availableNext',
            'click #close-terms':                           'closeTerms',
            'click #link-terms':                            'showTerms',
            'click #container_text-terms':                  'invertCheckbox',
            'input #ssn':                                   'ssnChanged',
            'input #code':                                  'codeChanged',
            'input #email':                                 'availableNext',

            // footer
            'click #btn-help':							    'helpSection'
        },

        // Render the template elements
        render: function(callback) {
            var number = app.utils.Storage.getLocalItem('register-number');
            var number_cut = number.substr(number.length - 4);
            var self = this,
                variables = {
                    showBackBth: true,
                    number_cut: number_cut,
                    isPrepago: app.utils.Storage.getSessionItem('register-number-is-prepago'),
                    isPostpago: app.utils.Storage.getSessionItem('register-number-is-postpago'),
                    number: number,
                };
            app.TemplateManager.get(self.name, function(code) {
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
             * set enter event
             */
            $('body').on('keypress', function(e){
                if (e.which === 13 || e.keyCode === 13) {
                    self.validateData();
                }
            });

            $('#ssn').on('click focus', function (e) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $("#ssn").offset().top-20
                }, 1000);
            });
            $('#code').on('click focus', function (e) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $("#code").offset().top-20
                }, 1000);
            });
            $('#email').on('click focus', function (e) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $("#code").offset().top-20
                }, 1000);
            });

            // enable tooltips
            $('[data-toggle="popover"]').popover({
                animation: false
            });

            $.mobile.activePage.on("show.bs.popover", ".tooltip-pin", function(event) {
                setTimeout(function(){
                    $.mobile.activePage.find('[data-toggle="popover"]').popover('hide');
                },3000);
            });
        },

        login: function(e) {
            
            //Go to next
            app.router.navigate('login', {
                trigger: true
            });

        },

        ssnChanged: function(e) {
            self = this;

            var number = $.mobile.activePage.find('#ssn').val();

            if (number.length > 4) {
                number = number.slice(0,4);
                $.mobile.activePage.find('#ssn').val(number);
            }
            self.availableNext(e);
        },

        codeChanged: function(e) {
            var self = this;

            var number = $.mobile.activePage.find('#code').val();

            if (number.length > 6) {
                number = number.slice(0,6);
                $.mobile.activePage.find('#code').val(number);
            }
            self.availableNext(e);
        },

        validateData: function(e) {
            var self = this;

            var ssn = $.mobile.activePage.find('#ssn').val();
            var email = $.mobile.activePage.find('#email').val();
            var code = $.mobile.activePage.find('#code').val();

            var isPrepago = app.utils.Storage.getSessionItem('register-number-is-prepago');

            // validate
            if (code.length != 6) {
                message = 'Debe ingresar los datos solicitados.';
                showAlert('Error', message, 'Aceptar');
                return;
            }

            if(!isPrepago){
                if (!ssn.length == 4) {
                    message = 'Debe ingresar los datos solicitados.';
                    showAlert('Error', message, 'Aceptar');
                    return;
                }
            }

            if (email.length == 0){
                message = 'Debe ingresar los datos solicitados.';
                showAlert('Error', message, 'Aceptar');
                return;
            }

            var check = $('#checkbox-terms').is(':checked');
            if (!check) {
                showAlert('Error' , 'Debe seleccionar los términos y condiciones para poder continuar.', 'OK');
                return
            }

            if (!app.utils.tools.validateEmail(email)) {
                message = 'Debe ingresar un correo electrónico válido.';
                showAlert('Error', message, 'Aceptar');
                return;
            }
            $('#ssn').blur();
            $('#email').blur();
            $('#code').blur();

            if (isPrepago) {
                ssn = code;
            }

            var number = app.utils.Storage.getLocalItem('register-number');

            self.options.loginModel.validateSSNAndEmail(number, code, ssn, email,
                function (response) {
                    if(response.hasError){
                        showAlert('Error', response.errorDisplay, 'Aceptar');
                    } else {
                        app.utils.Storage.setLocalItem('register-number', number);
                        app.utils.Storage.setLocalItem('register-email', email);
                        app.utils.Storage.setLocalItem('register-ssn', ssn);
                        app.utils.Storage.setLocalItem('register-code', code);
                        app.router.navigate('signin_step_3', {
                            trigger: true
                        });
                    }
                },
                app.utils.network.errorRequest
            );
        },

        invertCheckbox: function (e) {
            var self = this;
            var check = $('#checkbox-terms').is(':checked');
            $('#checkbox-terms').prop('checked', !check);
            self.availableNext(e);
        },

        showTerms: function(e) {
            $('.popupbg').show();
        },

        availableNext: function(e) {

            var isPrepago = app.utils.Storage.getSessionItem('register-number-is-prepago');
            var code = $.mobile.activePage.find('#code').val();
            var ssn = $.mobile.activePage.find('#ssn').val();
            var email = $.mobile.activePage.find('#email').val();
            var check = $('#checkbox-terms').is(':checked');

            if ((check && isPrepago && code.length == 6 && app.utils.tools.validateEmail(email)) ||
                (check && !isPrepago && ssn.length == 4 && code.length == 6 && app.utils.tools.validateEmail(email))) {
                $('#btn-validate').removeClass('gray');
                $('#btn-validate').addClass('red');
                $('#btn-validate').addClass('rippleR');
            } else {
                $('#btn-validate').removeClass('red');
                $('#btn-validate').removeClass('rippleR');
                $('#btn-validate').addClass('gray');
            }
        },

        closeTerms: function(e) {
            $('.popupbg').hide();
        },

        send: function(e) {
            self = this;

            var number = app.utils.Storage.getLocalItem('register-number');
            /**
             * Register User
             */
            self.options.loginModel.validateSubscriber(number,
                function (response) {
                    if(response.hasError){
                        if (response.errorDisplay.includes('cuenta ya existente')) {
                            showConfirm('Aviso', 'Hemos detectado que está intentando registrar una cuenta ya existente' +
                                ' en nuestro sistema. Por favor presione la opción Olvido Contraseña para recuperar sus' +
                                ' accesos al sistema.', ['Olvido Contraseña', 'Cerrar'],
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
                        showAlert('', response.errorDisplay, 'Ok');
                    }
                },
                app.utils.network.errorRequest
            );
        }

    });

});
