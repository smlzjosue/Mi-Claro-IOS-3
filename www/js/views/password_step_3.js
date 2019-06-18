$(function() {

    // Register step 1 View
    // ---------------

    app.views.PasswordStep3View = app.views.CommonView.extend({

        name: 'password_step_3',

        // The DOM events specific.
        events: {
            // event
            'pagecreate':                           	'pageCreate',

            // content
            'click #btn-next':                          'next',
            'click #btn-login':                         'login',

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

            var questions = app.utils.Storage.getSessionItem('security-question-list');

            var question1 = questions[0].question;
            var question2 = questions[1].question;

            // init validate if you have question marks
            if (!question1.includes('¿')) {
                question1 = '¿'+question1;
            }
            if (!question1.includes('?')) {
                question1 = question1+'?';
            }
            if (!question2.includes('¿')) {
                question2 = '¿'+question2;
            }
            if (!question2.includes('?')) {
                question2 = question2+'?';
            }

            // end validate if you have question marks
            $('#question1').html(question1);
            $('#question2').html(question2);

            /**
             * set enter event
             */
            $('body').unbind('keypress');
            $('body').on('keypress', function(e){
                if (e.which === 13 || e.keyCode === 13) {
                    self.next();
                }
            });

            $('#answer1').on('click focus', function () {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $('#question1').offset().top-50
                }, 1000);
            });

            $('#answer2').on('click focus', function () {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $('#question1').offset().top-50
                }, 1000);
            });
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

        next: function(e) {
            var self = this;

            var answer1 = $.mobile.activePage.find('#answer1').val();
            var answer2 = $.mobile.activePage.find('#answer2').val();

            // validate
            if(!answer1.length > 0 || !answer2.length > 0){
                const message = 'Por favor, complete los campos para continuar.';
                showAlert('Error', message, 'Aceptar');
                return;
            }

            var number = app.utils.Storage.getSessionItem('security-question-subscriber');
            var questions = app.utils.Storage.getSessionItem('security-question-list');
            questions[0].response = answer1;
            questions[1].response = answer2;

            $('#answer1').blur();
            $('#answer2').blur();
            self.options.loginModel.answerSecurityQuestions(number, questions,
                function (response) {
                    if(response.hasError){
                        showAlert('Error', response.errorDisplay, 'Aceptar');
                    } else {

                        app.utils.Storage.setSessionItem('security-question-password', response.newpassword);
                        app.utils.Storage.setSessionItem('token', response.token);

                        app.router.navigate('password_step_5', {
                            trigger: true
                        });
                    }
                },
                app.utils.network.errorRequest
            );

        },

    });

});
