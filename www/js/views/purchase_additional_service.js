$(function() {

    app.views.PurchaseServiceView = app.views.CommonView.extend({

        name: 'purchase_additional_service',

        // The DOM events specific.
        events: {
            // event
            'pagecreate':                                   'pageCreate',
            'active':                                       'active',

            // content
            'change #select-account':						'simpleChangeAccount',
            'click .select-subscriber':                     'changeSubscriber',
        },

        // Render the template elements
        render: function(callback) {
            var subscribers = app.utils.Storage.getSessionItem('subscribers-info');

            var self = this,
                variables = {
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

        },

        pageCreate: function(e) {
            var self = this;
            self.activateMenu(e);
        },

        changeSubscriber: function(e) {
            var self = this;

            var currentIndex = $(e.currentTarget).data('index'),
                subscribers = app.utils.Storage.getSessionItem('subscribers-info'),
                selectedAccount = app.utils.Storage.getSessionItem('selected-account'),
                subscriber = subscribers[currentIndex];

            var htmlID = '#subscriber'+currentIndex;

            $(e.currentTarget).toggleClass('mon');
            if ($(e.currentTarget).data('search-info') == true) {
                $(e.currentTarget).data('search-info', false);
            } else {
                $(e.currentTarget).data('search-info', true);


            }
        },
    });
});
