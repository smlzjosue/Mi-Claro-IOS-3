$(function() {

	// Profile View
	// ---------------
	
	app.views.ProfileUpdateUsernameView = app.views.CommonView.extend({

		name: 'profile_update_username',
		
		// The DOM events specific.
		events: {
            // events
            'pagecreate':                           'pageCreate',

            // Content
            'click #save':                          'saveData',
            'click #btn-help':                      'helpSection',
            'click #btn-back':                      'back',
		},

		// Render the template elements        
		render:function (callback) {

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

        pageCreate: function(e) {
            var self = this;

            $('input.inp-f').on('click focus', function (e) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $(e.currentTarget).offset().top-60
                }, 1000);
            });

            // enable tooltips
            $('[data-toggle="popover"]').popover({
                animation: false
            });

            $("#password-new").popover({
                html : true,
                animation: false,
                target: '#password',
                placement: 'bottom',
                content: function() {
                    return $('#popover-content-input-password').html();
                }
            });

            // hide pasword popover
            $.mobile.activePage.on('focusout', '#password-new', function(e) {
                $("#password-new").popover('hide');
            });

            $.mobile.activePage.on("input", "#password-new", function() {

                var password = $("#password-new").val();

                // length
                if (password.length < 8 || password.length > 15) {
                    $('.validate-length').find('.img-cancel').removeClass('hide');
                    $('.validate-length').find('.img-accept').addClass('hide');
                } else {
                    $('.validate-length').find('.img-cancel').addClass('hide');
                    $('.validate-length').find('.img-accept').removeClass('hide');
                }

                // lower
                if (!hasTiny(password)) {
                    $('.validate-lower').find('.img-cancel').removeClass('hide');
                    $('.validate-lower').find('.img-accept').addClass('hide');
                } else {
                    $('.validate-lower').find('.img-cancel').addClass('hide');
                    $('.validate-lower').find('.img-accept').removeClass('hide');
                }

                //upper
                if (!hasCapital(password)) {
                    $('.validate-upper').find('.img-cancel').removeClass('hide');
                    $('.validate-upper').find('.img-accept').addClass('hide');
                } else {
                    $('.validate-upper').find('.img-cancel').addClass('hide');
                    $('.validate-upper').find('.img-accept').removeClass('hide');
                }

                // two digit
                if (!hasTwoNumbers(password)) {
                    $('.validate-number').find('.img-cancel').removeClass('hide');
                    $('.validate-number').find('.img-accept').addClass('hide');
                } else {
                    $('.validate-number').find('.img-cancel').addClass('hide');
                    $('.validate-number').find('.img-accept').removeClass('hide');
                }

                // no special character
                if (hasSpecialCharacter(password)) {
                    $('.validate-character').find('.img-cancel').removeClass('hide');
                    $('.validate-character').find('.img-accept').addClass('hide');
                } else {
                    $('.validate-character').find('.img-cancel').addClass('hide');
                    $('.validate-character').find('.img-accept').removeClass('hide');
                }

            });

            self.setupData();
        },

        setupData: function() {

            const username = app.utils.Storage.getLocalItem('username');
            $('#current_user').val(username);

            const subscriber = app.utils.Storage.getLocalItem('logged-subscriber');
            $('#phone_user').val(subscriber);
        },

        saveData: function (e) {
            var self = this;

            var passwordOld = $('#password-old').val();
            var password = $('#password-new').val();
            var passwordRepeat = $('#password-repeat').val();
            var userEmail = $('#user-new').val();

            if (userEmail.length == 0){
                message = 'Debe ingresar su nuevo usuario.';
                showAlert('Error', message, 'Aceptar');
                return;
            }

            if (!app.utils.tools.validateEmail(userEmail)) {
                message = 'Debe ingresar un correo electrónico válido.';
                showAlert('Error', message, 'Aceptar');
                return;
            }

            if(passwordOld.length == 0){
                message = 'Debe colocar su contaseña anterior';
                showAlert('Error', message, 'Aceptar', function(e){});
                return;
            }

            if(password.length < 8 || password.length > 15){
                message = 'Debe tener entre 8 y 15 caracteres';
                showAlert('Error de Contraseña', message, 'Aceptar');
                return;
            }
            if(!hasTiny(password)){
                message = 'Debe tener al menos 1 letra minúscula';
                showAlert('Error de Contraseña', message, 'Aceptar');
                return;
            }
            if(!hasCapital(password)){
                message = 'Debe tener al menos 1 letra mayúscula';
                showAlert('Error de Contraseña', message, 'Aceptar');
                return;
            }
            if(!hasTwoNumbers(password)){
                message = 'Debe tener al menos 2 números';
                showAlert('Error de Contraseña', message, 'Aceptar');
                return;
            }
            if(hasSpecialCharacter(password)){
                message = 'No estan permitidos caracteres especiales';
                showAlert('Error de Contraseña', message, 'Aceptar');
                return;
            }

            if(password != passwordRepeat){
                message = 'Las contraseñas no coinciden.';
                showAlert('Error de Contraseña', message, 'Aceptar');
                return;
            }

            self.options.userModel.updateUsername(userEmail,
                function (response) {
                    if (!response.hasError ) {
                        self.updatePassword(password, passwordOld);
                    } else {
                        showAlert('Error', response.errorDisplay, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            );
        },

        updatePassword: function(password, passwordOld) {
            var self = this;

            const selectedAccount = app.utils.Storage.getSessionItem('selected-account');

            const object = {
                ban: selectedAccount.Account,
                newPassword: password,
                password: passwordOld
            };

            self.options.userModel.updatePassword(object,
                function (response) {
                    if (!response.hasError) {
                        app.utils.Storage.setLocalItem('password', password);
                        showAlert('',
                            'Se actualizo su usuario y contraseña con éxito.', 'Aceptar',
                            function () {
                                app.router.navigate('login',{trigger: true});
                        });
                    } else {
                        showAlert('Error', response.errorDisplay, 'Aceptar');
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