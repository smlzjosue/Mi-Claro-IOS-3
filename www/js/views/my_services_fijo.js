$(function() {

    // Register step 1 View
    // ---------------

    app.views.MyServicesFijoView = app.views.CommonView.extend({

        name: 'my_services_fijo',

        // The DOM events specific.
        events: {
            // content
            'click .btn-back':                  'back',

            // footer
            'click #btn-help':	                'helpSection',

            // new navigation
            'click #nav-open': 				        'openNav',
            'click #nav-close': 				    'closeNav',
            'click #postpaid1-head': 				'clickSubMenu1',
            'click #postpaid2-head': 				'clickSubMenu2',
            'click #postpaid3-head': 				'clickSubMenu3',
            'click #postpaid4-head': 				'clickSubMenu4',
            'click #postpaid5-head': 				'clickSubMenu5',
        },

        // Render the template elements
        render: function(callback) {
            var self = this,
                variables = {
                    showBackBth: true
                };
            app.TemplateManager.get(self.name, function(code) {
                var template = cTemplate(code.html());
                $(self.el).html(template(variables));
                callback();
                return this;
            });
        },

        help: function(element){

            //Go to help
            app.router.navigate('help', {trigger: true});

        },

    });

});
