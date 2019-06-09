$(function() {

	// Common Logout View
	// ---------------
	
	app.views.CommonLogoutView = Backbone.View.extend({
		
		name:'menu',	
		history: true,
		
		// Initialize the view
		initialize: function(options){
			this.options = options;
		},
		
        back: function(e){
			e.preventDefault();
			app.router.back = true;
			app.router.backPage();			
		},

		menu: function(e){			
			app.router.navigate('menu',{trigger: true});
			return false;
		},		
		
		chat: function(){
			
			app.router.navigate('chat',{trigger: true});
				
			return false;
		},
		
		helpSection: function(element){

			app.utils.Storage.setSessionItem('exit-help-url', this.name);
			
			//Go to help
			app.router.navigate('help_section',{trigger: true});

		},
		
	});
	
});