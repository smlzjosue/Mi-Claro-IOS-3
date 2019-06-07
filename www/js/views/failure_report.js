$(function() {

	// Failure Report View
	// ---------------
	
	app.views.FailureReportView = app.views.CommonView.extend({

		name:'failure_report',
		
		// The DOM events specific.
		events: {
            // events
            'pagecreate':                           'pageCreate',
			
			// header
			'click #btn-back'					:'back',

			//content
			'click #send-failure'				:'sendFailure',
            'click .tab'                        :'selectTab',

            // focus
            'focus #failure-comment'            :'focus',
            'focusout #failure-comment'         :'focusOut',
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

            $('#failure-comment').on('click focus', function (e) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $(e.currentTarget).offset().top - 40
                }, 1000);
            });
        },
		
		sendFailure: function(e){
			
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;				    
			
			var failureCategory,
				userEmail,
				failureComment,
				message,
				userId;
			
			// set user message
			failureCategory = $('input[name=failure_category]:checked').val();
			failureComment = $.mobile.activePage.find('#failure-comment').val();
			message = failureCategory+'*'+failureComment;

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

            console.log('failureComment');
            console.log(failureComment);
            console.log('userEmail');
            console.log(userEmail);
            console.log('userId');
            console.log(userId);
			
			// Validate network
			var networkState = navigator.connection.type;
			
			if(networkState == Connection.NONE){
				showAlert('Error', 'Revisa que tengas acceso a Internet.', 'Aceptar');
			}else if(networkState == Connection.UNKNOWN){
				showAlert('Error', 'Por el momento el servicio no está disponible, intenta más tarde. Gracias.', 'Aceptar');
			}else{
				if(userEmail != '' &&  failureComment != '' && typeof failureCategory != 'undefined'){
					// Validate email
					if(re.test(userEmail)){
						// Show loader
						app.utils.loader.show();
						
						//disable send button
						$('#send-failure').addClass('ui-disabled'); 		

						var parameters = {
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
									app.helpURL+'/failure/'+app.country+'/'+app.id,
									
									// parameters
									parameters,
									
									//success callback
									function(data){
										// Hide Loader
										app.utils.Loader.hide();
										
										//enable send button
										($('#send-failure').hasClass('ui-disabled')) ? $('#send-failure').removeClass('ui-disabled'):'';

                                        app.utils.Storage.setLocalItem('success_report_title', 'Reportar Falla');
										app.router.navigate('success_report',{
                                            trigger: true,
                                            replace: true
										});
									},
									
									//error callback
									function(data){
										app.utils.loader.hide();
										showAlert('Error', 'No se puede enviar su mensaje en este momento, intente más tarde', 'Aceptar');
									}
								);
							
						},1000);
						
					} else {
						showAlert('Error', 'Por favor introduzca un correo electrónico válido', 'Aceptar');
					}
						
				} else {
					if (failureComment=='') {
						showAlert('Error', 'Campo de "Detalle tu comentario" es requerido', 'Aceptar');
					} else if(userEmail=='') {
						showAlert('Error', 'Campo "Correo electrónico" es requerido', 'Aceptar');
					} else if(typeof failureCategory == 'undefined') {
						showAlert('Error', 'Debe seleccionar una categoría para su reporte', 'Aceptar');
					}
					
				}
			}
		},
                          
        selectTab: function(e){
              $('.tab').removeClass('tab-on');
              $(e.currentTarget).addClass('tab-on');
              $(e.currentTarget).find('input[type="radio"]').prop('checked', true);
        }
	});
});
