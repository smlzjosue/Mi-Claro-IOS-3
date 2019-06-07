$(function() {

    // Register step 1 View
    // ---------------

    app.views.RechargePrepaidView = app.views.CommonView.extend({

        name: 'recharge_prepaid',

        // The DOM events specific.
        events: {
            // events
            'pagecreate':                           'pageCreate',

            'click #container-other':               'otherAmount',

            'click #next':                          'continue',
            'click #cancel':                        'navigateHome'
        },

        // Render the template elements
        render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            const amountPlan = this.getCurrentAccountPrepaidPlanInfo().socRateField;

            var self = this,
                variables = {
                    selectedSubscriberValue: app.utils.Storage.getSessionItem('selected-subscriber-value'),
                    amountPlan: app.utils.tools.formatAmount(amountPlan),
                    accounts: this.getSelectTabAccounts(),
                    prepaidBalance: this.getCurrentAccountPrepaidBalance(),
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

            self.getAddress(e);
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
                        self.setupData(response.formProducts);
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

        setupData: function(list) {
            var html = '';
            $.each(list, function(index, offer) {
                if (offer.idProduct != 24) {
                    html += '<div class="mnts-rcrg">\n' +
                        '\t\t\t\t\t\t\t\t\t\t<div class="checkrcrg">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t<input type="radio" name="radioR" id="radioG'+index+'" class="css-radio" value="'+offer.amountRecharge+'" data-iva="'+offer.ivuState+'" data-id="'+offer.idProduct+'"><label for="radioG'+index+'" class="css-label3 radGroup1"></label>\n' +
                        '\t\t\t\t\t\t\t\t\t\t</div>\n' +
                        '\n' +
                        '\t\t\t\t\t\t\t\t\t\t'+offer.productName+'\n' +
                        '\t\t\t\t\t\t\t\t\t</div>\n';
                } else {
                    $('#radioPlan').data('id', offer.idProduct);
                    $('#radioPlan').data('iva', offer.ivuState);

                    $('#radioOther').data('id', offer.idProduct);
                    $('#radioOther').data('iva', offer.ivuState);
                }
            });
            $('#container_recharge').html(html);


            $('.mnts-rcrg').on('click', function (e) {
                $('.mnts-rcrg').removeClass('on');
                $(e.currentTarget).addClass('on');
                $(e.currentTarget).find('input').prop("checked", true);
                $('#input-other').prop('disabled', true);
                $('#input-other').val('0.00');
            });
        },

        otherAmount: function(e) {
            var check = $('#radioOther').is(':checked');
            if (!check) {
                $('#radioOther').prop("checked", true);
                $('.mnts-rcrg').removeClass('on');
                $('#input-other').prop('disabled', false);
                $('#input-other').focus();
                $('#input-other').val('');

                $([document.documentElement, document.body]).animate({
                    scrollTop: $("#radioOther").offset().top - 20
                }, 1000);
            }
        },

        continue: function (e) {
            var amount = 0;
            var check = $('#radioOther').is(':checked');
            if (check) {
                amount = $('#input-other').val();
                if (String(amount) == '') {
                    showAlert('Error', 'Debe ingresar un monto valido', 'OK', function () {
                        $('#input-other').focus();
                    });
                    return;
                }
                if (parseFloat(amount) < 5) {
                    showAlert('Error', 'El monto de recarga no puede ser menor a $5.00', 'OK', function () {
                        $('#input-other').focus();
                    });
                    return;
                }
                if (parseFloat(amount) > 150) {
                    showAlert('Error', 'El monto de recarga no puede ser mayor a $150.00', 'OK', function () {
                        $('#input-other').focus();
                    });
                    return;
                }
                amount = parseFloat(amount);
            } else {
                amount = $('input[name=radioR]:checked').val();
                if (parseFloat(amount) < 5) {
                    showAlert('Error', 'El monto de recarga no puede ser menor a $5.00', 'OK', function () {
                        $('#input-other').focus();
                    });
                    return;
                }
                if (parseFloat(amount) > 150) {
                    showAlert('Error', 'El monto de recarga no puede ser mayor a $150.00', 'OK', function () {
                        $('#input-other').focus();
                    });
                    return;
                }
                amount = parseFloat(amount);
            }
            if (isNaN(amount)) {
                showAlert('Error', 'Debe colocar un monto para la recarga.', 'OK');
                return;
            }
            const iva = $('input[name=radioR]:checked').data('iva');
            const id = $('input[name=radioR]:checked').data('id');

            const selectedAccount = app.utils.Storage.getSessionItem('selected-account');
            const selectedSubscriberValue = app.utils.Storage.getSessionItem('selected-subscriber-value');

            const recharge = {
                subscriber: selectedSubscriberValue,
                account: selectedAccount.Account,
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

});
