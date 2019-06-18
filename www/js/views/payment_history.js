$(function() {

    app.views.PaymentHistoryView = app.views.CommonView.extend({

        name: 'payment_history',

        // The DOM events specific.
        events: {
            // events
            'pagecreate':                               'pageCreate',

            // Content
            'change #select-account':                   'simpleChangeAccount',
            'change #select-year':                      'changeYear',
        },

        // Render the template elements
        render: function(callback) {

            var now = moment();
            years = [];

            for (var i = 2; i > 0; i--) {
                years.push(now.format('YYYY'));
                now.add(-1, 'years');
            }

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            var self = this,
                variables = {
                    accounts: this.getSelectTabAccounts(),
                    selectedTab: app.utils.Storage.getSessionItem('selected-tab'),
                    selectedAccount: app.utils.Storage.getSessionItem('selected-account'),
                    years: years,
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
            self.paymentHistory(moment().format('YYYY'));
        },

        changeYear: function(){
            var self = this;
            var selectedYear = $.mobile.activePage.find('#select-year').val();
            var year = parseInt(selectedYear)+2000;
            self.paymentHistory(year);
        },

        paymentHistory: function(year){
            var self = this;
            var accountInfo = app.utils.Storage.getSessionItem('account-info');
            var account = accountInfo.bANField;
            self.options.paymentModel.paymentHistory(account, year,
                function (success) {
                    if (!success.hasError) {
                        var paymentHistory = success.PaymentHistory;
                        var html = '';
                        $.each(paymentHistory, function(index, payment) {

                            html +=
                                '\t\t\t\t\t\t\t\t\t<div class="tab-cbar evless' + (self.isPair(index) ? ' bg-gray' : '') +'">\n' +
                                '\t\t\t\t\t\t\t\t\t\t<div class="frwds frths rline vcenter">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t<div class="tabcell">\n' +
                                                            payment.Fecha + '\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                '\n' +
                                '\t\t\t\t\t\t\t\t\t\t<div class="frwds frths rline vcenter">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t<div class="tabcell">\n' +
                                                            payment.Metodo + '\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                '\n' +
                                '\t\t\t\t\t\t\t\t\t\t<div class="frwds frths rline vcenter">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t<div class="tabcell">\n' +
                                                            payment.Status + '\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                '\n' +
                                '\t\t\t\t\t\t\t\t\t\t<div class="frwds frths vcenter">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t<div class="tabcell">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t\t<span class="roboto-b">\n' +
                                                            payment.Cantidad + '\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t\t</span>\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t\t\t\t\t\t</div>\n' +
                                '\n';
                        });
                        
                        $('#table').html(html);

                    } else {
                        showAlert('Error', success.ErrorDesc, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            )
        },

        isPair: function(num) {
            return num % 2;
        },

    });

});
