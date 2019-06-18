$(function() {

    // Register step 1 View
    // ---------------

    app.views.SigninGuestView = app.views.CommonView.extend({

        name: 'signin_guest',

        // The DOM events specific.
        events: {

            // event
            'pagecreate':                           	'pageCreate',

            // content
            'click #btn-next':                           'next',
            'click #btn-login':                          'login',
            'click #btn-resend':                         'send',
            'input #code':                               'codeChanged',

            // footer
            'click #btn-help':							 'helpSection'
        },

        // Render the template elements
        render: function(callback) {
            var number = app.utils.Storage.getLocalItem('register-number');
            var number_cut = number.substr(number.length - 4);
            var self = this,
                variables = {
                    showBackBth: true,
                    number_cut: number_cut,
                    number: number
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
                    self.next();
                }
            });

            $('#code').on('click focus', function (e) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $("#code").offset().top-50
                }, 1000);
            })
        },

        login: function(e) {
            
            //Go to next
            app.router.navigate('login_guest', {
                trigger: true
            });

        },

        codeChanged: function(e) {
            var number = $.mobile.activePage.find('#code').val();

            if (number.length > 6) {
                number = number.slice(0,6);
                $.mobile.activePage.find('#code').val(number);
            }
        },

        next: function(e) {
            var self = this;

            var code = $.mobile.activePage.find('#code').val();

            // validate
            if(code.length != 6){
                message = 'Debe ingresar los datos solicitados.';
                showAlert('Error', message, 'Aceptar');
                return;
            }
            $('#code').blur();

            if (app.utils.Storage.getLocalItem('register-guest-update')) {
                self.onUpdateGuest(code);
            } else {
                self.onValidateGuest(code);
            }
        },

        /**
         * Validate Guest Account
         */
        onValidateGuest: function(code) {
            var self = this;

            var number = app.utils.Storage.getLocalItem('register-number');
            var token = app.utils.Storage.getLocalItem('register-token');
            self.options.customerModel.validateGuest(
                token, code, number,
                function (response) {
                    if(response.hasError){
                        app.utils.network.errorRequest(response, 200, response.errorDisplay);
                    } else {

                        app.utils.Storage.setLocalItem('isLogged', true);
                        app.utils.Storage.setLocalItem('logged-subscriber', number);
                        app.utils.Storage.setLocalItem('logged-subscriber-used', number);
                        app.utils.Storage.setLocalItem('logged-guest', true);

                        showAlert('', ' Su registro como usuario invitado fue realizado exitosamente.', 'Continuar',
                            function () {
                                app.router.navigate('login_guest', {
                                    trigger: true
                                });
                            }
                        );
                    }
                },
                app.utils.network.errorRequest
            );
        },

        /**
         * Update Guest Account
         */
        onUpdateGuest: function(code) {
            var self = this;

            var number = app.utils.Storage.getLocalItem('register-number');
            self.options.loginModel.updateGuest(
                code, number,
                function (response) {
                    if(response.hasError){
                        showAlert('Error', response.errorDisplay, 'Aceptar');
                    } else {

                        app.utils.Storage.setLocalItem('isLogged', true);
                        app.utils.Storage.setLocalItem('logged-subscriber', number);
                        app.utils.Storage.setLocalItem('logged-subscriber-used', number);
                        app.utils.Storage.setLocalItem('logged-guest', true);

                        app.router.navigate('login_guest', {
                            trigger: true
                        });
                    }
                },
                app.utils.network.errorRequest
            );
        },

        /**
         * Send code again
         */
        send: function(e) {
            var self = this;
            var number = app.utils.Storage.getLocalItem('register-number');
            self.options.loginModel.resendGuestCode(number,
                function (response) {
                    if(response.hasError){
                        showAlert('Error', response.errorDisplay, 'Aceptar');
                    } else {
                        app.utils.Storage.setLocalItem('register-number', number);
                        app.utils.Storage.setLocalItem('register-token', response.token);
                        app.utils.Storage.setLocalItem('register-guest-update', true);
                        showAlert('', 'Su código de verificación ha sido enviado nuevamente.', 'Ok');
                    }
                },
                app.utils.network.errorRequest
            );
        },
    });

});
