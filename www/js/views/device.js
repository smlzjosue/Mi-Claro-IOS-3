$(function() {

    // Device View
    // ---------------

    app.views.DeviceView = app.views.CommonView.extend({

        name: 'device',

        // The DOM events specific.
        events: {

            // events
            'pagecreate':                               'pageCreate',

            // content
            'change #select-account':                   'simpleChangeAccount',

            'click #details-plan':                      'showDetailsPlan',
            'click #details-device':                    'showDetailsDevice',
            'click .select-subscriber-plan':            'changeSubscriberPlan',
            'click .select-subscriber-device':          'changeSubscriberDevice',
            'click .btn-fixed-failure':                 'goFixedFailureReport',
            'click .btn-pay-quota':                     'goPayQuota',
            'click .btn-change-plan':                   'goChangePlan',

            // toggle
            'click .sectbar': 'toggleClass',
            'click .phonebar': 'toggleClass',

        },

        // Render the template elements
        render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            var subscribers = app.utils.Storage.getSessionItem('subscribers-info'),
                accountInfo = app.utils.Storage.getSessionItem('account-info'),
                dsl = accountInfo.accountSubtypeField == 'W' && accountInfo.accountTypeField == 'I';

            var self = this,
                variables = {
                    typeOfTelephony: app.utils.tools.typeOfTelephony,
                    subscribers: subscribers,
                    accounts: this.getSelectTabAccounts(),
                    dsl: dsl,
                    formatNumber: app.utils.tools.formatSubscriber,
                    selectedTab: app.utils.Storage.getSessionItem('selected-tab'),
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
                $('.select-subscriber-plan').eq(0).trigger('click');
                $('.select-subscriber-device').eq(0).trigger('click');
            }


            app.utils.Storage.setSessionItem('selected-subscriber', subscribers[0]);
        //     app.router.navigate('device_payment_1', { // TODO, borrar/acomodar
        //         trigger: true
        //     });
        },

        goPayQuota: function(e) {
            var currentIndex = $(e.currentTarget).data('index'),
                subscribers = app.utils.Storage.getSessionItem('subscribers-info'),
                subscriber = subscribers[currentIndex];
            app.utils.Storage.setSessionItem('selected-subscriber', subscriber);
            //Go to Pay Quotas Device
            app.router.navigate('device_payment_1', {
                trigger: true
            });
        },

        goChangePlan: function(e) {
            app.router.navigate('change_plan', {
                trigger: true
            });
        },

        changeSubscriberPlan: function(e) {  // TODO, se deben verificar todos los mapeos

            var currentIndex = $(e.currentTarget).data('index'),
                subscribers = app.utils.Storage.getSessionItem('subscribers-info'),
                subscriber = subscribers[currentIndex];

            var plan = subscriber.planInfoField;

            var planFullName = plan.sOCDescriptionField;
            var planName = planFullName.split(':')[0].trim();
            var planAmount = plan.socRateField;
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

            var htmlID = '#subscriber-plan'+currentIndex;

            $(htmlID).find('.plan-name').html(planFullName);
            $(htmlID).find('.plan-amount').html('$'+app.utils.tools.formatAmount(planAmount));
            $(htmlID).find('.plan-packs').html(htmlPacks);
            $(htmlID).find('.total-rent').html('$'+app.utils.tools.formatAmount(totalRent));

            if (subscriber.equipmentInfoField.installmentValueField != null && subscriber.equipmentInfoField.installmentValueField != 'not_set') {
                var equipmentInfo = subscriber.equipmentInfoField;

                $(htmlID).find('.equipment-installments').show();
                $(htmlID).find('.equipment-name').html(equipmentInfo.itemDescriptionField);
                if (equipmentInfo.installmentValueField == 'not_set') {
                    $(htmlID).find('.equipment-quota').hide();
                } else {
                    $(htmlID).find('.equipment-quota').show();
                    $(htmlID).find('.equipment-quota').html('&#36;'+app.utils.tools.formatAmount(equipmentInfo.installmentValueField));
                }
                if (equipmentInfo.installmentValueField == 'not_set') {
                    $(htmlID).find('.equipment-remaining').html('No disponible');
                } else {
                    $(htmlID).find('.equipment-remaining').html(equipmentInfo.installmentsField);
                }

            } else {
                $(htmlID).find('.equipment-installments').hide();
            }

            if (subscriber.servSVAInfoField.servSVAsField.length > 0) {

                var htmlSVA = '<div class="basicrow f-bmed roboto-b m-bott-ii">\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tServicios Adicionales\n' +
                    '\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>';
                subscriber.servSVAInfoField.servSVAsField.forEach(function(sva) {
                    htmlSVA += '<div class="redstat m-top-ii">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="autorow roboto-r pull-left">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'+sva.sOCDescField+'\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                        '\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="autorow roboto-b pull-right">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t&#36;'+app.utils.tools.formatAmount(sva.socRateField)+'\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>';
                });

                $(htmlID).find('.additional-services-content').html(htmlSVA);

                $(htmlID).find('.additional-services').show();

            } else {
                $(htmlID).find('.additional-services').hide();
            }

            $(e.currentTarget).toggleClass('mon');
        },

        changeSubscriberDevice: function(e) {

            var currentIndex = $(e.currentTarget).data('index'),
                subscribers = app.utils.Storage.getSessionItem('subscribers-info'),
                subscriber = subscribers[currentIndex];

            var info = subscriber.equipmentInfoField;

            var image = info.itemImageField;

            var brand = info.itemBrandField == 'no_set' ? "No disponible" : info.itemBrandField;

            var htmlID = '#subscriber-device'+currentIndex;

            $(htmlID).find('.equipment-name').html(info.itemDescriptionField);

            $(htmlID).find('.equipment-photo').attr("src", image);

            var id = info.itemIdField;
            var imei = 'No disponible';
            subscriber.servEquipmentSerialsField.servEquipmentSerialField.forEach(function(serial) {
                if (serial.itemIdField == id) {
                    imei = serial.eSNField;
                }
            });

            $(htmlID).find('.equipment-imei').html(imei);

            $(htmlID).find('.equipment-brand').html(brand);

            $(e.currentTarget).toggleClass('mon');
        },
        
        showDetailsPlan: function() {
            $('#details-plan').addClass('on');
            $('#details-device').removeClass('on');

            $('.list-plan').show();
            $('.list-device').hide();
        },

        showDetailsDevice: function() {
            $('#details-plan').removeClass('on');
            $('#details-device').addClass('on');

            $('.list-plan').hide();
            $('.list-device').show();
        },

    });
});
