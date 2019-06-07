$(function() {

    // Register step 1 View
    // ---------------

    app.views.PasswordStep1View = app.views.CommonView.extend({

        name: 'password_step_1',

        // The DOM events specific.
        events: {
            // event
            'pagecreate':                           	'pageCreate',
            // content
            'click #btn-next':                          'next',
            'click #btn-login':                         'login',
            'input #number':                            'numberChanged',

            // footer
            'click #btn-help':	                        'helpSection'
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

            /**
             * set enter event
             */
            $('body').unbind('keypress');
            $('body').on('keypress', function(e){
                if (e.which === 13 || e.keyCode === 13) {
                    self.next();
                }
            });

            $('#number').on('click focus', function () {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $('#number').offset().top-20
                }, 1000);
            });
        },

        numberChanged: function() {
            var number = $.mobile.activePage.find('#number').val();

            if (number.length > 40) {
                number = number.slice(0,40);
                $.mobile.activePage.find('#number').val(number);
            }
        },

        help: function(e){

            //Go to help
            app.router.navigate('help', {trigger: true});

        },

        login: function(e) {
            
            //Go to next
            app.router.navigate('login', {
                trigger: true
            });

        },

        next: function() {
            var self = this;

            var number = $.mobile.activePage.find('#number').val();

            if(!number.length > 0){
                    message = 'El número de teléfono o correo ingresado no se encuentra registrado en nuestros sistemas, su formato es incorrecto o no pertenece a nuestra red. Por favor intente nuevamente.';
                showAlert('Error', message, 'Aceptar');
                return;
            }

            $('#number').blur();
            self.options.loginModel.getSecurityQuestions(number,
                function (response) {
                    if(response.hasError){
                        showAlert('Error', response.errorDisplay, 'Aceptar');
                    } else {
                        if (response.subscriber == null) {
                            showAlert('Error', 'El número de teléfono o correo ingresado no se encuentra registrado en nuestros sistemas, su formato es incorrecto o no pertenece a nuestra red. Por favor intente nuevamente.', 'Aceptar');
                            return;
                        }

                        var questions = null;

                        app.utils.Storage.setSessionItem('security-question-subscriber', response.subscriber);
                        app.utils.Storage.setSessionItem('security-question-email', response.email);

                        app.utils.Storage.setSessionItem('security-question-is-telefonia', false);
                        if (response.accountType == 'I' && response.accountSubType == 'W'
                        || response.productType == 'O'){
                            app.utils.Storage.setSessionItem('security-question-is-telefonia', true);
                        }

                        if (response.ResponseList == null) {
                            app.router.navigate('password_step_4', {
                                trigger: true
                            });
                            return;
                        } else {
                            questions = [];
                            $.each(response.ResponseList, function (i, object) {
                                questions[i] = {
                                    question: object.question,
                                    questionID: object.questionID,
                                    response: object.response
                                };
                            });
                        }
                        app.utils.Storage.setSessionItem('security-question-list', questions);

                        app.router.navigate('password_step_2', {
                            trigger: true
                        });
                    }
                },
                app.utils.network.errorRequest
            );

        },

    });

});
