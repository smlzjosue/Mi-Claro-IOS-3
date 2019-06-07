$(function() {

	// Contact Us View
	// ---------------
	
	app.views.ContactUsView = app.views.CommonView.extend({

		name:'contact_us',
		
		// The DOM events specific.
		events: {
        
        	// evets
            'active'                            :'active',
			
			// header
			'click #btn-back'					:'back',
		},
		
		// Render the template elements        
		render: function(callback) {

			var self = this,
				variables =  {};
			
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