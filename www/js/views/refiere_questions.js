$(function() {

    app.views.RefiereQuestionsView = app.views.CommonView.extend({

        name: 'refiere_questions',

        // The DOM events specific.
        events: {
            // events
            'pagecreate':                           'pageCreate',

            // content
            'click #btn-click':                     'questions',
            'click .link-terms':                    'showTerms',
            'click #close-terms':                   'closeTerms',
            'click #return':                        'back',
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
            app.TemplateManager.get(self.name, function(code) {
                var template = cTemplate(code.html());
                $(self.el).html(template(variables));
                callback();
                return this;
            });
            $(document).scrollTop();
        },

        pageCreate: function(e) {
            var self = this;
            self.activateMenu(e);

            $(".preg-f").click(function() {
                $( this ).toggleClass( "on" );
            });
        },

        showTerms: function(e) {
            $('.popupbg').show();
        },

        closeTerms: function(e) {
            $('.popupbg').hide();
        },

        return: function (e) {
            var self = this;
    
            self.back(e);
        },
        
    });
});