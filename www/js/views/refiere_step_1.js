$(function() {

    // Register step 1 View
    // ---------------

    app.views.RefiereStep1 = app.views.CommonView.extend({

        name: 'refiere_step_1',
        goTo: '',

        // The DOM events specific.
        events: {
            'pagecreate':                           'pageCreate',
            // content
            'click #btn-refiere':                   'refiere',
            'click #btn-redimir':                   'redimir',

            'click #next-update':                   'onNextUpdate',
            'click #cancel-update':                 'onCancelUpdate',
            'click #next-select':                   'onNextSelect',
            'click #cancel-select':                 'onCancelSelect',
            'click #next-balance-post':             'onNextBalancePost',
            'click #cancel-balance-post':           'onCancelBalancePost',
            'click #next-balance-pre':              'onNextBalancePre',
            'click #cancel-balance-pre':            'onCancelBalancePre',
            'click #icono_questions':               'questions',
            'click #cancel-cant':                   'onCancelCant',

            'change #select-account':				'changeAccount',
            'change #select-subscriber':			'changeSubscriber',

            'click #terminos':                      'showTerms',
            'click #close-terms':                   'closeTerms',
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

        pageCreate: function(e) {
            const self = this;
            // removing any enter event
            $('body').unbind('keypress');
            self.activateMenu(e);
        },

        changeAccount: function() {
            const self = this;
            const newAccountNumber = $.mobile.activePage.find('#select-account').val();

            const accounts = app.utils.Storage.getSessionItem('accounts-list');

            var selectedAccount = null;
            $.each(accounts, function (i, object) {
                if (object.Account == newAccountNumber) {
                    selectedAccount = object;
                }
            });

            $('.popup-select').hide();

            self.options.customerModel.accountDetails(
                selectedAccount.DefaultSubscriber,
                selectedAccount.Account,
                function (response) {
                    const subscribers = [];
                    $.each(response.SubscriberInfo, function (j, subscriberObj) {
                        var subscriber = {
                            subscriber: subscriberObj.subscriberNumberField,
                            Status: subscriberObj.subscriberStatusField,
                            ProductType: subscriberObj.productTypeField
                        };
                        subscribers[j] = subscriber;
                    });
                    selectedAccount.Subscribers = subscribers;
                    self.showPopupSelect(selectedAccount);
                },
                app.utils.network.errorRequest
            );
        },

        showPopupSelect: function(selectedAccount) {

            var self = this;

            var accounts = app.utils.Storage.getSessionItem('accounts-list');
            var selectedAccountValue = selectedAccount.Account;

            var htmlA = '';
            $.each(accounts, function (i, account) {
                htmlA += '<option value="'+account.Account+'"'+(selectedAccountValue==account.Account?' selected="selected"':'')+'>'+account.Account+'</option>\n'
            });

            var htmlS = '';
            $.each(selectedAccount.Subscribers, function (i, subscriber) {
                if (subscriber.Status != 'C') {
                    htmlS += '<option value="'+subscriber.subscriber+'"'
                        +(selectedAccount.DefaultSubscriber==subscriber.subscriber?' selected="selected"':'')
                        +'>'+subscriber.subscriber+'</option>\n';
                }
            });

            $('#select-account').html(htmlA);
            $('#select-subscriber').html(htmlS);

            $('.popup-select').show();

        },

        changeSubscriber: function(e) {

        },

        onNextBalancePost: function(e) {
            this.navigateInvoiceSummary();
        },

        onCancelBalancePost: function(e) {
            $('.popup-balance-post').hide();
        },

        onNextBalancePre: function(e) {
            this.navigateInvoiceSummary();
        },

        onCancelBalancePre: function(e) {
            $('.popup-balance-pre').hide();
        },

        onNextUpdate: function(e) {

            const idHobby = $.mobile.activePage.find('#select-hobby').val();
            const date = $('#date').val();
            const email = $('#email').val();
            const paperless = $('#radio-yes').is(':checked');

            if (!(idHobby > 0)) {
                showAlert('Error', 'Debe seleccionar un hobbie', 'ok');
                return;
            }
            if (date.length == 0 || email.length == 0) {
                showAlert('Error', 'Debe ingresar los datos solicitados.', 'ok');
                return;
            }
            if (!app.utils.tools.validateEmail(email)) {
                showAlert('Error', 'Debe ingresar un correo electrónico válido.', 'ok');
                return;
            }
            if (!paperless) {
                showAlert('Error', 'Esta opcion esta habilitada solo para usuarios con factura electronica activa.', 'ok');
                return;
            }

            var hobby = null;
            const hobbiesList = app.utils.Storage.getSessionItem('hobbiesList');
            $.each(hobbiesList, function (j, value) {
                if (value.idHobbies == idHobby) {
                    hobby = value;
                }
            });

            var ReferrerData = app.utils.Storage.getSessionItem('referrer-data');

            const accounts = app.utils.Storage.getSessionItem('accounts-list');
            var selectedAccount = null;

            $.each(accounts, function (i, object) {
                if (object.Account == ReferrerData.account) {
                    selectedAccount = object;
                }
            });
            console.log(selectedAccount);
            var referrerMember = {
                campaingID: 1,
                accountName: app.utils.Storage.getSessionItem('name'),
                account: ReferrerData.account,
                subscriber: ReferrerData.subscriber,
                accountSubType: selectedAccount.mAccountSubType,
                accountType: selectedAccount.mAccountType,
                productType: selectedAccount.mProductType,
                source: 'app',
                dob: date,
                hobby: hobby.hobbie,
                email: email,
                paperless: 'Y',
                token: app.utils.Storage.getSessionItem('token')
            };
            console.log(referrerMember);

            const self = this;
            self.options.customerModel.addMember(referrerMember,
                function (success) {
                    if (!success.hasError) {
                        showAlert('', 'Su perfil ha sido actualizado con éxito.', 'Continuar',
                            function (e) {
                                app.utils.Storage.setSessionItem('referred-valid-member-id', success.memberID);
                                app.router.navigate(self.goTo, {
                                    trigger: true
                                });
                            });
                    } else {
                        showAlert('Error', success.errorDisplay, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            );
        },

        onCancelUpdate: function(e) {
            $('.popup-update').hide();
        },

        onCancelCant: function(e) {
            $('.popup-cant').hide();
        },

        onNextSelect: function(e) {
            const self = this;
            const account = $.mobile.activePage.find('#select-account').val();
            const subscriber = $.mobile.activePage.find('#select-subscriber').val();

            if (!account) {
                showAlert('', 'Debes seleccionar un número de cuenta', 'ok');
                return;
            }
            if (!subscriber) {
                showAlert('', 'Debes seleccionar un número de telefono', 'ok');
                return;
            }

            $('.popup-select').hide();
            self.validateReferrer(e, account, subscriber)
        },

        onCancelSelect: function(e) {
            $('.popup-select').hide();
        },

        validateReferrer: function(e, account, subscriber) {
            const self = this;
            self.options.referrerModel.getValidateReferrer(account, subscriber,
                function (success) {
                    if (!success.hasError) {
                        var ReferrerData = {
                            balance: success.Balance,
                            paperless: success.Paperless,
                            registerUpdated: success.registerUpdated,
                            solvent: success.solvent,
                            account: account,
                            subscriber: subscriber,
                        };
                        app.utils.Storage.setSessionItem('referrer-data', ReferrerData);
                        if (!success.solvent) {
                            self.openPopupPay();
                        } else if (!success.Paperless) {
                            self.getMember(e, account, subscriber);
                        } else if (!success.registerUpdated) {
                            self.getMember(e, account, subscriber);
                        } else {
                            app.router.navigate(self.goTo, {
                                trigger: true
                            });
                        }
                    } else {
                        $('.popup-cant').show();
                    }
                },
                app.utils.network.errorRequest
            );
        },

        openPopupPay: function() {
            var ReferrerData = app.utils.Storage.getSessionItem('referrer-data');
            $('#balance-post').html(ReferrerData.balance);
            $('#value-balance-post').val(ReferrerData.balance);
            $('.popup-balance-post').show();
        },

        getMember: function(e, account, subscriber) {
            const self = this;
            self.options.customerModel.getMember(account,
                function (success) {
                    if (!success.hasError) {
                        app.utils.Storage.setSessionItem('referrer-member', success);
                        self.getListHobbies(e, account, subscriber);
                    } else {
                        showAlert('Error', success.errorDisplay, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            );
        },

        getListHobbies: function(e, account, subscriber) {
            const self = this;
            self.options.referrerModel.getHobbies(account,
                function (success) {
                    if (!success.hasError) {
                        app.utils.Storage.setSessionItem('hobbiesList', success.hobbiesList);
                        self.openPopupHobbies(e, success.hobbiesList);
                    } else {
                        showAlert('Error', success.errorDisplay, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            );
        },

        openPopupHobbies: function(e, hobbiesList) {
            var ReferrerData = app.utils.Storage.getSessionItem('referrer-data');

            var htmlH = '<option value="0">Seleccionar...</option>\n';
            $.each(hobbiesList, function (j, hobby) {
                htmlH += '<option value="'+hobby.idHobbies+'">'+hobby.hobbie+'</option>\n';
            });

            $('#select-hobby').html(htmlH);

            if (ReferrerData.paperless) {
                $('#radio-yes').prop("checked", true);
            } else {
                $('#radio-no').prop("checked", true);
            }
            $('.popup-update').show();
        },

        refiere: function(e) {
            //Go to refiere
            this.goTo = 'refiere_step_2';
            this.showPopupSelect(app.utils.Storage.getSessionItem('selected-account'));
        },

        redimir: function(e) {
            //Go to redimir
            this.goTo = 'refiere_step_3';
            this.showPopupSelect(app.utils.Storage.getSessionItem('selected-account'));
        },

        questions: function(e) {
            //Go to next
            app.router.navigate('refiere_questions', {
                trigger: true
            });
        },

        showTerms: function(e) {
            $('.popup-term').show();
        },

        closeTerms: function(e) {
            $('.popupbg').hide();
        },
    });

});
