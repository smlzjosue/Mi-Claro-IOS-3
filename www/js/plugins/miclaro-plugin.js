$(function(){
	window.build = function(str, callback) {
	    cordova.exec(
    	function(data){
    		callback(data);
    	}, 
    	function(err){
    		callback(err);
    	}, 
    	'MiClaroPlugin', 
    	'build',
    	[str]);
	};
	
	window.version = function(str, callback) {
	    cordova.exec(
    	function(data){
    		callback(data);
    	}, 
    	function(err){
    		callback(err);
    	}, 
    	'MiClaroPlugin', 
    	'version',
    	[str]);
	};
    
	window.sendPaymentInfo = function(url, json, success, error) {
	    
	    cordova.exec(
    	function(data){
    		success(data);
    	}, 
    	function(err){	
    		error(err);
    	}, 
    	'MiClaroPlugin', 
    	'sendPaymentInfo',
    	[url, json]);
	};
	
	window.sendPostForm = function(url, json, sucess, error) {
	    
	    cordova.exec(
    	function(data){
    		sucess(data);
    	}, 
    	function(err){	
    		error(err);
    	}, 
    	'MiClaroPlugin', 
    	'sendPostForm',
    	[url, json]);
	};		
});