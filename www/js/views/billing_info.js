$(function() {

	// BillingInfo View
	// ---------------
	
	app.views.BillingInfoView = app.views.CommonView.extend({

		name:'billing_info',
		
		// The DOM events specific.
		events: {				
			
			// header
           'click .btn-back': 						'invoice',   
           
			// footer
			'click #btn-help':						'helpSection'	
        	   
		},	
		
		render:function (callback) {

			var  self = this,
				 subscriber = null,
				 variables = null;
			
			// user hasn't logged in
			if(app.utils.Storage.getSessionItem('token') == null){
				
				document.location.href = 'index.html';
				
			}else{
				
				variables = {
						accounts: app.utils.Storage.getSessionItem('accounts-list'),					
						selectedAccountValue: app.utils.Storage.getSessionItem('selected-account-value'),
						selectedAccount: app.utils.Storage.getSessionItem('selected-account'),
						showBackBth: true,
					};
					
				app.TemplateManager.get(self.name, function(code){
			    	var template = cTemplate(code.html());
			    	$(self.el).html(template(variables));	
			    	callback();	
			    	return this;
			    });			
				
			}
			
		}		
	
	});
});
