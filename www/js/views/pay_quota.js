$(function() {

    // Pay Quota View
    // ---------------

    app.views.PayQuotaView = app.views.CommonView.extend({

        name: 'pay_quota',

        // The DOM events specific.
        events: {

            //event
            'pagecreate': 'pageCreate',

            // header
            'click .btn-back': 'back',
            'click .btn-menu': 'menu',
            'click .btn-chat': 'chat',
            'click .input-check-container': 'selectNewType',
            'click #continue-1': 'goPayDevicesQuota',
            'click #cancel-1': 'resetPayDevicesQuota',

            'change #select-quotas': 'changeQuotas',

            // nav menu
            'click #close-nav':							'closeMenu',
            'click .close-menu':						'closeMenu',
            'click .open-menu':						    'openMenu',
            'click .btn-account':                       'account',
            'click .btn-consumption':                   'consumption',
            'click .btn-service':                       'service',
            'click .btn-change-plan':                   'changePlan',
            'click .btn-add-aditional-data':            'aditionalDataPlan',
            'click .btn-device':                        'device',
            'click .btn-profile':                       'profile',
            'click .btn-gift':                          'giftSend',
            'click .btn-invoice':                       'invoice',
            'click .btn-notifications':	                'notifications',
            'click .btn-sva':                           'sva',
            'click .btn-gift-send-recharge':            'giftSendRecharge',
            'click .btn-my-order':                      'myOrder',
            'click .btn-logout':                        'logout',
            'click .select-menu':						'clickMenu',

            // footer
            'click #btn-help': 'helpSection'

        },

        // Render the template elements
        render: function(callback) {

            var self = this,
                account = app.utils.Storage.getSessionItem('selected-account'),
                gift = app.utils.Storage.getSessionItem('gift'),
                variables = {};

            var selectSubscriber = app.utils.Storage.getSessionItem('selected-subscriber');
            var subscribers = app.utils.Storage.getSessionItem('subscribers');
            var totalAmount = '';
                                                      
			// remove session variables
 			app.utils.Storage.removeSessionItem('pay-quotas-type');
            app.utils.Storage.removeSessionItem('pay-quotas-amount');
            app.utils.Storage.removeSessionItem('pay-quotas-num');

            $.each(subscribers, function(index, value) {
                if (value.subscriber == selectSubscriber) {
                    var totalRate = value.UpdateRent;
                    totalRate = totalRate.replace('$', '');
                    var rent = parseFloat(totalRate);
                    totalAmount = (value.UpdateMonths * rent);
                    value.totalAmount = totalAmount.toString();

                    app.utils.Storage.setSessionItem('selected-subscriber-info', value);
                }
            });

            variables = {
                subscribers: app.utils.Storage.getSessionItem('subscribers'),
                selectSubscriber: app.utils.Storage.getSessionItem('selected-subscriber'),
                dataSubscriber: app.utils.Storage.getSessionItem('selected-subscriber-info'),
                wirelessAccount: (app.utils.Storage.getSessionItem('selected-account').prodCategory == 'WLS'),
                typeofPay: app.utils.Storage.getSessionItem('pay-quotas-type'),
                accountAccess: this.getUserAccess(),
                convertCaseStr: app.utils.tools.convertCase,
                showBackBth: true
            };

            app.TemplateManager.get(self.name, function(code) {
                var template = cTemplate(code.html());
                $(self.el).html(template(variables));
                app.router.refreshPage();
                callback();
                return this;
            });

        },

        pageCreate: function(e) {
            console.log('pagecreate...');
            var self = this;
        },

        selectNewType: function(e) {

            var self = this;
            // remove all selected input
            $('.input-check-container').removeClass('on');

            // uncheck all the inputs
            $('input[type="checkbox"].css-checkbox').each(function() {
                $(this).prop('checked', false);
            });

            //check the input
            $(e.currentTarget).find('input[type="checkbox"].css-checkbox').prop('checked', true);
            $(e.currentTarget).addClass('on');

            var type = $('input[name=typeofPay]:checked').val();

            app.utils.Storage.setSessionItem('pay-quotas-type', type);

            var value = app.utils.Storage.getSessionItem('selected-subscriber-info');
            var numQuotas = value.UpdateMonths;
            var totalRate = value.UpdateRent;

            if (type == 'Quotas') {

                var htmlData = '<!-- Num of Quotas  -->' +
                    '<div class="autobar diffr">' +
                    '<div class="container">' +
                    '<div class="basicrow">' +
                    '<select class="selln f-bold f-med f-black" id="select-quotas">';

                htmlData += '<option value="">Cuotas</option>';

                for (var i = 1; i <= numQuotas; i++) {
                    htmlData += '<option value="' + i + '">' + i + '</option>';
                }

                htmlData += '</select>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

                $('#numQuotas').html(htmlData);
                $('#totalAmountPay').html('');

                $('input[type=text], #select-quotas').unbind('focus');
                $('input[type=text], #select-quotas').focus(function(e) {
                    e.focus();
                });

                $('input[type=text], #select-quotas').unbind('blur');
                $('input[type=text], #select-quotas').blur(function(e) {
                    self.focusOut();
                });

                $('select').on('click', function(e) {
                    e.preventDefault();
                });

            } else if (type == 'Total') {
                var htmlData = '';
                $('#numQuotas').html(htmlData);

                totalRate = totalRate.replace('$', '');
                var rent = parseFloat(totalRate);
                totalAmount = (numQuotas * rent);
                app.utils.Storage.setSessionItem('pay-quotas-amount', totalAmount);
                app.utils.Storage.setSessionItem('pay-quotas-num', numQuotas);
                totalAmount = totalAmount.toString();
                // New format amount value
                value.totalAmount = totalAmount;
                var newAmountValue = totalAmount.split(".");

                var htmlData2 = '<div class="theight">' +
                    '<span class="tmed-s din-b f-red">$</span>' +
                    '<span class="big-s din-b f-red">' + newAmountValue[0] + '</span>' +
                    '<span class="tmed-s din-b f-red"><span class="tabcell">' + newAmountValue[1] + '</span></span>' +
                    '</div>' +
                    '<div class="basicrow f-little f-bold">Total a Pagar</div>';


                $('#totalAmountPay').html(htmlData2);
            }
        },

        goPayDevicesQuota: function(e) {
            if (!app.utils.Storage.getSessionItem('pay-quotas-type')) {
                showAlert('Error', 'Debe seleccionar una opción de pago.', 'Aceptar');
            } else if (app.utils.Storage.getSessionItem('pay-quotas-type') == 'Quotas' && !(app.utils.Storage.getSessionItem('pay-quotas-num'))) {
                showAlert('Error', 'Debe seleccionar la cantidad de cuotas a pagar.', 'Aceptar');
            } else {

                // send data to services
                var subscriberModel = new app.models.Subscriber();

                var requestSendQuotasDevice = {
                    accountFrom: app.utils.Storage.getSessionItem('selected-account-value'),
                    subscriberFrom: app.utils.Storage.getSessionItem('selected-subscriber-value'),
                    channel: 'IOS',
                    amount: parseFloat(app.utils.Storage.getSessionItem('pay-quotas-amount')).toFixed(2),
                    quantity: app.utils.Storage.getSessionItem('pay-quotas-num'),
                    equipmentName: app.utils.Storage.getSessionItem('selected-subscriber-info').Divice
                };

                subscriberModel.sendQuotasDevice(
                    // parameters
                    requestSendQuotasDevice,
                    // success callback
                    function(success) {

                        if (!success.hasError) {
                            console.log(success.object.transactionId);
                            app.utils.Storage.setSessionItem('pay-quotas-transactionId', success.object.transactionId);
                            // render payment info
                            app.router.navigate('payment_quota_device', {
                                trigger: true
                            });
                            //app.router.navigate('confirm_pay_quota', {trigger: true});
                        } else {
                            // show alert
                            showAlert(
                                'Error',
                                success.desc,
                                'Aceptar',
                                function(e) {}
                            );
                        }

                    },
                    // error callback
                    app.utils.network.errorFunction
                );
            }
        },

        changeQuotas: function(e) {
            var numQuotas = $.mobile.activePage.find('#select-quotas').val();
            var self = this;
                                                         
            if (!numQuotas) {
                showAlert('Error', 'Debe seleccionar la cantidad de cuotas a pagar.', 'Aceptar');
            } else {
                app.utils.Storage.setSessionItem('pay-quotas-num', numQuotas);

                var value = app.utils.Storage.getSessionItem('selected-subscriber-info');
                var totalRate = value.UpdateRent;

                totalRate = totalRate.replace('$', '');
                var rent = parseFloat(totalRate);
                var totalAmount = this.formatNumber(numQuotas * rent);
                app.utils.Storage.setSessionItem('pay-quotas-amount', totalAmount);
                totalAmount = totalAmount.toString();
                                                         
                // New format amount value
                value.totalAmount = totalAmount;
                var newAmountValue = totalAmount.split(".");

                var htmlData2 = '<div class="theight">' +
                    '<span class="tmed-s din-b f-red">$</span>' +
                    '<span class="big-s din-b f-red">' + newAmountValue[0] + '</span>' +
                    '<span class="tmed-s din-b f-red"><span class="tabcell">' + newAmountValue[1] + '</span></span>' +
                    '</div>' +
                    '<div class="basicrow f-little f-bold">Total a Pagar</div>';

                $('#totalAmountPay').html(htmlData2);
            }
        },

        resetPayDevicesQuota: function(e) {
            if (app.utils.Storage.getSessionItem('pay-quotas-type')) {
                app.utils.Storage.removeSessionItem('pay-quotas-type');
            }
            if (app.utils.Storage.getSessionItem('pay-quotas-amount')) {
                app.utils.Storage.removeSessionItem('pay-quotas-amount');
            }
            if (app.utils.Storage.getSessionItem('pay-quotas-num')) {
                app.utils.Storage.removeSessionItem('pay-quotas-num');
            }
            app.router.navigate('device', {
                trigger: true
            });
        }

    });

});
