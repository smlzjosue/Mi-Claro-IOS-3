$(function() {

	// Splash View
	// ---------------
	
	app.views.SplashView = app.views.CommonLogoutView.extend({

		name:'splash',
		
		// The DOM events specific.
		events: {
			'pagecreate':							'pageCreate',
			'click  #btn-mobile': 						'goMobile',
		},
		
		// Render the template elements        
		render: function(callback) {
			
			var self = this,
				variables = {
					deviceAndroid : (/android/i.test(navigator.userAgent.toLowerCase())),
					deviceIos : (/iPhone|iPad/i.test(navigator.userAgent.toLowerCase())),
					showBackBth: true
				};
			
			app.TemplateManager.get(self.name, function(code){
		    	var template = cTemplate(code.html());
		    	$(self.el).html(template(variables));	
		    	
		    	callback();	
		    	return this;
		    });					
		
		},
		
		pageCreate: function(e){
			$('.btn-android').attr('href', app.androidAppUrl);
			$('.btn-ios').attr('href', app.iosAppUrl);
		},
		
		goMobile: function(e) {
			document.location.href='#login'+((this.options.section !== undefined)?'/'+this.options.section:'');
		}

	});
	
});
