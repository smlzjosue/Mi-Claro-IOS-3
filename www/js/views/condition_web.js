$(function() {

	// Help Pin View
	// ---------------
	
	app.views.ConditionWebView = app.views.CommonLogoutView.extend({

		name:'condition_web',
		
		// The DOM events specific.
		events: {
			
			// content
			'click  #btn-back': 						'back'
				
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
