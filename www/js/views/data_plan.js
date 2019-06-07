$(function() {

	// Data Plan View
	// ---------------

	app.views.DataPlanView = app.views.CommonView.extend({

		name:	'data_plan',

		selectedOffer: {
			offerId: 		'',
			displayName: 	'',
            price:		    '',
            subscriber:		'',
            subscriberType:	''
		},

		// The DOM events specific.
		events: {
            'pagecreate':                           'pageCreate',

            // new content
            'change #select-account':               'changeAccount',
            'click .select-subscriber':             'changeSubscriber',
            'click .btn-buy':                       'buyPlan',
            'click .link-terms':                    'showTerms',
            'click #close-terms':                   'closeTerms',

            // toggle
		    'click .sectbar':                       'toggleClass',
            'click .phonebar':                      'toggleClass',

			// header
			'click .payment-step-1':                'goToPaymentStep1',
			'click .available-offer':               'selectPlan',
		},

		// Render the template elements
		render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            var subscribers = app.utils.Storage.getSessionItem('subscribers-info'),
                selectedAccount = app.utils.Storage.getSessionItem('selected-account');

            var self = this,
                variables = {
                    subscribers: subscribers,
                    selectedOfferId: app.utils.Storage.getSessionItem('selected-offer-id'),
                    availableOffers: app.utils.Storage.getSessionItem('select-offer-to-subscriber'),
                    wirelessAccount: (selectedAccount.prodCategory == 'WLS'),
                    typeOfTelephony: app.utils.tools.typeOfTelephony,
                    formatNumber: app.utils.tools.formatSubscriber,
                    selectedTab: app.utils.Storage.getSessionItem('selected-tab'),
                    accounts: this.getSelectTabAccounts(),
                    selectedAccount: app.utils.Storage.getSessionItem('selected-account'),
                    accountSections: this.getUserAccess(),
                    showBackBth: true
                };

            app.TemplateManager.get(self.name, function(code){
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

            var subscribers = app.utils.Storage.getSessionItem('subscribers-info');
            if (subscribers.length == 1) {
                $('.select-subscriber').eq(0).trigger('click');
            }
        },

        changeAccount: function(e){

            var self = this,
                analytics = null;

            app.utils.Storage.setSessionItem('selected-offer', null);
            app.utils.Storage.setSessionItem('selected-offer-id', 0);

            this.selectedOffer = {
                offerId: 		'',
                displayName: 	'',
                price:		    '',
                subscriber:		''
            };

            const newAccountNumber = $.mobile.activePage.find('#select-account').val();
            const accountNumber = app.utils.Storage.getSessionItem('selected-account-value');

            const accountList = app.utils.Storage.getSessionItem('accounts-list');

            var selectAccount = null;
            $.each(accountList, function (i, object) {
                if (object.Account == newAccountNumber) {
                    selectAccount = object;
                }
            });

            self.getAccountDetails(selectAccount,
                function (response) {
                    if(analytics != null ){
                        // send GA statistics
                        analytics.trackEvent('select', 'change', 'select account number data_plan', accountNumber);
                    }
                    self.render(function(){
                        $.mobile.activePage.trigger('pagecreate');
                    });
                },
                app.utils.network.errorRequest
            );
        },

        changeSubscriber: function(e) {
            var self = this;

            var currentIndex = $(e.currentTarget).data('index'),
                subscribers = app.utils.Storage.getSessionItem('subscribers-info'),
                selectedAccount = app.utils.Storage.getSessionItem('selected-account'),
                activeSubscriber = subscribers[currentIndex],
                offersToSubscriber = activeSubscriber.additionalpackagesField;

            app.utils.Storage.setSessionItem('select-offer-to-subscriber', offersToSubscriber);

            var htmlID = '#subscriber'+currentIndex;

            $(e.currentTarget).toggleClass('mon');
            if ($(e.currentTarget).data('search-info') == true) {
                $(e.currentTarget).data('search-info', false);
            } else {
                $(e.currentTarget).data('search-info', true);

                $(htmlID).find('.ciclo-fact').html(selectedAccount.CycleDate);
                var usageActiveSubscriber = activeSubscriber.usageInfoField;

                // START BASE PLAN
                if (usageActiveSubscriber.dataOffersField != null && usageActiveSubscriber.dataOffersField.length > 0) {

                    var mainPlan = usageActiveSubscriber.dataOffersField[0];
                    // update the subscriber
                    app.utils.Storage.setSessionItem('selected-subscriber-value', activeSubscriber.subscriberNumberField);
                    app.utils.Storage.setSessionItem('selected-subscriber', activeSubscriber);

                    var usagePercentage = Math.round(100.0 * (mainPlan.usedField / mainPlan.quotaField));
                    if (usagePercentage == 0 && mainPlan.usedField > 0) {
                        usagePercentage = 1;
                    }

                    var htmlGraphic = '<div class="c100 p' + usagePercentage + ' text-center center vcenter" style="height: 55vw; width: 55vw; font-size: 55vw">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="slice" style="font-size: 55vw">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="bar"></div>\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="fill"></div>\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t</div>';

                    $(htmlID).find('.graphic-chart').html(htmlGraphic);

                    $(htmlID).find('.data-plan-name').html(mainPlan.displayNameField);

                    var htmlUsage = '<span class="f-red">'+mainPlan.usedTextField+'</span> de '+mainPlan.quotaTextField;
                    $(htmlID).find('.data-plan-usage').html(htmlUsage);

                    var remain = mainPlan.quotaField - mainPlan.usedField;

                    $(htmlID).find('.consumido-label').html('consumidos (' + mainPlan.usedTextField + ')');

                    $(htmlID).find('.disponible-label').html('disponibles (' + app.utils.tools.transformAvailable(remain) + ')');

                } else {
                    $(htmlID).find('.plan-basic-full').hide();
                    $(htmlID).find('.plan-basic-empty').show();
                }
                // END BASE PLAN

                self.getOffers(htmlID, e);
            }
        },

        getOffers: function(htmlID, e) {
            var self = this;

            var currentIndex = $(e.currentTarget).data('index'),
                subscribers = app.utils.Storage.getSessionItem('subscribers-info'),
                subscriber = subscribers[currentIndex];

            var groupID = subscriber.groupIDField == null ? '' : subscriber.groupIDField;
            var transactionId = '12345'; // TODO, no se que deberia ir aqui
            self.options.offerModel.getDataPackets(
                groupID,
                transactionId,
                subscriber.subscriberNumberField,
                function(success) {
                    if (success.HasError) {
                        showAlert('Error', success.ErrorDesc, 'Aceptar');
                    } else {
                        self.setOffers(htmlID, currentIndex, subscriber, success.Offers);
                    }
                },
                // error function
                app.utils.network.errorRequest
            );
        },

        setOffers: function(htmlID, currentIndex, subscriber, offers) {
            var self = this;

            app.utils.Storage.setSessionItem('selected-offer', null);
            app.utils.Storage.setSessionItem('selected-offer-id', 0);

            // New code
            var html = '',
                htmlIndicators = '';

            if (offers != null && offers.length > 0) {

                $.each(offers, function (index, package) {

                    htmlIndicators += '<li data-target="#carousel'+currentIndex+'" data-slide-to="'+index+'" '+(index == 0 ? 'class="active"' : '') +'></li>\n';

                    html +=
                        '\t\t\t\t\t\t\t\t\t\t\t<div class="item'+(index == 0 ? ' active' : '') +'">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t<div class="plansondisps">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="row">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="basicrow">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="plandisptitle">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'+ package.DisplayName +'\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                        '\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="plandispcont">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="basicrow roboto-r text-center">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tAl Mes<br/>\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="f-big roboto-b">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'+package.Price+'\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</span>\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                        '\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="basicrow text-center m-top">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="servs-plans">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="basicrow">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="btns red vcenter rippleR btn-buy" data-subscriber-index="'+currentIndex+'" data-subscriber="'+subscriber.subscriberNumberField+'" data-offer-id="'+package.OfferId+'" data-offer-name="'+package.DisplayName+'" data-offer-price="'+package.Price+'">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="tabcell">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tComprar&nbsp;&nbsp;<i class="fa fa-angle-right" aria-hidden="true"></i>\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</span>\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t</div>';
                });
                // put html
                $(htmlID).find('.carousel-indicators').html(htmlIndicators);
                $(htmlID).find('.carousel-inner').html(html);
                $(htmlID).find('.not-additional-packs').hide();
            } else {
                $(htmlID).find('.carousel-container').hide();
                $(htmlID).find('.not-additional-packs').show();
            }
        },

        buyPlan: function(e) {
		    var self = this;

            // select current
            var offerId = $(e.currentTarget).data('offerId');
            var offerName = $(e.currentTarget).data('offerName');
            var offerPrice = $(e.currentTarget).data('offerPrice');
            var subscriberSelected = $(e.currentTarget).data('subscriber');

            var currentIndex = $(e.currentTarget).data('subscriberIndex'),
                subscribers = app.utils.Storage.getSessionItem('subscribers-info'),
                subscriberObj = subscribers[currentIndex];

            self.selectedOffer.offerId 		= offerId;
            self.selectedOffer.displayName 	= offerName;
            self.selectedOffer.price 		= offerPrice;
            self.selectedOffer.subscriber 	= subscriberSelected;
            self.selectedOffer.subscriberType = subscriberObj.productTypeField;

            app.utils.Storage.setSessionItem('selected-subscriber', subscriberObj);

            if (offerId == ''){
                showAlert('Error', 'Debe seleccionar algun paquete.', 'Aceptar');
                return;
            }

            var transactionId = '12345'; // TODO, no se que deberia ir aqui
            self.options.offerModel.getReadSubscriber(
                self.selectedOffer.subscriber+'',
                transactionId,
                function(response){
                    if(!response.HasError){
                        var sw = 0;
                        for (var i = 0; i< response.Offers.length; i++) { // TODO; comenta el for si se hara una prueba de supply directa
                            if (response.Offers[i].OfferGroupOrder != '1') { // excluding basic offer
                                if(response.Offers[i].Balances[0].BalanceAmount == 0 && (/ROAM/.test(response.Offers[i].OfferGroup)) == false) {
                                    sw = 1;
                                }
                            }
                        }
                        if(sw == 0){
                            self.validateCreditLimit(e);
                        } else {
                            showAlert('Aviso', 'Ya cuentas con un paquete de data adicional en espera de uso.', 'Aceptar');
                        }
                    } else {
                        showAlert('Error', response.Response.Description, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            );
        },

        validateCreditLimit: function(e){
            var self = this;

            const accountInfo = app.utils.Storage.getSessionItem('account-info');

            self.options.offerModel.validateCreditLimit(
                accountInfo.bANField+'',
                (accountInfo.billBalanceField+'').replace('CR',''),
                self.selectedOffer.price.replace('$',''),
                function(response){
                    if(!response.HasError){

                        var availableCredit = parseFloat(response.AvailableCredit.replace('$','')).toFixed(2);
                        var offerPrice = parseFloat(self.selectedOffer.price.replace('$','')).toFixed(2);

                        var subscriberHasAvailableCredit = parseFloat(availableCredit) >= parseFloat(offerPrice);

                        if (subscriberHasAvailableCredit) {
                        //if (false) { // TODO, se usa solo parap ruebas
                            self.supply();
                        } else {
                            self.goToPaymentStep();
                        }
                    } else {
                        showAlert('Error', response.ErrorDesc, 'Aceptar');
                    }
                },

                // error callback
                app.utils.network.errorRequest
            );
        },

        supply: function() {
            var self = this;

            var invoiceMessage = 'Estimado Cliente: El paquete seleccionado será agregado con cargo ' +
                'a su próxima factura. ¿Está seguro de agregar el plan: ' +
                self.selectedOffer.displayName + ' ?';

            showConfirm('Recargo a factura', invoiceMessage, ['Aceptar', 'Cancelar'],

                function(result){

                    if(result == 1) {

                        const accountInfo = app.utils.Storage.getSessionItem('account-info');
                        const username = app.utils.Storage.getLocalItem('username');

                        var offerData = {
                            TransactionId: '123456',
                            SubscriberId : '1' + self.selectedOffer.subscriber,
                            OfferId      : self.selectedOffer.offerId,
                            Charge       : '1',
                            Cicle        : accountInfo.billCycleField,
                            paymentID    : '',
                            UserID       : username,
                        };

                        //add offer (plan) to subscriber on INVOICE
                        self.options.offerModel.addOfferToSubscriber(
                            offerData,
                            function(response){
                                if(!response.HasError){
                                    app.utils.Storage.setSessionItem('invoice-charge', true);
                                    app.utils.Storage.setSessionItem('data-plan_selected-offer-name',  self.selectedOffer.displayName);
                                    app.utils.Storage.setSessionItem('data-plan_selected-offer-price',  self.selectedOffer.price);
                                    app.utils.Storage.setSessionItem('data-plan_order-id', response.PCRFTransaID);
                                    app.router.navigate('data_plan_success', {
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
                    }
                });
        },

        goToPaymentStep: function() {
            var self = this;

            var confirmMessage = 'Estimado cliente el plan de data adicional seleccionado no califica ' +
                'para cargo en factura, por favor seleccione un plan de menor costo o continúe su ' +
                'compra efectuando el pago inmediato usando sus tarjeta de crédito.';

            showConfirm('Pago con tarjeta de crédito', confirmMessage, ['Aceptar', 'Cancelar'],

                function(result){
                    // redirect to credit card view
                    if(result == 1) {

                        const details = [
                            {
                                name        : 'Paquete',
                                description : self.selectedOffer.displayName
                            }
                        ];
                        const accountInfo = app.utils.Storage.getSessionItem('account-info');
                        const username = app.utils.Storage.getLocalItem('username');

                        var offerData = {
                            TransactionId: '123456',
                            SubscriberId : '1' + self.selectedOffer.subscriber,
                            OfferId      : self.selectedOffer.offerId,
                            Charge       : '0',
                            Cicle        : accountInfo.billCycleField,
                            paymentID    : '',
                            UserID       : username,
                        };

                        app.utils.Storage.setSessionItem('payment-data_offer-data', offerData);

                        app.utils.Storage.setSessionItem('payment-data_details', details);
                        app.utils.Storage.setSessionItem('payment-data_amount', self.selectedOffer.price.replace('$',''));
                        app.utils.Storage.setSessionItem('payment-data_subscriber', self.selectedOffer.subscriber);
                        app.utils.Storage.setSessionItem('payment-data_subscriber_type', self.selectedOffer.subscriberType);
                        app.utils.Storage.setSessionItem('payment-data_account', accountInfo.bANField);
                        app.utils.Storage.setSessionItem('payment-data_email', accountInfo.emailField);
                        app.utils.Storage.setSessionItem('payment-data_description', self.selectedOffer.displayName);
                        app.utils.Storage.setSessionItem('payment-data_type', self.PAY.ADDITIONAL_DATA);

                        app.utils.Storage.setSessionItem('data-plan_selected-offer-name',  self.selectedOffer.displayName);
                        app.utils.Storage.setSessionItem('data-plan_selected-offer-price',  self.selectedOffer.price);

                        app.router.navigate('payment_step_1', {trigger: true});
                    }
                });
        },

        selectPlan: function(e){

            // clean others
            $('.available-offer-check').each(function(){
                $(this).prop('checked', false);
            });

            $('.available-offer').removeClass('on');

            // select current
            $(e.currentTarget).addClass('on');
            var offerId = $(e.currentTarget).data('offerId');
            var subscriberSelected = app.utils.Storage.getSessionItem('selected-subscriber-value');
            $('#check-'+offerId+'-'+subscriberSelected).prop('checked', true);

            this.selectedOffer.offerId 		= offerId;

            this.selectedOffer.displayName 	= $.trim($('#offer-description-' + offerId).html());
            this.selectedOffer.price 		= $.trim($('#offer-price-' + offerId).html());

        },

        showTerms: function(e) {
            $('.popupbg').show();
        },

        closeTerms: function(e) {
            $('.popupbg').hide();
        },

	});
});
