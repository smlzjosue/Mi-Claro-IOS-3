$(function() {

	// Help Pin View
	// ---------------
	
	app.views.HelpNewPasswProfileView = app.views.CommonLogoutView.extend({

		name:'help_new_passw_profile',
		
		// The DOM events specific.
		events: {
			
			// content
			'click  .btn-back': 'back'
			
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
		    	app.router.refreshPage();
		    	callback();	
		    	return this;
		    });					
		
		},

		back: function(e){

			app.router.navigate('profile', {trigger: true});
			return false;
		}
	
	});
});
