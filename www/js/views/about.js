$(function() {

	// About View
	// ---------------
	
	app.views.AboutView = app.views.CommonView.extend({

		name:'about',
		
		// The DOM events specific.
		events: {
			
			// header
			'click #btn-back'					:'toReturn'
		},

		// Render the template elements        
		render: function(callback) {

			var self = this,
				variables = {
					version: app.version
				};
			
			app.TemplateManager.get(self.name, function(code){
		    	var template = cTemplate(code.html());
		    	$(self.el).html(template(variables));	
		    	callback();	
		    	return this;
		    });
            $(document).scrollTop();
		},
	
	});
});
