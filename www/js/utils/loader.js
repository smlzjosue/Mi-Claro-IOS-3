$(function() {

	// Utils For make loader
	// ---------------
	
	app.utils.Loader = {
		
		visible: false,
		
		initialize: function(){
	    	
			//Loader
			var opts = {
			    lines: 13, // The number of lines to draw
				length: 8, // The length of each line
	            width: 6, // The line thickness
				radius: 14, // The radius of the inner circle
				corners: 1, // Corner roundness (0..1)
				rotate: 0, // The rotation offset
				direction: 1, // 1: clockwise, -1: counterclockwise
				color: '#000', // #rgb or #rrggbb or array of colors
				speed: 1, // Rounds per second
				trail: 60, // Afterglow percentage
				shadow: false, // Whether to render a shadow
				hwaccel: false, // Whether to use hardware acceleration
				className: 'spinner', // The CSS class to assign to the spinner
				zIndex: 2e9, // The z-index (defaults to 2000000000)
				top: '50%', // Top position relative to parent
				left: '50%' // Left position relative to parent
			};
			
			var target = document.getElementById('loadercont');
			app.spinner = new Spinner(opts).spin(target);
		},
		
		show: function(message){
			
			// scroll top
	        //$('body').scrollTop(0); -- disable for v2.0.0
	        
	        // hide scroll
	        $('body').css('overflow','hidden');
            document.ontouchstart = function(e){ e.preventDefault(); }
	        
	        // show loader
			$('#loadercont').show();		    
		    this.visible = true;

		},

		hide: function(){
			
			// Hide loading
			$('#loadercont').hide();
			
			// show scroll
			$('body').css('overflow','auto');
            document.ontouchstart = function(e){ return true; }
			
	        // hide scroll
	        $('body').css('overflow','hidden');
			
			this.visible = false;

		},	
		
		isVisible: function(){
			
			return this.visible;
			
		}
		
	};
});
