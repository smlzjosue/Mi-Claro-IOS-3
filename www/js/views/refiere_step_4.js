$(function() {

    // Register step 1 View
    // ---------------

    app.views.RefiereStep4 = app.views.CommonView.extend({

        name: 'refiere_step_4',

        // The DOM events specific.
        events: {
            'pagecreate':                               'pageCreate',
            // content
            'click #btn-next':                          'next',
        },

        // Render the template elements
        render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            var self = this,
                variables = {
                    name: app.utils.Storage.getSessionItem('name'),
                    accountSections: this.getUserAccess(),
                    convertCaseStr: app.utils.tools.convertCase,
                    showBackBth: true
                };
            app.TemplateManager.get(self.name, function(code) {
                var template = cTemplate(code.html());
                $(self.el).html(template(variables));
                callback();
                return this;
            });
            $(document).scrollTop();
        },

        pageCreate: function(e){
            var self = this;
            // removing any enter event
            $('body').unbind('keypress');
            self.activateMenu(e);
        },

        next: function(e) {
            //Go to next
            app.router.navigate('refiere_step_1', {
                trigger: true
            });

        },

    });

});
