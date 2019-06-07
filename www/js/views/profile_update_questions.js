$(function() {

	// Profile View
	// ---------------
	
	app.views.ProfileUpdateQuestionsView = app.views.CommonView.extend({

		name: 'profile_update_questions',

        questions: [],
		
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
		render: function (callback) {

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
                    scrollTop: $(e.currentTarget).offset().top-40
                }, 1000);
            });

            // $.getJSON("js/data/questions.json", function(json) {
            //     var questions = json;
            //     var htmlA = '';
            //     var htmlB = '';
            //     $.each(questions, function(index, question) {
            //         if (index == 0) {
            //             htmlA += '<option value="'+question.id+'" selected>'+question.question+'</option>\n';
            //             htmlB += '<option value="'+question.id+'">'+question.question+'</option>\n';
            //         } else if (index == 1) {
            //             htmlA += '<option value="'+question.id+'">'+question.question+'</option>\n';
            //             htmlB += '<option value="'+question.id+'" selected>'+question.question+'</option>\n';
            //         } else {
            //             htmlA += '<option value="'+question.id+'">'+question.question+'</option>\n';
            //             htmlB += '<option value="'+question.id+'">'+question.question+'</option>\n';
            //         }
            //     });
            //     $('#questions_1').html(htmlA);
            //     $('#questions_2').html(htmlB);
            // });

            self.getQuestions();
        },

        getQuestions: function() {
            var self = this;
            self.options.userModel.getQuestions(
                function (response) {
                    if (!response.hasError) {
                        self.setQuestionData(response.QuestionsItemsList)
                    } else {
                        showAlert('Error', response.errorDisplay, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            );
        },

        setQuestionData: function(questions) {
            var self = this;

            self.questions = questions;

            var htmlA = '';
            var htmlB = '';
            $.each(questions, function(index, question) {
                if (index == 0) {
                    htmlA += '<option value="'+question.questionID+'" selected>'+question.question+'</option>\n';
                    htmlB += '<option value="'+question.questionID+'">'+question.question+'</option>\n';
                } else if (index == 1) {
                    htmlA += '<option value="'+question.questionID+'">'+question.question+'</option>\n';
                    htmlB += '<option value="'+question.questionID+'" selected>'+question.question+'</option>\n';
                } else {
                    htmlA += '<option value="'+question.questionID+'">'+question.question+'</option>\n';
                    htmlB += '<option value="'+question.questionID+'">'+question.question+'</option>\n';
                }
            });
            $('#questions_1').html(htmlA);
            $('#questions_2').html(htmlB);

            self.getUserChallengeQuestions();
        },

        getUserChallengeQuestions: function() {
            var self = this;
            self.options.userModel.getChallengeQuestions(
                function (response) {
                    if (!response.hasError) {
                        if (response.ResponseList != null) {
                            $.each(self.questions, function(index, question) {
                                if (response.ResponseList.length > 0) {
                                    const questionId1 = response.ResponseList[0].questionID;
                                    if (questionId1 == question.questionID) {
                                        $('#questions_1').prop('selectedIndex', index);
                                    }
                                }
                                if (response.ResponseList.length > 1) {
                                    const questionId1 = response.ResponseList[1].questionID;
                                    if (questionId1 == question.questionID) {
                                        $('#questions_2').prop('selectedIndex', index);
                                    }
                                }
                            });
                        }
                    } else {
                        showAlert('Error', response.errorDisplay, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            );
        },

        saveData: function (e) {
            var self = this;

            const answer1 = $('#answer_1').val();
            const answer2 = $('#answer_2').val();


            const questionId1 = $('#questions_1').val();
            const questionId2 = $('#questions_2').val();

            if(answer1.length == 0){
                message = 'Porfavor introduzca su respuesta a la primera pregunta de Seguridad.';
                showAlert('Error', message, 'Aceptar', function(e){});
                return;
            }

            if(answer2.length == 0){
                message = 'Porfavor introduzca su respuesta a la segunda pregunta de Seguridad.';
                showAlert('Error', message, 'Aceptar', function(e){});
                return;
            }

            self.options.userModel.setChallengeQuestions(
                questionId1,
                answer1,
                function (response) {
                    if (!response.hasError) {
                        self.setQuestion2(questionId2, answer2);
                    } else {
                        showAlert('Error', response.errorDisplay, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            );
        },

        setQuestion2: function (questionId2, answer2) {
            var self = this;

            self.options.userModel.setChallengeQuestions(
                questionId2,
                answer2,
                function (response) {
                    if (!response.hasError) {
                        showAlert('',
                            'Se actualizaron sus preguntas de seguridad con éxito.', 'Aceptar',
                            function () {
                                app.router.navigate('login',{trigger: true});
                            });
                    } else {
                        showAlert('Error', response.errorDisplay, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            );
        },
	});
});