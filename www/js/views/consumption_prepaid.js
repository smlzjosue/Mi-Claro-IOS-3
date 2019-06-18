$(function() {

    // Register step 1 View
    // ---------------

    app.views.ConsumptionPrepaidView = app.views.CommonView.extend({

        name: 'consumption_prepaid',

        // The DOM events specific.
        events: {

            // events
            'pagecreate':                               'pageCreate',

            // Content
            'change #select-account':                   'simpleChangeAccount',
            'click .select-subscriber':                 'changeSubscriber'
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

            $(e.currentTarget).toggleClass('mon');

            if ($(e.currentTarget).data('search-info') == true) {
                $(e.currentTarget).data('search-info', false);
                return;
            }
            $(e.currentTarget).data('search-info', true);

            const usageInfo = subscriber.usageInfoField;

            $(htmlID).find('.minutes').html(usageInfo.minutesUsageField); // TODO revisar
            var sms = parseFloat(usageInfo.sMSUSageField) + parseFloat(usageInfo.mMSUsageField); // TODO revisar
            $(htmlID).find('.sms').html(String(sms));

            var used = 0;
            var quota = 0;
            const dataInfo = usageInfo.dataOffersField;
            if (dataInfo != null && dataInfo.length > 0) {
                $.each(dataInfo, function(index, data) {
                    used += parseFloat(data.usedField);
                    quota += parseFloat(data.quotaField);
                });
            }

            $(htmlID).find('.mb-text').html(app.utils.tools.transformAvailable(used) + ' USADOS');

            var usagePercentage = Math.round(100.0 * (used / quota));
            if (usagePercentage == 0 && used > 0) {
                usagePercentage = 1;
            }

            $(htmlID).find('.mb-perc').css('width', usagePercentage+'%');
        },

    });

});
