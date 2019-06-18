$(function() {

    // Register step 1 View
    // ---------------

    app.views.RefiereStep3 = app.views.CommonView.extend({

        name: 'refiere_step_3',

        // The DOM events specific.
        events: {
            'pagecreate':                               'pageCreate',
            // content
            'click #btn-next':                          'next',
            'click #pay-invoice':                       'navigateHome'
        },

        // Render the template elements
        render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            var referrerData = app.utils.Storage.getSessionItem('referrer-data');

            var self = this,
                variables = {
                    account: referrerData.account,
                    subscriber: referrerData.subscriber,
                    accountName: app.utils.Storage.getSessionItem('name'),
                    name: app.utils.Storage.getSessionItem('name'),
                    accountSections: this.getUserAccess(),
                    convertCaseStr: app.utils.tools.convertCase,
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

        pageCreate: function(e){
            var self = this;
            // removing any enter event
            $('body').unbind('keypress');
            self.activateMenu(e);
            self.getUserCredits(e);
        },

        getUserCredits: function(e) {
            var self = this;
            var selectedAccountValue = app.utils.Storage.getSessionItem('selected-account-value');
            self.options.referrerModel.getCredits(selectedAccountValue,
                function (success) {
                    if (!success.hasError) {
                        var accountName = success.CreditItems[0].accountName;
                        var totalCredits = success.CreditItems[0].TotalCredits;
                        var totalRedeem = success.CreditItems[0].TotalRedeem;
                        var totalPending = success.CreditItems[0].CountPending;
                        var sumAvialable = success.CreditItems[0].TotalAvailable;

                        $('#accountName').html(accountName+'');
                        $('#totalCredits').html(totalCredits+'');
                        $('#totalRedeem').html(totalRedeem+'');
                        $('#totalPending').html(totalPending+'');
                        $('#sumAvialable').html('$'+sumAvialable);

                        self.getUserRedeemCredits(e);

                    } else {
                        self.navigateReferSystem(e);
                        showAlert('Error', response.errorDisplay, 'Aceptar');
                    }
                },
                function (data, status, error) {
                    self.navigateReferSystem(e);
                    app.utils.network.errorRequest(data, status, error);
                });
        },

        getUserRedeemCredits: function(e) {
            var self = this;
            var selectedAccountValue = app.utils.Storage.getSessionItem('selected-account-value');
            self.options.referrerModel.getReferrerAccountsAllStatus(selectedAccountValue,
                function (success) {
                    if (!success.hasError) {
                        if (success.objItems) {
                            var html = '';
                            if (success.objItems == null || success.objItems.length == 0) {
                                $('#redeemNone').show();
                                $('#redeemCreditsList').hide();
                            } else {
                                success.objItems.forEach(function (item) {
                                    html = html + '\t\t\t\t<div class="onew-cont redeemd">\n' +
                                        '\t\t\t\t\t\t\t\t\t<div class="onew-spc-i roboto-b vcenter">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t<div class="tabcell">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t<i class="fa fa-ticket" aria-hidden="true"></i> $'+item.discountMember+'\n' +
                                        '\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                        '\t\t\t\t\t\t\t\t\t</div>\n' +
                                        '\n' +
                                        '\t\t\t\t\t\t\t\t\t<div class="onew-spc-ii roboto-b vcenter">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t<div class="tabcell">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\t'+item.ReferAccountName+'\n' +
                                        '\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                        '\t\t\t\t\t\t\t\t\t</div>\n' +
                                        '\n' +
                                        '\t\t\t\t\t\t\t\t\t<div class="onew-spc-iii text-center vcenter">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t<div class="tabcell">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\tVigente desde el '+item.validFromDate+' al '+item.validUntilDate+'\n' +
                                        '\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                        '\t\t\t\t\t\t\t\t\t</div>\n' +
                                        '\n' +
                                        '\t\t\t\t\t\t\t\t\t<div class="onew-spc-iii roboto-b text-center vcenter">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t<div class="tabcell">\n' +
                                        '\t\t\t\t\t\t\t\t\t\t\tEstatus: '+item.cuponStatus+'\n' +
                                        '\t\t\t\t\t\t\t\t\t\t</div>\n' +
                                        '\t\t\t\t\t\t\t\t\t</div>\n' +
                                        '\t\t\t\t\t\t\t\t</div>'
                                });
                                $('#redeemNone').hide();
                                $('#redeemCreditsList').show();
                                $('#redeemCreditsList').html(html);
                            }
                        }

                    } else {
                        self.navigateReferSystem(e);
                        showAlert('Error', response.errorDisplay, 'Aceptar');
                    }
                },
                function (data, status, error) {
                    self.navigateReferSystem(e);
                    app.utils.network.errorRequest(data, status, error);
                });
        },

        next: function(e) {
            //Go to next
            app.router.navigate('refiere_step_4', {
                trigger: true
            });
        }

    });

});
