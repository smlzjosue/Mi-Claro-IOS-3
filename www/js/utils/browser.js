$(function() {

	// Utils For make in app browser
	// ---------------
	
	app.utils.Browser = {
		
		show: function(url,location){

			var ref = window.open(url, '_blank', 'location=yes,closebuttoncaption=Cerrar,hidden=yes'); 
			return ref;

		}
		
	};
});
