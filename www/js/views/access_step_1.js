$(function() {

    // Register step 1 View
    // ---------------

    app.views.AccessStep1View = app.views.CommonView.extend({

        name: 'access_step_1',

        // The DOM events specific.
        events: {
            // content
            'click #btn-next':  'next',
            'click #btn-login': 'login',

            // footer
            'click #btn-help':	'helpSection'
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

        login: function(e) {
            
            //Go to next
            app.router.navigate('login', {
                trigger: true
            });

        },

        next: function(e) {

            //Go to next
            app.router.navigate('access_step_2', {
                trigger: true
            });

        }

    });

});
