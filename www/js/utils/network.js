$(function() {

	// Utils For make AJAX Request
	// ---------------
	
	app.utils.Network = {
  
	    attempts: 0,

		errorMsg: 'Disculpe, no fue posible establecer la comunicación',

        errorFunction: function (data) {
            if (data.responseJSON.code == "001") {
                showAlert('Error', "Disculpe, su sesión ha expirado", 'Aceptar', function(){})
                app.router.navigate('login',{trigger: true});
            } else {
                showAlert('Error', app.utils.network.errorMsg, 'Aceptar', function(){});
            }
        },

        errorRequest: function (data, status, message) {
	        if (message) {
                showAlert('Error', message, 'Aceptar', function(){});
            } else if (status == 401) {
                showAlert('Error', "Disculpe, su sesión ha expirado", 'Aceptar', function(){})
                app.router.navigate('login',{trigger: true});
            } else {
                showAlert('Error', app.utils.network.errorMsg, 'Aceptar', function(){});
            }
        },
        
        customErrorFunction: function(data) {
        	console.log(data.responseJSON.desc);
        	if (data.responseJSON.code == "001") {
        		showAlert('Error', "Disculpe, su sesión ha expirado", 'Aceptar', function(){})
        		app.router.navigate('login',{trigger: true});
        	} else {
        		showAlert('Error', data.responseJSON.desc, 'Aceptar', function(){});
        	}
        },	
		
        /*************************************************************************/
        //method -> method url or name
        //type -> GET, POST, PUT, DELETE
        //parameters -> body request parameters for POST, PUT and DELETE
        //authenticated -> boolean, TRUE when user has authenticated else FALSE
        requestAPI: function (method, type, parameters, authenticated, successCB, errorCB) {
        	var self = this;
        	
            // Timeout time
            var timeoutValue = 150000;

            // Show loading
            app.utils.loader.show();
        	
        	var token = '',
            	header = '';

        	if (authenticated) {
            	header = {'token': app.utils.Storage.getSessionItem('token'),
                          'api-key': app.apiKey}
        	}

            $.ajax({
                type: type,
                url: app.apiUrl + method,
                contentType: 'application/json; charset=utf-8',
                data: parameters,
                dataType: 'json',
                timeout: timeoutValue,
                headers: header,
                success: function (data, textStatus) {
                    console.log('#ws call success');
                    console.log(data);

                    // Hidden loading
                    app.utils.loader.hide();
                    successCB(data);
                },
                error: function (data, status, error) {
                    console.log('#ws call error');

                    console.log(data);
                    console.log(status);
                    console.log(error);

                    if (status == 200) {

                        //session last
                        if (data.hasError && data.desc == '0001') {
                            showAlert('Error', 'La sesión se ha vencido', 'Aceptar');
                            app.router.navigate('login', {
                                trigger: true,
                                replace: true
                            });
                        }
                    } else {

                    	self.attempts++;
                    }

                    // Hidden loading
                    app.utils.loader.hide();

                    // Callback
                    errorCB(data);
                }
            });
        },
        /*************************************************************************/

		/*************************************************************************/

          requestnewAPI: function (method, type, parameters, authenticated, successCB, errorCB) {
              var self = this;

              // Timeout time
              var timeoutValue = 150000;

              // Show loading
              app.utils.loader.show();

              var token = '',
              header = '';

              if (authenticated) {
                  header = {
                      'token': app.utils.Storage.getSessionItem('token'),
                      'api-key': app.apiKey
                  }
              }

              $.ajax({
                 type: type,
                 url: app.apiUrl + method,
                 contentType: 'application/json; charset=utf-8',
                 data: parameters,
                 dataType: 'json',
                 timeout: timeoutValue,
                 headers: header,
                 success: function (data, textStatus) {
                 console.log('#ws call success');
                 console.log(data);

                 // Hidden loading
                 app.utils.loader.hide();
                 successCB(data);
                 },
                 error: function (data, status, error) {
                 console.log('#ws call error');

                 console.log(data);
                 console.log(status);
                 console.log(error);

                 if (status == 200) {

                 //session last
                 if (data.hasError && data.desc == '0001') {
                 showAlert('Error', 'La sesión se ha vencido', 'Aceptar');
                 app.router.navigate('login', {
                                     trigger: true,
                                     replace: true
                                     });
                 }
                 } else {

                 self.attempts++;
                 }

                 // Hidden loading
                 app.utils.loader.hide();

                 // Callback
                 errorCB(data);
                 }
                 });
          },
          /*************************************************************************/

		request: function (method, parameters, successCB, errorCB, jump) {

        	var self = this;
        	
            // Timeout time
            var timeoutValue = 70000;

            // Show loading
            app.utils.loader.show();
            
        	if (self.attempts > 2) {
        		return;
        	}
            
            $.ajax({
                type: 'POST',
                url: ( jump === undefined ? app.url : app.alterUrl) + 'Services.aspx?Service=' + method,
                contentType: 'application/json; charset=utf-8',
                data: parameters,
                dataType: 'json',
                timeout: timeoutValue,
                success: function (data, textStatus) {
                    console.log('#ws call success');
                    
                    data.HasError = (data.hasError != undefined) ? data.hasError : data.HasError;
                    data.Success = (data.hasError != undefined) ? true : data.Success; 
                    

                    // Hidden loading
                    app.utils.loader.hide();
                    successCB(data);
                },
                error: function (data, status, error) {
                    console.log('#ws call error');
                    
                    if (data.status == 200 &&
                    		data.status == 0) {
                    	
                        //session last
                        if (data.HasError && data.Desc == '0001') {
                            showAlert('Error', 'La sesión se ha vencido', 'Aceptar');
                            app.router.navigate('login', {
                                trigger: true,
                                replace: true
                            });
                        }
                        
                        // Hidden loading
                        app.utils.loader.hide();
                        
                        // Callback
                        errorCB(data);
                    	
                    } else {

                    	self.attempts++;
                    	
                    	// Jump to alternative ws version
                    	self.request(method, parameters, successCB, errorCB, true);
                    	
                    }

                }
            });

        },






        processRequest: function(parameters, successCB, errorCB) {

            var self = this;
            // Timeout time
            var timeoutValue = 90000;
            // Show loading
            app.utils.loader.show();

            if (self.attempts > 2) {
                return;
            }

            $.ajax({
                type: 'POST',
                url: app.processURL,
                contentType: 'application/json; charset=utf-8',
                data: parameters,
                dataType: 'json',
                timeout: timeoutValue,
                success: function (data, textStatus) {
                    app.utils.loader.hide();
                    successCB(data);
                },
                error: function (data, status, error) {
                    app.utils.loader.hide();
                    errorCB(data, status);
                }
            });
        },

        processRequestOld: function(parameters, successCB, errorCB) {

            var self = this;
            // Timeout time
            var timeoutValue = 90000;
            // Show loading
            app.utils.loader.show();

            if (self.attempts > 2) {
                return;
            }

            $.ajax({
                type: 'POST',
                url: app.processOLD,
                contentType: 'application/json; charset=utf-8',
                data: parameters,
                dataType: 'json',
                timeout: timeoutValue,
                success: function (data, textStatus) {
                    app.utils.loader.hide();
                    successCB(data);
                },
                error: function (data, status, error) {
                    app.utils.loader.hide();
                    errorCB(data, status);
                }
            });
        },

        requestLogin: function(method, parameters, successCB, errorCB) {
            this.requestNew('login', method, null, parameters, successCB, errorCB)
        },

        requestCustomers: function(method, headers, parameters, successCB, errorCB) {
		    this.requestNew('customers', method, headers,  parameters, successCB, errorCB)
        },

        requestReferrer: function(method, headers, parameters, successCB, errorCB) {
            this.requestNew('referr', method, headers,  parameters, successCB, errorCB)
        },

        requestNew: function(path, method, headers, parameters, successCB, errorCB) {

            var self = this;
            // Timeout time
            var timeoutValue = 70000;
            // Show loading
            app.utils.loader.show();

            if (self.attempts > 2) {
                return;
            }

            $.ajax({
                type: 'POST',
                url: app.newUrl + path + '/' + method,
                contentType: 'application/json; charset=utf-8',
                data: parameters,
                dataType: 'json',
                timeout: timeoutValue,
                headers: headers != null? headers : '',
                success: function (data, textStatus) {
                    app.utils.loader.hide();
                    successCB(data);
                },
                error: function (data, status, error) {
                    app.utils.loader.hide();
                    errorCB(data, status);
                }
            });
        },







		sendComment: function(commentInfo, parameters, successCB, errorCB){

			console.log(commentInfo);
			
			// Timeout time
			var timeoutValue = 50000;
			
			// Show loading
		    app.utils.loader.show();
		    
			$.ajax({
				type: 'POST',
			    url: 'http://soporteapps.speedymovil.com:8090/appFeedback/service/feedback/application/'+commentInfo.commentType+'/'+commentInfo.countryId+'/775322054'+commentInfo.appId,
			    //url: 'http://soporteapps.speedymovil.com:8090/appFeedback/service/feedback/application/'+commentInfo.commentType+'/mx/com.telcel.proximate.RedPrivadaTelcel.ios',
			    
			    contentType: 'application/json; charset=utf-8',
			    data: parameters,
			    dataType: 'json',
			    accepts: 'application/json',
			    timeout: timeoutValue,
			    success: function (data, textStatus) { 
			        console.log('#ws call success');
			        // Hidden loading
			        app.utils.loader.hide();
			        successCB(data);
			    },
			    error: function (data, status, error) {
			    	console.log('#ws call error');
			    	// Hidden loading
			    	app.utils.loader.hide();              	
			    	errorCB(data);
			    }
			});
		},
  
		requestJSON: function (jsonUrl, successCB, errorCB) {

            // Timeout time
            var timeoutValue = 50000;

            // Show loading
            app.utils.loader.show();

            $.ajax({
                type: 'GET',
                url: jsonUrl,
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                accepts: 'application/json',
                timeout: timeoutValue,
                success: function (data, textStatus) {
                    console.log('#ws call success');
                    // Hidden loading
                    app.utils.loader.hide();
                    successCB(data);
                },
                error: function (data, status, error) {
                    console.log('#ws call error');
                    // Hidden loading
                    app.utils.loader.hide();
                    console.log(error);
                    errorCB(data);
                }
            });

        },
		
 		apiRequest: function(method, parameters, successCB, errorCB, loader){

			// Timeout time
			var timeoutValue = 50000;

			var  header = {
                            'api-key': app.apiKey
                          };

			// Show loading
            if(loader==undefined || loader) {
			    app.utils.loader.show();
            }
		    
			$.ajax({
				type: 'POST',
				cache: false,
                crossDomain: true,
			    url: app.apiUrl + method,  
			    contentType: 'application/json; charset=utf-8',
			    data: parameters,
			    dataType: 'json',
			    timeout: timeoutValue,
			    headers: header,
			    success: function (data, textStatus) { 
			        console.log('#ws call success');
                    		
			        // Hidden loading
                    if(loader==undefined || loader) {
				        app.utils.loader.hide();
                    }
			        successCB(data);
			    },
			    error: function (data, status, error) {
			    	console.log('#ws call error');

                    // Hidden loading
                    if(loader==undefined || loader) {
				    	app.utils.loader.hide();
                    }
			    	errorCB(data);
			    }
			});

		},

		serviceRequest: function(method, parameters, successCB, errorCB, loader){
            // Timeout time
            var timeoutValue = 50000;

            // Show loading
            if(loader==undefined || loader) {
                app.utils.loader.show();
            }

            $.ajax({
                type: 'POST',
                cache: false,
                crossDomain: true,
                url: app.v3URL + method,
                contentType: 'application/json; charset=utf-8',
                data: parameters,
                dataType: 'json',
                timeout: timeoutValue,
                success: function (data, textStatus) {
                    console.log('#ws call success');

                    // Hidden loading
                    if(loader==undefined || loader) {
                        app.utils.loader.hide();
                    }
                    successCB(data);
                },
                error: function (data, status, error) {
                    console.log('#ws call error');

                    // Hidden loading
                    if(loader==undefined || loader) {
                        app.utils.loader.hide();
                    }
                    errorCB(data);
                }
            });
        },

 		checkRequest: function(method, parameters, successCB, errorCB){

			// Timeout time
			var timeoutValue = 10000;

		    var  header = {
                            'api-key': app.apiKey
                          };

			$.ajax({		
				type: 'POST',
			    url: app.apiUrl + method,  
			    contentType: 'application/json; charset=utf-8',
			    data: parameters,   
			    dataType: 'json',
			    timeout: timeoutValue,
			    headers: header,
			    success: function (data, textStatus) { 
			        console.log('#ws call success');
                    		
			        // Hidden loading
			        app.utils.loader.hide();
			        successCB(data);
			    },
			    error: function (data, status, error) {
			    	console.log('#ws call error');
			    	
			    	errorCB(data);
			    }
			});

		} 		 		
		
	};
});
