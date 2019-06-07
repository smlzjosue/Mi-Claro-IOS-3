$(function() {

    // Debit Direct View
    // ---------------

    app.views.DebitDirectView = app.views.CommonView.extend({

        name: 'debit_direct',

        // The DOM events specific.
        events: {
            // event
            'pagecreate':                                   'pageCreate',
            'active':                                       'active',

            // content
            'change #select-account':						'simpleChangeAccount',
            'change .select-type':                          'changeType',

            'input .card-name':                             'changeName',
            'input .card-number':                           'changeNumber',
            'input .card-cvv':                              'changeCVV',

            'click .continue':                              'continue',
            'click .cancel':                                'cancel'
        },

        // Render the template elements
        render: function(callback) {
            var now = moment(),
                months = [],
                years = [];

            // Years
            for (var i = 0; i < 10; i++) {
                years.push(now.format('YYYY'));
                now.add(1, 'years');
            }

            // Months
            for (var j = 1; j <= 12; j++) {
                months.push((j < 10) ? '0' + j : j);
            }

            var subscribers = app.utils.Storage.getSessionItem('subscribers-info');

            var self = this,
                variables = {
                    months: months,
                    years: years,
                    subscribers: subscribers,
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

            $('input.inp-f').on('click focus', function (e) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $(e.currentTarget).offset().top-40
                }, 1000);
            });

            /*** START ON SELECT CREDIT CARD TYPE ***/
            $('.card-vs').on('click', function () {
                $('.radio-vs').prop("checked", true);
            });

            $('.card-am').on('click', function () {
                $('.radio-am').prop("checked", true);
            });

            $('.card-mc').on('click', function () {
                $('.radio-mc').prop("checked", true);
            });
            /*** END ON SELECT CREDIT CARD TYPE ***/
            self.getDebitDirect(e);
        },

        changeType: function(e) {
            const type = $('.select-type').val();
            if (type == 1) {
                $('.content-add-bank').show();
                $('.content-add-card').hide();
            } else {
                $('.content-add-bank').hide();
                $('.content-add-card').show();
            }
        },

        cancel: function(e) {
            app.router.navigate('invoice',{trigger: true});
        },

        continue: function(e) {
            var self = this;
            const type = $('.select-type').val();
            if (type == 1) {
                self.addBankAccount();
            } else {
                self.addCreditCard();
            }
        },

        getDebitDirect: function(e) {
            var self = this;
            var selectedAccount = app.utils.Storage.getSessionItem('selected-account')
            self.options.paymentModel.getDirectDebitInfo(
                ''+selectedAccount.Account,
                function(success) {
                    if (!success.HasError) {
                        var isActive = (success.mType != "" && success.mType != null) ? true : false;
                        if (isActive) {

                            $.getJSON("js/data/banks.json", function(json) {
                                self.setupData(success, json);
                            });

                            $('.content-active').show();
                            $('.content-add').hide();
                        } else {
                            $('.content-active').hide();
                            $('.content-add').show();
                        }

                    } else {
                        showAlert('Error', success.ErrorDesc, 'Aceptar');
                    }
                },
                // error callback
                app.utils.network.errorRequest
            );
        },

        setupData: function(data, banks) {

            var type = "";
            if (data.mType == "CH") {
                type = "Cuenta de Cheques";
                $('#container-saved-name').hide();
                $('#container-saved-card').hide();
                $('#container-saved-account').show();
            } else {
                type = "Tarjeta de Cr&eacute;dito";
                $('#container-saved-name').show();
                $('#container-saved-card').show();
                $('#container-saved-account').hide();
            }

            var bankName = "";
            $.each(banks, function(index, bank) {
                if (bank.value == data.mBankCode) {
                    bankName = bank.name;
                }
            });

            var method = "";
            switch (data.mCreditCardType) {
                case 'MC':
                    method = 'MasterCard';
                    break;
                case 'VS':
                    method = 'Visa';
                    break;
                case 'AM':
                    method = 'American';
                    break;
                default:
                    method = bankName;
                    return;
            }

            $('#saved-type').html(type);
            $('#saved-method').html(method);
            $('#saved-name').html(data.mCreditCardMemberName);
            $('#saved-card').html('**** **** **** '+data.mCreditCardNo);
            $('#saved-account').html(data.mAccountNo);
        },

        addBankAccount: function() {
            var self = this,
                selectedAccount = app.utils.Storage.getSessionItem('selected-account');

            var bank = $('.select-bank').val();
            var bankNumber = $('.bank-number').val();

            if (bank == "") {
                showAlert('Error', 'Por favor seleccione su banco', 'ok');
                return;
            }
            if (bankNumber.length == 0) {
                showAlert('Error', 'Por favor indique un número de cuenta válido', 'ok');
                return;
            }

            var actualMonth = moment().format('MM');
            var actualYear = moment().format('YY');
            var actualDay = moment().format('DD');
            var startDate = '20'+actualYear+'-'+actualMonth+'-'+actualDay+'T01:01:01.000-04:00';

            var requestDirectDebit = {
                Ban: ''+selectedAccount.Account,
                mAccountNo: bankNumber,
                mBankCod: bank,
                mCreditCardMemberName: "",
                mCreditCardNo: "",
                mCreditCardType: "",
                mCreditCardExpDate: "",
                mReason: '',
                mStartDate: startDate,
                mEndDate: '',
                mStatus: 'A',
                mType: 'CH'
            };

            self.saveDebitDirect(requestDirectDebit);
        },

        addCreditCard: function(htmlID) {
            var self = this,
                selectedAccount = app.utils.Storage.getSessionItem('selected-account');

            var cardType = $('input[name=card]:checked').data('cardType');
            console.log('creditCardType: '+cardType);
            var cardNumber = $('.card-number').val();
            var cardName = $('.card-name').val();
            var cardMonth = $('.select-month').val();
            var cardYear = $('.select-year').val();
            var cardCVV = $('.card-cvv').val();
            console.log('cardMonth: '+cardMonth);
            console.log('cardYear: '+cardYear);
            console.log('cardCVV: '+cardCVV);

            if (cardType == undefined) {
                showAlert('Error', 'Por favor seleccione un método de pago', 'ok');
                return;
            }

            if (cardName.length == 0) {
                showAlert('Error', 'Por favor indique su nombre y apellido', 'ok');
                return;
            }

            switch (cardType) {
                case 'MC':
                    pattern = /^5[1-5][0-9]{14}$/;
                    break;
                case 'VS':
                    pattern = /^4[0-9]{12}(?:[0-9]{3})?$/;
                    break;
                case 'AM':
                    pattern = /^3[4,7][0-9]{13}$/;
                    break;
                default:
                    return;
            }

            if (!pattern.test(cardNumber)) {
                showAlert('Error', 'Por favor indique un número de tarjeta válido', 'ok');
                return;
            }

            if (cardCVV.length == 0) {
                showAlert('Error', 'Por favor indique un código de verificación válido', 'ok');
                return;
            }

            var expDate = '20'+cardYear+'-'+cardMonth+'-01T01:01:01.000-04:00';

            var actualMonth = moment().format('MM');
            var actualYear = moment().format('YY');
            var actualDay = moment().format('DD');
            var startDate = '20'+actualYear+'-'+actualMonth+'-'+actualDay+'T01:01:01.000-04:00';

            var requestDirectDebit = {
                Ban: ''+selectedAccount.Account,
                mAccountNo: '',
                mBankCode: '021502011',
                mCreditCardMemberName: cardName,
                mCreditCardNo: cardNumber,
                mCreditCardType: cardType,
                mCreditCardExpDate: expDate,
                mReason: '',
                mStartDate: startDate,
                mEndDate: '',
                mStatus: 'A',
                mType: 'CC'
            };

            self.saveDebitDirect(requestDirectDebit);
        },

        saveDebitDirect: function(requestDirectDebit) {
            var self = this;
            self.options.paymentModel.updateDirectDebit(
                requestDirectDebit,
                function(success) {
                    if (!success.HasError) {
                        app.utils.Storage.setSessionItem('pay-debit-direct', requestDirectDebit);
                        showAlert('Afiliación exitosa', '', 'Ok');
                        // render payment step 2
                        self.render(function() {
                            $.mobile.activePage.trigger('pagecreate');
                        });
                    } else {
                        showAlert('Error', success.ErrorDesc, 'Aceptar');
                    }
                },
                // error callback
                app.utils.network.errorRequest
            );
        },

        changeName: function(e) {
            var number = $(e.currentTarget).val();

            if (number.length > 50) {
                number = number.slice(0,50);
                $(e.currentTarget).val(number);
            }
        },

        changeNumber: function(e) {
            var number = $(e.currentTarget).val();

            if (number.length > 25) {
                number = number.slice(0,25);
                $(e.currentTarget).val(number);
            }
        },

        changeCVV: function(e) {
            var number = $(e.currentTarget).val();

            if (number.length > 6) {
                number = number.slice(0,6);
                $(e.currentTarget).val(number);
            }
        },
    });
});
