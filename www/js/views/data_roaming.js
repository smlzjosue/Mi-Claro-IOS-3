$(function() {

	// Data Roaming View View
	// ---------------
	
	app.views.DataRoamingView = app.views.CommonLogoutView.extend({

		name:'data_roaming',
		
		// The DOM events specific.
		events: {
            'pagecreate':                               'pageCreate',
            'active':                                   'active',
		},

		// Render the template elements        
		render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }
			
			var self = this,
				variables = {
                    accounts: this.getSelectTabAccounts(),
                    selectedTab: app.utils.Storage.getSessionItem('selected-tab'),
                    selectedAccount: app.utils.Storage.getSessionItem('selected-account'),
                    accountSections: this.getUserAccess(),
                    showBackBth: true
				};
			
			app.TemplateManager.get(self.name, function(code){
		    	var template = cTemplate(code.html());
		    	$(self.el).html(template(variables));	
		    	callback();	
		    	return this;
		    });
		},

        pageCreate: function(e) {
            var self = this;
            self.activateMenu();
        },
	
	});
});
