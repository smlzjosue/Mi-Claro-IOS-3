$(function() {

	// Navmenu View
	// ---------------
	
	app.views.TabsView = app.views.CommonView.extend({

		name:'tabs',
		
		// The DOM events specific.
		events: {

		},

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
