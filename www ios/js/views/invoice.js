$(function() {

	// Home View
	// ---------------
	
	app.views.InvoiceView = app.views.CommonView.extend({

		name:'invoice',
		
		// The DOM events specific.
		events: {
        	// evets
            'pagecreate':									'pageCreate',
	           
	        // content	
            'change #select-account':						'simpleChangeAccount',
            'click 	#btn-bill': 							'billPayment',
            'click	#btn-view':								'navigateInvoiceDownload',
            'click 	#btn-debit':                    		'debitDirect',
            'click 	#btn-history':                    		'navigatePaymentHistory',
            'click 	#btn-details':                    		'navigateInvoiceDetails',
		},
	
		
		// Render the template elements        
		render:function (callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

			var self = this,
				variables = {};

			var accountInfo = app.utils.Storage.getSessionItem('account-info');

			var amountDue = accountInfo.billBalanceField;
			var lastPaymentAmount = accountInfo.lastPaymentAmountField;
            lastPaymentAmount = parseFloat(String(lastPaymentAmount)).toFixed(2);
            lastPaymentAmount = app.utils.tools.formatAmount(lastPaymentAmount);
			var amountPayable = amountDue.includes('CR') ? '0' : accountInfo.billBalanceField;
            amountPayable = parseFloat(String(amountPayable.replace(',',''))).toFixed(2);

			variables = {
				amountDue: amountDue,
                lastPaymentAmount: lastPaymentAmount,
				amountPayable: amountPayable.replace(',',''),
				accountInfo: accountInfo,
				accounts: this.getSelectTabAccounts(),
				selectedTab: app.utils.Storage.getSessionItem('selected-tab'),
				selectedAccount: app.utils.Storage.getSessionItem('selected-account'),
				accountSections: this.getUserAccess(),
				showBackBth: true
			};

			app.TemplateManager.get(self.name, function(code){
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

            $('#due-amount').on('click focus', function (e) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $("#due-amount").offset().top-50
                }, 1000);
            });
		},

        debitDirect: function(e) {
             app.router.navigate('debit_direct', {
                 trigger: true
             });
        },

		billPayment: function(e){
            var self = this,
                accountInfo = app.utils.Storage.getSessionItem('account-info'),
                amountDue = parseFloat($('#due-amount').val()),
                creditAmountDue = accountInfo.billBalanceField.includes('CR') ? accountInfo.billBalanceField.replace('CR','') : 0,
                billBalance = accountInfo.billBalanceField.includes('CR') ? 0 : accountInfo.billBalanceField,
                selectedAccountValue = app.utils.Storage.getSessionItem('selected-account-value');
            creditAmountDue = parseFloat(String(creditAmountDue).replace(',',''));
            billBalance = parseFloat(String(billBalance).replace(',',''));

			// Escape, if the loader it's showing
			if(app.utils.loader.isVisible()){
			    return;
			}

            $('#due-amount').val(parseFloat(String(amountDue)).toFixed(2));

            if (!$.isNumeric(amountDue)){
                showAlert('Error','El monto a pagar no es un número válido.','Aceptar');
                return;
            } else if (amountDue < 5) {
                showAlert('Error','El monto no puede ser menor a $5.00','Aceptar');
                return;
            } else if (amountDue > 800) {
                showAlert('Error','El monto no puede ser mayor a $800.00','Aceptar');
                return;
            } else if (creditAmountDue > 0){
                if ((creditAmountDue + amountDue) > 800) {
                    showAlert('Error','El monto total abonado en su cuenta no puede ser mayor a $800.00','Aceptar');
                    return;
                }
                self.doPayment(amountDue, selectedAccountValue);
            } else if (amountDue > billBalance) {
                showConfirm(
                    'Confirmación',
                    'La cantidad ingresada es mayor al balance de su factura, la diferencia será acreditada a su cuenta.',
                    ['Cancelar','Pagar'],
                    function(button){
                        if(button == 2) {
                            self.doPayment(amountDue, selectedAccountValue);
                        }
                    }
                );
            } else {
                self.doPayment(amountDue, selectedAccountValue);
            }
		},
		
	});
  
});