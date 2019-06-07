$(function() {

	// Help email View
	// ---------------
	
	app.views.HelpEmailView = app.views.CommonLogoutView.extend({

		name:'help_email',
		
		// The DOM events specific.
		events: {
			
			// content
			'click  #btn-back': 						'back',	
			
   			// footer
   			'click  #btn-help'							:'help'
				
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