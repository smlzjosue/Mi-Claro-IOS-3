$(function() {

    // Register step 1 View
    // ---------------

    app.views.ChangePlanView = app.views.CommonView.extend({

        name: 'change_plan',

        // The DOM events specific.
        events: {

            // events
            'pagecreate':                               'pageCreate',

            // Content
            'change #select-account':                   'simpleChangeAccount',
            'click .select-subscriber':                 'changeSubscriber',
            'click .btn-buy':                           'changePlan'
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
                    isPrepaid: this.isCurrentAccountPrepaid(),
                    prepaidBalance: this.getCurrentAccountPrepaidBalance(),
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

            var plan = subscriber.planInfoField;

            var planFullName = plan.sOCDescriptionField;
            var planAmount = 0;
            if (planFullName != null) {
                var planName = planFullName.split(':')[0].trim();
                planAmount = plan.socRateField;
                var totalRent = plan.totalRateField;
                var subPlans = [planFullName];
                if (planFullName.split(':').length > 1) {
                    subPlans = planFullName.split(':')[1].split('-');
                }

                var htmlPacks = '';
                subPlans.forEach(function(pack) {
                    htmlPacks += '<div class="redstat m-top-ii">\n' +
                        '\t\t\t<div class="basicrow roboto-r">\n' +
                        '\t\t\t\t'+pack.trim()+'\n' +
                        '\t\t\t</div>\n' +
                        '\t\t</div>'
                });

                $(htmlID).find('.plan-name').html(planFullName);
                $(htmlID).find('.plan-packs').html(htmlPacks);
                $(htmlID).find('.total-rent').html("$"+app.utils.tools.formatAmount(planAmount));
            }

            $(e.currentTarget).toggleClass('mon');
            $(htmlID).find('.carousel-container').hide();

            if ($(e.currentTarget).data('search-info') == true) {
                $(e.currentTarget).data('search-info', false);
                return;
            }
            $(e.currentTarget).data('search-info', true);

            // START OFFERS FOR SUBSCRIBER
            var accountInfo = app.utils.Storage.getSessionItem('account-info');
            if (subscriber.productTypeField == 'G') {
                self.options.offerModel.getPlans(
                    accountInfo.creditClassField,
                    accountInfo.accountSubtypeField,
                    accountInfo.accountTypeField,
                    app.utils.tools.formatAmount(plan.socRateField),
                    plan.sOCInfoField,
                    "LTE",
                    function(success) {
                        if (success.hasError) {
                            //showAlert('Error', 'No se pudieron obtener ofertas para el subscriptor seleccionado.', 'Aceptar');
                        } else {
                            self.setOffers(htmlID, currentIndex, subscriber, success.object, 1);
                        }
                    },
                    // error function
                    app.utils.network.errorRequest
                );
            } else {
                self.options.offerModel.getPlansDSL(
                    subscriber.subscriberNumberField,
                    function(success) {
                        if (success.HasError) {
                            $(htmlID).find('.not-additional-plans').html('<h3>'+success.ErrorDesc+'</h3>');
                            $(htmlID).find('.carousel-container').hide();
                            $(htmlID).find('.not-additional-plans').show();
                        } else {
                            self.setOffers(htmlID, currentIndex, subscriber, success.DSLCatalogItems, 3);
                        }
                    },
                    // error function
                    app.utils.network.errorRequest
                );
            }
            // END OFFERS FOR SUBSCRIBER
        },

        setOffers: function (htmlID, currentIndex, subscriber, offers, type) { // type 1 postpaid, 2 prepaid, 3 dsl

            if (offers != null && offers.length > 0) {

                var htmlIndicators = '',
                    html = '';
                $.each(offers, function(index, offer) {

                    htmlIndicators += '<li data-target="#carousel'+currentIndex+'" data-slide-to="'+index+'" '+(index == 0 ? 'class="active"' : '') +'></li>\n';

                    var subPlans = [];
                    if (subscriber.productTypeField == 'G') {
                        var planName = offer.description.split(':')[0].trim();
                        var planDescription = offer.description.split(':')[1];
                        if (planDescription != null && planDescription.includes('-')) {
                            subPlans = planDescription.trim().split('-');
                        } else {
                            subPlans.push(planName);
                        }
                    } else {
                        var planName = offer.PRODUCT_NAME;
                        var planDescription = offer.DESCRIPTION.substring(0,  offer.DESCRIPTION.length-1);
                        subPlans = planDescription.split('.');
                    }

                    var htmlPacks = '';
                    subPlans.forEach(function(pack) {
                        htmlPacks +=
                            '\t\t\t\t\t\t\t\t\t<div class="redstat rblack">\n' +
                            '\t\t\t\t\t\t\t\t\t\t'+pack.trim()+'\n' +
                            '\t\t\t\t\t\t\t\t\t</div>'
                    });

                    var price = 0;
                    var soc = '';
                    var description = '';
                    if (type == 1) {
                        price = offer.rent;
                        soc = offer.soc;
                        description = offer.description;
                    } else if (type == 2) {
                        price = offer.price;
                        soc = offer.soc;
                        description = offer.description;
                    } else {
                        price = offer.PRICE;
                        soc = offer.ADA_PRODUCT_ID;
                        description = offer.DESCRIPTION;
                    }

                    html += '<div class="item'+(index == 0 ? ' active' : '') +'">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t    <div class="plansondisps">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="row">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="basicrow">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="plandisptitle vcenter">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="tabcell">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t&#36;'+app.utils.tools.formatAmount(price)+'\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                        '\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="plandispcont">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="basicrow roboto-b">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tDescripci&oacute;n del Plan:\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                        '\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="basicrow m-top-ii">\n' +
                        htmlPacks +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                        '\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="basicrow m-top-ii">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="logline full"></div>\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                        '\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="basicrow text-center m-top">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="servs-plans">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="basicrow">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="btns red vcenter rippleR btn-buy" ' +
                        'data-subscriber-index="'+currentIndex+'" ' +
                        'data-subscriber="'+subscriber.subscriberNumberField+'" ' +
                        'data-offer-soc="'+soc+'" ' +
                        'data-offer-description="'+description+'" ' +
                        'data-offer-rent="'+price+'">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="tabcell">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tEscoger&nbsp;&nbsp;<i class="fa fa-angle-right" aria-hidden="true"></i>\n' +
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
                $(htmlID).find('.carousel-container').show();
                $(htmlID).find('.not-additional-plans').hide();
            } else {
                $(htmlID).find('.carousel-container').hide();
                $(htmlID).find('.not-additional-plans').show();
            }
        },

        changePlan: function (e) {
            var self = this;

            var offerSoc = $(e.currentTarget).data('offerSoc');
            var offerDescription = $(e.currentTarget).data('offerDescription');
            var offerRent = $(e.currentTarget).data('offerRent');
            var subscriberNumber = $(e.currentTarget).data('subscriber');
            var currentIndex = $(e.currentTarget).data('subscriberIndex');
            var subscribers = app.utils.Storage.getSessionItem('subscribers-info');
            var subscriber = subscribers[currentIndex];

            var planName = offerDescription.includes(":") ? offerDescription.split(':')[0].trim() : offerDescription;

            const selectedPlan = {
                soc: offerSoc,
                description: offerDescription,
                rent: offerRent,
                name: planName
            };
            app.utils.Storage.setSessionItem('change-plan_subscriber', subscriber);
            app.utils.Storage.setSessionItem('change-plan_selected-plan', selectedPlan);

            app.router.navigate('change_plan_confirm', {
                trigger: true
            });
        }

    });

});
