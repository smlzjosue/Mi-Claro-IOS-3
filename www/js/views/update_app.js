$(function() {

	// Update App View
	// ---------------
	
	app.views.UpdateAppView = app.views.CommonView.extend({

		name:'update_app',
		
		// The DOM events specific.
		events: {
			
			// content
			'click .update-app'         :'updateApp',

            // footer
            'click #btn-help'           :'helpSection'
				
		},

		// Render the template elements        
		render: function(callback) {

            //validate if logued
            var isLogued = false;
            var wirelessAccount = null;

            if(app.utils.Storage.getSessionItem('selected-account') != null){
                isLogued = true;
                wirelessAccount = (app.utils.Storage.getSessionItem('selected-account').prodCategory=='WLS')?true:false;
            }

			var self = this,
				variables = {
                	isLogued: isLogued,
                    wirelessAccount: wirelessAccount
				};
			
			app.TemplateManager.get(self.name, function(code){
		    	var template = cTemplate(code.html());
		    	$(self.el).html(template(variables));	
		    	
		    	callback();	
		    	return this;
		    });					
		
		},
		
		updateApp: function(){
			
			var ref = window.open('market://details?id='+app.packageName, '_system');
			
			
		}
	});
});
