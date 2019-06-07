$(function() {

    // Sva View
    // ---------------

    app.views.SvaSellView = app.views.CommonView.extend({

        name: 'sva_sell',

        selectedOffer: {
            offerId: '',
            displayName: '',
            price: '',
			terms: false
        },

        // The DOM events specific.
        events: {

            // evets
            'active': 'active',

            //header
            'click .btn-back': 'back',
            'click .btn-menu': 'menu',
            'click .btn-chat': 'chat',

            'change #select-account': 'changeAccount',
            'click .select-subscriber': 'changeSubscriber',

            // toggle
            'click .sectbar': 'toggleClass',
            'click .phonebar': 'toggleClass',

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

            // header
            'click .payment-step-1': 'goToPaymentStep1',
            'click .available-offer': 'selectPlan',

            // footer
            'click #btn-help': 'helpSection'

        },

        // Render the template elements
        render: function(callback) {

            var self = this,
                variables = null;

            // user hasn't logged in
            if (app.utils.Storage.getSessionItem('token') == null) {

                document.location.href = 'index.html';

            } else {

                var subscribers = app.utils.Storage.getSessionItem('subscribers'),
                    selectedAccountValue = app.utils.Storage.getSessionItem('selected-subscriber-value'),
                    selectedAccount = app.utils.Storage.getSessionItem('selected-account')

                if (selectedAccountValue != null) {
                    app.utils.Storage.setSessionItem('selected-subscriber-value', selectedAccountValue);
                } else {
                    app.utils.Storage.setSessionItem('selected-subscriber-value', subscribers[0].subscriber);
                }

                var variables = {
                    accounts: app.utils.Storage.getSessionItem('accounts-list'),
                    selectedAccountValue: app.utils.Storage.getSessionItem('selected-account-value'),
                    selectedAccount: app.utils.Storage.getSessionItem('selected-account'),
                    subscribers: app.utils.Storage.getSessionItem('subscribers'),
                    selectedSubscriberValue: app.utils.Storage.getSessionItem('selected-subscriber-value'),
                    selectedOfferId: app.utils.Storage.getSessionItem('selected-offer-id'),
                    availableOffers: app.utils.Storage.getSessionItem('select-offer-to-subscriber'),
                    wirelessAccount: (selectedAccount.prodCategory == 'WLS'),
                    typeOfTelephony: app.utils.tools.typeOfTelephony,
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

        changeAccount: function(e) {

            var self = this,
                analytics = null;

            app.utils.Storage.setSessionItem('selected-offer', null);
            app.utils.Storage.setSessionItem('selected-offer-id', 0);

            this.selectedOffer = {
                'offerId': '',
                'displayName': '',
                'price': ''
            };

            app.utils.Storage.setSessionItem('selected-account-value', $.mobile.activePage.find('#select-account').val());
            var accountNumber = app.utils.Storage.getSessionItem('selected-account-value');

            if (analytics != null) {
                // send GA statistics
                analytics.trackEvent('select', 'change', 'select account number', accountNumber);
            }

            app.utils.Storage.setSessionItem('selected-account', app.utils.Storage.getSessionItem(accountNumber));

            $.each(app.utils.Storage.getSessionItem('accounts-list'), function(index, value) {
                if (value.Account === app.utils.Storage.getSessionItem('selected-account-value')) {
                    app.utils.Storage.setSessionItem('selected-account', value);
                }
            });

            if (app.utils.Storage.getSessionItem(accountNumber) == null) {

                this.options.accountModel.getAccountSubscribers(
                    //parameter
                    app.utils.Storage.getSessionItem('token'),

                    accountNumber,

                    //success callback
                    function(data) {

                        if (!data.HasError) {

                            // session
                            app.utils.Storage.setSessionItem('selected-account', data);

                            // cache
                            //app.cache.Accounts[accountNumber] = data;
                            app.utils.Storage.setSessionItem(accountNumber, data);

                            self.options.accountModel.getAccountSubscribers(
                                //parameter
                                app.utils.Storage.getSessionItem('token'),
                                data.Account,

                                //success callback
                                function(dataSubscriber) {
                                    console.log('#success ws service');

                                    if (!data.HasError) {

                                        app.utils.Storage.setSessionItem('subscribers', dataSubscriber.Subscribers);
                                        app.utils.Storage.setSessionItem('selected-subscriber', dataSubscriber.Subscribers[0]);

                                        // cache
                                        app.utils.Storage.setSessionItem('subscribers-' + data.Account, dataSubscriber.Subscribers);

                                        // render view
                                        self.render(function() {});

                                    } else {

                                        showAlert('Error', data.Desc, 'Aceptar');

                                    }

                                },

                                // error function
                                app.utils.network.errorFunction
                            );

                        } else {

                            showAlert('Error', data.Desc, 'Aceptar');

                        }

                    },

                    // error function
                    app.utils.network.errorFunction
                );


            } else {

                // cache
                app.utils.Storage.setSessionItem('selected-account', app.utils.Storage.getSessionItem(accountNumber));
                var selectedAccount = app.utils.Storage.getSessionItem('selected-account');

                // search if the subscriber dont exists
                if (app.utils.Storage.getSessionItem('subscribers-' + accountNumber) == null) {
                    this.options.accountModel.getAccountSubscribers(
                        //parameter
                        app.utils.Storage.getSessionItem('token'),
                        selectedAccount.Account,

                        //success callback
                        function(data) {

                            if (!data.HasError) {

                                app.utils.Storage.setSessionItem('subscribers', data.Subscribers);
                                app.utils.Storage.setSessionItem('selected-subscriber', data.Subscribers[0]);
                                app.utils.Storage.setSessionItem('subscribers-' + selectedAccount.Account, data.Subscribers);

                                // render view
                                self.render(function() {});


                            } else {

                                showAlert('Error', data.Desc, 'Aceptar');

                            }

                        },

                        // error function
                        app.utils.network.errorFunction
                    );

                } else {

                    //load cache
                    var subscribers = app.utils.Storage.getSessionItem('subscribers-' + accountNumber);

                    // set cache
                    app.utils.Storage.setSessionItem('subscribers', subscribers);
                    app.utils.Storage.setSessionItem('selected-subscriber', subscribers[0]);

                    // render view
                    self.render(function() {});

                }

            }

        },

        changeSubscriber: function(e) {

            var self = this,
                analytics = null,
                subscriberModel = new app.models.Subscriber();

            var socs = [];

            app.utils.Storage.setSessionItem('selected-offer', null);
            app.utils.Storage.setSessionItem('selected-offer-id', 0);

            this.selectedOffer = {
                'offerId': '',
                'displayName': '',
                'price': ''
            };

            $('.collapse.in').collapse('hide');

            $.each(app.utils.Storage.getSessionItem('subscribers'), function(index, value) {
                if (value.subscriber == $(e.currentTarget).data('value')) {
                    app.utils.Storage.setSessionItem('selected-subscriber', value);
                    app.utils.Storage.setSessionItem('selected-subscriber-value', value.subscriber);
                }
            });

            if (analytics != null) {
                // send GA statistics
                analytics.trackEvent('select', 'change', 'select subscriber', app.utils.Storage.getSessionItem('selected-subscriber'));
            }

            if ($(e.currentTarget).data('search-info') == true) {
                // set flag search data
                $(e.currentTarget).data('search-info', false);
            } else {
                $('.select-subscriber').removeClass('mon').addClass('collapsed');
                // set flag search data
                $(e.currentTarget).data('search-info', true);


                        var socs = app.utils.Storage.getSessionItem('selected-subscriber').svaSocCode.replace(/\'/g,'').split(',');;
                        var offerModel = new app.models.Offer();
                        var htmlNew = '';
                        var subscriberSelected = app.utils.Storage.getSessionItem('selected-subscriber-value');
                        var selectedAccount = app.utils.Storage.getSessionItem('selected-account');
                        var wirelessAccount = (selectedAccount.prodCategory == 'WLS');
                        var currentIndex = $(e.currentTarget).data('index');
                        var equipmentPrice = (app.utils.Storage.getSessionItem('selected-subscriber').ItemPrice !== '' &&
                                        	app.utils.Storage.getSessionItem('selected-subscriber').ItemPrice !== null &&
                                            app.utils.Storage.getSessionItem('selected-subscriber').ItemPrice !== undefined) ?
                                            app.utils.Storage.getSessionItem('selected-subscriber').ItemPrice : 0.00;
                        var equipmentEffectiveDate = (app.utils.Storage.getSessionItem('selected-subscriber').ItemEffectiveDate !=='' &&
                                        	app.utils.Storage.getSessionItem('selected-subscriber').ItemEffectiveDate !== null &&
                                            app.utils.Storage.getSessionItem('selected-subscriber').ItemEffectiveDate !== undefined) ?
                                            app.utils.Storage.getSessionItem('selected-subscriber').ItemEffectiveDate : '2015-01-01';

                        //SVAs
                        //app.utils.Storage.setSessionItem('svas', SVAs);

                        offerModel.listSVA(

                            // parameters
                            socs,
                            equipmentPrice,
                            equipmentEffectiveDate,

                            function(success) {
                                if (!success.hasError) {
                                    var svasData = success.object;
                                    $.each(svasData, function(index, value) {
                                        htmlNew += '<div class="basicrow">' +
                                            '<div class="planspc available-offer" data-offer-id="' + value.soc + '" data-index="' + currentIndex + '">' +
                                            '<div class="container norel">' +
                                            '<div class="spc-i vcenter">' +
                                            '<div class="tabcell">' +
                                            '<input type="checkbox" name="checkbox_offers" id="check-' + value.soc + '-' + subscriberSelected + '" class="css-checkbox2 available-offer-check" value="' + value.soc + '" />' +
                                            '<label for="checkboxG7" class="css-label2 radGroup1"></label>' +
                                            '</div>' +
                                            '</div>' +

                                            '<div class="spc-ii f-little f-bold text-justify vcenter">' +
                                            '<div class="tabcell">' +
                                            '<span id="offer-name-' + value.soc + '">' + value.description + '</span>' +
                                            '</div>' +
                                            '</div>' +

                                            '<div class="spc-iii f-med text-right din-b vcenter">' +
                                            '<div class="tabcell" id="offer-price-' + value.soc + '">$' +
                                            value.rent +
                                            '</div>' +
                                            '</div>' +
                                            '</div>' +
                                            '</div>' +
                                            '</div>';
                                    });

                                           if(!_.isEmpty(svasData)){
                                                // add terms and conditions validation
                                                htmlNew += '<div class="autobar diff-i">' +
                                                '<div class="container">' +
                                                    '<div class="transparent-btn text-center f-med f-white vcenter" style="background-color: none; ">' +
                                                        '<div class="tabcell f-black">' +
                                                            '<input type="checkbox" name="terms_' + currentIndex + '" id="terms_' + currentIndex + '" />&nbsp;&nbsp;&nbsp;Acepto los <a href="#sva_terms">T&eacute;rminos y Condiciones</a>' +
                                                        '</div>' +
                                                    '</div>' +
                                                '</div>';
                                           }
                                           else{
                                                htmlNew += '<div>' +
                                                    '<div class="subtitle nbott din-b f-little text-center f-black vcenter">' +
                                                        '<div class="tabcell">' +
                                                            'AVISO' +
                                                        '</div>' +
                                                    '</div>' +
                                                    '<div class="nbott din-b f-little text-center f-red padding-alert">No hay servicios adicionales disponibles</div>' +
                                                    '</div>';
                                           }

                                    if (!_.isEmpty(svasData) && wirelessAccount) {

                                        htmlNew += '<div class="autobar diff-i">' +
                                            '<div class="container">' +
                                            '<div class="r-btn text-center f-med f-white vcenter">' +
                                            '<div class="tabcell payment-step-1">' +
                                            'Comprar' +
                                            '</div>' +
                                            '</div>' +

                                            '<div class="g-btn text-center f-med f-white vcenter">' +
                                            '<div class="tabcell btn-back">' +
                                            'Cancelar' +
                                            '</div>' +
                                            '</div>' +
                                            '</div>' +
                                            '</div>';
                                    }

                                    // put html
                                    $('#phone' + currentIndex).html(htmlNew);

                                } else {
                                    showAlert('Error', success.desc, 'Aceptar');
                                }
                            },
                            // error function
                            function(error) {
                                showAlert('Error', error.Desc, 'Aceptar');
                            }
                        ); //end offer

            }
        },

        goToPaymentStep1: function(e) {

            var self = this,
                subscriberHasAvailableCredit,
                creditLimitData = {},
                offerData = {},
                usageOfferDataList,
                adicionalPackageData = false,
                adicionalPackageRoaming = false,
                selectedOfferMessage = 'Estimado cliente su cuenta ya tiene un paquete adicional en espera de uso.',
                selectedOffer = this.selectedOffer,
                selectedOfferId = this.selectedOffer.offerId,
                price = this.selectedOffer.price,
				index = this.selectedOffer.index;
				console.log('index =' + index);
			var terms = $('#terms_'+index).prop('checked');

            if (selectedOfferId == '') {

                showAlert('Error', 'Debe seleccionar algun plan', 'Aceptar');
                return;
			} else if (!terms) {

                showAlert('Error', 'Debe aceptar los Términos y Condiciones', 'Aceptar');
                return;

            } else {
                self.showPasswordPrompt(function() {
                    // add parameters here
                    app.utils.Storage.setSessionItem('selected-offer', selectedOffer);
                    app.utils.Storage.setSessionItem('selected-offer-id', selectedOfferId);

                    // create object to Credit Limit Data
                    creditLimitData.ban = app.utils.Storage.getSessionItem('selected-account-value');
                    creditLimitData.productPrice = parseFloat(price.replace('$', '')).toFixed(2);
                    creditLimitData.accountType = app.utils.Storage.getSessionItem('selected-account').mAccountType;

                    usageOfferDataList = app.utils.Storage.getSessionItem('selected-subscriber').UsageOfferDataList;

                    // validateCreditLimit
                    self.options.offerModel.validateCreditLimit(

                        creditLimitData,

                        function(validateResponse) {

                            var availableCredit = parseFloat(validateResponse.AvailableCredit.replace('$', '')).toFixed(2);

                            if (!validateResponse.HasError) {

                                subscriberHasAvailableCredit = parseFloat(availableCredit) >= parseFloat(creditLimitData.productPrice);

                                if (subscriberHasAvailableCredit) {

                                    var invoiceMessage = 'Estimado Cliente: El paquete seleccionado será agregado con cargo a su próxima factura. ¿Está seguro de agregar el plan: ' + app.utils.Storage.getSessionItem('selected-offer').displayName + ' a ' + app.utils.Storage.getSessionItem('selected-offer').price + ' ?';

                                    showConfirm('Recargo a factura', invoiceMessage, ['Aceptar', 'Cancelar'],

                                        function(result) {

                                            if (result == 1) {

                                                // send data to services
                                                var subscriberModel = new app.models.Subscriber();

                                                var monto = app.utils.Storage.getSessionItem('selected-offer').price;
                                                var price = parseFloat(monto.replace('$', '')).toFixed(2);

                                                var requestSvaBuy = {
                                                    soc: app.utils.Storage.getSessionItem('selected-offer-id'),
                                                    accountFrom: app.utils.Storage.getSessionItem('selected-account-value'),
                                                    subscriberFrom: app.utils.Storage.getSessionItem('selected-subscriber-value'),
                                                    channel: 'IOS',
                                                    invoiceCharge: 'Y',
                                                    amount: price
                                                };

                                                console.log(requestSvaBuy);

                                                subscriberModel.svaBuy(
                                                    // parameters
                                                    requestSvaBuy,
                                                    // success callback
                                                    function(success) {

                                                        if (!success.hasError) {
                                                            console.log(success.object.transactionId);
                                                            app.utils.Storage.setSessionItem('pay-sva-transactionId', success.object.transactionId);
                                                            app.utils.Storage.setSessionItem('pay-sva-transactionInfo', success.object);
                                                            // render confirm
                                                            app.utils.Storage.setSessionItem('invoice-charge', true);
                                                            app.router.navigate('confirm_pay_sva', {
                                                                trigger: true
                                                            });
                                                        } else {
                                                            // show alert
                                                            showAlert(
                                                                'Error',
                                                                success.desc,
                                                                'Aceptar',
                                                                function(e) {}
                                                            );
                                                        }

                                                    },
                                                    // error callback
                                                    app.utils.network.errorFunction
                                                );


                                            }

                                        });

                                } else {
                                    var confirmMessage = 'Estimado cliente el servicio adicional seleccionado no califica para cargo en factura, por favor seleccione un servicio de menor costo o continúe su compra efectuando el pago inmediato usando sus tarjeta de crédito.';

                                    showConfirm('Pago con tarjeta de crédito', confirmMessage, ['Aceptar', 'Cancelar'],

                                        function(result) {
                                            // redirect to credit card view
                                            if (result == 1) {
                                                // send data to services
                                                var subscriberModel = new app.models.Subscriber();

                                                var monto = app.utils.Storage.getSessionItem('selected-offer').price;
                                                var price = parseFloat(monto.replace('$', '')).toFixed(2);

                                                var requestSvaBuy = {
                                                    soc: app.utils.Storage.getSessionItem('selected-offer-id'),
                                                    accountFrom: app.utils.Storage.getSessionItem('selected-account-value'),
                                                    subscriberFrom: app.utils.Storage.getSessionItem('selected-subscriber-value'),
                                                    channel: 'IOS',
                                                    invoiceCharge: 'N',
                                                    amount: price
                                                };

                                                console.log(requestSvaBuy);

                                                subscriberModel.svaBuy(
                                                    // parameters
                                                    requestSvaBuy,
                                                    // success callback
                                                    function(success) {

                                                        if (!success.hasError) {
                                                            console.log(success.object.transactionId);
                                                            app.utils.Storage.setSessionItem('pay-sva-transactionId', success.object.transactionId);
                                                            app.utils.Storage.setSessionItem('pay-sva-transactionInfo', success.object);
                                                            // render payment info
                                                            app.router.navigate('payment_sva', {
                                                                trigger: true
                                                            });
                                                        } else {
                                                            // show alert
                                                            showAlert(
                                                                'Error',
                                                                success.desc,
                                                                'Aceptar',
                                                                function(e) {}
                                                            );
                                                        }

                                                    },
                                                    // error callback
                                                    app.utils.network.errorFunction
                                                );

                                            }
                                        });
                                }


                            } else {

                                showAlert('Error', validateResponse.ErrorDesc, 'Aceptar');

                            }

                        },

                        // error callback
                        app.utils.network.errorFunction

                    ); // end validateCreditLimit

                });

            }
        },

        selectPlan: function(e) {

            // clean others
            $('.available-offer-check').each(function() {
                $(this).prop('checked', false);
            });

            $('.available-offer').removeClass('on');

            // select current
            $(e.currentTarget).addClass('on');
            var offerId = $(e.currentTarget).data('offerId');
            var subscriberSelected = app.utils.Storage.getSessionItem('selected-subscriber-value');
            $('#check-' + offerId + '-' + subscriberSelected).prop('checked', true);

            this.selectedOffer.offerId = offerId;
            this.selectedOffer.displayName = $.trim($('#offer-name-' + offerId).html());
            this.selectedOffer.price = $.trim($('#offer-price-' + offerId).html());
            this.selectedOffer.index = $(e.currentTarget).data('index');

        }

    });
});
