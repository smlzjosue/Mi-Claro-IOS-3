$(function() {

	// Frequently Asked Questions View
	// ---------------
	
	app.views.FaqView = app.views.CommonView.extend({

		name:'faq',
		
		// The DOM events specific.
		events: {
        
			// events
            'pagecreate':                       'pageCreate',
            'active':							'active',
			
			// header
			'click #btn-back':					'toReturn',
		},
		
		// Render the template elements        
		render: function(callback) {

            var self = this,
                variables = {
                    convertCaseStr: app.utils.tools.convertCase,
                    showBackBth: true
                };
			
			app.TemplateManager.get(self.name, function(code){
		    	var template = cTemplate(code.html());
		    	$(self.el).html(template(variables));	
		    	callback();	
		    	return this;
		    });
            $(document).scrollTop();
		},

        pageCreate: function(e) {
            $(".preg-f").click(function() {
                $( this ).toggleClass( "on" );
            });
        },
		
	
	});
});