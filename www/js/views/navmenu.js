$(function() {

	// Navmenu View
	// ---------------
	
	app.views.NavmenuView = app.views.CommonView.extend({

		name:'navmenu',
		
		// The DOM events specific.
		events: {

		},

		// Render the template elements        
		render: function(callback) {

            var self = this,
                variables = {
                    wirelessAccount: (app.utils.Storage.getSessionItem('selected-account').prodCategory=='WLS')?true:false,
                    //accessList: fullListAccess,
                    accountAccess: app.utils.Storage.getSessionItem('access-list'),
                    name: app.utils.Storage.getSessionItem('name')
                };
			
			app.TemplateManager.get(self.name, function(code){
		    	var template = cTemplate(code.html());
		    	$(self.el).html(template(variables));	
		    	app.router.refreshPage();
		    	callback();	
		    	return this;
		    });					
		
		},
	});
});
