$(function() {

	// SideMenu View
	// ---------------
	
	app.views.SideMenuView = app.views.CommonView.extend({

		name:'sidemenu',
				
		// The DOM events specific.
		events: {
			
			'pagecreate':								'pageCreate',
			
			// header 
			'click .btn-chat': 							'chat',
			'click .btn-logout':						'logout',
			
			// content
			'click .btn-account':       				'account',
			'click .btn-device':       			 		'device',
			'click .btn-service':       				'service',
			'click .btn-profile':       				'profile',
			'click .btn-consumption':   				'consumption',
			'click .btn-invoice':       				'invoice',
				
		},
		
		// Render the template elements
		render:function (callback) {
			
			var self = this,
				variables = {};
			
			app.TemplateManager.get(self.name, function(code){
		    	var template = cTemplate(code.html());
		    	$(self.el).html(template(variables));
		    	callback();	
		    });	
   		    
		},
		
		pageCreate: function(e){
			
			var self = this;
			
	    	setTimeout(function(){
		    	app.sidemenu = $.jPanelMenu({
		    		clone: false,
				    menu: '#sidemenu',
				    direction: 'right',
				    trigger: '.menu-trigger',
				    closeOnContentClick: true,
				    excludedPanelContent: 'style, script, section#loadercont',
				    duration: 600				    
				});
				app.sidemenu.on();

	    	},500);			
			
		}
	
	});
});