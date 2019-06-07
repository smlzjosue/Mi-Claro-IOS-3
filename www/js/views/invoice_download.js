$(function() {

    app.views.InvoiceDownloadView = app.views.CommonView.extend({

        name: 'invoice_download',

        // The DOM events specific.
        events: {
            // events
            'pagecreate':                           'pageCreate',

            'change #select-year':                  'changeYear',
            'click #open-chat':                     'chat',
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
            self.getHistoricoFacturas(moment().format('YYYY'));
        },

        changeYear: function(){
            var self = this;
            var selectedYear = $.mobile.activePage.find('#select-year').val();
            var year = parseInt(selectedYear)+2000;
            self.getHistoricoFacturas(year);
        },

        getHistoricoFacturas: function(year){
            var self = this;
            var accountInfo = app.utils.Storage.getSessionItem('account-info');
            var account = accountInfo.bANField;
            self.options.paymentModel.getHistoricoFacturas(account, year,
                function (success) {
                    if (!success.hasError) {
                        var invoices = success.Invoices;
                        var html = '';
                        $.each(invoices, function(index, invoice) {
                            html +=
                                '<div class="tab-cbar evless' + (self.isPair(index) ? ' bg-gray' : '') +'">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t<div class="frwds dscgaf-i rline vcenter">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t<div class="tabcell">\n' +
                                invoice.BillDate + '\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                '\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t<div class="frwds dscgaf-i rline vcenter">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t<div class="tabcell">\n' +
                                invoice.DueDate + '\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                '\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t<div class="frwds dscgaf-i rline vcenter">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t<div class="tabcell">\n' +
                                invoice.AmountDue + '\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                '\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t<div class="frwds dscgaf-ii vcenter">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t<div class="tabcell">\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="actbtn">\n' +
                                '<a title="icono" href="'+invoice.UrlPDF+'">\n'+
                                '<i class="fa fa-file-text" aria-hidden="true"></i>\n' +
                                '</a>\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                '\t\t\t\t\t\t\t\t\t\t</div>';
                            // html +=
                            //     '\t\t\t\t\t\t\t\t\t<div class="tab-cbar evless' + (self.isPair(index) ? ' bg-gray' : '') +'">\n' +
                            //     '\t\t\t\t\t\t\t\t\t\t<div class="frwds dscgaf-i rline vcenter">\n' +
                            //     '\t\t\t\t\t\t\t\t\t\t\t<div class="tabcell">\n' +
                            //                                 invoice.BillDate + '\n' +
                            //     '\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                            //     '\t\t\t\t\t\t\t\t\t\t</div>\n' +
                            //     '\n' +
                            //     '\t\t\t\t\t\t\t\t\t\t<div class="frwds dscgaf-i rline vcenter">\n' +
                            //     '\t\t\t\t\t\t\t\t\t\t\t<div class="tabcell">\n' +
                            //                                 invoice.DueDate + '\n' +
                            //     '\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                            //     '\t\t\t\t\t\t\t\t\t\t</div>\n' +
                            //     '\n' +
                            //     '\t\t\t\t\t\t\t\t\t\t<div class="frwds dscgaf-i rline vcenter">\n' +
                            //     '\t\t\t\t\t\t\t\t\t\t\t<div class="tabcell">\n' +
                            //                                 invoice.AmountDue + '\n' +
                            //     '\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                            //     '\t\t\t\t\t\t\t\t\t\t</div>\n' +
                            //     '\n' +
                            //     '\t\t\t\t\t\t\t\t\t\t<div class="frwds dscgaf-ii vcenter">\n' +
                            //     '\t\t\t\t\t\t\t\t\t\t\t<div class="tabcell">\n' +
                            //     '\t\t\t\t\t\t\t\t\t\t\t\t<div class="actbtn">\n' +
                            //     '\t\t\t\t\t\t\t\t\t\t\t\t\t<i class="fa fa-file-text" aria-hidden="true"></i>\n' +
                            //     '\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                            //     '\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                            //     '\t\t\t\t\t\t\t\t\t\t</div>\n' +
                            //     '\n';
                        });
                        $('#table_f').html(html);
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
