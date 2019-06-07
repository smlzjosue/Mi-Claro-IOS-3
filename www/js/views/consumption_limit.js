$(function() {

	// Consumption Limit View
	// ---------------
	
	app.views.ConsumptionLimitView = app.views.CommonLogoutView.extend({

		name:'consumption_limit',
		
		// The DOM events specific.
		events: {
			
			// content

				
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
