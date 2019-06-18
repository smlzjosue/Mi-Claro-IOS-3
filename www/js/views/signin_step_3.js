$(function() {

    // Register step 1 View
    // ---------------

    app.views.SigninStep3View = app.views.CommonView.extend({

        name: 'signin_step_3',

        // The DOM events specific.
        events: {
            // event
            'pagecreate':                           	'pageCreate',

            // content
            'click #btn-validate':                      'validatePassword',
            'click #btn-login':                         'login',
            'input #password':                          'passwordChanged',
            'input #password_repeat':                   'passwordChanged',

            // footer
            'click #btn-help':	                        'helpSection',
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

                    self.validatePassword();

                }
            });

            $('#password').on('click focus', function (e) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $("#password").offset().top-50
                }, 1000);
            });

            $('#password_repeat').on('click focus', function () {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $('#password').offset().top-50
                }, 1000);
            });
        },

        login: function(e) {

            //Go to next
            app.router.navigate('login', {
                trigger: true
            });

        },

        passwordChanged: function(e) {

            var self = this;

            var password = $.mobile.activePage.find('#password').val();


            if (password.length > 15) {
                password = password.slice(0,15);
                $.mobile.activePage.find('#password').val(password);
            }

            $('#p1').removeClass('done');
            $('#p2').removeClass('done');
            $('#p3').removeClass('done');
            $('#p4').removeClass('done');
            $('#p5').removeClass('done');
            $('#p6').removeClass('done');

            self.availableNext();

            if(password.length < 8 || password.length > 15){
                $('#p1').removeClass('done');
                self.disableNext();
            } else {
                $('#p1').addClass('done');
            }

            if(!hasCapital(password)){
                $('#p2').removeClass('done');
                self.disableNext();
            } else {
                $('#p2').addClass('done');
            }

            if(!hasTiny(password)){
                $('#p3').removeClass('done');
                self.disableNext();
            } else {
                $('#p3').addClass('done');
            }

            if(!hasTwoNumbers(password)){
                $('#p4').removeClass('done');
                self.disableNext();
            } else {
                $('#p4').addClass('done');
            }

            if(hasSpecialCharacter(password)){
                $('#p5').removeClass('done');
                self.disableNext();
            } else {
                $('#p5').addClass('done');
            }

            var passwordRepeat = $.mobile.activePage.find('#password_repeat').val();

            if(password != passwordRepeat){
                $('#p6').removeClass('done');
                self.disableNext();
            } else {
                $('#p6').addClass('done');
            }
        },

        availableNext: function() {
            $('#btn-validate').removeClass('gray');
            $('#btn-validate').addClass('red');
            $('#btn-validate').addClass('rippleR');
        },

        disableNext: function() {
            $('#btn-validate').removeClass('red');
            $('#btn-validate').removeClass('rippleR');
            $('#btn-validate').addClass('gray');
        },

        validatePassword: function(e) {
            var self = this;

            var password = null;

            password = $.mobile.activePage.find('#password').val();

            // validate
            if(password.length == 0){
                message = 'Debe ingresar los datos solicitados.';
                showAlert('Error de Contraseña', message, 'Aceptar');
                return;
            }
            if(password.length < 8 || password.length > 15){
                message = 'Debe tener entre 8 y 15 caracteres';
                showAlert('Error de Contraseña', message, 'Aceptar');
                return;
            }
            if(!hasCapital(password)){
                message = 'Debe tener al menos 1 letra mayúscula';
                showAlert('Error de Contraseña', message, 'Aceptar');
                return;
            }
            if(!hasTiny(password)){
                message = 'Debe tener al menos 1 letra minúscula';
                showAlert('Error de Contraseña', message, 'Aceptar');
                return;
            }
            if(!hasTwoNumbers(password)){
                message = 'Debe tener al menos 2 números';
                showAlert('Error de Contraseña', message, 'Aceptar');
                return;
            }
            if(hasSpecialCharacter(password)){
                message = 'No estan permistidos caracteres especiales';
                showAlert('Error de Contraseña', message, 'Aceptar');
                return;
            }

            var passwordRepeat = $.mobile.activePage.find('#password_repeat').val();

            if(password != passwordRepeat){
                message = 'Las contraseñas no coinciden.';
                showAlert('Error de Contraseña', message, 'Aceptar');
                return;
            }

            var number = app.utils.Storage.getLocalItem('register-number');
            var email = app.utils.Storage.getLocalItem('register-email');
            var ssn = app.utils.Storage.getLocalItem('register-ssn');
            var code = app.utils.Storage.getLocalItem('register-code');
            $('#password').blur();
            self.options.loginModel.validatePassword(
                number, code, ssn, email, password,
                function (response) {
                    if(response.hasError){
                        showAlert('Error', response.errorDisplay, 'Aceptar'); // TODO, mostrar error exacto
                    } else {
                        // // set logged user
                        app.utils.Storage.setLocalItem('isLogged', false);
                        app.utils.Storage.setLocalItem('loginModeGuest', false);

                        // navigate to login
                        showAlert('', 'Has sido registrado con Exito!', 'Continuar',
                            function () {
                                app.router.navigate('login', {
                                    trigger: true
                                });
                            }
                        );
                    }
                },
                app.utils.network.errorRequest
            );

        }

    });

    function hasCapital(password) {
        var hasCapital = false;
        for(var index = 0; index < password.length; index++) {
            var letter = password.charAt(index);
            if(isCapital(letter)) {
                hasCapital = true;
            }
        }
        return hasCapital;
    }

    function hasTiny(password) {
        var hasTiny = false;
        for(var index = 0; index < password.length; index++) {
            var letter = password.charAt(index);
            if(isTiny(letter)) {
                hasTiny = true;
            }
        }
        return hasTiny;
    }

    function isCapital(letter) {
        var letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (letters.indexOf(letter, 0) == -1){
            return false;
        }
        return letter === letter.toUpperCase();
    }

    function isTiny(letter) {
        var letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (letters.indexOf(letter, 0) == -1){
            return false;
        }
        return letter === letter.toLowerCase();
    }


    function hasTwoNumbers(password){
        var numbers = "0123456789";
        var count = 0;
        for(i=0; i<password.length; i++){
            if (numbers.indexOf(password.charAt(i),0)!=-1){
                count++;
            }
        }
        return count >= 2;

    }

    function hasSpecialCharacter(password){
        var numbers = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var hasSpecial = false;
        for(i=0; i<password.length; i++){
            if (numbers.indexOf(password.charAt(i),0)==-1){
                hasSpecial = true;
            }
        }
        return hasSpecial;
    }

});
