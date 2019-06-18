$(function() {

    // Service View
    // ---------------

    app.views.ConsumptionView = app.views.CommonView.extend({

        name: 'consumption',

        consumptionSwiper: null,

        minute: true,

        data: false,

        // Events declarations
        //
        events: {

            // events
            'pagecreate':                           'pageCreate',
            'active':                               'active',


            // content
            'change #select-account':               'simpleChangeAccount',

            // new content
            'click #details-data':                  'showDetailsData',
            'click #details-voz':                   'showDetailsVoz',
            'click .select-subscriber-data':        'changeSubscriberData',
            'click .select-subscriber-voz':         'changeSubscriberVoz',
            'click .btn-add-packet':                'additionalDataPlan'
        },

        // Render the template elements
        //
        render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            var selectedAccount = app.utils.Storage.getSessionItem('selected-account'),
                subscribers = app.utils.Storage.getSessionItem('subscribers-info'),
                accountInfo = app.utils.Storage.getSessionItem('account-info'),
                dsl = accountInfo.accountSubtypeField == 'W' && accountInfo.accountTypeField == 'I';

            var self = this,
                variables = {
                    selectedTab: app.utils.Storage.getSessionItem('selected-tab'),
                    accounts: this.getSelectTabAccounts(),
                    selectedAccount: selectedAccount,
                    subscribers: subscribers,
                    dsl: dsl,
                    wirelessAccount: (selectedAccount.prodCategory == 'WLS'),
                    typeOfTelephony: app.utils.tools.typeOfTelephony,
                    formatSubscriber: app.utils.tools.formatSubscriber,
                    subscribersCount: subscribers.length,
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
                $('.select-subscriber-data').eq(0).trigger('click');
                $('.select-subscriber-voz').eq(0).trigger('click');
            }

            var accountInfo = app.utils.Storage.getSessionItem('account-info'),
                dsl = accountInfo.accountSubtypeField == 'W' && accountInfo.accountTypeField == 'I';
            if (dsl) {
                self.showDetailsVoz();
            } else {
                if (app.utils.Storage.getSessionItem('consumption-type-selected') == 2) {
                    self.showDetailsVoz();
                } else {
                    self.showDetailsData();
                }
            }
        },

        showDetailsData: function() {
            $('#details-data').addClass('on');
            $('#details-voz').removeClass('on');

            $('.list-data').show();
            $('.list-voz').hide();
        },

        showDetailsVoz: function() {
            $('#details-data').removeClass('on');
            $('#details-voz').addClass('on');

            $('.list-data').hide();
            $('.list-voz').show();
        },

        changeSubscriberData: function(e) {
            var self = this;

            var currentIndex = $(e.currentTarget).data('index'),
                subscribers = app.utils.Storage.getSessionItem('subscribers-info'),
                selectedAccount = app.utils.Storage.getSessionItem('selected-account'),
                activeSubscriber = subscribers[currentIndex];

            var htmlID = '#data-phone'+currentIndex;

            if ($(e.currentTarget).data('search-info') == true) {
                // set flag search data
                $(e.currentTarget).data('search-info', false);
            } else {

                $(htmlID).find('.ciclo-fact').html(selectedAccount.CycleDate);
                var usageActiveSubscriber = activeSubscriber.usageInfoField;

                var mainPlans = [];
                var roamingPlans = [];
                var additionalPlans = [];
                $.each(usageActiveSubscriber.dataOffersField, function(index, plan) {
                    console.log(plan.offerGroupField);
                    if (plan.offerGroupField.includes('BASE')) {
                        mainPlans.push(plan);
                    } else if (plan.offerGroupField.includes('ROAMING') > 0) {
                        roamingPlans.push(plan);
                    } else {
                        additionalPlans.push(plan);
                    }
                });

                // START BASE PLAN
                if (mainPlans.length > 0) {

                    var html = '';

                    $.each(mainPlans, function(index, plan) {

                        html += self.createHTMLConsumption(plan);

                        if (index+1 < mainPlans.length) {
                            html += '<div class="basicrow m-top">\n' +
                                '\t\t\t\t\t\t\t\t\t\t<div class="logline full"></div>\n' +
                                '\t\t\t\t\t\t\t\t\t</div>';
                        }
                    });
                    $(htmlID).find('.plan-basic-content').html(html);
                } else {
                    $(htmlID).find('.plan-basic-content').html('<h3> No hay planes básicos activos</h3>');
                }
                // END BASE PLAN

                // START ROAMING PLAN
                if (roamingPlans.length > 0) {

                    var html = '';

                    $.each(roamingPlans, function(index, plan) {

                        html += self.createHTMLConsumption(plan);

                        if (index+1 < roamingPlans.length) {
                            html += '<div class="basicrow m-top">\n' +
                                '\t\t\t\t\t\t\t\t\t\t<div class="logline full"></div>\n' +
                                '\t\t\t\t\t\t\t\t\t</div>';
                        }
                    });
                    $(htmlID).find('.plan-roaming-content').html(html);
                } else {
                    $(htmlID).find('.plan-roaming-content').html('<h3> No hay paquetes roaming activos</h3>');
                }
                // END ROAMING PLAN

                // START ADDITIONAL PLAN
                if (additionalPlans.length > 0) {

                    var html = '';

                    $.each(additionalPlans, function(index, plan) {

                        html += self.createHTMLConsumption(plan);

                        if (index+1 < additionalPlans.length) {
                            html += '<div class="basicrow m-top">\n' +
                                '\t\t\t\t\t\t\t\t\t\t<div class="logline full"></div>\n' +
                                '\t\t\t\t\t\t\t\t\t</div>';
                        }
                    });
                    $(htmlID).find('.plan-additional-content').html(html);
                } else {
                    $(htmlID).find('.plan-additional-content').html('<h3> No hay paquetes adicionales activos</h3>');
                }
                // END ADDITIONAL PLAN

                $(htmlID).find('.plan-basic').click(function() {
                    $(htmlID).find('.plan-basic').addClass('on');
                    $(htmlID).find('.plan-roaming').removeClass('on');
                    $(htmlID).find('.plan-additional').removeClass('on');

                    $(htmlID).find('.plan-basic-content').show();
                    $(htmlID).find('.plan-roaming-content').hide();
                    $(htmlID).find('.plan-additional-content').hide();
                });

                $(htmlID).find('.plan-roaming').click(function() {
                    $(htmlID).find('.plan-roaming').addClass('on');
                    $(htmlID).find('.plan-basic').removeClass('on');
                    $(htmlID).find('.plan-additional').removeClass('on');

                    $(htmlID).find('.plan-roaming-content').show();
                    $(htmlID).find('.plan-basic-content').hide();
                    $(htmlID).find('.plan-additional-content').hide();
                });

                $(htmlID).find('.plan-additional').click(function() {
                    $(htmlID).find('.plan-additional').addClass('on');
                    $(htmlID).find('.plan-basic').removeClass('on');
                    $(htmlID).find('.plan-roaming').removeClass('on');

                    $(htmlID).find('.plan-additional-content').show();
                    $(htmlID).find('.plan-basic-content').hide();
                    $(htmlID).find('.plan-roaming-content').hide();
                });
            }
            $(e.currentTarget).toggleClass('mon');
        },

        createHTMLConsumption: function(plan) {

            var usagePercentage = Math.round(100.0 * (plan.usedField / plan.quotaField));
            if (usagePercentage == 0 && plan.usedField > 0) {
                usagePercentage = 1;
            }

            var htmlUsage = '<span class="f-red">'+plan.usedTextField+'</span> de '+plan.quotaTextField;

            var consumidos = 'Consumidos (' + plan.usedTextField + ')';

            var remain = plan.quotaField - plan.usedField;

            var disponibles = 'Disponibles (' + app.utils.tools.transformAvailable(remain) + ')';

            var html = '<div class="row">\n' +
                '\t\t\t\t\t\t\t\t\t\t<div class="col-xs-12 col-sm-12 col-md-5 col-lg-5 text-center">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t<div class="graphic-chart-r" style="height: 60vw">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t<div class="c100 p' + usagePercentage + ' text-center center vcenter" style="height: 55vw; width: 55vw; font-size: 55vw">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="slice" style="font-size: 55vw">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="bar"></div>\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="fill"></div>\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\n' +
                '\t\t\t\t\t\t\t\t\t\t<div class="col-xs-12 col-sm-12 col-md-7 col-lg-7">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t<div class="basicrow">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t<div class="userinfo full">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="basicrow">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="basicrow f-bmed roboto-b m-bott">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tDetalle del Plan\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="redstat">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="autorow roboto-r pull-left">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tPlan Base\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="autorow roboto-b pull-right data-plan-name-r">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'+plan.displayNameField+'\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="redstat m-top-ii">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="autorow roboto-r pull-left">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tHas consumido\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="autorow roboto-b pull-right data-plan-usage-r">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'+htmlUsage+'\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\n' +
                '\t\t\t\t\t\t\t\t\t\t\t<div class="basicrow m-top">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t<div class="logline full"></div>\n' +
                '\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\n' +
                '\t\t\t\t\t\t\t\t\t\t\t<div class="basicrow m-top-ii">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t<div class="twostats">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="statrectdef redstat"></div>\n' +
                '\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="autocont f-mini roboto-r f-black vcenter">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="tabcell consumido-label-r">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t' + consumidos + '\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t<div class="twostats">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="statrectdef graystat"></div>\n' +
                '\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="autocont f-mini roboto-r f-black vcenter">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="tabcell disponible-label-r">\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t' + disponibles + '\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t\t\t\t\t\t</div>\n' +
                '\t\t\t\t\t\t\t\t\t</div>';

            return html;
        },

        changeSubscriberVoz: function(e) {

            var currentIndex = $(e.currentTarget).data('index'),
                subscribers = app.utils.Storage.getSessionItem('subscribers-info'),
                selectedAccount = app.utils.Storage.getSessionItem('selected-account'),
                activeSubscriber = subscribers[currentIndex];

            var htmlID = '#voz-phone'+currentIndex;

            if ($(e.currentTarget).data('search-info') == true) {
                // set flag search data
                $(e.currentTarget).data('search-info', false);
            } else {
                $(e.currentTarget).data('search-info', true);

                var usage = activeSubscriber.usageInfoField;

                // update the subscriber
                app.utils.Storage.setSessionItem('selected-subscriber-value', activeSubscriber.subscriberNumberField);
                app.utils.Storage.setSessionItem('selected-subscriber', activeSubscriber);

                $(htmlID).find('.ciclo-fact').html(selectedAccount.CycleDate);

                $(htmlID).find('.minutes-used').html(usage.minutesUsageField);

                $(htmlID).find('.voz-used').html(usage.lDUsageField);

                $(htmlID).find('.voz-international-used').html(usage.lDIUsageField);

                $(htmlID).find('.voz-roaming-used').html(usage.roamingUsageField);

                $(htmlID).find('.sms-used').html(usage.sMSUSageField);

                $(htmlID).find('.sms-premium-used').html(usage.sMSPremiunUsageField);

                $(htmlID).find('.mms-used').html(usage.mMSUsageField);

            }
            $(e.currentTarget).toggleClass('mon');
        },

        notifications: function(e) {
            app.router.navigate('manage_notifications', {
                trigger: true,
                replace: true
            });
        },

        additionalDataPlan: function(e) {
            app.router.navigate('data_plan', {
                trigger: true,
                replace: true
            });
        },

        consumptionLimit: function(e) {
            app.router.navigate('consumption_limit', {
                trigger: true,
                replace: true
            });
        }
    });
});