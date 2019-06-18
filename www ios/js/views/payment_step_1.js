$(function () {

    // Payment Step 1 View
    // ---------------
    //
    // Informacion necesaria para el proceso de pago:
    //
    // Variables de session necesarias:
    //
    //      (payment-data_details)
    //      detalles a mostrar, es un array de objectos donde se agregar todos los detalles que necesitas aparecer, como ejemplo:
    //      [ { name : 'Paquete', description : 'Data Roaming' } , { name : 'Detalles', description : 'Llamadas inlimitadas' } ]
    //      debe contener al menos 1 elemento
    //
    //      (payment-data_amount)
    //      monto a pagar en el proceso, debe contener solo numeros y maximo 1 punto (eliminar el signo $) ejemplo: '60.00'
    //
    //      (payment-data_subscriber)
    //      numero de subscriptor, solo numeros, en string
    //
    //      (payment-data_account)
    //      Ban o cuenta usada, solo numeros, en string
    //
    //      (payment-data_email)
    //      correo del usuario
    //
    //      (payment-data_description)
    //      descripsion de lo que se esta pagando, ejemplo 'Data Roaming'
    //
    //      (payment-data_redirect-success)
    //      pagina/modulo donde debe ser redireccionado el usuario si el pago es exitoso
    //
    //
    // La informacion debe almacenarse en variables de session de la siguiente forma, Ejemplo:
    // app.utils.Storage.setSessionItem('payment-data_details', details);
    //

    app.views.PaymentStep1View = app.views.CommonView.extend({

        name: 'payment_step_1',

        // The DOM events specific.
        events: {

            // event
            'pagecreate': 'pageCreate',
            'active': 'active',

            // content
            'click #btn-pay':					            'pay',
            'click #btn-return':                            'toReturn'
        },

        // Render the template elements
        render: function (callback) {

            var selectedSubscriber = '7871230000'; // TODO, Borrar
            var selectedSubscriberType = 'G'; // TODO, Borrar

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

            var self = this,
                variables = {
                    months: months,
                    years: years,
                    paymentSummary: self.createSummary(),
                    productType: app.utils.tools.typeOfTelephony(selectedSubscriberType),
                    subscriberNumber: app.utils.tools.formatSubscriber(selectedSubscriber),
                    accounts: this.getSelectTabAccounts(),
                    selectedTab: app.utils.Storage.getSessionItem('selected-tab'),
                    selectedAccount: app.utils.Storage.getSessionItem('selected-account'),
                    accountSections: this.getUserAccess(),
                    showBackBth: true
                };

            app.TemplateManager.get(self.name, function (code) {
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

            $.getJSON("js/data/states.json", function(json) {
                var states = json;
                var html = '';
                $.each(states, function(index, state) {
                    const code = state.code.replace('US-','');
                    const selected = code == 'PR' ? 'selected="selected"':'';
                    html += '<option value="'+code+'" '+selected+'>'+state.name+'</option>\n'
                });
                $('#select-state').html(html);
            });
        },

        createSummary: function() {

            const details = app.utils.Storage.getSessionItem('payment-data_details');
            var amount = app.utils.Storage.getSessionItem('payment-data_amount');
            amount = app.utils.tools.formatAmount(amount);

            var html = '';
            $.each(details, function(index, details) {
                var padding = index == 0 ? '' : ' m-top-ii';
                html += '<div class="redstat'+padding+'">\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="autorow roboto-r pull-left">\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'+details.name+'\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                    '\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="autorow roboto-b pull-right">\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'+details.description+'\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n';
            });
            html += '<div class="redstat m-top-ii">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="autorow roboto-r pull-left">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tMonto\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="autorow roboto-b pull-right">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t$'+amount+'\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n';

            return html;
        },

        pay: function (e) {
            var self = this;

            var cardType = $('input[name=card]:checked').data('cardType');
            var cardName = $('#card-name').val();
            var cardNumber = $('#card-number').val();
            var cardMonth = $('#select-month').val();
            var cardYear = $('#select-year').val();
            var cardCVV = $('#card-cvv').val();
            var address = $('#user-address').val();
            var address2 = $('#user-address2').val();
            var city = $('#user-city').val();
            var state = $('#select-state').val();
            var zipCode = $('#user-zip').val();

            if (!self.validateData(cardType, cardName, cardNumber, cardMonth, cardYear,
                cardCVV, address, address2, city, state, zipCode)) {
                return;
            }

            const amount = app.utils.Storage.getSessionItem('payment-data_amount');
            const subscriber = app.utils.Storage.getSessionItem('payment-data_subscriber');
            const account = app.utils.Storage.getSessionItem('payment-data_account');
            const email = app.utils.Storage.getSessionItem('payment-data_email');
            const description = app.utils.Storage.getSessionItem('payment-data_description');

            var paymentData = {
                Amount: parseFloat(amount).toFixed(2),
                CVNum: cardCVV,
                CardNum: cardNumber,
                ClientApp: 'MCAPP',
                CustomerId: app.gatewayAppId,
                ExpDate: cardMonth + '' + cardYear,
                ExtData: '',
                InvNum: '',
                MagData: '',
                NameOnCard: cardName,
                PNRef: '',
                PayType: cardType,
                Street: (address+' '+address2).trim(),
                TransType: 'Sale',
                Zip: zipCode,
                account: account+'',
                cellphone: subscriber+'',
                city: city,
                description: description,
                email: email,
                state: state,
            };

            // var aa = {
            //     "ErrorDesc": "Aprobado",
            //     "ErrorNum": 0,
            //     "ErrorType": "",
            //     "HasError": false,
            //     "paymentid": "0000005606",
            //     "CardType": "V",
            //     "ETReference_Id": "024690000408",
            //     "HostDate": "",
            //     "HostTime": "",
            //     "IVULottoHostAuthorizationCode": "024690000408",
            //     "InvNum": null,
            //     "MerchantNumber": "",
            //     "PinPad": null,
            //     "RetrievalReferenceNumber": "024690000408",
            //     "TID": ""
            // }

            self.options.paymentModel.makePayment(
                paymentData,
                function(response){
                    if(!response.HasError){
                        if (response.ErrorDesc == "Aprobado") {
                            const object = {
                                paymentId: response.paymentid,
                                referenceId: response.ETReference_Id,
                                hostAuthorizationCode: response.IVULottoHostAuthorizationCode,
                                date: new Date(), // TODO, deberia venir del backend
                                amount: paymentData.Amount
                            };
                            app.utils.Storage.setSessionItem('payment-data_result', true);
                            app.utils.Storage.setSessionItem('payment-data_pay-object', object);
                        }
                        app.router.navigate('payment_step_2', {
                            trigger: true,
                            replace: true
                        });
                    } else {
                        showAlert('Error', response.ErrorDesc, 'Aceptar');
                    }
                },
                // error callback
                app.utils.network.errorRequest
            );
        },

        validateData: function (cardType, cardName, cardNumber, cardMonth, cardYear, cardCVV, address, address2, city, state, zipCode) {
            if (cardType == undefined) {
                showAlert('Error', 'Por favor seleccione un método de pago', 'ok');
                return false;
            }

            if (cardName.length == 0) {
                showAlert('Error', 'Por favor indique su nombre y apellido', 'ok');
                return false;
            }

            switch (cardType) {
                case 'M':
                    pattern = /^5[1-5][0-9]{14}$/;
                    break;
                case 'V':
                    pattern = /^4[0-9]{12}(?:[0-9]{3})?$/;
                    break;
                case 'A':
                    pattern = /^3[4,7][0-9]{13}$/;
                    break;
                default:
                    return false;
            }

            if (!pattern.test(cardNumber)) {
                showAlert('Error', 'Por favor indique un número de tarjeta válido', 'ok');
                return false;
            }

            if (cardCVV.length == 0) {
                showAlert('Error', 'Por favor indique un código de verificación válido', 'ok');
                return false;
            }

            if (address.length == 0) {
                showAlert('Error', 'Por favor indique una dirección', 'ok');
                return false;
            }

            if (state.length == 0) {
                showAlert('Error', 'Por favor indique un estado', 'ok');
                return false;
            }

            if (zipCode.length == 0) {
                showAlert('Error', 'Por favor indique un código postal válido', 'ok');
                return false;
            }
            return true;
        }
    });
});