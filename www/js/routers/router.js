$(function() {

	// App Router
	// ---

	app.AppRouter = Backbone.Router.extend({

		back: false,

		history: [],

	    routes:{
            'login'	 						:'login',
	        'login/:section'				:'login',
	        'help'							:'help',
            'menu'							:'menu',
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
            'refiere_questions'             :'refiereQuestions',
            'data_packages'              	:'dataPackages',
            'invoice_download'              :'invoiceDownload',
            'electronic_bill'               :'electronicBill',
            'my_orders'               		:'myOrders',
            'my_services'               	:'myServices',
            'netflix'          				:'netflix',
            'netflix_subscription'          :'netflixSubscription',
            'netflix_support'          		:'netflixSupport',
			'netflix_faq'   	        	:'netflixFaq',
            'netflix_terms'  	        	:'netflixTerms',
            'netflix_redirect'          	:'netflixRedirect',
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
            'change_plan_prepaid'           :'changePlanPrepaid',
            'change_plan_confirm'           :'changePlanConfirm',
            'change_plan_success'           :'changePlanSuccess',
            'gift_1gb'                      :'gift1gb',
            'gift_recharge'                 :'giftRecharge',
            'gift_sent'                 	:'giftSent',
            'invoice_details'				:'invoiceDetails',
            'purchase_additional_service'	:'purchaseAdditionalService',
            'device_payment_1'				:'devicePayment1',
            'calls_details'					:'callsDetails',
            'consumption_prepaid'			:'consumptionPrepaid',
            'history_prepaid'				:'historyPrepaid',
            'recharge_prepaid'				:'rechargePrepaid',
            'recharge_prepaid_confirm'		:'rechargePrepaidConfirm',
            'recharge_prepaid_payment'		:'rechargePrepaidPayment',
            'recharge_prepaid_success'		:'rechargePrepaidSuccess',
            'transactions_prepaid'			:'transactionsPrepaid',
            'data_plan_success'				:'dataPlanSuccess',
            'profile_update_username'		:'profileUpdateUsername',
            'profile_update_questions'		:'profileUpdateQuestions',
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

	    paymentStep1: function() {
	    	console.log('#paymentStep1');
             this.changePage(new app.views.PaymentStep1View(
				{
                    paymentModel: new app.models.Payment()
				}
			));
	    },

	    paymentStep2: function() {
	    	console.log('#paymentStep2');
	        this.changePage(new app.views.PaymentStep2View(
                {
                    paymentModel: new app.models.Payment(),
                    offerModel: new app.models.Offer(),
                    customerModel: new app.models.Customer(),
                }
            ));
	    },

	    paymentStep3: function() {
	    	console.log('#paymentStep3');
	        this.changePage(new app.views.PaymentStep3View());
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

	    chat: function() {
	    	console.log('#chat');
	        this.changePage(new app.views.ChatView());
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

	    updateApp:function () {
	        console.log('#updateApp');
	        this.changePage(new app.views.UpdateAppView());
	    },

	    addAccounts:function () {
	        console.log('#add_accounts');
	        this.changePage(new app.views.AddAccountView(
        		{
	        		accountModel: new app.models.Account()
	        	}
	        ));
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
  
              if (current=='chat' && prev=='login'){
                  app.router.navigate('login', {trigger: true});
              } else if(Backbone.history.fragment=='login'
                  || Backbone.history.fragment=='login_guest'
                  || Backbone.history.fragment == ''){
                  // Exit application for Android
                  navigator.app.exitApp();
              } else if(Backbone.history.fragment=='menu'){
                  showConfirm(
                      'Confirmación',
                      '¿Esta seguro que desea salir de la aplicación?',
                      ['Cancelar', 'Si, Salir'],
                      function (btnIndex) {
                          if (btnIndex == 2) {
                              navigator.app.exitApp();
                          }
  
                      }
                  );
              } else {
                  app.router.navigate(prev, {trigger: true});
              }
  
	    },
        
        debitDirect: function() {
            console.log('#debitDirect');
            this.changePage(new app.views.DebitDirectView(
                {
                    paymentModel: new app.models.Payment()
                }
            ));
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
            this.changePage(new app.views.NotificationsAppView(
                {
                    userModel: new app.models.User()
                }
            ));
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

        refiereQuestions: function () {
            console.log('#refiere_questions');
            this.changePage(new app.views.RefiereQuestionsView(
                {

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

        changePlanPrepaid: function () {
            console.log('#change_plan_prepaid');
            this.changePage(new app.views.ChangePlanPrepaidView(
                {
                    offerModel: new app.models.Offer()
                }
            ));
        },

         changePlanConfirm: function () {
            console.log('#change_plan_confirm');
            this.changePage(new app.views.ChangePlanConfirmView(
                {
                    offerModel: new app.models.Offer(),
                    customerModel: new app.models.Customer(),
                    paymentModel: new app.models.Payment()
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
            this.changePage(new app.views.MyOrdersView(
                {
                    accountModel: new app.models.Account()
                }
			));
        },

        netflix: function () {
            console.log('#netflix');
            this.changePage(new app.views.NetflixView());
        },

        netflixSubscription: function () {
            console.log('#netflix_subscription');
            this.changePage(new app.views.NetflixSubscriptionView(
                {
                    accountModel: new app.models.Account()
                }
            ));
        },

        netflixSupport: function () {
            console.log('#netflix_support');
            this.changePage(new app.views.NetflixSupportView());
        },

        netflixFaq: function () {
            console.log('#netflix_faq');
            this.changePage(new app.views.NetflixFaqView());
        },

        netflixTerms: function () {
            console.log('#netflix_terms');
            this.changePage(new app.views.NetflixTermsView());
        },

        netflixRedirect: function () {
            console.log('#netflix_redirect');
            this.changePage(new app.views.NetflixRedirectView(
                {
                    accountModel: new app.models.Account()
                }
			));
        },

        purchases: function () {
            console.log('#purchases');
            this.changePage(new app.views.PurchasesView());
        },

        support: function () {
            console.log('#support');
            this.changePage(new app.views.SupportView());
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
                    customerModel: new app.models.Customer(),
                    offerModel: new app.models.Offer()
                }
            ));
        },

        giftRecharge: function () {
            console.log('#gift_recharge');
            this.changePage(new app.views.GiftRechargeView(
                {
                    customerModel: new app.models.Customer(),
                    offerModel: new app.models.Offer()
                }
            ));
        },

        giftSent: function () {
            console.log('#gift_sent');
            this.changePage(new app.views.GiftSentView());
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
        
        purchaseAdditionalService: function () {
            console.log('#purchase_additional_service');
            this.changePage(new app.views.PurchaseServiceView());
        },

        devicePayment1: function () {
            console.log('#device_payment_1');
            this.changePage(new app.views.DevicePayment1View());
        },

        callsDetails:function () {
            console.log('#calls_details');
            this.changePage(new app.views.CallsDetailsView());
        },

        consumptionPrepaid:function () {
            console.log('#consumption_prepaid');
            this.changePage(new app.views.ConsumptionPrepaidView(
                {
                    loginModel: new app.models.Login(),
                    customerModel: new app.models.Customer()
                }
            ));
        },

        historyPrepaid:function () {
            console.log('#history_prepaid');
            this.changePage(new app.views.HistoryPrepaidView());
        },

        rechargePrepaid:function () {
            console.log('#recharge_prepaid');
            this.changePage(new app.views.RechargePrepaidView(
                {
                    paymentModel: new app.models.Payment()
                }
            ));
        },

        rechargePrepaidConfirm:function () {
            console.log('#recharge_prepaid_confirm');
            this.changePage(new app.views.RechargePrepaidConfirmView(
                {
                    paymentModel: new app.models.Payment()
                }
            ));
        },

        rechargePrepaidPayment:function () {
            console.log('#recharge_prepaid_payment');
            this.changePage(new app.views.RechargePrepaidPaymentView(
                {
                    paymentModel: new app.models.Payment()
                }
            ));
        },

        rechargePrepaidSuccess:function () {
            console.log('#recharge_prepaid_payment');
            this.changePage(new app.views.RechargePrepaidSuccessView());
        },

        transactionsPrepaid:function () {
            console.log('#transactions_prepaid');
            this.changePage(new app.views.TransactionsPrepaidView(
                {
                    paymentModel: new app.models.Payment()
                }
            ));
        },

        dataPlanSuccess:function () {
            console.log('#data_plan_success');
            this.changePage(new app.views.DataPlanSuccessView());
        },

        profileUpdateUsername: function() {
            console.log('#profile_update_username');
            this.changePage(new app.views.ProfileUpdateUsernameView(
                {
                    userModel: new app.models.User(),
                    accountModel: new app.models.Account()
                }
            ));
        },

        profileUpdateQuestions: function() {
            console.log('#profile_update_questions');
            this.changePage(new app.views.ProfileUpdateQuestionsView(
                {
                    userModel: new app.models.User(),
                    accountModel: new app.models.Account()
                }
            ));
        }
	});

});
