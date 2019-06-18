$(function() {

	// Chat View
	// ---------------
	
	app.views.ChatView = app.views.CommonView.extend({

		name:'chat',
		
		// The DOM events specific.
		events: {
			
			//header
			'click #btn-back':					'toReturn',
            
        	// evets
			'active': 							'active',
			'click #continue': 					'openChat'
		},
			
		
		// Render the template elements        
		render:function (callback) {

			//validate if logged
			var isLogged = '';
			var name = '';
			var email = '';
			if(app.utils.Storage.getSessionItem('selected-account') != null){
				isLogged = 'off';
				const accountInfo = app.utils.Storage.getSessionItem('account-info');
				name = accountInfo.firstNameField + ' ' + accountInfo.lastNameField;
				email = accountInfo.emailField;
			}


			var self = this,
				variables = {
					name: name,
					email: email,
					isLogged: isLogged
			};
			
			app.TemplateManager.get(self.name, function(code){
		    	var template = cTemplate(code.html());
		    	$(self.el).html(template(variables));	
		    	app.router.refreshPage();
		    	callback();	
		    	return this;
		    });
            $(document).scrollTop();
		},

		openChat: function(e) {
			var url = app.chatURL;

			const question = $('#question').val();
			var name = $('#name').val();
			var lastname = 'Invitado';
			const email = $('#email').val();
			const dept = $('input[name=radio]:checked').val();

			if(app.utils.Storage.getSessionItem('selected-account') != null){
				const accountInfo = app.utils.Storage.getSessionItem('account-info');
				name = accountInfo.firstNameField;
				lastname = accountInfo.lastNameField;
			}

			if (name.length == 0) {
				message = 'Debe ingresar su nombre y apellido.';
				showAlert('Error', message, 'Aceptar');
				return;
			}
			if (!app.utils.tools.validateEmail(email)) {
				message = 'Debe ingresar un correo electrónico válido.';
				showAlert('Error', message, 'Aceptar');
				return;
			}
			if (dept == undefined) {
				message = 'Debe seleccionar un departamento.';
				showAlert('Error', message, 'Aceptar');
				return;
			}

			url += '?Email='+email;
			url += '&Department='+dept;
			url += '&firstname='+name;
			url += '&lastname='+lastname;
			url += '&Question='+question;

            url = url.replace(/\s+/g,'%20');
			console.log(url);

			var browser = app.utils.browser.show(url, true);

			app.utils.loader.show();

			// success event load url
			browser.addEventListener('loadstop', function(e) {

				// hiden loader
				app.utils.loader.hide();

				// show navegator
				browser.show();
			});

			// error event load url
			browser.addEventListener('loaderror', function(e) {

				// hiden loader
				app.utils.loader.hide();

				// close browser
				browser.close();

				showAlert('Error' , 'No se puede cargar la pagina, compruebe su conexion a Internet.', 'OK');
			});
		}
	});

});