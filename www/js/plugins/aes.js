$(function(){
	window.aes = function(str, callback) {
		//var cordova = window.cordova || window.Cordova;
  		
	    cordova.exec(
    	function(data){
    		callback(data);
    	}, 
    	function(err){
    		callback(err);
    	}, 
    	'AES', 
    	'encryp',
    	[str]);
	};
});
