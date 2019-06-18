$(function() {

	// Help View
	// ---------------
	
	app.views.HeaderHelpView = app.views.CommonView.extend({

		name:'header_help',
		
		// The DOM events specific.
		events: {
			// content
		},

		// Render the template elements        
		render: function(callback) {
			
			var self = this,
				variables = {};
			
			app.TemplateManager.get(self.name, function(code){
		    	var template = cTemplate(code.html());
		    	$(self.el).html(template(variables));	
		    	callback();	
		    	return this;
		    });					
		
		},
	});
});
