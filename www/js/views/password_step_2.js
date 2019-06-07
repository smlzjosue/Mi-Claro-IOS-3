$(function() {

    // Register step 1 View
    // ---------------

    app.views.PasswordStep2View = app.views.CommonView.extend({

        name: 'password_step_2',

        // The DOM events specific.
        events: {
            // event
            'pagecreate':                           	    'pageCreate',
            // content
            'click #btn-next':                              'next',
            'click #btn-login':                             'login',

            // footer
            'click #btn-help':	                            'helpSection'
        },

        // Render the template elements
        render: function(callback) {
            var self = this,
                variables = {
                    isTelefonia: app.utils.Storage.getSessionItem('security-question-is-telefonia'),
                    showBackBth: true
                };
            app.TemplateManager.get(self.name, function(code) {
                var template = cTemplate(code.html());
                $(self.el).html(template(variables));
                callback();
                return this;
            });
        },

        pageCreate: function(){
            var self = this;

            /**
             * set enter event
             */
            $('body').unbind('keypress');
            $('body').on('keypress', function(e){
                if (e.which === 13 || e.keyCode === 13) {
                    self.next();
                }
            });
        },

        help: function(e){

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

            if (document.getElementById('radio-code').checked) {
                app.router.navigate('password_step_4', {
                    trigger: true
                });
                return;
            }

            if (document.getElementById('radio-question').checked) {
                app.router.navigate('password_step_3', {
                    trigger: true
                });
                return;
            }

        },

    });

});
