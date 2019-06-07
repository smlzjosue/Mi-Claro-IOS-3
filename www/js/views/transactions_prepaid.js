$(function() {

    // Register step 1 View
    // ---------------

    app.views.TransactionsPrepaidView = app.views.CommonView.extend({

        name: 'transactions_prepaid',

        // The DOM events specific.
        events: {
            // events
            'pagecreate':                           'pageCreate',

            'click #search':                        'search',
            'click #return':                        'back',
        },

        // Render the template elements
        render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            var now = moment(),
                years = [];

            // Years
            for (var i = 5; i > 0; i--) {
                years.push(now.format('YYYY'));
                now.add(-1, 'years');
            }

            var subscribers = app.utils.Storage.getSessionItem('subscribers-info');
            var selectedSubscriberValue = app.utils.Storage.getSessionItem('selected-subscriber-value');
            var subscriberObj = null;
            $.each(subscribers, function(index, subscriber) {
                if (subscriber.subscriberNumberField == selectedSubscriberValue) {
                    subscriberObj = subscriber;
                }
            });

            const currentMonth = new Date().getMonth();

            const status = ['Estatus', 'Aprobada', 'Rechazada', 'Error'];
            const types = ['Transacciones', 'Recarga de Prepago', 'Transaferencia de Dinero', 'Cambio de Plan'];
            const months = [
                { name: 'Enero', id: 0 },
                { name: 'Febrero', id: 1 },
                { name: 'Marzo', id: 2 },
                { name: 'Abril', id: 3 },
                { name: 'Mayo', id: 4 },
                { name: 'Junio', id: 5 },
                { name: 'Julio', id: 6 },
                { name: 'Agosto', id: 7 },
                { name: 'Septiembre', id: 8 },
                { name: 'Octubre', id: 9 },
                { name: 'Noviembre', id: 10 },
                { name: 'Diciembre', id: 11 }
            ];

            var self = this,
                variables = {
                    typeOfTelephony: app.utils.tools.typeOfTelephony,
                    subscriberObj: subscriberObj,
                    status: status,
                    types: types,
                    years: years,
                    months: months,
                    currentMonth: currentMonth,
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
        },

        search: function (e) {
            var self = this;

            $('#container-trans').hide();

            const year = $.mobile.activePage.find('#select-year').val();
            const month = $.mobile.activePage.find('#select-month').val();
            const status = $.mobile.activePage.find('#select-status').val();
            const type = $.mobile.activePage.find('#select-type').val();

            var selectedSubscriberValue = app.utils.Storage.getSessionItem('selected-subscriber-value');
            const idCustomerCard = app.utils.Storage.getSessionItem('prepaid-customer-card-id');

            self.options.paymentModel.prepaidHistory(
                selectedSubscriberValue,
                idCustomerCard,
                0,
                parseFloat(year),
                parseFloat(month),
                status,
                type,
                function (success) {
                    if (success.success) {
                        if (success.formTransactions != null) {
                            $('#container-trans').show();
                            var html = '';
                            if (success.formTransactions.length > 0) {
                                $.each(success.formTransactions, function(index, transaction) {
                                    html +=
                                        '<div class="basicrow m-top">\n' +
                                        '\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t<div class="userinfo full nomtops">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="basicrow f-black roboto-b f-bmed">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\tTransacci&oacute;n: '+transaction.transactionId+'\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                        '\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="redstat m-top-ii">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="autorow roboto-r pull-left">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'+transaction.nameProductType+'\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                        '\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="autorow roboto-b pull-right">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'+transaction.nameProduct+'\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                        '\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="redstat m-top-ii">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="autorow roboto-r pull-left">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tEstatus\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                        '\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="autorow roboto-b pull-right">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'+transaction.status+'\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                        '\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="redstat m-top-ii">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="autorow roboto-r pull-left">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tFecha\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                        '\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="autorow roboto-b pull-right">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t'+new Date(transaction.date).toLocaleString()+'\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                        '\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="redstat m-top-ii">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="autorow roboto-r pull-left">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tMonto\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                        '\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class="autorow roboto-b f-red pull-right">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t&#36;'+app.utils.tools.formatAmount(transaction.amount)+'\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t</div>\n';
                                });
                                $('#container-transactions').html(html);
                            } else {
                                $('#container-transactions').html(
                                    '<div class="basicrow m-top">\n' +
                                    '        Estimado cliente no existen registros de acuerdo a su busqueda.\n' +
                                    '</div>'
                                );
                            }

                            $([document.documentElement, document.body]).animate({
                                scrollTop: $('#return').offset().top-40
                            }, 1000);
                        }
                    } else {
                        showAlert('Error', success.error, 'Aceptar');
                    }
                },
                app.utils.network.errorRequest
            )
        }

    });

});
