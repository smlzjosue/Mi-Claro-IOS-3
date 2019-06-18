$(function() {

	// Success Report View
	// ---------------
	
	app.views.SuccessReportView = app.views.CommonView.extend({

		name:'success_report',
		history: false,
		
		// The DOM events specific.
		events: {
			
			// events
            'active'							:'active',
            
			// body
			'click #btn-back'					:'toReturn',
			'click #btn-continue'				:'continue'
		},

		// Render the template elements        
		render: function(callback) {

            const title = app.utils.Storage.getLocalItem('success_report_title');

			var self = this,
				variables = { title: title };

			app.TemplateManager.get(self.name, function(code){
                var template = cTemplate(code.html());
                $(self.el).html(template(variables));
                callback();
                return this;
		    });	
			
			// remove the current
			app.router.navigation.pop();
			
		},

		continue: function(e){
           app.router.navigate('help_section', {
                trigger: true,
                replace: true
            });
		}
        
	});
});
