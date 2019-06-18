$(function() {

    // Manage Notifications View
    // ---------------

    app.views.ManageNotificationsView = app.views.CommonView.extend({

        name: 'manage_notifications',

        // The DOM events specific.
        events: {

            //events
            'pagecreate':                               'pageCreate',

            // Content
            'change #select-account':                   'simpleChangeAccount',
            'click .select-subscriber':                 'changeSubscriber'

        },

        // Render the template elements
        render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            var subscribers = app.utils.Storage.getSessionItem('subscribers-info');

            var self = this,
                variables = {
                    typeOfTelephony: app.utils.tools.typeOfTelephony,
                    subscribers: subscribers,
                    accounts: this.getSelectTabAccounts(),
                    formatNumber: app.utils.tools.formatSubscriber,
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

            var subscribers = app.utils.Storage.getSessionItem('subscribers-info');
            if (subscribers.length == 1) {
                $('.select-subscriber').eq(0).trigger('click');
            }
        },

        changeSubscriber: function(e) {
            var self = this;

            var currentIndex = $(e.currentTarget).data('index'),
                subscribers = app.utils.Storage.getSessionItem('subscribers-info'),
                subscriber = subscribers[currentIndex];

            var htmlID = '#subscriber'+currentIndex;

            $(e.currentTarget).toggleClass('mon');

            if ($(e.currentTarget).data('search-info') == true) {
                $(e.currentTarget).data('search-info', false);
                $(htmlID).find('.btn-save').unbind('click');
                return;
            }
            $(e.currentTarget).data('search-info', true);

            var accountInfo = app.utils.Storage.getSessionItem('account-info');

            self.options.userModel.getPersonalAlertsStatus(
                accountInfo.bANField+'',
                subscriber.subscriberNumberField+'',
                function(success) {
                    if (!success.HasError) {
                        self.setData(htmlID, accountInfo, subscriber, success);
                    } else {
                        showAlert('Error', response.response, 'Aceptar');
                    }
                },
                // error function
                app.utils.network.errorRequest
            );
        },

        setData: function (htmlID, accountInfo, subscriber, response) {
            var self = this;
            var html = '';
            const selectedAccount = app.utils.Storage.getSessionItem('selected-account')
            response.QuestionList.forEach(function(question) {
                var disabled = '';
                if (question.Question.includes('impresa en papel')) {
                    disabled = ' style="display: none"';
                }
                if (app.utils.tools.accountIsTelephony(
                        selectedAccount.mAccountType,
                        selectedAccount.mAccountSubType,
                        selectedAccount.mProductType)
                    && question.Question.includes('SMS')) {
                    disabled = ' style="display: none"';
                }
                html +=
                    '<div class="basicrow m-top" '+disabled+'>\n' +
                    '\t<label><input type="checkbox" ' +
                        (question.Checked ? 'checked="checked"' : '') + ' ' +
                        'data-question-id="'+question.QuestionID+'" ' +
                        '> ' + question.Question + ' </label>\n' +
                    '</div>\n';
            });

            $(htmlID).find('.questions-list').html(html);
            $(htmlID).find('.list-no-call').html(response.response);
            $(htmlID).find('.text-no-call').html(response.status);

            $(htmlID).find('.btn-no-call').on('click', function () {
                self.options.userModel.updateNotToCall(
                    accountInfo.bANField+'',
                    subscriber.subscriberNumberField+'',
                    response.status,
                    function(response) {
                        if (!response.HasError) {
                            showAlert('', 'Se ha cambiado el estado de NO LLAMAR con exito.', 'Aceptar'); // TODO, revisar respuesta
                            response.status = 'Inactivar';
                            response.response = 'Este suscriptor se encuentra en la lista \'No Llamar\' con estatus de \'Inactivo\'. Su vigencia es entre 11/28/2018 a 11/27/2023';
                            $(htmlID).find('.list-no-call').html(response.response);
                            $(htmlID).find('.text-no-call').html(response.status);
                        } else {
                            showAlert('Error', response.response, 'Aceptar');
                        }
                    },
                    // error function
                    app.utils.network.errorRequest
                );
            });

            $(htmlID).find('.btn-save').on('click', function () {
                var mvar = '';
                $(htmlID).find("input[type='checkbox']").each(function() {
                    mvar += $(this).data('questionId') + ':' + ($(this).is(":checked") ? 'Y,' : 'N,');
                });
                if (mvar.length > 0) {
                    mvar = mvar.substring(0,mvar.length-1);

                    self.options.userModel.updateAlerts(
                        accountInfo.bANField+'',
                        subscriber.subscriberNumberField+'',
                        mvar,
                        function(response) {
                            if (!response.HasError) {
                                showAlert('', 'Se ha cambiado el estado de las notificaciónes con exito.', 'Aceptar'); // TODO, revisar respuesta
                            } else {
                                showAlert('Error', response.response, 'Aceptar');
                            }
                        },
                        // error function
                        app.utils.network.errorRequest
                    );
                }

            });
        }
    });
});