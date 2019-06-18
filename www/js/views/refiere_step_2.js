$(function() {

    // Register step 1 View
    // ---------------

    app.views.RefiereStep2 = app.views.CommonView.extend({

        name: 'refiere_step_2',

        memberID: 1,

        // The DOM events specific.
        events: {
            'pagecreate':                               'pageCreate',
            // content
            'click #btn-next':                          'next',
            'change #checkbox-terms':                   'showTerms',
            'click #close-terms':                       'closeTerms',
            'click #link-terms':                        'invertCheckbox',
            'click #copy':                              'copy',
            'click #ok-success':                        'okSuccess',

            // share
            'click #share-mail':                        'shareViaEmail',
            'click #share-face':                        'shareViaFacebook',
            'click #share-twitter':                     'shareViaTwitter',
            'click #share-wp':                          'shareViaWhatsApp',

            'click #btn-faq':                           'questions'
        },

        // Render the template elements
        render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            var self = this,
                variables = {
                    name: app.utils.Storage.getSessionItem('name'),
                    convertCaseStr: app.utils.tools.convertCase,
                    accountSections: this.getUserAccess(),
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

        pageCreate: function(e){
            var self = this;
            // removing any enter event
            //$('body').unbind('keypress');
            self.activateMenu(e);
            self.getUserCredits(e);

            $('#tags').tagsinput('add', '');
            $('body').on('keypress', function(e){
                if (e.which === 13 || e.keyCode === 13) {
                    const email = $('#email').val();
                    if (app.utils.tools.validateEmail(email)) {
                        $('#tags').tagsinput('add', email);
                        $('#email').val('');
                        $([document.documentElement, document.body]).animate({
                            scrollTop: $("#tags").offset().top-20
                        }, 1000);
                    } else {
                        showAlert('Error', 'Debe ingresar un correo electrónico válido.')
                    }
                }
            });
        },

        getUserCredits: function(e) {
            var self = this;
            var selectedAccountValue = app.utils.Storage.getSessionItem('selected-account-value');
            self.options.referrerModel.getCredits(selectedAccountValue,
                function (success) {
                    if (!success.hasError) {

                        var totalCredits = success.CreditItems[0].TotalCredits;
                        var totalRedeem = success.CreditItems[0].TotalRedeem;
                        var sumAvialable = success.CreditItems[0].TotalAvailable;

                        $('#totalCredits').html(totalCredits+'');
                        $('#totalRedeem').html(totalRedeem+'');
                        $('#sumAvialable').html('$'+sumAvialable);

                        self.getSharingMedia(e);
                    } else {
                        self.navigateReferSystem(e);
                        showAlert('Error', response.errorDisplay, 'Aceptar');
                    }
                },
                function (data, status, error) {
                    self.navigateReferSystem(e);
                    app.utils.network.errorRequest(data, status, error);
                });
        },

        getSharingMedia: function(e) {
            const self = this;
            self.options.referrerModel.getSharingMediaByUser(
                function (success) {
                    if (!success.hasError) {

                        if (success.objItems) {
                            var html = '';
                            success.objItems.forEach(function (item) {
                                if (item.socialMedia == 'facebook') {
                                    $('#share-face').val(item.linkCode);
                                } else if (item.socialMedia == 'twitter') {
                                    $('#share-twitter').val(item.linkCode);
                                } else if (item.socialMedia == 'whatsapp') {
                                    $('#share-wp').val(item.linkCode);
                                } else if (item.socialMedia == 'email') {
                                    $('#share-mail').val(item.linkCode);
                                } else if (item.socialMedia == 'web') {
                                    $('#share-link').val(item.linkCode);
                                    $('#share-link').html(item.linkCode);
                                    self.memberID = item.memberID;
                                }
                            });
                        }

                    } else {
                        self.navigateReferSystem(e);
                        showAlert('Error', response.errorDisplay, 'Aceptar');
                    }
                },
                function (data, status, error) {
                    self.navigateReferSystem(e);
                    app.utils.network.errorRequest(data, status, error);
                });
        },

        next: function(e) {
            const self = this;

            if ($('#tags').tagsinput('items').length == 0) {
                message = 'Debe ingresar al menos un correo electronico y pulsar enter.';
                showAlert('Error', message, 'Aceptar');
                return;
            }
            var check = $('#checkbox-terms').is(':checked');
            if (!check) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $("#tags").offset().top-20
                }, 1000);
                this.alertRequiredTerms();
                return
            }
            var emails = $('#tags').tagsinput('items').join(",", $('#tags').tagsinput('items'));
            $('#email').blur();
            var ReferrerData = app.utils.Storage.getSessionItem('referrer-data');
            var link = $('#share-link').val();
            self.options.referrerModel.sharedCoupons(self.memberID, ReferrerData.account, ReferrerData.subscriber, emails, link,
                function (success) {
                    if (!success.hasError) {
                        $('#tags').tagsinput('removeAll');
                        $('.popup-success').show();
                    } else {
                        showAlert('Error', success.errorDisplay, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            );
        },

        okSuccess: function(e) {
            $('.popup-success').hide();
         },

        showTerms: function(e) {
            var check = $('#checkbox-terms').is(':checked');
            if (check) {
                $('.popup-terms').show();
                $('#share-link').show();
            } else {
                $('#share-link').hide();
            }
        },

        closeTerms: function(e) {
            $('.popup-terms').hide();
        },

        invertCheckbox: function (e) {
            var self = this;
            var check = $('#checkbox-terms').is(':checked');
            $('#checkbox-terms').prop('checked', !check);
            self.showTerms(e);
        },

        copy: function(e) {
            var check = $('#checkbox-terms').is(':checked');
            if (check) {
                var copyText = $('#share-link').val();
                setClipboardText(copyText);
            } else {
                this.alertRequiredTerms();
            }
        },

        shareViaEmail: function (e) {
            var self = this;
            var check = $('#checkbox-terms').is(':checked');
            if (check) {
                window.plugins.socialsharing.shareViaEmail(
                    getMessage() + '\n\n'+ $('#share-mail').val(),
                    'Refiere y Gana',
                    null,
                    null,
                    null,
                    null,
                    null,
                    function(errormsg){self.onShareError('GMAIL o HOTMAIL')}
                );
            } else {
                this.alertRequiredTerms();
            }
        },

        shareViaFacebook: function (e) {
            var self = this;
            var check = $('#checkbox-terms').is(':checked');
            if (check) {
                window.plugins.socialsharing.shareViaFacebook(getMessage(),
                    null /* img */,
                    $('#share-face').val(),
                    null,
                    function(errormsg) {self.onShareError('Facebook')}
                );
            } else {
                this.alertRequiredTerms();
            }
        },

        shareViaTwitter: function (e) {
            var self = this;
            var check = $('#checkbox-terms').is(':checked');
            if (check) {
                window.plugins.socialsharing.shareViaTwitter(getMessage(),
                    null /* img */,
                    $('#share-twitter').val(),
                    null,
                    function(errormsg){self.onShareError('Twitter')}
                );
            } else {
                this.alertRequiredTerms();
            }
        },

        shareViaWhatsApp: function (e) {
            var self = this;
            var check = $('#checkbox-terms').is(':checked');
            if (check) {
                window.plugins.socialsharing.shareViaWhatsApp(getMessage(),
                    null /* img */,
                    $('#share-wp').val(),
                    null,
                    function(errormsg){self.onShareError('WhatsApp')}
                );
            } else {
                this.alertRequiredTerms();
            }
        },

        onShareError: function(name) {
            showAlert('' , 'Aplicación no instalada, vaya a su app store instale '+name+' y vuelva a intentar.', 'OK');
        },

        alertRequiredTerms: function () {
            showAlert('' , 'Debe seleccionar el campo de Términos y Condiciones para continuar.', 'OK');
        },

        questions: function(e) {
            //Go to next
            app.router.navigate('refiere_questions', {
                trigger: true
            });
        },
    });

    function getMessage() {
        var message = 'Usted ha sido referido para disfrutar de descuentos al activar tu cuenta con Claro. ' +
            'Para más información favor de acceder al siguiente enlace para redimir su cupón y/o visitar una de nuestras localidades.';
        return message;
    }

    function setClipboardText(text){
        var id = "mycustom-clipboard-textarea-hidden-id";
        var existsTextarea = document.getElementById(id);

        if(!existsTextarea){
            console.log("Creating textarea");
            var textarea = document.createElement("textarea");
            textarea.id = id;
            // Place in top-left corner of screen regardless of scroll position.
            textarea.style.position = 'fixed';
            textarea.style.top = 0;
            textarea.style.left = 0;

            // Ensure it has a small width and height. Setting to 1px / 1em
            // doesn't work as this gives a negative w/h on some browsers.
            textarea.style.width = '1px';
            textarea.style.height = '1px';

            // We don't need padding, reducing the size if it does flash render.
            textarea.style.padding = 0;

            // Clean up any borders.
            textarea.style.border = 'none';
            textarea.style.outline = 'none';
            textarea.style.boxShadow = 'none';

            // Avoid flash of white box if rendered for any reason.
            textarea.style.background = 'transparent';
            document.querySelector("body").appendChild(textarea);
            console.log("The textarea now exists :)");
            existsTextarea = document.getElementById(id);
        }else{
            console.log("The textarea already exists :3")
        }

        existsTextarea.value = text;
        existsTextarea.select();

        try {
            var status = document.execCommand('copy');
            if(!status){
                console.error("Cannot copy text");
            }else{
                console.log("The text is now on the clipboard");
            }
        } catch (err) {
            console.log('Unable to copy.');
        }
    }
});
