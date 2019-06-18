$(function() {

    app.views.FaultReportCView = app.views.CommonView.extend({

        name: 'fault_report_c',

        // The DOM events specific.
        events: {
            // events
            'pagecreate':                               'pageCreate',
            'click #ok_action':                         'navigateHome',
        },

        // Render the template elements
        render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            var selectedSubscriber = app.utils.Storage.getSessionItem('fault-selected-subscriber');

            var self = this,
                variables = {
                    subscriber: app.utils.tools.formatSubscriber(selectedSubscriber),
                    accounts: this.getSelectTabAccounts(),
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

    });

});
