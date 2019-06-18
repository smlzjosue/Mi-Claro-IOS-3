
/**
 * In order to encapsulate PhoneGap calls
 */



// Show a custom alertDismissed
//
function showAlert(title, message, buttonName, callback) {
	
	if(typeof navigator.notification != 'undefined' && typeof navigator.notification.alert != 'undefined') {
	
		navigator.notification.alert(
			message,			// message
			callback,         	// callback
			title,            	// title
			buttonName        	// buttonName
		);
	}else{
		
		showAlertPopUp(
				title, 
				message, 
				function(e){}
			);		
	}
}


// Show a custom confirmation dialog
//
function showConfirm(title, message, buttonLabels, callback) {
	if(typeof navigator !== "undefined" && typeof navigator.notification !== "undefined") {
	    navigator.notification.confirm(
	        message,  			// message
	        callback,           // callback to invoke with index of button pressed
	        title,            	// title
	        buttonLabels      	// buttonLabels: 'Restart,Exit'
	    );
	}else{
		if(confirm(message))
			eval('callback()');
	}
}

function showConfirmPopUp(title, message, callback){
    
	navigator.notification.confirm(
	        message,  				// message
	        callback,           	// callback to invoke with index of button pressed
	        title,            		// title
	        ['Aceptar','Cancelar']  // buttonLabels: 'Restart,Exit'
	    );
    
}

function hideConfirmPopUp(){
    
}

function showPrompt(message, callback, title) {
    navigator.notification.prompt(
        message,
        callback,
        title,
        ['Aceptar','Cancelar']
    );
}
