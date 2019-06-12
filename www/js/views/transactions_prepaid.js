$(function() {

    // Transaction prepaid View
    // ---------------

    app.views.TransactionsPrepaidView = app.views.CommonView.extend({

        name: 'transactions_prepaid',

        // The DOM events specific.
        events: {
            // events
            'pagecreate':                           'pageCreate',

            'click .select-subscriber':             'changeSubscriber',
            'click .btn-return':                    'back'
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
                    subscribers: subscribers,
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

            const htmlID = '#subscriber'+currentIndex;

            $(e.currentTarget).toggleClass('mon');

            if ($(e.currentTarget).data('search-info') == true) {
                $(e.currentTarget).data('search-info', false);
                return;
            }
            $(e.currentTarget).data('search-info', true);

            $([document.documentElement, document.body]).animate({
                scrollTop: $(htmlID).offset().top-40
            }, 1000);

            $(htmlID).find('.btn-search').click(function(){
                self.search(htmlID, subscriber);
            });
        },

        search: function (target, subscriber) {
            const self = this;

            $(target).find('.container-trans').hide();

            const year = $(target).find('.select-year').val();
            const month = $(target).find('.select-month').val();
            const status = $(target).find('.select-status').val();
            const type = $(target).find('.select-type').val();

            const idCustomerCard = app.utils.Storage.getSessionItem('prepaid-customer-card-id');
            const selectedAccount = app.utils.Storage.getSessionItem('selected-account');

            self.options.paymentModel.prepaidHistory(
                selectedAccount.Account,
                subscriber.subscriberNumberField,
                idCustomerCard,
                0,
                parseFloat(year),
                parseFloat(month),
                status,
                type,
                function (success) {
                    if (success.success) {
                        if (success.formTransactions != null) {
                            $(target).find('.container-trans').show();
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
                                $(target).find('.container-transactions').html(html);
                            } else {
                                $(target).find('.container-transactions').html(
                                    '<div class="basicrow m-top">\n' +
                                    '        Estimado cliente no existen registros de acuerdo a su busqueda.\n' +
                                    '</div>'
                                );
                            }

                            $(target).find('.btn-return').focus();
                            $([document.documentElement, document.body]).animate({
                                scrollTop: $(target).find('.btn-return').offset().top-40
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
