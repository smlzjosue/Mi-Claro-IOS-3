$(function() {

    // Register step 1 View
    // ---------------

    app.views.PasswordStep4View = app.views.CommonView.extend({

        name: 'password_step_4',

        // The DOM events specific.
        events: {
            // event
            'pagecreate':                           	'pageCreate',
            // content
            'click #btn-next':              'next',
            'click #btn-login':             'login',

            'click #option-number':         'selectNumber',
            'click #option-email':          'selectEmail',

            // footer
            'click #btn-help':	            'helpSection'
        },

        // Render the template elements
        render: function(callback) {

            var number = ''+app.utils.Storage.getSessionItem('security-question-subscriber');
            console.log(number);
            var number_cut = number.substr(number.length - 4);
            number = '********' + number_cut;

            var self = this,
                variables = {
                    number : number,
                    email: app.utils.Storage.getSessionItem('security-question-email'),
                    isTelefonia: app.utils.Storage.getSessionItem('security-question-is-telefonia'),
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
            if (app.utils.Storage.getSessionItem('security-question-is-telefonia')) {
                $('#radioG1').prop('checked', false);
            }
        },

        selectNumber: function() {
            $('#option-number').toggleClass("on");
            if (document.getElementById('option-number').classList.contains("on")) {
                $('#radioG1').prop('checked', true);
            } else {
                $('#radioG1').prop('checked', false);
            }
            this.availableNext();
        },

        selectEmail: function() {
            $('#option-email').toggleClass("on");
            if (document.getElementById('option-email').classList.contains("on")) {
                $('#radioG2').prop('checked', true);
            } else {
                $('#radioG2').prop('checked', false);
            }
            this.availableNext();
        },

        help: function(e){

            //Go to help
            app.router.navigate('help', {trigger: true});

        },

        availableNext: function(e) {
            var check1 = $('#radioG1').is(':checked');
            var check2 = $('#radioG2').is(':checked');
            if (check1 || check2) {
                $('#btn-next').removeClass('gray');
                $('#btn-next').addClass('red');
                $('#btn-next').addClass('rippleR');
            } else {
                $('#btn-next').removeClass('red');
                $('#btn-next').removeClass('rippleR');
                $('#btn-next').addClass('gray');
            }
        },

        login: function(e) {
            
            //Go to next
            app.router.navigate('login', {
                trigger: true
            });

        },

        next: function(e) {

            var self = this;

            var check1 = $('#radioG1').is(':checked');
            var check2 = $('#radioG2').is(':checked');

            if (!check1 && !check2) {
                // nothing to do because don't have selected option
                return;
            }

            var sms = '';
            var email = '';

            var number = ''+app.utils.Storage.getSessionItem('security-question-subscriber');

            if (check1) {
                sms = number;
            }

            if (check2) {
                email = app.utils.Storage.getSessionItem('security-question-email')
            }

            self.options.loginModel.recoveryPasswordBySubscriber(number, sms, email,
                function (response) {
                    if(response.hasError){
                        showAlert('Error', response.errorDisplay, 'Aceptar');
                    } else {

                        app.utils.Storage.setLocalItem('isLogged', false);
                        app.utils.Storage.setLocalItem('loginModeGuest', false);
                        // navigate to login
                        showAlert('', response.response, 'Continuar',
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

        },

    });

});
