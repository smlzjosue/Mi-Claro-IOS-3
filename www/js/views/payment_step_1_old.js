$(function () {

    // Payment Step 1 View
    // ---------------

    app.views.PaymentStep1View = app.views.CommonView.extend({

        name: 'payment_step_1',

        // The DOM events specific.
        events: {

            // event
            'pagecreate': 'pageCreate',
            'active': 'active',            

            //header
            'click .btn-back': 'back',

            // content
            'click .payment-step-2': 'goToPaymentStep2',
            'click .btn-card': 'selectCreditCard',
            'focusout #credit-card': 'updateCreditCard',
            'focusin #card_expiration_month': 'hideFooter',
            'focusout #card_expiration_month': 'showFooter',
            'focusin #card_expiration_year': 'hideFooter',
            'focusout #card_expiration_year': 'showFooter',

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
            'click #btn-help': 'helpSection'

        },

        // Render the template elements
        render: function (callback) {
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

            //if (app.utils.Storage.getSessionItem('selected-offer-id') !== null) {

                var self = this,
                    variables = {
                        selectedAccount: app.utils.Storage.getSessionItem('selected-account'),
                        selectedAccountValue: app.utils.Storage.getSessionItem('selected-account-value'),
                        paymentData: app.utils.Storage.getSessionItem('payment-data'),
                        selectedOffer: app.utils.Storage.getSessionItem('selected-offer'),
                        months: months,
                        years: years,
                        wirelessAccount: (selectedAccount.prodCategory == 'WLS'),
                        accountAccess: this.getUserAccess(),
                        convertCaseStr: app.utils.tools.convertCase,
                        showBackBth: true
                    };

                app.TemplateManager.get(self.name, function (code) {
                    var template = cTemplate(code.html());
                    $(self.el).html(template(variables));
                    callback();
                    return this;
                });

           /* } else {

                window.location.href = 'index.jsp';

            }*/

        },

        goToPaymentStep2: function (e) {
        	
        	 // add custom validation methods
            $.validator.addMethod('creditCard', function () {

                var creditCardNumber = $('input[name=card_number]').val(),
                    creditCardType = app.utils.Storage.getSessionItem('credit-card-type');

                switch (creditCardType) {
	                case 'MASTER':
	                    pattern = /^5[1-5][0-9]{14}$/;
	                    break;
	                case 'VISA':
	                    pattern = /^4[0-9]{12}(?:[0-9]{3})?$/;
	                    break;
	                case 'AMERICAN':
	                    pattern = /^3[4,7][0-9]{13}$/;
	                    break;
	                default:
	                    return;
	            }
                
                return pattern.test(creditCardNumber);
            });

            $('#form-payment-step-1').validate({
                ignore: '',
                rules: {
                    'card_type': {
                        required: true
                    },
                    'full_name': {
                        required: true
                    },
                    'card_number': {
                        required: true,
                        creditCard: true
                    },
                    'card_expiration_month': {
                        required: true,
                        digits: true,
                        range: [1, 12]
                    },
                    'card_expiration_year': {
                        required: true,
                        digits: true
                    },
                    'security_code': {
                        required: true,
                        digits: true,
                        rangelength: [3, 4]
                    }
                },
                
                messages: {
                    'card_type': {
                        required: 'Por favor seleccione un método de pago'
                    },
                    'full_name': {
                        required: 'Por favor indique su nombre y apellido'
                    },
                    'card_number': {
                        required: 'Por favor indique un número de tarjeta válido',
                        creditCard: 'Por favor indique un número de tarjeta válido'
                    },
                    'card_expiration_month': {
                        required: 'Por favor indique el mes de vencimiento de la tarjeta',
                        digits: 'Por favor indique un mes válido',
                        range: 'Por favor indique un mes válido'
                    },
                    'card_expiration_year': {
                        required: 'Por favor indique el año de vencimiento de la tarjeta',
                        digits: 'Por favor indique un año válido'
                    },
                    'security_code': {
                        required: 'Por favor indique un código de verificación válido',
                        digits: 'Por favor indique un código de verificación válido',
                        rangelength: 'Por favor indique un código de verificación válido'
                    }
                },
                
                invalidHandler: function (event, validator) {

                    if (validator.errorList.length > 0) {
                        var err = validator.errorList[0];
                        showAlert('Error', err.message, 'Aceptar');
                        $(err.element).focus();
                    }
                },

                submitHandler: function (form) {

                    // create object with data
                    var paymentData = {
                        'cardType': app.utils.Storage.getSessionItem('credit-card-type'),
                        'fullName': $('input[name=full_name]').val(),
                        'cardNumber': $('input[name=card_number]').val(),
                        'cardExpirationDate': $('select[name=card_expiration_month]').val() + $('select[name=card_expiration_year]').val(),
                        'securityCode': $('input[name=security_code]').val()
                    };

                    // save payment data on session
                    app.utils.Storage.setSessionItem('payment-data', paymentData);

                    // render payment step 2
                    app.router.navigate('payment_step_2', {trigger: true});

                    return false;

                },

                showErrors: function (errorMap, errorList) {
                    // next  . . .
                }
            });        	

        	$('#form-payment-step-1').submit();

        },

        goToDataPlan: function (e) {

            app.router.navigate('data_plan', {trigger: true});

        },

        selectCreditCard: function (e) {

            var cardType = $(e.currentTarget).data('cardType');

            $('.btn-card').removeClass('on');

            $('#card-' + cardType).addClass('on');

            $('input[name=card_type]').val(cardType);

            app.utils.Storage.setSessionItem('credit-card-type', cardType);

        },

        updateCreditCard: function (e) {

            $('#credit-card').validateCreditCard(function (result) {

                if (result.valid) {

                    $('.btn-card').removeClass('on');

                    var creditCardType = result.card_type.name;

                    switch (creditCardType) {
                    case 'mastercard':
                        $('#card-MASTER').addClass('on');
                        $('input[name=card_type]').val('MASTER');
                        app.utils.Storage.setSessionItem('credit-card-type', 'MASTER');
                        break;

                    case 'visa':
                        $('#card-VISA').addClass('on');
                        $('input[name=card_type]').val('VISA');
                        app.utils.Storage.setSessionItem('credit-card-type', 'VISA');
                        break;

                    case 'amex':
                        $('#card-AMERICAN').addClass('on');
                        $('input[name=card_type]').val('AMERICAN');
                        app.utils.Storage.setSessionItem('credit-card-type', 'AMERICAN');
                        break;
                    default:
                        return;
                    }

                } else {

                    $('.btn-card').removeClass('on');
                    $('input[name=card_type]').val('');
                    app.utils.Storage.setSessionItem('credit-card-type', '');
                }

            });

        },

        hideFooter: function (e) {
            $('#btn-help').hide();
        },

        showFooter: function (e) {
            $('#btn-help').show();
        }

    });
});