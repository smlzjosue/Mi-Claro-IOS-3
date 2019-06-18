$(function() {

	// Suggestions View
	// ---------------
	
	app.views.ImprovementView = app.views.CommonView.extend({

		name:'improvement',
		
		// The DOM events specific.
		events: {
        
			// events
            'active'							:'active',        
			
			// header
			'click #btn-back'					:'toReturn',
			
			//content
			'click #send-improvement'			:'sendImprovement',

            // focus
            'focus #improvement-comment'        :'focus',
            'focusout #improvement-comment'     :'focusOut',
		},

		// Render the template elements        
		render: function(callback) {

            //validate if logged
            var isLogged = false;
            if(app.utils.Storage.getSessionItem('selected-account') != null){
                isLogged = true;
            }

            var self = this,
                variables = {
                    isLogged: isLogged
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

            $('input.inp-f').on('click focus', function (e) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $(e.currentTarget).offset().top - 40
                }, 1000);
            });

            $('#improvement-comment').on('click focus', function (e) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $(e.currentTarget).offset().top - 40
                }, 1000);
            });
        },
		
		sendImprovement:function(e){
			
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			
			var userEmail,
				message,
				userId,
				parameters;
			
			message = $.mobile.activePage.find('#improvement-comment').val();

            var isLogged = false;
            if(app.utils.Storage.getSessionItem('selected-account') != null){
                isLogged = true;
            }

            if(isLogged){
                userId = app.utils.Storage.getLocalItem('username');
                const accountInfo = app.utils.Storage.getSessionItem('account-info');
                userEmail = accountInfo.emailField;
            } else {
                userId = app.uuid;
                userEmail = $.mobile.activePage.find('#email').val();
            }
			
			// Validate network
			var networkState = navigator.connection.type;
			
			if(networkState == Connection.NONE){
				showAlert('Error', 'Revisa que tengas acceso a Internet.', 'Aceptar');
			}else if(networkState == Connection.UNKNOWN){
				showAlert('Error', 'Por el momento el servicio no está disponible, intenta más tarde. Gracias.', 'Aceptar');
			}else{
				if(userEmail != '' && message != ''){
					// Validate email
					if(re.test(userEmail)){
						// Show loader
						app.utils.loader.show();
						
						//disable send button
						$('#send-improvement').addClass('ui-disabled'); 		
						
						parameters = {
								'userMail': userEmail, 
								'info': {
									userAgent: device.platform,
									versionCode: app.build,
									versionName: app.version,
									soVersion: device.version,
									userId: userId
								},
								'message': message
							};
						
						setTimeout(function(){
							window.sendPostForm(
									
									// url
									app.helpURL+'/improvement/'+app.country+'/'+app.id,
									
									// parameters
									parameters,
									
									//success callback
									function(data){
										
										// Hide loading
										app.utils.Loader.hide(); 
										
										//enable send button
										($('#send-improvement').hasClass('ui-disabled')) ? $('#send-improvement').removeClass('ui-disabled'):'';

                                        app.utils.Storage.setLocalItem('success_report_title', 'Sugerencias');
                                        app.router.navigate('success_report',{
                                            trigger: true,
                                            replace: true
                                        });
									},
									
									//error callback
									function(data){
										// Hide loader
										app.utils.loader.hide();
										showAlert('Error', 'No se puede enviar su mensaje en este momento, intente más tarde', 'Aceptar');
									}
								);
						},1000);
						
					}else{
						showAlert('Error', 'Por favor introduzca un correo electrónico válido', 'Aceptar');
					}
					
				}else{
					if(message==''){
						showAlert('Error', 'Campo de "Detalle tu comentario" es requerido', 'Aceptar');
					}else if(userEmail==''){
						showAlert('Error', 'Campo "Correo electrónico" es requerido', 'Aceptar');
					}
					
				}	
			}		
		}
	});
});