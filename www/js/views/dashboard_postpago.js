$(function() {

	// Help View
	// ---------------
	
	app.views.DashboardPostpago = app.views.CommonView.extend({

		name:'dashboard_postpago',
		
		// The DOM events specific.
		events: {
				
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
		
		}
	});
});
