$(function() {

    // Register step 1 View
    // ---------------

    app.views.RechargePrepaidPaymentView = app.views.CommonView.extend({

        name: 'recharge_prepaid_payment',

        // The DOM events specific.
        events: {
            // events
            'pagecreate':                           'pageCreate',

            'click #next':                          'continue',
            'click #cancel':                        'navigateHome',
        },

        // Render the template elements
        render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            var now = moment(),
                months = [],
                years = [];

            // Years
            for (var i = 0; i <= 10; i++) {
                years.push(now.format('YYYY'));
                now.add(1, 'years');
            }

            // Months
            for (var j = 1; j <= 12; j++) {
                months.push((j < 10) ? '0' + j : j);
            }

            const amountPlan = this.getCurrentAccountPrepaidPlanInfo().socRateField;
            const recharge = app.utils.Storage.getSessionItem('prepaid-recharge_select-product');
            const addresses = app.utils.Storage.getSessionItem('prepaid-address');

            var ath = false;
            var visa = false;
            var master = false;
            var american = false;
            const formPaymentTypes = app.utils.Storage.getSessionItem('prepaid-payments-type');

            $.each(formPaymentTypes, function(index, payment) {
                if (payment.type == 'ATH') {
                    ath = payment;
                }
                if (payment.type == 'Visa') {
                    visa = payment;
                }
                if (payment.type == 'Master') {
                    master = payment;
                }
                if (payment.type == 'American') {
                    american = payment;
                }
            });

            var self = this,
                variables = {
                    selectedSubscriberValue: app.utils.Storage.getSessionItem('selected-subscriber-value'),
                    ath: ath,
                    visa: visa,
                    master: master,
                    american: american,
                    addresses: addresses,
                    months: months,
                    years: years,
                    amount: recharge.amount,
                    amountIvu: recharge.amountIvu,
                    totalAmount: recharge.totalAmount,
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

            $('.cred-opts').on('click', function (e) {
                $('.cred-opts').removeClass('on');
                $(e.currentTarget).addClass('on');
                $(e.currentTarget).find('input').prop("checked", true);
                self.changeCVV(e);
            });

            $('.mnts-rcrg').on('click', function (e) {
                $('.mnts-rcrg').removeClass('on');
                $(e.currentTarget).addClass('on');
                $(e.currentTarget).find('input').prop("checked", true);
            });
        },

        changeCVV: function (e) {
            var check = $('.ath-check').is(':checked');
            if (check) {
                $('#container-cvv').hide();
            } else {
                $('#container-cvv').show();
            }
        },

        continue: function (e) {
            var self = this;

            var cardType = $('input[name=card]:checked').data('cardType');
            var cardName = $('#card-name').val();
            var cardNumber = $('#card-number').val();
            var cardMonth = $('#select-month').val();
            var cardYear = $('#select-year').val();
            var cardCVV = $('#card-cvv').val();
            var zipCode = $('input[name=address]:checked').val();

            if (!self.validateData(cardType, cardName, cardNumber, cardMonth, cardYear, cardCVV, zipCode)) {
                return;
            }

            const address = $('input[name=address]:checked').data('address');

            const idPaymentType = $('input[name=card]:checked').data('id');

            const recharge = app.utils.Storage.getSessionItem('prepaid-recharge_select-product');

            const idCustomerCard = app.utils.Storage.getSessionItem('prepaid-customer-card-id');

            const rechargeData = {
                idCustomerCard: String(idCustomerCard),
                idProduct: recharge.id,
                amount: parseFloat(recharge.amount)
            };

            if (cardType == 'AA') {
                const paymentData = {
                    amount: parseFloat(recharge.totalAmount),
                    idCustomerCard: String(idCustomerCard),
                    idPaymentType: String(idPaymentType),
                    idProduct: recharge.id,
                    month: cardMonth,
                    name: cardName,
                    number: cardNumber,
                    year: '20'+cardYear
                };

                self.options.paymentModel.makePaymentRechargeAth(paymentData, recharge.subscriber,
                    function(response){
                        if(response.success){
                            const dataTransaction = {
                                transactionId: response.idTransaction
                            };
                            self.sendRecharge(rechargeData, recharge.subscriber, dataTransaction);
                        } else {
                            showAlert('Error', response.error, 'Aceptar');
                        }
                    },
                    // error callback
                    app.utils.network.errorRequest
                );

            } else {
                const paymentData = {
                    account: recharge.account,
                    address: address,
                    amount: parseFloat(recharge.totalAmount),
                    city: "",
                    cvv: cardCVV,
                    idCustomerCard: String(idCustomerCard),
                    idPaymentType: String(idPaymentType),
                    idProduct: recharge.id,
                    idState: "4240",  // PR
                    month: cardMonth,
                    name: cardName,
                    number: cardNumber,
                    year: '20'+cardYear,
                    zip: zipCode
                };

                self.options.paymentModel.makePaymentRecharge(paymentData, recharge.subscriber,
                    function(response){
                        if(response.success){
                            const dataTransaction = {
                                transactionId: response.idTransaction,
                            };
                            self.sendRecharge(rechargeData, recharge.subscriber, dataTransaction);
                        } else {
                            showAlert('Error', response.error, 'Aceptar');
                        }
                    },
                    // error callback
                    app.utils.network.errorRequest
                );
            }
        },

        sendRecharge: function(data, subscriber, dataTransaction) {
            const self = this;
            self.options.paymentModel.doRecharge(data, subscriber,
                function(response){
                    if (response.success){
                        dataTransaction.rechargeId = response.idTransaction;
                        dataTransaction.dateTransaction = response.dateTransaction;
                        app.utils.Storage.setSessionItem('prepaid-recharge_data-payment', dataTransaction);
                        app.router.navigate('recharge_prepaid_success', {
                            trigger: true,
                            replace: true
                        });
                    } else {
                        showAlert('Error', response.error, 'Aceptar');
                    }
                },
                // error callback
                app.utils.network.errorRequest
            );
        },

        validateData: function (cardType, cardName, cardNumber, cardMonth, cardYear, cardCVV, zipCode) {
            if (cardType == undefined) {
                showAlert('Error', 'Por favor seleccione un método de pago', 'ok');
                return false;
            }

            if (cardName.length == 0) {
                showAlert('Error', 'Por favor indique su nombre y apellido', 'ok');
                return false;
            }

            switch (cardType) {
                case 'CM':
                case 'DM':
                    pattern = /^5[1-5][0-9]{14}$/;
                    break;
                case 'CV':
                case 'DV':
                    pattern = /^4[0-9]{12}(?:[0-9]{3})?$/;
                    break;
                case 'CA':
                    pattern = /^3[4,7][0-9]{13}$/;
                    break;
                case 'AA':
                    pattern = /[0-9]$/;
                    break;
                default:
                    showAlert('Error', 'Método de pago invalido', 'ok');
                    return false;
            }

            if (!pattern.test(cardNumber)) {
                showAlert('Error', 'Por favor indique un número de tarjeta válido', 'ok');
                return false;
            }

            if (cardType != 'AA' && cardCVV.length == 0) {
                showAlert('Error', 'Por favor indique un código de verificación válido', 'ok');
                return false;
            }

            if (zipCode == undefined) {
                showAlert('Error', 'Por favor seleccione la dirección postal de la tarjeta', 'ok');
                return false;
            }
            return true;
        }

    });

});
