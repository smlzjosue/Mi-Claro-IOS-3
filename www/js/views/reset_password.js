$(function() {
  
  // Help View
  // ---------------
  
  app.views.ResetPasswordView = app.views.CommonView.extend({
                                                   
    name:'reset_password',
                                                   
    // The DOM events specific.
    events: {
                                             
        'pagecreate':                           	'pageCreate',
        
        // content
        'click .btn-back':                          'back',
        'click #btn-reset': 						'reset',
        'click #btn-clear': 						'clear',
                                                   
        // footer
        'click #btn-help':                          'helpSection'
                                                
    },
                                                   
    // Render the template elements
    render: function(callback) {
        var title = '';
                                                            
        var self = this,
            userInfo = app.utils.Storage.getSessionItem('user-info');
        
        if(userInfo.emailInvalid == 'Y')
            title = 'Cambio de informaci&oacute;n de usuario';
        else
            title = 'Cambio de constrase&ntilde;a';
                                                            
        var variables = {
                title: title,
        		showBackBth: true,
            	emailInvalid: userInfo.emailInvalid == 'Y'
        	};
                                                   
        app.TemplateManager.get(self.name, function(code){
            var template = cTemplate(code.html());
            
            // load template variables
            $(self.el).html(template(variables));
                                                                           
            callback();
            return this;
        });
                                                   
    },
                                                            
    pageCreate: function(){
                                                            
        var self = this,
            password = null,
            new_password = null,
            repeat_password = null
            email = null;
                                                            
    },
                                                            
    reset: function(element){
    
        console.log('------------------------------------');
        console.log('Reset password');
        console.log('------------------------------------');

        var email = $.mobile.activePage.find('#email').val(),
            oldPassword = $.mobile.activePage.find('#password-old').val(),
            newPassword = $.mobile.activePage.find('#password-new').val(),
            confNewpassword = $.mobile.activePage.find('#password-new-conf').val(),
            userInfo = app.utils.Storage.getSessionItem('user-info'),
            emailInvalid = userInfo.emailInvalid,
            actualPassword = app.utils.Storage.getLocalItem('password'),
            actualUsername = app.utils.Storage.getSessionItem('username');

        var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(!actualPassword){
            actualPassword = app.utils.Storage.getSessionItem('password');
        }
        // validate
        if(emailInvalid=="Y"){
            if(!email.length>0){
               message = 'El campo de Correo de Electrónico / Usuario es requerido';
               showAlert('Error', message, 'Aceptar', function(e){});
               return;
            }
            else if (!emailReg.test(email)){
                message = 'Correo eléctronico no es un formato válido';
                showAlert('Error', message, 'Aceptar', function(){});
                //setting initial values
                self.render(function () {
                    $.mobile.activePage.trigger('pagecreate');
                });
                return;
            }
            else if(email ==  actualUsername){
                message = 'El campo de Correo de Electrónico / Usuario no puede ser el anterior';
                showAlert('Error', message, 'Aceptar', function(e){});
                return;
            }
        }
        if(!oldPassword.length>0 ){
            message = 'Debe colocar su contaseña anterior';
            showAlert('Error', message, 'Aceptar', function(e){});
            return;
        }else if(oldPassword != actualPassword){
             message = 'La contaseña anterior no es correcta';
             showAlert('Error', message, 'Aceptar', function(e){});
             return;
        }else if ((!newPassword.length>=8 &&
            !newPassword.length<=10) || // length 8-10
            !/(?=.*[a-z])/.test(newPassword) || // almost one lower case
            !/(.*[A-Z].*)/.test(newPassword) || // almost one upper case
            !/((.*\d{2}.*))/.test(newPassword) || // two digit
            !/([a-zA-Z0-9]+$)/.test(newPassword) || // special character
            /(.)\1{3,}/.test(newPassword) ){ // repeat 4 times
                    message = 'La Contraseña debe tener entre 8 y 10 caracteres, incluyendo un mínimo de 2 números y 2 letras, diferenciando entre máyuscula y minúsculas ("case sensitive"). No se puede repetir el mismo carácter más de 4 veces consecutivas';
                    showAlert('Error', message, 'Aceptar', function(e){});
                    return;
        }else if(!confNewpassword.length>0){
            message = 'Debe confirmar la contraseña';
            showAlert('Error', message, 'Aceptar', function(e){});
            return;
        }else if(newPassword != confNewpassword){
            message = 'La nueva contraseña no coincide con la confirmación de la contraseña';
            showAlert('Error', message, 'Aceptar', function(e){});
            return;
        }else if(oldPassword == newPassword){
            message = 'La contraseña no debe ser la misma que la anterior';
            showAlert('Error', message, 'Aceptar', function(e){});
            return;
        }
                                                            
        // send data to services
        var userModel = new app.models.User();
                                                  
      if(emailInvalid=="N"){
        var data = {
            oldPassword: oldPassword,
            newPassword: newPassword,
            confirmationPassword: confNewpassword
        };
                                                            
        userModel.resetPassword(
            // parameters
            data,
            // success callback
            function(success){
                                                                                     
                if (!success.hasError) {
                                                                                     
                    // reset input
                    $.mobile.activePage.find('#password-old').val('');
                    $.mobile.activePage.find('#password-new').val('');
                    $.mobile.activePage.find('#password-new-conf').val('');
                                                                                     
                    // update password for touchId
                    if (app.utils.Storage.getLocalItem('password') != null) {
                        app.utils.Storage.setLocalItem('password', newPassword);
                    }
                                                                                     
                    // show alert
                    showAlert(
                        'Mensaje',
                        'Su contraseña fue actualizada correctamente',
                        'Aceptar',
                        function(e){}
                    );
                    app.router.navigate('menu', {trigger: true});
                } else {
                    // show alert
                    showAlert(
                        'Error',
                        success.desc,
                        'Aceptar',
                        function(e){}
                    );
                }
                                                                                     
            },
            // error callback
            app.utils.network.errorFunction
        );
      }
      else{
                                                            
         var data = {
                    newEmail: email,
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                    confirmationPassword: confNewpassword,
                    channel: 'miclaro-android',
                    accountNumber: app.utils.Storage.getSessionItem('selected-account').Account
                    };
                                                            
        userModel.resetUserPassword(
            // parameters
            data,
            // success callback
            function(success){
                                                                                     
                if (!success.hasError) {
                                                                                     
                    // reset input
                    $.mobile.activePage.find('#email').val('');
                    $.mobile.activePage.find('#password-old').val('');
                    $.mobile.activePage.find('#password-new').val('');
                    $.mobile.activePage.find('#password-new-conf').val('');
                                                                                     
                    // update password for touchId
                    if (app.utils.Storage.getLocalItem('password') != null) {
                        app.utils.Storage.setLocalItem('password', newPassword);
                    }
                    if (app.utils.Storage.getLocalItem('user') != null) {
                        app.utils.Storage.setLocalItem('user', email);
                    }
                                                                                     
                    // show alert
                    showAlert(
                        'Mensaje',
                        'Su usuario y contraseña fueron actualizados correctamente',
                        'Aceptar',
                        function(e){}
                    );
                    app.router.navigate('menu', {trigger: true});
                } else {
                    // show alert
                    showAlert(
                        'Error',
                        success.desc,
                        'Aceptar',
                        function(e){}
                    );
                }
                                                                                     
            },
            // error callback
            app.utils.network.errorFunction
        );
                                                   
      }
                                                            
    },
                                                        
                                                            
    clear: function(element){
                                                            
        // clear inputs
        $.mobile.activePage.find('#email').val('');
        $.mobile.activePage.find('#password-old').val('');
        $.mobile.activePage.find('#password-new').val('');
        $.mobile.activePage.find('#password-new-conf').val('');
                                                            
    }
                                                            
  });
});
