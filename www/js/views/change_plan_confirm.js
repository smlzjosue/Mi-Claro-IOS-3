$(function() {

    // Register step 1 View
    // ---------------

    app.views.ChangePlanConfirmView = app.views.CommonView.extend({

        name: 'change_plan_confirm',

        // The DOM events specific.
        events: {

            // events
            'pagecreate':                               'pageCreate',

            // Content
            'click #link-terms':                        'showTerms',
            'click #close-terms':                       'closeTerms',
            'click #radioG1':                           'selectRadio1',
            'click #radioC1':                           'selectRadio1',
            'click #radioG2':                           'selectRadio2',
            'click #radioC2':                           'selectRadio2',
            'click #radioPG1':                          'selectRadioP1',
            'click #radioPC1':                          'selectRadioP1',
            'click #radioPG2':                          'selectRadioP2',
            'click #radioPC2':                          'selectRadioP2',
            'change #checkbox-terms':                   'validateNext',
            'click #btn-next':                          'next',
            'click #btn-return':                        'return'
        },

        // Render the template elements
        render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            var accountInfo = app.utils.Storage.getSessionItem('account-info');
            var subscriber = app.utils.Storage.getSessionItem('change-plan_subscriber');
            var selectedPlan = app.utils.Storage.getSessionItem('change-plan_selected-plan');

            var currentDate = parseCurrentDate();
            var nextDate = parseCurrentDate(accountInfo.cycleEndDateField);

            const dsl = accountInfo.accountSubtypeField == 'W' && accountInfo.accountTypeField == 'I' && subscriber.productTypeField == 'O';

            const prepaid = app.utils.tools.accountIsPrepaid(accountInfo.accountTypeField,
                accountInfo.accountSubtypeField, subscriber.productTypeField);

            var self = this,
                variables = {
                    currentDate: currentDate,
                    nextDate: nextDate,
                    subscriberObj: subscriber,
                    dsl: dsl,
                    prepaid: prepaid,
                    dslMonths: subscriber.planInfoField.mCommitmentOrigNoMonthField,
                    currentPlan: subscriber.planInfoField.sOCDescriptionField,
                    currentRent: subscriber.planInfoField.socRateField,
                    selectedPlan: selectedPlan.description,
                    selectedRent: selectedPlan.rent,
                    amountIvu: 0,
                    totalAmount: selectedPlan.rent,
                    typeOfTelephony: app.utils.tools.typeOfTelephony,
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
            $(document).scrollTop();
        },

        pageCreate: function(e) {
            var self = this;
            self.activateMenu(e);
            $('#nav-open').hide();

            if (self.isCurrentAccountPrepaid()) {
                $('#checkbox-terms').prop('checked', true);
                self.validateNext(e);
                $('#container-terms').hide();
            }
        },

        showTerms: function(e) {
            $('.popup-terms').show();
        },

        closeTerms: function(e) {
            $('.popup-terms').hide();
        },

        selectRadio1: function (e) {
            $('#radioG1').prop('checked', true);
            $('#radioC1').addClass("on");

            $('#radioG2').prop('checked', false);
            $('#radioC2').removeClass("on");
        },

        selectRadio2: function (e) {
            $('#radioG2').prop('checked', true);
            $('#radioC2').addClass("on");

            $('#radioG1').prop('checked', false);
            $('#radioC1').removeClass("on");
        },

        selectRadioP1: function (e) {
            $('#radioPG1').prop('checked', true);
            $('#radioPC1').addClass("on");

            $('#radioPG2').prop('checked', false);
            $('#radioPC2').removeClass("on");
        },

        selectRadioP2: function (e) {
            $('#radioPG2').prop('checked', true);
            $('#radioPC2').addClass("on");

            $('#radioPG1').prop('checked', false);
            $('#radioPC1').removeClass("on");
        },

        validateNext: function (e) {
            var check = $('#checkbox-terms').is(':checked');
            if (check) {
                $('#btn-next').removeClass('gray');
                $('#btn-next').addClass('red');
                $('#btn-next').addClass('rippleR');
            } else {
                $('#btn-next').removeClass('red');
                $('#btn-next').removeClass('rippleR');
                $('#btn-next').addClass('gray');
            }
        },

        return: function (e) {
            var self = this;

            self.back(e);
        },

        next: function (e) {
            var self = this;

            var check = $('#checkbox-terms').is(':checked');
            if (!check) {
                message = 'Debe seleccionar el campo de Términos y Condiciones para continuar.';
                showAlert('' , message, 'OK');
                return;
            }

            var accountInfo = app.utils.Storage.getSessionItem('account-info');
            var subscriber = app.utils.Storage.getSessionItem('change-plan_subscriber');
            var selectedPlan = app.utils.Storage.getSessionItem('change-plan_selected-plan');

            const prepaid = app.utils.tools.accountIsPrepaid(accountInfo.accountTypeField,
                accountInfo.accountSubtypeField, subscriber.productTypeField);

            if (prepaid) {

                if (parseFloat(self.getCurrentAccountPrepaidBalance()) >= parseFloat(selectedPlan.rent)) {
                    self.options.customerModel.validateAccount(
                        String(accountInfo.bANField),
                        accountInfo.accountTypeField,
                        accountInfo.accountSubtypeField,
                        subscriber.subscriberNumberField,
                        function(success) {
                            if (success.success) {
                                self.options.offerModel.updatePrepaidSubscriberPlan(
                                    String(selectedPlan.rent),
                                    selectedPlan.name,
                                    false, //no se sabe de donde sale esta variable
                                    selectedPlan.soc,
                                    subscriber.planInfoField.sOCInfoField,
                                    accountInfo.accountTypeField,
                                    accountInfo.accountSubtypeField,
                                    String(accountInfo.bANField),
                                    subscriber.subscriberNumberField,
                                    function(response) {
                                        if (response.success) {
                                            app.utils.Storage.setSessionItem('change-plan_order-id', response.idTransaction);
                                            app.router.navigate('change_plan_success', {
                                                trigger: true,
                                                replace: true
                                            });
                                        } else {
                                            showAlert('Error', response.error, 'Aceptar');
                                        }
                                    },
                                    // error function
                                    app.utils.network.errorRequest
                                );
                            } else {
                                showAlert('Error', success.error, 'Aceptar');
                            }
                        },
                        // error function
                        app.utils.network.errorRequest
                    );
                } else {
                    showConfirm('Balance Insuficiente', 'Estimado cliente debe recargar para poder ' +
                        'aplicar el cambio de plan.', ['Recargar', 'Cancelar'], function (index) {
                        if (index == 1) {
                            self.getAddress(e);
                        }
                    })
                }
            } else {
                const dsl = accountInfo.accountSubtypeField == 'W' && accountInfo.accountTypeField == 'I'
                    && subscriber.productTypeField == 'O';

                if (dsl) {
                    var months12 = $('#radioPG1').is(':checked');
                    self.options.offerModel.updateSubscriberDSLPlan(
                        selectedPlan.soc,
                        subscriber.planInfoField.socRateField+''/*CASTING TO STRING*/,
                        'Y',
                        months12 ? '12months' : '24months',
                        subscriber.productTypeField,
                        subscriber.subscriberNumberField,
                        accountInfo.bANField+''/*CASTING TO STRING*/,
                        function(success) {
                            if (success.HasError) {
                                showAlert('Error', success.ErrorDesc, 'Aceptar');
                            } else {
                                app.utils.Storage.setSessionItem('change-plan_order-id', success.idTransaction);
                                app.router.navigate('change_plan_success', {
                                    trigger: true,
                                    replace: true
                                });
                            }
                        },
                        // error function
                        app.utils.network.errorRequest
                    );
                } else {
                    var currentDate = $('#radioG1').is(':checked');
                    if (currentDate) {
                        self.options.offerModel.updateSubscriberPlan(
                            selectedPlan.soc,
                            subscriber.planInfoField.sOCInfoField,
                            subscriber.productTypeField,
                            subscriber.subscriberNumberField,
                            function(success) {
                                if (success.HasError) {
                                    showAlert('Error', success.ErrorDesc, 'Aceptar');
                                } else {
                                    app.utils.Storage.setSessionItem('change-plan_order-id', success.idTransaction);
                                    app.router.navigate('change_plan_success', {
                                        trigger: true,
                                        replace: true
                                    });
                                }
                            },
                            // error function
                            app.utils.network.errorRequest
                        );
                    } else {
                        self.options.offerModel.updateSubscriberPlanNextCycle(
                            selectedPlan.soc,
                            subscriber.planInfoField.sOCInfoField,
                            subscriber.productTypeField,
                            subscriber.subscriberNumberField,
                            accountInfo.bANField+''/*CASTING TO STRING*/,
                            function(success) {
                                if (success.HasError) {
                                    showAlert('Error', success.ErrorDesc, 'Aceptar');
                                } else {
                                    app.utils.Storage.setSessionItem('change-plan_order-id', success.idTransaction);
                                    app.router.navigate('change_plan_success', {
                                        trigger: true,
                                        replace: true
                                    });
                                }
                            },
                            // error function
                            app.utils.network.errorRequest
                        );
                    }
                }
            }
        },

        getAddress: function(e) {
            var self = this;
            const selectedSubscriberValue = app.utils.Storage.getSessionItem('selected-subscriber-value');
            self.options.paymentModel.listPrepaidAddress(
                selectedSubscriberValue,
                function (response) {
                    if (response.success == true) {
                        app.utils.Storage.setSessionItem('prepaid-address', response.address);
                        self.getPaymentsType(e);
                    } else {
                        showAlert('Error', 'Disculpe, no cuenta con recargas disponibles.', 'Aceptar',
                            function () { self.back(e);
                            });
                    }
                },
                function () {
                    showAlert('Error', 'Disculpe, no se puede obtener su informacion para la recarga.', 'Aceptar',
                        function () { self.back(e);
                        });
                }
            );
        },

        getPaymentsType: function(e) {
            var self = this;
            const selectedSubscriberValue = app.utils.Storage.getSessionItem('selected-subscriber-value');
            self.options.paymentModel.listPrepaidPaymentsType(
                selectedSubscriberValue,
                function (response) {
                    if (response.success == true) {
                        app.utils.Storage.setSessionItem('prepaid-payments-type', response.formPaymentTypes);
                        self.getProducts(e);
                    } else {
                        showAlert('Error', 'Disculpe, no cuenta con recargas disponibles.', 'Aceptar',
                            function () { self.back(e);
                            });
                    }
                },
                function () {
                    showAlert('Error', 'Disculpe, no se puede obtener su informacion para la recarga.', 'Aceptar',
                        function () { self.back(e);
                        });
                }
            );
        },

        getProducts: function(e) {
            var self = this;
            const selectedSubscriberValue = app.utils.Storage.getSessionItem('selected-subscriber-value');
            self.options.paymentModel.listProductService(
                selectedSubscriberValue, 2,
                function (response) {
                    if (response.success == true) {
                        app.utils.Storage.setSessionItem('prepaid-products', response.formProducts);
                        self.goRecharge(response.formProducts);
                    } else {
                        showAlert('Error', 'Disculpe, no cuenta con recargas disponibles.', 'Aceptar',
                            function () { self.back(e);
                            });
                    }
                },
                function () {
                    showAlert('Error', 'Disculpe, no se puede obtener su informacion para la recarga.', 'Aceptar',
                        function () { self.back(e);
                        });
                }
            );
        },

        goRecharge: function (listProducts) {

            var iva = 0.115;
            var id = 24;
            listProducts.forEach(function(product) {
                if (product.productName == 'Otro monto') {
                    iva = product.ivuState;
                    id = product.idProduct;
                }
            });

            var accountInfo = app.utils.Storage.getSessionItem('account-info');
            var subscriber = app.utils.Storage.getSessionItem('change-plan_subscriber');
            var selectedPlan = app.utils.Storage.getSessionItem('change-plan_selected-plan');

            var amount = parseFloat(selectedPlan.rent)-parseFloat(self.getCurrentAccountPrepaidBalance());
            const recharge = {
                subscriber: subscriber.subscriberNumberField,
                account: String(accountInfo.bANField),
                iva: iva,
                id: id,
                amount: app.utils.tools.formatAmount(amount),
                amountIvu: app.utils.tools.formatAmount(amount*iva),
                totalAmount: app.utils.tools.formatAmount((amount*iva)+amount)
            };

            app.utils.Storage.setSessionItem('prepaid-recharge_select-product', recharge);

            app.router.navigate('recharge_prepaid_confirm', {
                trigger: true,
                replace: true
            });
        }
    });

    function parseCurrentDate(date) {
        if (date) {
            date = new Date(date);
        } else {
            date = new Date();
        }
        var month = date.getMonth();
        var dayOfMonth = date.getDate();
        var dayOfWeek = date.getDay();
        var year = date.getFullYear();
        var daysList = new Array('Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado');
        var monthList = new Array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
        return daysList[dayOfWeek] + ", " + dayOfMonth + " de " + monthList[month] + " de " + year;
    }
});
