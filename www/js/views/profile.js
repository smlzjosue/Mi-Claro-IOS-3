$(function() {

	// Profile View
	// ---------------
	
	app.views.ProfileView = app.views.CommonView.extend({

		name: 'profile',

        questions: [],
		
		// The DOM events specific.
		events: {
            // events
            'pagecreate':                           'pageCreate',

            // Content
            'click #tab-info':                      'tabInfo',
            'click #tab-email':                     'tabEmail',
            'click #tab-password':                  'tabPassword',
            'click #tab-postal':                    'tabPostal',
            'click #tab-questions':                 'tabQuestions',
            'click #save-personal':                 'savePersonal',
            'click #save-email':                    'saveEmail',
            'click #save-password':                 'savePassword',
            'click #save-address':                  'saveAddress',
            'click #save-questions':                'saveQuestions',

            'input #phone':                         'numberChanged',
            'input #phone_f':                       'numberChanged',
		},

		// Render the template elements        
		render:function (callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            var self = this,
                variables = {
                    accounts: this.getSelectTabAccounts(),
                    selectedTab: app.utils.Storage.getSessionItem('selected-tab'),
                    selectedAccount: app.utils.Storage.getSessionItem('selected-account'),
                    accountSections: this.getUserAccess(),
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
            self.activateMenu(e);
            self.getProfile();

            const tab = app.utils.Storage.getSessionItem('profile-tab-selected');
            switch (tab) {
                case 0:
                    self.tabInfo(e);
                    break;
                case 1:
                    self.tabEmail(e);
                    break;
                case 2:
                    self.tabPassword(e);
                    break;
            }

            if (app.utils.Storage.getSessionItem('required-updates').requiredAccountUpdate) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $('#label_update').offset().top-50
                }, 1000);
            }

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

            // allow only number and dash
            var SPMaskBehavior = function (val) {
                    return val.replace(/\D/g, '').length === 11 ? '00000' : '00000-0000';
                },
                spOptions = {
                    onKeyPress: function(val, e, field, options) {
                        field.mask(SPMaskBehavior.apply({}, arguments), options);
                    }
                };

            $('#zip_code').mask(SPMaskBehavior, spOptions);

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
        },

        getProfile: function() {
            var self = this;
            const selectedAccount = app.utils.Storage.getSessionItem('selected-account');
            self.options.userModel.getUserProfile(selectedAccount.Account,
                function (response) {
                    if (!response.HasError) {
                        self.setupData(response);
                    } else {
                        showAlert('Error', response.ErrorDesc, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            );
        },

        numberChanged: function(e) {
            var number = $(e.currentTarget).val();
            if (number.length > 10) {
                number = number.slice(0,10);
                $(e.currentTarget).val(number);
            }
        },

        setupData: function(data) {
            var self = this;

            const username = app.utils.Storage.getLocalItem('username');
            $('#current_user').val(username);

            app.utils.Storage.setSessionItem('profile-data', data);

            $('#name').val(data.FirstName + ' ' + data.LastName);
            $('#phone').val(data.CelularPhone);
            $('#phone_f').val(data.PhoneNumber);
            $('#email').val(data.Email);
            $('#address_1').val(data.AddressDet);
            $('#address_2').val(data.AddressDet2);
            $('#city').val(data.City);
            $('#state').val(data.State);
            $('#country').val(data.Country);
            $('#zip_code').val(data.ZipCode);

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
                        if (response.ResponseList) {
                            $.each(self.questions, function(index, question) {
                                if (response.ResponseList.length > 0) {
                                    const questionId1 = response.ResponseList[0].questionID;
                                    if (questionId1 == question.questionID) {
                                        $('#questions_1').prop('selectedIndex', index);
                                        $('#answer_1').val(response.ResponseList[0].response);
                                    }
                                }
                                if (response.ResponseList.length > 1) {
                                    const questionId2 = response.ResponseList[1].questionID;
                                    if (questionId2 == question.questionID) {
                                        $('#questions_2').prop('selectedIndex', index);
                                        $('#answer_2').val(response.ResponseList[1].response);
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

        tabInfo: function (e) {
            $('#tab-info').addClass('on');
            $('#tab-email').removeClass('on');
            $('#tab-password').removeClass('on');
            $('#tab-postal').removeClass('on');
            $('#tab-questions').removeClass('on');

            $('#content-info').show();
            $('#content-email').hide();
            $('#content-password').hide();
            $('#content-postal').hide();
            $('#content-questions').hide();
        },

        tabEmail: function (e) {
            $('#tab-info').removeClass('on');
            $('#tab-email').addClass('on');
            $('#tab-password').removeClass('on');
            $('#tab-postal').removeClass('on');
            $('#tab-questions').removeClass('on');

            $('#content-info').hide();
            $('#content-email').show();
            $('#content-password').hide();
            $('#content-postal').hide();
            $('#content-questions').hide();
        },

        tabPassword: function (e) {
            $('#tab-info').removeClass('on');
            $('#tab-email').removeClass('on');
            $('#tab-password').addClass('on');
            $('#tab-postal').removeClass('on');
            $('#tab-questions').removeClass('on');

            $('#content-info').hide();
            $('#content-email').hide();
            $('#content-password').show();
            $('#content-postal').hide();
            $('#content-questions').hide();

            if (app.utils.Storage.getSessionItem('required-updates').requiredAccountUpdate) {
                $('#container_required_update').show();
                $('#container_no_update').hide();
            } else {
                $('#container_required_update').hide();
                $('#container_no_update').show();
            }
        },

        tabPostal: function(e) {
            $('#tab-info').removeClass('on');
            $('#tab-email').removeClass('on');
            $('#tab-password').removeClass('on');
            $('#tab-postal').addClass('on');
            $('#tab-questions').removeClass('on');

            $('#content-info').hide();
            $('#content-email').hide();
            $('#content-password').hide();
            $('#content-postal').show();
            $('#content-questions').hide();
        },

        tabQuestions: function(e) {
            $('#tab-info').removeClass('on');
            $('#tab-email').removeClass('on');
            $('#tab-password').removeClass('on');
            $('#tab-postal').removeClass('on');
            $('#tab-questions').addClass('on');

            $('#content-info').hide();
            $('#content-email').hide();
            $('#content-password').hide();
            $('#content-postal').hide();
            $('#content-questions').show();
        },

        savePersonal: function (e) {
            var self = this;

            const data = app.utils.Storage.getSessionItem('profile-data');
            const phone = $('#phone').val();
            const phonef = $('#phone_f').val();

            if(phone.length != 10){
                message = 'El número de teléfono celular es invalido.';
                showAlert('Error', message, 'Aceptar');
                return;
            }

            if(phonef.length != 10){
                message = 'El número de teléfono de hogar es invalido.';
                showAlert('Error', message, 'Aceptar');
                return;
            }

            const selectedAccount = app.utils.Storage.getSessionItem('selected-account');

            const object = {
                BAN: btoa(selectedAccount.Account),
                Email: btoa(data.Email),
                PhoneNumber: btoa(phone),
                PhoneNumber2: btoa(phonef)
            };

            self.options.userModel.updatePersonalData(object,
                function (response) {
                    if (!response.HasError) {
                        showAlert('', response.ErrorDesc, 'Aceptar', function () {
                            self.render(function(){
                                $.mobile.activePage.trigger('pagecreate');
                            });
                        });

                    } else {
                        showAlert('Error', response.ErrorDesc, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            );
        },

        saveEmail: function (e) {
            var self = this;

            const data = app.utils.Storage.getSessionItem('profile-data');
            const email = $('#new_email').val();
            const repeatEmail = $('#repeat_email').val();

            if (!app.utils.tools.validateEmail(email)) {
                message = 'Debe ingresar un correo electrónico válido.';
                showAlert('Error', message, 'Aceptar');
                return;
            }

            if(email !== repeatEmail){
                message = 'Los correos no coinciden.';
                showAlert('Error', message, 'Aceptar');
                return;
            }

            self.options.userModel.getVerifyEmail(email,
                function (success) {
                    if (!success.hasErrorField) {

                        const selectedAccount = app.utils.Storage.getSessionItem('selected-account');

                        const object = {
                            BAN: btoa(selectedAccount.Account),
                            Email: btoa(email),
                            PhoneNumber: btoa(data.CelularPhone),
                            PhoneNumber2: btoa(data.PhoneNumber)
                        };

                        self.options.userModel.updatePersonalData(object,
                            function (response) {
                                if (!response.HasError) {
                                    showAlert('', response.ErrorDesc, 'Aceptar', function () {
                                        self.render(function(){
                                            $.mobile.activePage.trigger('pagecreate');
                                        });
                                    });

                                } else {
                                    showAlert('Error', response.ErrorDesc, 'Aceptar');
                                }
                            },
                            app.utils.network.errorRequest
                        );

                    } else {
                        showAlert('Error', success.errorDescField, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            );
        },

        savePassword: function (e) {
            var self = this;

            const data = app.utils.Storage.getSessionItem('profile-data');
            var passwordOld = $('#password-old').val();
            var password = $('#password-new').val();
            var passwordRepeat = $('#password-repeat').val();

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

            const selectedAccount = app.utils.Storage.getSessionItem('selected-account');

            const object = {
                ban: selectedAccount.Account,
                newPassword: password,
                password: passwordOld
            };

            self.options.userModel.updatePassword(object,
                function (response) {
                    if (!response.hasError) {
                        showAlert('', response.response, 'Aceptar', function () {
                            self.render(function(){
                                $.mobile.activePage.trigger('pagecreate');
                            });
                        });

                    } else {
                        showAlert('Error', response.errorDisplay, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            );
        },

        saveAddress: function (e) {
            var self = this;

            const data = app.utils.Storage.getSessionItem('profile-data');
            var address1 = $('#address_1').val();
            var address2 = $('#address_2').val();
            var city = $('#city').val();
            var zipCode = $('#zip_code').val();

            if(address1.length == 0){
                message = 'Por favor indique su dirección.';
                showAlert('Error', message, 'Aceptar');
                return;
            }

            if(city.length == 0){
                message = 'Por favor indique su ciudad.';
                showAlert('Error', message, 'Aceptar');
                return;
            }

            if(zipCode.length == 0){
                message = 'Por favor indique su codigo postal.';
                showAlert('Error', message, 'Aceptar');
                return;
            }

            const selectedAccount = app.utils.Storage.getSessionItem('selected-account');

            const object = {
                BAN: selectedAccount.Account,
                AddressDet: address1,
                AddressDet2: address2,
                City: city,
                zip: zipCode,
            };

            self.options.userModel.updatePersonalAddress(object,
                function (response) {
                    if (!response.HasError) {
                        showAlert('', response.ErrorDesc, 'Aceptar', function () {
                            self.render(function(){
                                $.mobile.activePage.trigger('pagecreate');
                            });
                        });

                    } else {
                        showAlert('Error', response.ErrorDesc, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            );
        },

        saveQuestions: function (e) {
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
                        showAlert('', 'Se actualizaron sus preguntas de seguridad con éxito.', 'Aceptar');
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