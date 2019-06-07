$(function() {

	// Help View
	// ---------------
	
	app.views.HelpView = app.views.CommonView.extend({

		name:'help',
		
		// The DOM events specific.
		events: {
			
			// content
			'click .btn-back': 						'back',
			
            // footer
            'click #btn-help'                      : 'helpSection'
				
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
		
		},
		
		sampleFunction: function(){
			
			app.router.navigate('update_app',{trigger: true});
			
		}
	});
});
