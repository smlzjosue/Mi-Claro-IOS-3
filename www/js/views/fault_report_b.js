$(function() {

    app.views.FaultReportBView = app.views.CommonView.extend({

        name: 'fault_report_b',

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

            var selectedSubscriber = app.utils.Storage.getSessionItem('fault-selected-subscriber');

            var self = this,
                variables = {
                    selectedSubscriber: app.utils.tools.formatSubscriber(selectedSubscriber),
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

            var number1 = $.mobile.activePage.find('#number_1').val();
            var number2 = $.mobile.activePage.find('#number_2').val();
            var description = $.mobile.activePage.find('#description').val();

            if (number1.length == 0 && number2.length == 0) {
                message = 'Debes ingresar al menos 1 numero de contacto.';
                showAlert('Error', message, 'Aceptar');
                return;
            }
            if (description.length == 0) {
                message = 'Debes ingresar una breve explicacíon.';
                showAlert('Error', message, 'Aceptar');
                return;
            }

            app.utils.Storage.setSessionItem('fault-selected-line', $('#radio_1').is(':checked') ? 1 : 2);
            app.utils.Storage.setSessionItem('fault-selected-contact_1', number1);
            app.utils.Storage.setSessionItem('fault-selected-contact_2', number2);
            app.utils.Storage.setSessionItem('fault-selected-description', description);

            app.router.navigate('fault_report_c', {
                trigger: true,
                replace: true
            });
        }

    });

});
