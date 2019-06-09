$(function() {

	// App Router
	// ---

	app.AppRouter = Backbone.Router.extend({

		back: false,

		history: [],

	    routes:{
			''	 							:'login',
	        'login'	 						:'login',
	        'login/:section'				:'login',
	        'help'							:'help',
            'menu'							:'menu',
            'account'						:'account',
            'device'						:'device',
            'service'						:'service',
            'plan_detail'					:'planDetail',
            'profile'						:'profile',
            'consumption'					:'consumption',
            'consumption_limit'				:'consumptionLimit',
            'contact_us'					:'contactUs',
            'consumption_limit_subscriber'	:'consumptionLimitSubscriber',
            'order_summary'					:'orderSummary',
            'data_roaming'					:'dataRoaming',
            'payment_step_1'				:'paymentStep1',
            'payment_step_2'				:'paymentStep2',
            'payment_step_3'				:'paymentStep3',
            'payment_step_4'				:'paymentStep4',
            'payment_confirmation'			:'paymentConfirmation',
            'manage_notifications'			:'manageNotifications',
            'data_plan'						:'dataPlan',
            'invoice'						:'invoice',
            'location_detail'               :'locationDetail',
            'locations'                     :'locations',
            'billing_info/:id'				:'billingInfo',
            'chat'							:'chat',
            'register_step_1'				:'registerStep1',
            'register_step_2'				:'registerStep2',
            'register_step_3'				:'registerStep3',
            'register_step_4'				:'registerStep4',
            'register_step_1_web'			:'registerStep1Web',
            'register_step_2_web'			:'registerStep2Web',
            'register_step_3_web'			:'registerStep3Web',
            'register_step_4_web'			:'registerStep4Web',
            'recover_password_step_1'		:'recoverPasswordStep1',
            'recover_password_step_2'		:'recoverPasswordStep2',
            'recover_password_step_3'		:'recoverPasswordStep3',
            'recover_password_step_1_web'	:'recoverPasswordStep1Web',
            'recover_password_step_2_web'	:'recoverPasswordStep2Web',
            'recover_password_step_3_web'	:'recoverPasswordStep3Web',
            'splash'						:'splash',
            'splash/:section'				:'splash',
            'help_email'					:'helpEmail',
            'help_email_web'				:'helpEmailWeb',
            'help_pin'						:'helpPin',
            'help_pin_web'					:'helpPinWeb',
            'condition'						:'condition',
            'condition_web'					:'conditionWeb',
            'help_section'					:'helpSection',
            'failure_report'				:'failureReport',
            'success_report'				:'successReport',
            'improvement'					:'improvement',
            'about'							:'about',
            'faq'							:'faq',
            'update_app'					:'updateApp',
            'help_new_passw_profile'		:'helpNewPasswProfile',
            'help_old_passw_profile'        :'helpOldPasswProfile',
            'help_pin_profile'      	  	:'helpPinProfile',
            'add_accounts'					:'addAccounts',
            'touch_id_setup'				:'touchIdSetup',
            'email_update'					:'emailUpdateView',
			'reset_password'                :'resetPassword',
            'fixed_failure_report'			:'fixedFailureReport',
            'pay_quota'      	 		 	:'payQuota',
            'payment_quota_device'          :'paymentQuotaDevice',
            'confirm_pay_quota'             :'confirmPayQuota',
            'sva_sell'                      :'svaSell',
            'payment_credit_sva'            :'paymentCreditSva',
            'payment_sva'                   :'paymentSva',
            'confirm_pay_sva'               :'confirmPaySva',
            'debit_direct'                  :'debitDirect',
            'confirm_debit'                 :'confirmDebit',
            'my_order'                      :'myOrder',
            'sva_terms'                     :'svaTerms',
            'signin_step_1'                 :'signinStep1',
            'signin_step_2'                 :'signinStep2',
            'signin_step_3'                 :'signinStep3',
            'signin_step_4'                 :'signinStep4',
            'passport'                      :'passport',
            'password_step_1'               :'passwordStep1',
            'password_step_2'               :'passwordStep2',
            'password_step_3'               :'passwordStep3',
            'password_step_4'               :'passwordStep4',
            'password_step_5'               :'passwordStep5',
            'access_step_1'               	:'accessStep1',
            'access_step_2'               	:'accessStep2',
            'access_step_3'               	:'accessStep3',
            'notifications_app'             :'notificationsApp',
            'refiere_step_1'               	:'refiereStep1',
            'refiere_step_2'               	:'refiereStep2',
            'refiere_step_3'               	:'refiereStep3',
            'refiere_step_4'               	:'refiereStep4',
            'data_packages'              	:'dataPackages',
            'invoice_download'              :'invoiceDownload',
            'electronic_bill'               :'electronicBill',
            'my_orders'               		:'myOrders',
            'my_services'               	:'myServices',
            'netflix'          				:'netflix',
            'netflix_subscription'          :'netflixSubscription',
            'netflix_support'          		:'netflixSupport',
            'payment_history'               :'paymentHistory',
            'purchases'               		:'purchases',
            'support'               		:'support',
            'my_services_fijo'              :'myServicesFijo',
            'fault_report_a'               	:'faultReportA',
            'fault_report_b'               	:'faultReportB',
            'fault_report_c'               	:'faultReportC',
            'login_guest'	 				:'loginGuest',
            'signin_guest'	 				:'signinGuest',
            'change_password'	 			:'changePassword',
            'no_product_associated'	 		:'noProductAssociated',
            'change_plan'               	:'changePlan',
            'change_plan_confirm'           :'changePlanConfirm',
            'change_plan_success'           :'changePlanSuccess',
            'gift_1gb'                      :'gift1gb',
            'gift_recharge'                 :'giftRecharge',
            'invoice_details'				:'invoiceDetails',
            'my_store'                      :'myStore'

	    },

	    initialize: function() {
	        this.firstPage = true;
	    },

	    login: function(section) {
	        console.log('#login');
	        this.changePage(new app.views.LoginView(
	    		{
                    loginModel: new app.models.Login(),
                    customerModel: new app.models.Customer()
	    		}
	        ));
	    },

		help:function () {
	        console.log('#help');
	        this.changePage(new app.views.HelpView());
	    },

	    menu:function () {
	        console.log('#menu');
	        this.changePage(new app.views.MenuView(
                {
                    loginModel: new app.models.Login(),
                    customerModel: new app.models.Customer(),
                    referrerModel: new app.models.Referrer(),
                    paymentModel: new app.models.Payment()
                }
            ));
	    },

	    account:function () {
	        console.log('#account');
	        this.changePage(new app.views.AccountView(
        		{
	        		accountModel: new app.models.Account()
	        	}
	        ));
	    },

	    device:function () {
	        console.log('#device');
	        this.changePage(new app.views.DeviceView(
	        	{
	        		customerModel: new app.models.Customer()
	        	}
	        ));
	    },

	    service:function () {
	        console.log('#service');
	        this.changePage(new app.views.ServiceView(
        		{
	        		accountModel: new app.models.Account(),
	        		subscriberModel: new app.models.Subscriber()
	        	}
	        ));
	    },

	    planDetail:function () {
	        console.log('#plan_detail');
	        this.changePage(new app.views.PlanDetailView());
	    },

	    profile:function () {
	        console.log('#profile');
	        this.changePage(new app.views.ProfileView(
	    		{
	    			userModel: new app.models.User(),
                    accountModel: new app.models.Account()
	    		}
	        ));
	    },

	    consumption:function () {
	        console.log('#consumption');
	        this.changePage(new app.views.ConsumptionView(
	        	{
                    loginModel: new app.models.Login(),
                    customerModel: new app.models.Customer()
	        	}
	        ));
	    },

	    consumptionLimit:function () {
	        console.log('#consumption_limits');
	        this.changePage(new app.views.ConsumptionLimitView(
	        	{
                    loginModel: new app.models.Login(),
                    customerModel: new app.models.Customer()
	        	}
	        ));
	    },

	    consumptionLimitSubscriber:function () {
	        console.log('#consumption_limits_subscriber');
	        this.changePage(new app.views.ConsumptionLimitSubscriberView(
	        	{
	        		accountModel: new app.models.Account()
	        	}
	        ));
	    },

	    contactUs: function() {
	    	console.log('#contact_us');
	        this.changePage(new app.views.ContactUsView());
	    },

	    dataPlan: function() {
	    	console.log('#data_plan');
	        this.changePage(new app.views.DataPlanView({
                	loginModel: new app.models.Login(),
                	customerModel: new app.models.Customer(),
	        		offerModel: new app.models.Offer()
	        	}
	        ));
	    },

	    dataRoaming: function() {
	    	console.log('#data_roaming');
	        this.changePage(new app.views.DataRoamingView());
	    },

	    paymentStep1: function() {
	    	console.log('#paymentStep1');
	        this.changePage(new app.views.PaymentStep1View());
	    },

	    paymentStep2: function() {
	    	console.log('#paymentStep2');
	        this.changePage(new app.views.PaymentStep2View(
                {
                    paymentModel: new app.models.Payment(),
                    offerModel: new app.models.Offer()
                }
            ));
	    },

	    paymentStep3: function() {
	    	console.log('#paymentStep3');
	        this.changePage(new app.views.PaymentStep3View());
	    },

	    paymentStep4: function() {
	    	console.log('#paymentStep4');
	        this.changePage(new app.views.PaymentStep4View());
	    },

	    manageNotifications: function() {
	    	console.log('#manageNotifications');
	        this.changePage(new app.views.ManageNotificationsView(
		        {
                    userModel: new app.models.User(),
                    accountModel: new app.models.Account()
		        }
	        ));
	    },

	    paymentConfirmation: function() {
	    	console.log('#paymentConfirmation');
	        this.changePage(new app.views.PaymentConfirmationView());
	    },

	    orderSummary: function() {
	    	console.log('#order_summary');
	        this.changePage(new app.views.OrderSummaryView());
	    },

	    invoice:function () {
	        console.log('#invoice');
	        this.changePage(new app.views.InvoiceView(
        		{
                    loginModel: new app.models.Login(),
                    customerModel: new app.models.Customer(),
                    paymentModel: new app.models.Payment()
	        	}
	        ));
	    },

	    billingInfo: function() {
	    	console.log('#billing_info');
	        this.changePage(new app.views.BillingInfoView());
	    },

	    chat: function() {
	    	console.log('#chat');
	        this.changePage(new app.views.ChatView());
	    },

		helpEmail:function () {
	        console.log('#help_email');
	        this.changePage(new app.views.HelpEmailView());
	    },

		helpEmailWeb:function () {
	        console.log('#help_email_web');
	        this.changePage(new app.views.HelpEmailWebView());
	    },

		helpPin:function () {
	        console.log('#help_pin');
	        this.changePage(new app.views.HelpPinView());
	    },

		helpPinWeb:function () {
	        console.log('#help_pin_web');
	        this.changePage(new app.views.HelpPinView());
	    },

		condition:function () {
	        console.log('#Condition');
	        this.changePage(new app.views.ConditionView());
	    },

		conditionWeb:function () {
	        console.log('#conditionWeb');
	        this.changePage(new app.views.ConditionWebView());
	    },

		helpSection:function () {
	        console.log('#helpSection');
	        this.changePage(new app.views.HelpSectionView(
                {
                    storeModel: new app.models.Store()
                }
	        ));
	    },

	    failureReport:function () {
	        console.log('#failureReport');
	        this.changePage(new app.views.FailureReportView());
	    },

	    successReport:function () {
	        console.log('#failureReportSuccess');
	        this.changePage(new app.views.SuccessReportView());
	    },

	    improvement:function () {
	        console.log('#improvement');
	        this.changePage(new app.views.ImprovementView());
	    },

	    about:function () {
	        console.log('#about');
	        this.changePage(new app.views.AboutView());
	    },

	    faq:function () {
	        console.log('#faq');
	        this.changePage(new app.views.FaqView());
	    },

        locationDetail: function() {
	    	console.log('#locations');
	        this.changePage(new app.views.LocationDetailView(
                {
                    storeModel: new app.models.Store()
                }
            ));
	    },

        locations: function() {
	    	console.log('#locations');
	        this.changePage(new app.views.LocationsView(
                {
                    storeModel: new app.models.Store()
                }
            ));
	    },

	    helpNewPasswProfile: function() {
	    	console.log('#help_new_passw_profile');
	        this.changePage(new app.views.HelpNewPasswProfileView());
	    },

	    helpOldPasswProfile: function() {
	    	console.log('#help_old_passw_profile');
	        this.changePage(new app.views.HelpOldPasswProfileView());
	    },

	    helpPinProfile: function() {
	    	console.log('#help_pin_profile');
	        this.changePage(new app.views.HelpPinProfileView());
	    },

	    updateApp:function () {
	        console.log('#updateApp');
	        this.changePage(new app.views.UpdateAppView());
	    },

        emailUpdateView: function() {
            console.log('#email_update');
            this.changePage(new app.views.EmailUpdateView());
        },

	    addAccounts:function () {
	        console.log('#add_accounts');
	        this.changePage(new app.views.AddAccountView(
        		{
	        		accountModel: new app.models.Account()
	        	}
	        ));
	    },

        touchIdSetup: function() {
			console.log('#touch_id_setup');
	        this.changePage(new app.views.TouchIdSetupView());
        },


        resetPassword:function () {
            console.log('#reset_password');
            this.changePage(new app.views.ResetPasswordView());
        },

	    changePage: function (page) {

        	// Scroll top
	        $('body').scrollTop(0);

			// Trigger page init event
			$(page.el).trigger('pageinit');

			//	Remove from DOM
			$('.ui-page-active').remove();

			// Render HTML content
			page.render(function(){
				// Trigger pageload event
				setTimeout(function(){
					$(page.el).trigger('pagecreate');
				}, 200);
			});

			$(page.el).addClass('ui-page-active');

            // Google analitycs track
//	        if(app.isApplication &&
//	        		analytics !== undefined &&
//	        		analytics !== null ){
//	        	console.log(analytics+' page.name='+page.name);
//	        	//analytics.trackView(page.name, function(success){}, function(error){});
//	        }

	        // Set ative page
	    	if($.mobile === undefined){
	    		$.mobile = {};
	    	}

	        $.mobile.activePage = $(page.el);

			// Append html
			$('#maincont').append($(page.el));

            if (Backbone.history.fragment !== 'payment_step_3'){
                this.history.push(Backbone.history.fragment);
            }

            // to save navigation menu like closed
            app.isMenuOpen = false;
		},

	    refreshPage:function(){
	    	$.mobile.activePage.trigger('pagecreate');
	    },

        backPage:function(){

            // Hidden loading
            app.utils.loader.hide();

            var current = this.history.pop();
            var prev = this.history.pop();

            if(Backbone.history.fragment=='menu' || (current=='chat' && prev=='login')){
	        	app.router.navigate('login', {trigger: true});
	        } else if(Backbone.history.fragment=='login' || Backbone.history.fragment=='login_guest' || Backbone.history.fragment == ''){
	    		// Exit application for Android
	    		navigator.app.exitApp();
	    	} else {
	    		app.router.navigate(prev, {trigger: true});
	    	}

	    },

         fixedFailureReport:function () {
             console.log('#fixedFailureReport');
             this.changePage(new app.views.FixedFailureReportView(
                 {
                   accountModel: new app.models.Account()
                 }
             ));
         },

         payQuota: function() {
             console.log('#pay_quota');
             this.changePage(new app.views.PayQuotaView());
         },

         paymentQuotaDevice: function() {
             console.log('#payment_quota_device');
             this.changePage(new app.views.PaymentQuotaDeviceView(
                 {
                     paymentModel: new app.models.Payment()
                 }
             ));
         },

         confirmPayQuota: function() {
             console.log('#confirm_pay_quota');
             this.changePage(new app.views.ConfirmPayQuotaView());
         },

         svaSell: function() {
             console.log('#sva_sell');
             this.changePage(new app.views.SvaSellView(
                 {
                     accountModel: new app.models.Account(),
                     offerModel: new app.models.Offer()
                 }
             ));
         },

         myOrder: function() {
             console.log('#my_order');
             this.changePage(new app.views.MyOrderView(
                 {
                     accountModel: new app.models.Account()
                 }
             ));

         },

         paymentCreditSva: function() {
             console.log('#payment_sva');
             this.changePage(new app.views.PaymentCreditSvaView());
         },

         paymentSva: function() {
             console.log('#payment_sva');
             this.changePage(new app.views.PaymentSvaView(
                 {
                     paymentModel: new app.models.Payment()
                 }
             ));
         },

         confirmPaySva: function() {
             console.log('#confirm_pay_quota');
             this.changePage(new app.views.ConfirmPaySvaView());
         },

         debitDirect: function() {
            console.log('#debitDirect');
            this.changePage(new app.views.DebitDirectView());
        },

        confirmDebit: function() {
            console.log('#confirm_debit');
            this.changePage(new app.views.ConfirmDebitView());
        },

        svaTerms: function() {
            console.log('#sva_terms');
            this.changePage(new app.views.SvaTermsView());
        },

        signinStep1: function () {
            console.log('#signin_step_1');
            this.changePage(new app.views.SigninStep1View(
                {
                    loginModel: new app.models.Login(),
                    customerModel: new app.models.Customer()
                }
			));
        },

        signinStep2: function () {
            console.log('#signin_step_2');
            this.changePage(new app.views.SigninStep2View(
                {
                    loginModel: new app.models.Login(),
                    customerModel: new app.models.Customer()
                }
			));
        },

        signinStep3: function(section) {

            console.log('#signin_step_3');

            this.changePage(new app.views.SigninStep3View(
                {
                    loginModel: new app.models.Login(),
                    customerModel: new app.models.Customer()
                }
            ));
        },

        signinStep4: function(section) {

            console.log('#signin_step_4');

            this.changePage(new app.views.SigninStep4View(
                {
                    loginModel: new app.models.Login(),
                    customerModel: new app.models.Customer()
                }
            ));
        },

        passwordStep1: function () {
            console.log('#password_step_1');
            this.changePage(new app.views.PasswordStep1View(
                {
                    loginModel: new app.models.Login(),
                    customerModel: new app.models.Customer()
                }
			));
        },

        passwordStep2: function () {
            console.log('#password_step_2');
            this.changePage(new app.views.PasswordStep2View(
                {
                    loginModel: new app.models.Login(),
                    customerModel: new app.models.Customer()
                }
			));
        },

        passwordStep3: function () {
            console.log('#password_step_3');
            this.changePage(new app.views.PasswordStep3View(
                {
                    loginModel: new app.models.Login(),
                    customerModel: new app.models.Customer()
                }
			));
        },

        passwordStep4: function () {
            console.log('#password_step_4');
            this.changePage(new app.views.PasswordStep4View(
                {
                    loginModel: new app.models.Login(),
                    customerModel: new app.models.Customer()
                }
            ));
        },

        passwordStep5: function () {
            console.log('#password_step_5');
            this.changePage(new app.views.PasswordStep5View(
                {
                    loginModel: new app.models.Login(),
                    customerModel: new app.models.Customer()
                }
            ));
        },

        accessStep1: function () {
            console.log('#access_step_1');
            this.changePage(new app.views.AccessStep1View());
        },

        accessStep2: function () {
            console.log('#access_step_2');
            this.changePage(new app.views.AccessStep2View());
        },

        accessStep3: function () {
            console.log('#access_step_3');
            this.changePage(new app.views.AccessStep3View());
        },

        notificationsApp: function () {
            console.log('#notifications_app');
            this.changePage(new app.views.NotificationsAppView());
        },

        refiereStep1: function () {
            console.log('#refiere_step_1');
            this.changePage(new app.views.RefiereStep1(
                {
                    customerModel: new app.models.Customer(),
                    referrerModel: new app.models.Referrer()
                }
            ));
        },

        refiereStep2: function () {
            console.log('#refiere_step_2');
            this.changePage(new app.views.RefiereStep2(
                {
                    customerModel: new app.models.Customer(),
                    referrerModel: new app.models.Referrer()
                }
            ));
        },

        refiereStep3: function () {
            console.log('#refiere_step_3');
            this.changePage(new app.views.RefiereStep3(
                {
                    customerModel: new app.models.Customer(),
                    referrerModel: new app.models.Referrer()
                }
            ));
        },

        refiereStep4: function () {
            console.log('#refiere_step_4');
            this.changePage(new app.views.RefiereStep4(
                {
                    customerModel: new app.models.Customer(),
                    referrerModel: new app.models.Referrer()
                }
            ));
        },

        changePlan: function () {
            console.log('#change_plan');
            this.changePage(new app.views.ChangePlanView(
                {
                    offerModel: new app.models.Offer()
                }
            ));
        },

        changePlanConfirm: function () {
            console.log('#change_plan_confirm');
            this.changePage(new app.views.ChangePlanConfirmView(
                {
                    offerModel: new app.models.Offer()
                }
            ));
        },

        changePlanSuccess: function () {
            console.log('#change_plan_success');
            this.changePage(new app.views.ChangePlanSuccessView(
                {
                    customerModel: new app.models.Customer()
                }
            ));
        },

        dataPackages: function () {
            console.log('#data_packages');
            this.changePage(new app.views.DataPackagesView());
        },

        invoiceDownload: function () {
            console.log('#invoice_download');
            this.changePage(new app.views.InvoiceDownloadView(
                {
		         paymentModel: new app.models.Payment()
                }
             ));
	    
       },

        electronicBill: function () {
            console.log('#electronic_bill');
            this.changePage(new app.views.ElectronicBillView(
                {
                    customerModel: new app.models.Customer()
                }
			));
        },

        myOrders: function () {
            console.log('#my_orders');
            this.changePage(new app.views.MyOrdersView());
        },

        myServices: function () {
            console.log('#my_services');
            this.changePage(new app.views.MyServicesView());
        },

        netflix: function () {
            console.log('#netflix');
            this.changePage(new app.views.NetflixView());
        },

        netflixSubscription: function () {
            console.log('#netflix_subscription');
            this.changePage(new app.views.NetflixSubscriptionView());
        },

        netflixSupport: function () {
            console.log('#netflix_support');
            this.changePage(new app.views.NetflixSupportView());
        },

        purchases: function () {
            console.log('#purchases');
            this.changePage(new app.views.PurchasesView());
        },

        support: function () {
            console.log('#support');
            this.changePage(new app.views.SupportView());
        },

        myServicesFijo: function () {
            console.log('#my_services_fijo');
            this.changePage(new app.views.MyServicesFijoView());
        },

        faultReportA: function () {
            console.log('#fault_report_a');
            this.changePage(new app.views.FaultReportAView());
        },

        faultReportB: function () {
            console.log('#fault_report_b');
            this.changePage(new app.views.FaultReportBView());
        },

        faultReportC: function () {
            console.log('#fault_report_c');
            this.changePage(new app.views.FaultReportCView());
        },

        loginGuest: function () {
            console.log('#login_guest');
            this.changePage(new app.views.LoginGuestView(
                {
                    loginModel: new app.models.Login(),
                    customerModel: new app.models.Customer()
                }
			));
        },

        signinGuest: function() {

            console.log('#signin_guest');

            this.changePage(new app.views.SigninGuestView(
                {
                    loginModel: new app.models.Login(),
                    customerModel: new app.models.Customer()
                }
            ));
        },

        changePassword: function() {

            console.log('#change_password');

            this.changePage(new app.views.ChangePasswordView(
                {
                    loginModel: new app.models.Login(),
                    customerModel: new app.models.Customer()
                }
            ));
        },

        noProductAssociated: function () {
            console.log('#no_product_associated');
            this.changePage(new app.views.NoProductAssociatedView(
                {
                    customerModel: new app.models.Customer()
                }
            ));
        },

        gift1gb: function () {
            console.log('#gift_1gb');
            this.changePage(new app.views.Gift1gbView(
                {
                    customerModel: new app.models.Customer()
                }
            ));
        },

        giftRecharge: function () {
            console.log('#gift_recharge');
            this.changePage(new app.views.GiftRechargeView(
                {
                    customerModel: new app.models.Customer()
                }
            ));
        },

        paymentHistory: function () {
			console.log('#payment_history');
			this.changePage(new app.views.PaymentHistoryView(
				{
					paymentModel: new app.models.Payment()
				}
			));
		},

		invoiceDetails: function () {
			console.log('#invoice_details');
			this.changePage(new app.views.InvoiceDetailsView());
        },
        
        passport: function() {
            console.log('#passport');
            this.changePage(new app.views.PassportView());
        },

        myStore: function() {
            console.log('#my_store');
            this.changePage(new app.views.MyStoreView());

        },


	});

});
