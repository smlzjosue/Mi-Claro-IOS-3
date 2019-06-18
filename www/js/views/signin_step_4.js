$(function() {

    // Register step 1 View
    // ---------------

    app.views.SigninStep4View = app.views.CommonView.extend({

        name: 'signin_step_4',

        // The DOM events specific.
        events: {

            // event
            'pagecreate':                           	'pageCreate',
            // content
            'click #btn-next':                          'next',
            'click #btn-login':                         'login',
            'click #btn-resend':                        'send',
            'input #code':                              'codeChanged',

            // footer
            'click #btn-help':							'helpSection'
        },

        // Render the template elements
        render: function(callback) {
            var number = app.utils.Storage.getLocalItem('register-number');
            var number_cut = number.substr(number.length - 4);
            var self = this,
                variables = {
                    showBackBth: true,
                    number_cut: number_cut,
                    number: number,
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

        codeChanged: function(e) {
            self = this;

            var number = $.mobile.activePage.find('#code').val();

            if (number.length > 4) {
                number = number.slice(0,4);
                $.mobile.activePage.find('#code').val(number);
            }
        },

        login: function(e) {
            
            //Go to next
            app.router.navigate('login', {
                trigger: true
            });

        },

        next: function(e) {

            var code = $.mobile.activePage.find('#code').val();

            // validate
            if(code.length != 4){
                message = 'Has ingresado un código incorrecto, por favor verifícalo nuevamente.';
                showAlert('Error', message, 'Aceptar');
                return;
            }

            app.router.navigate('signin_step_2', {
                trigger: true
            });

            // /**
            //  * Validate Account
            //  */
            // var self = this;
            // var number = app.utils.Storage.getLocalItem('logged-subscriber');
            // self.options.customerModel.validateAccount(
            //     number, code,
            //     function (response) {
            //         if(response.hasError){
            //             showAlert('Error', response.errorDisplay, 'Aceptar');
            //         } else {
            //             showAlert('', 'Has sido registrado con Exito!', 'Continuar',
            //                 function () {
            //                     app.router.navigate('login', {
            //                         trigger: true
            //                     });
            //                 }
            //             );
            //         }
            //     },
            //     app.utils.network.errorRequest
            // );

        },

        send: function(e) {
            // var self = this;
            // var number = app.utils.Storage.getLocalItem('register-number');
            // self.options.loginModel.registerGuest(number,
            //     function (response) {
            //         if(response.hasError){
            //             showAlert('Error', response.errorDisplay, 'Aceptar');
            //         } else {
            //             app.utils.Storage.setLocalItem('register-number', number);
            //             app.utils.Storage.setLocalItem('register-token', response.token);
            //             showAlert('', 'Su código de verificación ha sido enviado nuevamente.', 'Ok');
            //         }
            //     },
            //     app.utils.network.errorRequest
            // );
        }

    });

});
