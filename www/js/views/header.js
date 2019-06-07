$(function() {

	// Help View
	// ---------------
	
	app.views.HeaderView = app.views.CommonView.extend({

		name:'header',
		
		// The DOM events specific.
		events: {
			
			// content
			
			// footer
			'click #btn-help':						'helpSection'				
				
		},

		// Render the template elements        
		render: function(callback) {
			
			var self = this,
				variables = {
				    showBackBth: false
				};
			
			app.TemplateManager.get(self.name, function(code){
		    	var template = cTemplate(code.html());
		    	$(self.el).html(template(variables));	
		    	callback();	
		    	return this;
		    });					
		
		},
	});
});
