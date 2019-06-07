$(function() {

	// Data Plan View
	// ---------------
	
	app.views.PaymentConfirmationView = app.views.CommonLogoutView.extend({

		name:'payment_confirmation',
		
		// The DOM events specific.
		events: {
			
			// header
			 'click .btn-back'						:'back'

				
		},

		// Render the template elements        
		render: function(callback) {
			
			var self = this,
				variables = {
				    showBackBth: true
				};
			
			app.TemplateManager.get(self.name, function(code){
		    	var template = cTemplate(code.html());
		    	$(self.el).html(template(variables));	
		    	callback();	
		    	return this;
		    });					
		
		}
	
	});
});
