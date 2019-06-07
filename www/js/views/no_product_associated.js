$(function() {

	// Menu View
	// ---------------
	
	app.views.NoProductAssociatedView = app.views.CommonView.extend({

		name:'no_product_associated',
				
		// The DOM events specific.
		events: {
        	
            // events
        	'active':                               'active',
        	'pagecreate':                           'pageCreate',

            // click tabs
            'click #tab-postpago':					'selectPostpago',
            'click #tab-prepago':				    'selectPrepago',
            'click #tab-telephony':					'selectTelephony',
            'click #associated_account':			'navigateAddAccounts'
		},
			
		
		// Render the template elements
		render:function (callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }
			
			var self = this,
				variables = {
                    showName: app.utils.Storage.getSessionItem('is-from-dashboard'),
                    name: app.utils.Storage.getSessionItem('name'),
                    selectedTab: app.utils.Storage.getSessionItem('selected-tab-empty'),
                    accountSections: this.getUserAccess(),
                    showBackBth: true
                };

            app.TemplateManager.get(self.name, function(code){
                var template = cTemplate(code.html());
                $(self.el).html(template(variables));
                callback();
                return this;
            });

		},

		pageCreate: function(e) {
			var self = this;
			self.activateMenu(e);
            $('#nav-open').hide();
		},

        selectPostpago: function(e) {
            var self = this;

            if (document.getElementById('tab-postpago').classList.contains("on")) {return;}

            var postpagoLoginAccounts = app.utils.Storage.getSessionItem('accounts-list-postpago');

            if (postpagoLoginAccounts.length > 0) {
                app.utils.Storage.setSessionItem('selected-tab', 0);
                $('#tab-prepago').removeClass('on');
                $('#tab-telephony').removeClass('on');
                $('#tab-postpago').addClass('on');
                self.selectAccount(postpagoLoginAccounts[0], true);
            } else {
                app.utils.Storage.setSessionItem('selected-tab-empty', 0);
                self.render(function(){
                    $.mobile.activePage.trigger('pagecreate');
                });
            }
        },

        selectPrepago: function(e) {
            var self = this;

            if (document.getElementById('tab-prepago').classList.contains("on")) {return;}

            var prepagoLoginAccounts = app.utils.Storage.getSessionItem('accounts-list-prepago');

            if (prepagoLoginAccounts.length > 0) {
                app.utils.Storage.setSessionItem('selected-tab', 1);
                $('#tab-postpago').removeClass('on');
                $('#tab-telephony').removeClass('on');
                $('#tab-prepago').addClass('on');
                self.selectAccount(prepagoLoginAccounts[0], true);
            } else {
                app.utils.Storage.setSessionItem('selected-tab-empty', 1);
                self.render(function(){
                    $.mobile.activePage.trigger('pagecreate');
                });
            }
        },

        selectTelephony: function(e) {
            var self = this;

            if (document.getElementById('tab-telephony').classList.contains("on")) {return;}

            var fijoLoginAccounts = app.utils.Storage.getSessionItem('accounts-list-telefonia');

            if (fijoLoginAccounts.length > 0) {
                app.utils.Storage.setSessionItem('selected-tab', 2);
                $('#tab-postpago').removeClass('on');
                $('#tab-prepago').removeClass('on');
                $('#tab-telephony').addClass('on');
                self.selectAccount(fijoLoginAccounts[0], true);
            } else {
                app.utils.Storage.setSessionItem('selected-tab-empty', 2);
                self.render(function(){
                    $.mobile.activePage.trigger('pagecreate');
                });
            }
        },
	
	});
});
