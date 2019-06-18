$(function() {

    app.views.FaultReportAView = app.views.CommonView.extend({

        name: 'fault_report_a',

        // The DOM events specific.
        events: {
            // events
            'pagecreate':                               'pageCreate',

            // content
            'click #next_step':					        'nextStep',
            'click #return':                            'back'
        },

        // Render the template elements
        render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            var self = this,
                variables = {
                    subscribers: app.utils.Storage.getSessionItem('subscribers-info'),
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

        nextStep: function(e){

            const subscriber = $.mobile.activePage.find('#select-subscriber').val();
            app.utils.Storage.setSessionItem('fault-selected-subscriber', subscriber);

            app.utils.Storage.setSessionItem('fault-selected-type', $('#radio_1').is(':checked') ? 1 : 2);
            app.utils.Storage.setSessionItem('fault-selected-subscriber', subscriber);

            app.router.navigate('fault_report_b', {
                trigger: true,
                replace: true
            });
        },

    });

});
