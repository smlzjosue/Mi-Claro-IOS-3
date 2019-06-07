$(function() {

    // Fixed Failure Report View
    // ---------------

    app.views.FixedFailureReportView = app.views.CommonView.extend({

        name: 'fixed_failure_report',

        deviceSwiper: null,

        // The DOM events specific.
        events: {

            // events
            'pagecreate': 'pageCreate',
            'active': 'active',
            // header
            'click .btn-back': 'goDevice',
            'click .btn-menu': 'menu',
            'click .btn-chat': 'chat',
            'click .btn-ok': 'device',

            // content
            //'change #select-account': 'changeAccountInfo',
            //'click .select-subscriber': 'changeSubscriber',
            'click #return-1': 'goToStep1',
            'click #continue-1': 'goToStep2',
            'click #continue-2': 'goToStep3',
            'click .input-check-container': 'selectNewType',

            // nav menu
            'click #close-nav':							'closeMenu',
            'click .close-menu':						'closeMenu',
            'click .open-menu':						    'openMenu',
            'click .btn-account':                       'account',
            'click .btn-consumption':                   'consumption',
            'click .btn-service':                       'service',
            'click .btn-change-plan':                   'changePlan',
            'click .btn-add-aditional-data':            'aditionalDataPlan',
            'click .btn-device':                        'device',
            'click .btn-profile':                       'profile',
            'click .btn-gift':                          'giftSend',
            'click .btn-invoice':                       'invoice',
            'click .btn-notifications':	                'notifications',
            'click .btn-sva':                           'sva',
            'click .btn-gift-send-recharge':            'giftSendRecharge',
            'click .btn-my-order':                      'myOrder',
            'click .btn-logout':                        'logout',
            'click .select-menu':						'clickMenu',

            // footer
            'click #btn-help': 'helpSection',

            // focus
            'focus #fixed-failure-comment': 'focus',
            'focusout #fixed-failure-comment': 'focusOut'

        },

        // Render the template elements
        render: function(callback) {

            var self = this,
                selectedAccount = app.utils.Storage.getSessionItem('selected-account');

            console.log('subscriber------>'+app.utils.Storage.getSessionItem('selected-subscriber-value'));

            // user hasn't logged in
            if (app.utils.Storage.getSessionItem('token') == null) {

                document.location.href = 'index.html';

            } else {

                var subscribers = app.utils.Storage.getSessionItem('subscribers');
                var step = app.utils.Storage.getSessionItem('fixed-failure-report-step');

                // format amount
                $.each(subscribers, function(index, value) {
                    var totalRate = value.TotalRate;
                    totalRate = totalRate.replace('$', '');

                    // New format amount value
                    var newAmountValue = totalRate.split(".");

                    value.NewAmountValue = newAmountValue;
                });

                if (!step) {
                    app.utils.Storage.setSessionItem('fixed-failure-report-step', 'step1');
                    step = 'step1';
                }

                app.utils.Storage.setSessionItem('subscribers', subscribers);

                var self = this,
                    variables = {
                        accounts: app.utils.Storage.getSessionItem('accounts-list'),
                        subscribers: app.utils.Storage.getSessionItem('subscribers'),
                        selectedAccountValue: app.utils.Storage.getSessionItem('selected-account-value'),
                        selectedSubscriber: app.utils.Storage.getSessionItem('selected-subscriber-value'),
                        wirelessAccount: (selectedAccount.prodCategory == 'WLS'),
                        typeOfTelephony: app.utils.tools.typeOfTelephony,
                        showStep1: (step == 'step1'),
                        showStep2: (step == 'step2'),
                        showStep3: (step == 'step3'),
                        typeReport: app.utils.Storage.getSessionItem('fixed-failure-report-type'),
                        detailReport: app.utils.Storage.getSessionItem('fixed-failure-report-detail'),
                        accountAccess: this.getUserAccess(),
                        convertCaseStr: app.utils.tools.convertCase,
                        showBackBth: true
                    };

                app.TemplateManager.get(self.name, function(code) {
                    var template = cTemplate(code.html());
                    $(self.el).html(template(variables));
                    callback();
                    return this;
                });
            }
        },

        pageCreate: function(e) {
            var self = this,
                type = '',
                detail = '';

            var subscribers = app.utils.Storage.getSessionItem('subscribers');
            if (subscribers.length == 1) {
                $('.select-subscriber').eq(0).trigger('click');
            }

            // allow only number
            $.mobile.activePage.on("input", "#contact-number-a, #contact-number-b", function() {
                this.value = this.value.replace(/[^0-9]/g,'');
            });

            var step = app.utils.Storage.getSessionItem('fixed-failure-report-step');

            if (!step || step == 'step1') {
                app.utils.Storage.setSessionItem('fixed-failure-report-step', 'step1');
                step = 'step1';
                $('.tr-step-i').addClass('on');
                $('.tr-step-ii').removeClass('on');
                $('.tr-step-iii').removeClass('on');
                $('.btn-back').show();
            } else if (step == 'step2') {
                $('.tr-step-i').removeClass('on');
                $('.tr-step-ii').addClass('on');
                $('.tr-step-iii').removeClass('on');
                $('.btn-back').show();
            } else if (step == 'step3') {
                $('.tr-step-i').removeClass('on');
                $('.tr-step-ii').removeClass('on');
                $('.tr-step-iii').addClass('on');
                $('.btn-back').hide();
            }

            // allow only number
			$.mobile.activePage.on('input', '#contact-number-a, #contact-number-a', function() {
			    this.value = this.value.replace(/[^0-9]/g,'');
			});
        },

        goToStep1: function(e) {
            var self = this;
            type = $('input[name=type]:checked').val();

            app.utils.Storage.setSessionItem('fixed-failure-report-type', '');
            app.utils.Storage.setSessionItem('fixed-failure-report-detail', '');
            app.utils.Storage.setSessionItem('fixed-failure-report-step', 'step1');

            self.render(function() {
                $.mobile.activePage.trigger('pagecreate');
            });
        },

        goToStep2: function(e) {
            var self = this;
            type = $('input[name=type]:checked').val();

            if (type) {
                app.utils.Storage.setSessionItem('fixed-failure-report-type', type);
                app.utils.Storage.setSessionItem('fixed-failure-report-step', 'step2');

                console.log('------------------------------------');
                console.log('Type = ' + app.utils.Storage.getSessionItem('fixed-failure-report-type'));
                console.log('Step = ' + app.utils.Storage.getSessionItem('fixed-failure-report-step'));
                console.log('------------------------------------');

                self.render(function() {
                    $.mobile.activePage.trigger('pagecreate');
                });
            } else {
                showAlert('Error', 'Debe seleccionar el tipo de averia para continuar', 'Aceptar');
            }
        },

        goToStep3: function(e) {
            var self = this;
            detail = $('input[name=onlyLine]:checked').val();
            if (!detail) {
                detail = $('input[name=lineDSL]:checked').val();
            }

            if (detail) {
                app.utils.Storage.setSessionItem('fixed-failure-report-detail', detail);
                app.utils.Storage.setSessionItem('fixed-failure-report-step', 'step3');

                fixedFailureComment = $.mobile.activePage.find('#fixed-failure-comment').val();
                contactNumber1 = $.mobile.activePage.find('#contact-number-a').val();
                contactNumber2 = $.mobile.activePage.find('#contact-number-b').val();

                if(contactNumber1 && fixedFailureComment){
                    app.utils.Storage.setSessionItem('fixed-failure-report-comment', fixedFailureComment);

                    self.render(function() {
                        $.mobile.activePage.trigger('pagecreate');
                    });

                    // send data to services
                    var subscriberModel = new app.models.Subscriber();

                    var requestFailureReport = {
                        accountNumber: app.utils.Storage.getSessionItem('selected-account-value'),
                        accountType: app.utils.Storage.getSessionItem('selected-account').mAccountType,
                        accountSubType: app.utils.Storage.getSessionItem('selected-account').mAccountSubType,
                        productType: 'O',
                        subscriber: app.utils.Storage.getSessionItem('selected-subscriber-value'),
                        message: detail + ' | ' + app.utils.Storage.getSessionItem('fixed-failure-report-type') + ' | ' + fixedFailureComment,
                        contactNumber1: contactNumber1,
                        contactNumber2: contactNumber2
                    };


                    console.log(requestFailureReport);

                    subscriberModel.sendFailure(
                        // parameters
                        requestFailureReport,
                        // success callback
                        function(success) {

                            // Delete sessions variables
                            app.utils.Storage.removeSessionItem('fixed-failure-report-type');
                            app.utils.Storage.removeSessionItem('fixed-failure-report-detail');
                            app.utils.Storage.removeSessionItem('fixed-failure-report-step');
                            app.utils.Storage.removeSessionItem('fixed-failure-report-comment');

                            if (success.hasError) {
                                // show alert
                                                         showAlert(
                                    'Error',
                                    'Hubo un error al crear el reporte por favor intente más tarde',
                                    'Aceptar',
                                    function(e) {
                                          app.router.navigate('fixed_failure_report', {trigger: true});
                                    }
                                );
                            }

                        },
                        // error callback
                        app.utils.network.errorFunction
                    );
                } else if (!contactNumber1.length > 0) {
                       message = 'Debe ingresar un número de contacto';
                       showAlert('Error', message, 'Aceptar', function() {});
                       return;
                } else if (contactNumber1.length !== 10) {
                       message = 'Formato de teléfono invalido. Favor ingresar los 10 números de teléfono.';
                       showAlert('Error', message, 'Aceptar', function() {});
                       return;
                } else if (contactNumber2 && contactNumber2.length !== 10) {
                       message = 'Formato de teléfono invalido. Favor ingresar los 10 números de teléfono.';
                       showAlert('Error', message, 'Aceptar', function() {});
                       return;
                } else {
                        showAlert('Error', 'Debe ingresar un número de contacto y una breve explicación de lo que desea reportar para continuar', 'Aceptar');
                }
            } else {
                showAlert('Error', 'Debe seleccionar el detalle de averia para continuar', 'Aceptar');
            }

        },

        changeAccountInfo: function(e) {

            var self = this,
                accountNumber = null,
                analytics = null;

            app.utils.Storage.setSessionItem('selected-account-value', $.mobile.activePage.find('#select-account').val());
            accountNumber = app.utils.Storage.getSessionItem('selected-account-value');

            if (analytics != null) {
                // send GA statistics
                analytics.trackEvent('select', 'change', 'select account number', accountNumber);
            }

            $.each(app.utils.Storage.getSessionItem('accounts-list'), function(index, value) {
                if (value.Account == app.utils.Storage.getSessionItem('selected-account-value')) {
                    app.utils.Storage.setSessionItem('selected-account', value);
                }
            });

            if (app.utils.Storage.getSessionItem('subscribers-' + accountNumber) == null) {

                this.options.accountModel.getAccountSubscribers(
                    //parameter
                    app.utils.Storage.getSessionItem('token'),
                    app.utils.Storage.getSessionItem('selected-account-value'),

                    //success callback
                    function(data) {
                        console.log('#success ws service');

                        if (!data.HasError) {
                            app.utils.Storage.setSessionItem('subscribers', data.Subscribers);

                            app.utils.Storage.setSessionItem('subscribers-' + accountNumber, data.Subscribers);

                            self.render(function() {
                                $.mobile.activePage.trigger('pagecreate');
                            });

                        } else {

                            showAlert('Error', data.Desc, 'Aceptar');

                        }

                    },

                    // error function
                    app.utils.network.errorFunction
                );

            } else {

                app.utils.Storage.setSessionItem('subscribers', app.utils.Storage.getSessionItem('subscribers-' + accountNumber));

                self.render(function() {
                    $.mobile.activePage.trigger('pagecreate');
                });

            }

        },

        changeSubscriber: function(e) {
            var subscriberValue = $(e.currentTarget).data('subscribers'),
                subscriberModel = new app.models.Subscriber();


            if ($(e.currentTarget).data('search-info') == true) {
                // set flag search data
                $(e.currentTarget).data('search-info', false);
            } else {
                // set flag search data
                $(e.currentTarget).data('search-info', true);
            }
        },

        selectNewType: function(e) {
            // remove all selected input
            $('.input-check-container').removeClass('on');

            // uncheck all the inputs
            $('input[type="checkbox"].css-checkbox').each(function() {
                $(this).prop('checked', false);
            });

            //check the input
            $(e.currentTarget).find('input[type="checkbox"].css-checkbox').prop('checked', true);

            $(e.currentTarget).addClass('on');

        },

        goDevice: function(e) {
            var confirmMessage = 'Esta seguro que desea salirse de Reportar Avería';

            showConfirm('Reportar Avería', confirmMessage, ['Aceptar', 'Cancelar'],
                function(result) {
                    if (result == 1) {
                        // Delete sessions variables
                        if (app.utils.Storage.getSessionItem('fixed-failure-report-type'))
                            app.utils.Storage.removeSessionItem('fixed-failure-report-type');
                        if (app.utils.Storage.getSessionItem('fixed-failure-report-detail'))
                            app.utils.Storage.removeSessionItem('fixed-failure-report-detail');
                        if (app.utils.Storage.getSessionItem('fixed-failure-report-step'))
                            app.utils.Storage.removeSessionItem('fixed-failure-report-step');
                        if (app.utils.Storage.getSessionItem('fixed-failure-report-comment'))
                            app.utils.Storage.removeSessionItem('fixed-failure-report-comment');

                        app.router.navigate('device', {
                            trigger: true
                        });
                    }
                }
            );
        }

    });
});
