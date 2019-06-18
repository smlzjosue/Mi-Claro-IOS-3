$(function() {

    // Common View
    // ---------------

    app.views.CommonView = Backbone.View.extend({

        name:'menu',
        history: true,

        // Models declaration
        loginModel: null,
        customerModel: null,
        referrerModel: null,
        accountModel: null,
        userModel: null,
        tools: null,

        PAY: {
            ADDITIONAL_DATA: 'pay_additional_data',
            SEND_1GB: 'pay_send_1gb',
            SEND_RECHARGE: 'pay_send_recharge',
            INSTALLMENT: 'pay_installment'
        },

        // Initialize the view
        initialize: function(options){
            this.options = options;
            this.tools = app.utils.tools;
        },

        activateMenu: function(e) {
            var self = this;

           app.resetTimer();

            $('.m-menuin.offnouse').click(function(){
                self.dialogAccessLimited();
            });

            $('.m-menubar.offnouse').click(function(){
                self.dialogAccessLimited();
            });

            $('.dashconts.offnouse').click(function(){
                self.dialogAccessLimited();
            });

            // return
            $('#btn-back').click(function() { self.back(e); });
            // go home
            $('#btn-menu').click(function() { self.navigateHome(); });
            // open-close nav menu
            $('#nav-open').click(function() { self.openNav(); });
            $('#nav-close').click(function() { self.closeNav(); });
            // go notifications
            $('#btn-notifications').click(function() { self.navigateMyNotifications(); });

           // sub menu
           $('#section-head0').click(function() {$('#section-head0').toggleClass('open-ins');});
           $('#section-head1').click(function() {$('#section-head1').toggleClass('open-ins');});
           $('#section-head2').click(function() {$('#section-head2').toggleClass('open-ins');});
           $('#section-head3').click(function() {$('#section-head3').toggleClass('open-ins');});
           $('#section-head4').click(function() {$('#section-head4').toggleClass('open-ins');});
           $('#section-head5').click(function() {$('#section-head5').toggleClass('open-ins');});
           $('#section-head6').click(function() {$('#section-head6').toggleClass('open-ins');});
           $('#section-head7').click(function() {$('#section-head7').toggleClass('open-ins');});
           $('#section-head8').click(function() {$('#section-head8').toggleClass('open-ins');});

            // Invoices & Payments
            $('#nav-access9').click(function() { self.navigateInvoiceSummary(); });
            $('#nav-access10').click(function() { self.navigateInvoiceDownload(); });
            $('#nav-access11').click(function() { self.navigateInvoiceDetails(); });
            $('#nav-access12').click(function() { self.navigatePaymentHistory(); });
            $('#nav-access13').click(function() { self.navigateElectronicBill(); });
            $('#nav-access32').click(function() { self.navigateDebitDirect(); });
            // Recharges
            $('#nav-access26').click(function() { self.navigatePrepaidRecharge(); });
            $('#nav-access27').click(function() { self.navigatePrepaidHistory(); });
            // My consumptions
            $('#nav-access14').click(function() { self.navigateConsumptionData(); });
            $('#nav-access15').click(function() { self.navigateConsumptionCalls(); });
            $('#nav-access28').click(function() { self.navigateConsumptionPrepaid(); });
            // My equipment & services
            $('#nav-access16').click(function() { self.navigateServices(); });
            $('#nav-access17').click(function() { self.navigateChangePlan(); });
            $('#nav-access18').click(function() { self.navigateNetflix(); });
            $('#nav-access19').click(function() { self.navigateReferSystem(); });
            $('#nav-access31').click(function() { self.navigateReferSystem(); });
            // My services
            $('#nav-access34').click(function() { self.navigateServices(); });
            $('#nav-access35').click(function() { self.navigateChangePlan(); });
            $('#nav-access36').click(function() { self.navigateNetflix(); });
            $('#nav-access37').click(function() { self.navigateReferSystem(); });
            // Purchases
            $('#nav-access38').click(function() { self.navigatePurchases(); });
            $('#nav-access20').click(function() { self.openStore(); });
            $('#nav-access21').click(function() { self.navigatePurchaseData(); });
            $('#nav-access22').click(function() { self.navigatePurchaseService(); });
            $('#nav-access23').click(function() { self.navigateMyOrders(); });
            $('#nav-access24').click(function() { self.navigateGift1gb(); });
            $('#nav-access25').click(function() { self.navigateGiftRecharge(); });
           // interruption
            $('#nav-access33').click(function() { self.navigateInterruption(); });
           // Transactions
            $('#nav-access30').click(function() { self.navigateTransactions(); });
           // My account
            $('#nav-access1').click(function() { self.navigateMyNotifications(); });
            $('#nav-access2').click(function() { self.navigateMyProfile(); });
            $('#nav-access3').click(function() { self.navigateAddAccounts(); });
            $('#nav-access4').click(function() { self.navigateChangePassword(); });
            $('#nav-access5').click(function() { self.navigateChangeEmail(); });
            $('#nav-access6').click(function() { self.navigateManageNotifications(); });
            $('#nav-access7').click(function() { self.navigateSupport(); });
            $('#nav-access8').click(function() { self.logout(); });

            // Dashboard
            $('.dash_recharge').click(function() { self.navigatePrepaidRecharge(); });
            $('.dash_invoice').click(function() { self.navigateInvoiceSummary(); });
            $('.dash_consumption_data').click(function() { self.navigateConsumptionData(); });
            $('.dash_consumption_others').click(function() { self.navigateConsumptionOthers(); });
            $('.dash_consumption_prepaid').click(function() { self.navigateConsumptionPrepaid(); });
            $('.dash_services').click(function() { self.navigateServices(); });
            $('.dash_data_plan').click(function() { self.navigatePurchaseData(); });
            $('.dash_change_plan').click(function() { self.navigateChangePlan(); });
            $('.dash_store').click(function() { self.openStore(); });
            $('.dash_send_1gb').click(function() { self.navigateGift1gb(); });
            $('.dash_send_recharge').click(function() { self.navigateGiftRecharge(); });
            $('.dash_electronic_bill').click(function() { self.navigateElectronicBill(); });
            $('.dash_account').click(function() { self.navigateMyProfile(); });
            $('.dash_netflix').click(function() { self.navigateNetflix(); });
            $('.dash_referrer').click(function() { self.navigateReferSystem(); });
            $('.dash_fault_report').click(function() { self.navigateInterruption(); });

     // footer
     $('#btn-help').click(function() { self.helpSection(); });

     // click tabs
     $('#tab-postpago').click(function() { self.selectPostpago(); });
     $('#tab-prepago').click(function() { self.selectPrepago(); });
     $('#tab-telephony').click(function() { self.selectTelephony(); });
     // notifications
     $('#notifications').click(function() { self.navigateMyNotifications(); });
     
     self.markSelectedPage(e);
        },

        markSelectedPage: function(e) {
            var self = this;

            var currentPage = app.router.history[app.router.history.length-1];

            if (currentPage == 'notifications_app') {
                self.mark('1');
            } else if (currentPage == 'profile') {
                self.mark('2');
            } else if (currentPage == 'add_accounts') {
                self.mark('3');
            } else if (currentPage == 'profile') {
                self.mark('4');
            } else if (currentPage == 'profile') {
                self.mark('5');
            } else if (currentPage == 'manage_notifications') {
                self.mark('6');
            } else if (currentPage == 'support') {
                self.mark('7');
            } else if (currentPage == 'invoice') {
                self.mark('9');
            } else if (currentPage == 'invoice_download') {
                self.mark('10');
            } else if (currentPage == 'invoice_details') {
                self.mark('11');
            } else if (currentPage == 'payment_history') {
                self.mark('12');
            } else if (currentPage == 'electronic_bill') {
                self.mark('13');
            } else if (currentPage == 'consumption') {
                self.mark('14');
            } else if (currentPage == 'calls_details') {
                self.mark('15');
            } else if (currentPage == 'device') {
                self.mark('16');
                self.mark('34');
            } else if (currentPage == 'change_plan' || currentPage == 'change_plan_prepaid') {
                self.mark('17');
                self.mark('35');
            } else if (currentPage == 'netflix'
            || currentPage == 'netflix_claims'
                || currentPage == 'netflix_support'
                || currentPage == 'netflix_subscription'
                || currentPage == 'netflix_redirect') {
                self.mark('18');
                self.mark('36');
            } else if (currentPage == 'refiere_step_1'
                || currentPage == 'refiere_step_2'
                || currentPage == 'refiere_step_3'
                || currentPage == 'refiere_step_4'
                || currentPage == 'refiere_questions') {
                self.mark('19');
                self.mark('31');
                self.mark('37');
            } else if (currentPage == 'purchases') {
                self.mark('38');
            } else if (currentPage == 'data_plan') {
                self.mark('21');
            } else if (currentPage == 'purchase_additional_service') {
                self.mark('22');
            } else if (currentPage == 'my_orders') {
                self.mark('23');
            } else if (currentPage == 'gift_1gb') {
                self.mark('24');
            } else if (currentPage == 'gift_recharge') {
                self.mark('25');
            } else if (currentPage == 'recharge_prepaid') {
            self.mark('26');
             } else if (currentPage == 'history_prepaid') {
            self.mark('27');
             } else if (currentPage == 'transactions_prepaid') {
            self.mark('30');
        } else if (currentPage == 'debit_direct') {
            self.mark('32');
        } else if (currentPage == 'fault_report_a'
            || currentPage == 'fault_report_b'
            || currentPage == 'fault_report_c') {
            self.mark('33');
            }
        },

        mark: function(id) {
            var self = this;
            var access = self.getUserAccess();
            var name = '';
            access.forEach(function(section) {
                section.Pages.forEach(function(page) {
                    if (String(page.accessID) == id) {
                        name = '<b>'+ page.pageName +'</b>';
                    }
                });
            });
            $('#nav-access'+id).find('p').html(name);
        },

        openNav: function() {           
           var sideNav = document.getElementById("mySidenav");
           sideNav.style.left = "0";
           $('#nav-open').hide();
           $('#nav-close').show();
           app.isMenuOpen = true;         
        },

        closeNav: function () {
            if (app.isMenuOpen === true) {
               var sideNav = document.getElementById("mySidenav");
               sideNav.style.left = "-100%";
               $('#nav-close').hide();
               $('#nav-open').show();
               app.isMenuOpen = false;              
            }
        },

        back: function(e) {
            console.log('back click on APP Header');
            e.preventDefault();

            if (app.isMenuOpen == true) {
                var sideNav = document.getElementById("mySidenav");
                if (sideNav) {
                    sideNav.style.right = "100%";
                    $('#nav-close').hide();
                    $('#nav-open').show();
                    app.isMenuOpen = false;
                }
                return;
            }


            /*if (Backbone.history.fragment=='profile_update_username') {
                showConfirm(
                    'Salir',
                    '¿Esta seguro que desea cerrar la sesión?',
                    ['Si', 'No'],
                    function (btnIndex) {
                        if (btnIndex == 1) {
                            app.removeSession();
                            app.router.navigate('login_guest', {trigger: true});
                        }

                    }
                );
                return
            }*/

            var analytics = null;

            if(analytics !=null ){
                // send google statistics
                analytics.trackEvent('button', 'click', 'back');
            }

           // e.preventDefault();
            app.router.back = true;

            app.router.backPage();
        },

        menu: function(e){
            app.router.history	= ['menu'];
            app.router.navigate('menu',{trigger: true});
            return false;
        },

        logout: function(){
            var self = this;

            var analytics = null;

            // close side menu
            if(app.isMenuOpen == true){
                self.closeNav();
            }

            if(analytics != null){
                // send google statistics
                analytics.trackEvent('button', 'click', 'logout');
            }

            console.log('in on logout method');

            showConfirm(
                'Salir',
                '¿Esta seguro que desea cerrar la sesión?',
                ['Si', 'No'],
                function(btnIndex){
                    if(btnIndex==1){
                        app.removeSession();
                        app.router.navigate('login_guest',{trigger: true});
                    }
                }
            );
        },

        navigateHome: function() {
            app.router.history	= ['menu']; // TODO, este es el correcto
            app.router.navigate('menu',{trigger: true}); // TODO, este es el correcto
            //app.router.navigate('payment_step_2',{trigger: true}); // TODO, Borrar
            //app.router.navigate('device',{trigger: true}); // TODO, Borrar
            //app.router.navigate('change_plan',{trigger: true}); // TODO, Borrar
            //this.navigatePrepaidRecharge(); // TODO, Borrar
        },

        navigateInvoiceSummary: function() {
            app.router.navigate('invoice', {trigger: true});
        },

        navigateInvoiceDownload: function() {
            app.router.navigate('invoice_download', {trigger: true});
        },

        navigateInvoiceDetails: function() {
            app.router.navigate('invoice_details', {trigger: true});
        },

        navigatePaymentHistory: function(e){
            app.router.navigate('payment_history', {trigger: true});
        },

        navigateElectronicBill: function(e){
            app.router.navigate('electronic_bill', {trigger: true});
        },

        navigateDebitDirect: function(){
            app.router.navigate('debit_direct', {trigger: true});
        },

        navigatePrepaidRecharge: function() {
            app.router.navigate('recharge_prepaid', {trigger: true});
        },

        navigatePrepaidHistory: function() {
            app.router.navigate('history_prepaid', {trigger: true});
        },

        navigateConsumptionData: function() {
            app.utils.Storage.setSessionItem('consumption-type-selected', 1);
            app.router.navigate('consumption', {trigger: true});
        },

         navigateConsumptionOthers: function() {
                app.utils.Storage.setSessionItem('consumption-type-selected', 2);    
            app.router.navigate('consumption', {trigger: true});
        },

        navigateConsumptionCalls: function() {
            app.router.navigate('calls_details', {trigger: true});
        },

        navigateConsumptionPrepaid: function() {
            app.router.navigate('consumption_prepaid', {trigger: true});
        },

        navigateInterruption: function() {
            app.router.navigate('fault_report_a', {trigger: true});
        },

        navigateTransactions: function() {
            app.router.navigate('transactions_prepaid', {trigger: true});
        },

        navigateGift1gb: function() {
            app.router.navigate('gift_1gb', {trigger: true});
        },

        navigateGiftRecharge: function() {
            app.router.navigate('gift_recharge', {trigger: true});
        },

        navigatePurchaseData: function() {
            app.router.navigate('data_plan', {trigger: true});
        },

        navigatePurchaseService: function() {
            app.router.navigate('purchase_additional_service', {trigger: true});
        },

        navigateServices: function(e){
            app.router.navigate('device', {trigger: true});
        },

        navigateChangePlan: function(e){
            if (this.isCurrentAccountPrepaid()) {
                app.router.navigate('change_plan_prepaid', {trigger: true});
            } else {
                app.router.navigate('change_plan', {trigger: true});
            }  
        },

        navigateNetflix: function(e){
            app.router.navigate('netflix', {trigger: true});
        },

        navigateReferSystem: function(e){
            app.router.navigate('refiere_step_1', {trigger: true});
        },

        navigatePurchases: function(e){
            app.router.navigate('purchases', {trigger: true});
        },

        navigateMyOrders: function(e){
            app.utils.Storage.setSessionItem('account-orders-is-loaded', false);
            app.router.navigate('my_orders', {trigger: true});
        },

        navigateMyNotifications: function(e){
            app.router.navigate('notifications_app', {trigger: true});
        },

        navigateMyProfile: function(e){
            app.utils.Storage.setSessionItem('profile-tab-selected', 0);
            app.router.navigate('profile', {trigger: true});
        },

        navigateChangeEmail: function(e){
            app.utils.Storage.setSessionItem('profile-tab-selected', 1);
            app.router.navigate('profile', {trigger: true});
            if (app.router.history[app.router.history.length-1] == 'profile') {
                this.closeNav();
                this.tabEmail(e);
            }
        },

        navigateChangePassword: function(e){
            app.utils.Storage.setSessionItem('profile-tab-selected', 2);
            app.router.navigate('profile', {trigger: true});
            if (app.router.history[app.router.history.length-1] == 'profile') {
                this.closeNav();
                this.tabPassword(e);
            }
        },

        navigateAddAccounts: function(e){
            app.utils.Storage.setSessionItem('accounts-subscribers-is-loaded', false);
            app.router.navigate('add_accounts', {trigger: true});
        },

        navigateManageNotifications: function(e){
            app.router.navigate('manage_notifications', {trigger: true});
        },

        navigateSupport: function(e){
            app.router.navigate('support', {trigger: true});
        },

        openStore: function() {

            var self = this,
                browser = null;

            self.closeNav();

            browser = app.utils.browser.show('https://tienda.claropr.com/', true);

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
        },

        doPayment: function(amount, account) { // TODO, no se ha probado despues de hacer el pago
            var self = this,
                browser = null;

            var paymentModel = new app.models.Payment();
            paymentModel.doPayment(
                //parameters
                account,
                amount,

                // success
                function(success) {

                    if(!success.HasError){

                        browser = app.utils.browser.show(success.response, true);

                        app.utils.loader.show();

                        // success event load url
                        browser.addEventListener('loadstop', function(e) {

                            // hiden loader
                            app.utils.loader.hide();

                            // show navegator
                            browser.show();
                        });

                        // success event load url
                        browser.addEventListener('loadstart', function(e) {
                            if(e.url=='https://ebill.claropr.com/login/login.jsf' ||
                                e.url=='https://ebill.claropr.com/login/home.jsf' ||
                                e.url=='https://checkout.evertecinc.com/Close.aspx'){
                                browser.close();
                            }
                        });

                        // error event load url
                        browser.addEventListener('loaderror', function(e) {

                            // hiden loader
                            app.utils.loader.hide();

                            // close browser
                            browser.close();
                        });

                        browser.addEventListener('exit', function(e) {

                            var paymentId = success.paymentid;
                            // update data
                            self.simpleChangeAccount(e)
                        });

                    } else {
                        showAlert('Error', success.ErrorDesc, 'Aceptar');
                    }

                    // send analytics statistics
                    if(analytics!=null){
                        analytics.trackEvent('button', 'click', 'billPayment button');
                    }
                },
                // error function
                app.utils.network.errorRequest
            );
        },

        chat: function(){

            var browser = null,
                analytics = null;

            // close side menu
            if(app.isMenuOpen == true){
                this.closeMenu();
            }

            // send google statistics			
            if(analytics !=null ){
                analytics.trackEvent('button', 'click', 'chat button');
            }

            app.router.navigate('chat',{trigger: true});

            return false;
        },

        helpSection: function(e){

            var analytics = null;

            // close side menu
            if(app.isMenuOpen == true){
                this.closeMenu();
            }

            // send google statistics
            if(analytics !=null ){
                analytics.trackEvent('button', 'click', 'help section');
            }

            app.utils.Storage.setSessionItem('exit-help-url', this.name);

            //Go to help
            app.router.navigate('help_section',{trigger: true});

        },
 
        getUserAccess: function() {
            var listSections = app.utils.Storage.getSessionItem('accounts-available-sections');

            const isGuest = app.utils.Storage.getLocalItem('logged-guest');
            const selectedAccount = app.utils.Storage.getSessionItem('selected-account');

            const newList = [];
            listSections.forEach(function(section) {
                const newPages = [];
                section.Pages.forEach(function(page) {
                    if (page.accessID != 11  // TODO, modulo detalles de facturar
                        && page.accessID != 15 // TODO, modulo detalles de llamadas
                        && page.accessID != 22 // TODO, modulo SVA (Compra de servicios de Valor Agregado)
                        && !(page.accessID == 24 && app.utils.tools.accountIsTelephony(selectedAccount.mAccountType, selectedAccount.mAccountSubType, selectedAccount.mProductType)) // TODO, modulo regala 1 gb en fijo
                        && !(page.accessID == 25 && app.utils.tools.accountIsTelephony(selectedAccount.mAccountType, selectedAccount.mAccountSubType, selectedAccount.mProductType)) // TODO, modulo regala 1 recarga en fijo
                        && page.accessID != 27 // TODO, modulo de historico de recargas (prepago)
                        && page.accessID != 29 // TODO, modulo de transaferencias (prepago)
                        && page.accessID != 33) { // TODO, modulo reporta interrupcion
                        if (!page.allowAsGuest && isGuest) {
                            page.extraClass = 'offnouse';
                        } else {
                            page.extraClass = '';
                        }
                        newPages.push(page);
                    }
                });
                if (newPages.length > 0) {
                    section.Pages = newPages;
                    newList.push(section);
                }
            });
            if (newList.length == 0) {
                var section =
                {
                    "sectionName":"MENU",
                    "Pages":[
                        {
                            "userID":0,
                            "pageName":"CERRAR SESION",
                            "allowAsGuest":false,
                            "accessID":8
                        }
                    ]
                };
                newList.push(section);
            }

            return newList;
        },

        getSelectTabAccounts: function() {
            const selectedAccount = app.utils.Storage.getSessionItem('selected-account');
            var loginAccounts = [];
            if (selectedAccount.postpago) {
                loginAccounts = app.utils.Storage.getSessionItem('accounts-list-postpago');
            } else if (selectedAccount.prepago) {
                loginAccounts = app.utils.Storage.getSessionItem('accounts-list-prepago');
            } else if (selectedAccount.telefonia) {
                loginAccounts = app.utils.Storage.getSessionItem('accounts-list-telefonia');
            }
            return loginAccounts;
        },

        active: function(e){


            var	self = this;
            url = app.utils.Storage.getSessionItem('navegation-path');

            //alert('on commons.active: ' + url);

            app.utils.Storage.removeSessionItem('navegation-path');

            switch(url) {
                case 'account':
                    self.account();
                    break;
                case 'invoice':
                    self.invoice();
                    break;
                case 'chat':
                    self.chat();
                    break;
            }
        },

        addAccounts: function(e) {
            if (app.utils.Storage.getSessionItem('add-accounts') == null) {
                this.options.accountModel.getAccountsList(
                    // success callback
                    function(data) {
                        var accounts = data.object;

                        app.utils.Storage.setSessionItem('add-accounts-list', accounts);

                        //cache
                        app.utils.Storage.setSessionItem('add-accounts', true);

                        app.router.navigate('add_accounts',{trigger: true});
                    },

                    // error function
                    app.utils.network.errorFunction
                );
            }else {
                app.router.navigate('add_accounts',{trigger: true});
            }
        },

        focus: function(e) {console.log('focus**');
            $('.footcont').hide();
        },

        focusOut: function(e) {console.log('focus out**');
            $('.footcont').show();
        },

        toggleClass: function(e){
            $(e.currentTarget).toggleClass('mon');
        },
        
        dialogAccessLimited: function() {
            var self = this;
            showConfirm('', 'Actualmente, estas en modo de usuario invitado. Si eres el dueño de la cuenta, debes autenticarte y/o registrarte para esta y otras secciones transacciones solo disponibles para el administrador.',
                ['Ir a registro', 'Continuar como invitado', 'Autenticarse'],
                function(button){
                console.log('button'+ button);
                    if(button==3) {
                        app.utils.Storage.setLocalItem('loginModeGuest', false);
                        app.utils.Storage.setLocalItem('skip_signin', true);
                        app.utils.Storage.setSessionItem('request_login', true);
                        app.router.navigate('login', {
                            trigger: true
                        });
                    }
                    if(button==1) {
                        app.router.navigate('signin_step_1',{trigger: true});
                    }
                    if(button==2) {
                        // continuar como invitado
                    }

                });
        },
                               
        getAccountDetails: function(selectedAccount, successFunction, errorFunction) {
            var self = this;
            var customerModel = new app.models.Customer();
            customerModel.accountDetails(
                selectedAccount.DefaultSubscriber,
                selectedAccount.Account,
                function (response) {
                    if(response.hasError) {
                        errorFunction(response, 200, response.errorDisplay);
                    } else {
                        app.utils.Storage.setSessionItem('required-associate-account', false);

                        selectedAccount.AmtDue = response.AccounInfo.pastDueAmountField+"";
                        selectedAccount.LastPayment = response.AccounInfo.lastPaymentAmountField;
                        selectedAccount.BillDate = response.AccounInfo.cycleStartDateField;  // todo no estoy seguro
                        selectedAccount.BillDateEnd = response.AccounInfo.cycleEndDateField; // todo no estoy seguro
                        selectedAccount.BillCycle = response.AccounInfo.cycleDaysLeftField;
                        selectedAccount.CycleDate = response.AccounInfo.cycleDateField;
                        selectedAccount.CreditClass = response.AccounInfo.creditClassField;
                        selectedAccount.Paperless = response.AccounInfo.paperlessField;
                        selectedAccount.postpago = false;
                        selectedAccount.prepago = false;
                        selectedAccount.telefonia = false;
                        selectedAccount.guest = app.utils.Storage.getLocalItem('logged-guest');

                        if (app.utils.tools.accountIsPostpaid(selectedAccount.mAccountType, selectedAccount.mAccountSubType, selectedAccount.mProductType)) {
                            selectedAccount.postpago = true;
                            app.utils.Storage.setSessionItem('selected-tab', 0);
                            console.log("Selected account is postpago");
                        } else if (app.utils.tools.accountIsPrepaid(selectedAccount.mAccountType, selectedAccount.mAccountSubType, selectedAccount.mProductType)){
                            selectedAccount.prepago = true;
                            app.utils.Storage.setSessionItem('selected-tab', 1);
                            console.log("Selected account is prepago");
                        } else if (app.utils.tools.accountIsTelephony(selectedAccount.mAccountType, selectedAccount.mAccountSubType, selectedAccount.mProductType)) {
                            selectedAccount.telefonia = true;
                            app.utils.Storage.setSessionItem('selected-tab', 2);
                            console.log("Selected account is telefonia fija");
                        } else {
                            showAlert('Error', 'Esta cuenta no tiene permitido el acceso, por favor contacta el area de soporte', 'Ok');
                            app.removeSession();
                            console.log("Selected account is not defined");
                            return;
                        }

                        const subscribers = [];
                        $.each(response.SubscriberInfo, function (j, subscriberObj) {
                            var subscriber = {
                                subscriber: subscriberObj.subscriberNumberField,
                                Status: subscriberObj.subscriberStatusField,
                                ProductType: subscriberObj.productTypeField
                            };
                            // detect suspended account
                            if(subscriberObj.subscriberStatusField == 'S') {
                                app.utils.Storage.setSessionItem('suspend-account-init', true);
                            }
                            subscribers[j] = subscriber;
                        }); // unkwon if method is neccesay
                        selectedAccount.Subscribers = subscribers;

                        app.utils.Storage.setSessionItem('selected-account-is-suspend',
                            response.AccounInfo.banStatusField == "S"); // new method to know if account is suspend

                        app.utils.Storage.setSessionItem('selected-account-value', selectedAccount.Account);

                        app.utils.Storage.setSessionItem('selected-subscriber-value', selectedAccount.DefaultSubscriber);

                        app.utils.Storage.setSessionItem('selected-account', selectedAccount);

                        app.utils.Storage.setSessionItem('subscribers-info', response.SubscriberInfo);

                        app.utils.Storage.setSessionItem('account-info', response.AccounInfo);

                        var userInfo =  {
                            name: response.AccounInfo.firstNameField+' '+response.AccounInfo.lastNameField,
                            firstName: response.AccounInfo.firstNameField,
                            lastName: response.AccounInfo.lastNameField,
                        };
                        app.utils.Storage.setSessionItem('user-info', userInfo);

                        app.utils.Storage.setSessionItem('name', response.AccounInfo.firstNameField);

                        app.utils.Storage.setSessionItem('qualification', response.qualification);

                        app.utils.Storage.setSessionItem('notifications', response.Messages);

                        if (selectedAccount.prepago == true) {
                            self.registerPrepaidToken(selectedAccount, selectedAccount.DefaultSubscriber, successFunction, errorFunction);
                        } else {
                            self.getAccountAccess(selectedAccount, selectedAccount.DefaultSubscriber, successFunction, errorFunction);
                        }
                    }
                },
                errorFunction
            );
        },

        registerPrepaidToken: function(selectedAccount, subscriber, successFunction, errorFunction) {
            var self = this;
            var customerModel = new app.models.Customer();
            customerModel.updateToken(
                subscriber,
                selectedAccount.Account,
                function (response) {
                    if (!response.hasError) {
                        app.utils.Storage.setSessionItem('prepaid-customer-card-id', response.response);
                    }
                    //if (response.hasError){ // TODO, no validar error mientras se apunta al ambiente QA porque no actualiza el token
                        //errorFunction(response, 200, response.errorDisplay);
                    //} else {
                        self.getAccountAccess(selectedAccount, subscriber, successFunction, errorFunction);
                    //}
                },
                errorFunction
            );
        },

    updateTokenPrepaid: function(account, subscriber) {
            var self = this;
            var subscribers = app.utils.Storage.getSessionItem('subscribers-info');
            var subscriberObj = null;
            if (this.isCurrentAccountPrepaid()){
                var selectedSubscriberValue = app.utils.Storage.getSessionItem('selected-subscriber-value');
                $.each(subscribers, function(index, subscriber) {
                    if (subscriber.subscriberNumberField == selectedSubscriberValue) {
                        subscriberObj = subscriber;
                    }
                });
            }

            if (self.isPrepaidTokenSaved(subscriber)) {
                self.updateTokenPrepaidSuccess();
            } else {
                var customerModel = new app.models.Customer();
                customerModel.updateToken(
                    subscriber,
                    account,
                    function (response) {
                        self.updateTokenPrepaidSuccess();
                    },
                    function (error) {
                        self.updateTokenPrepaidSuccess();
                    }
                );
            }
        },

        updateTokenPrepaidSuccess: function() {

        },

        isPrepaidTokenSaved: function(subscriber) {
            var isLoaded = false;
            var tokenSaved = app.utils.Storage.getSessionItem('subscribers-prepaid-tokens');
            if (tokenSaved == undefined || tokenSaved == null) {
                return isLoaded;
            }
            $.each(tokenSaved, function(index, tokenU) {
                if (tokenU.subscriber == subscriber) {
                    isLoaded = true;
                }
            });
            return isLoaded;
        },

        getAccountAccess: function(selectedAccount, subscriber, successFunction, errorFunction) {
            var self = this;
            var customerModel = new app.models.Customer();
            customerModel.userAccess(
                subscriber,
                selectedAccount.Account,
                function (response) {
                    if(response.hasError){
                        errorFunction(response, 200, response.errorDisplay);
                    } else {

                        var sectionsList = response.Sections;

                        if (sectionsList.length > 0 && sectionsList[0].sectionName.includes('MENU')) {
                            var sectionMyAccount = sectionsList.shift();
                            sectionMyAccount.sectionName = 'MI CUENTA';
                            sectionsList.push(sectionMyAccount);
                        }

                        app.utils.Storage.setSessionItem('accounts-available-sections', sectionsList);
                        successFunction(response);
                    }
                },
                errorFunction
            );
        },

        selectPostpago: function(e) {
            var self = this;

            if (document.getElementById('tab-postpago').classList.contains("on")) {return;}

            if (app.utils.Storage.getLocalItem('logged-guest')) {
                self.permissionDenied();
                return;
            }

            var postpagoLoginAccounts = app.utils.Storage.getSessionItem('accounts-list-postpago');

            if (postpagoLoginAccounts.length > 0) {
                app.utils.Storage.setSessionItem('selected-tab', 0);
                $('#tab-prepago').removeClass('on');
                $('#tab-telephony').removeClass('on');
                $('#tab-postpago').addClass('on');
                self.selectAccount(postpagoLoginAccounts[0]);
            } else {
                var lastPage = app.router.history[app.router.history.length-1];
                app.utils.Storage.setSessionItem('is-from-dashboard', lastPage == 'menu');
                app.utils.Storage.setSessionItem('selected-tab-empty', 0);
                app.router.navigate('no_product_associated', {trigger: true});
            }
        },

        selectPrepago: function(e) {
            var self = this;

            if (document.getElementById('tab-prepago').classList.contains("on")) {return;}

            if (app.utils.Storage.getLocalItem('logged-guest')) {
                self.permissionDenied();
                return;
            }

            var prepagoLoginAccounts = app.utils.Storage.getSessionItem('accounts-list-prepago');

            if (prepagoLoginAccounts.length > 0) {
                app.utils.Storage.setSessionItem('selected-tab', 1);
                $('#tab-postpago').removeClass('on');
                $('#tab-telephony').removeClass('on');
                $('#tab-prepago').addClass('on');
                self.selectAccount(prepagoLoginAccounts[0]);
            } else {
                var lastPage = app.router.history[app.router.history.length-1];
                app.utils.Storage.setSessionItem('is-from-dashboard', lastPage == 'menu');
                app.utils.Storage.setSessionItem('selected-tab-empty', 1);
                app.router.navigate('no_product_associated',{trigger: true});
            }
        },

        selectTelephony: function(e) {
            var self = this;

            if (document.getElementById('tab-telephony').classList.contains("on")) {return;}

            if (app.utils.Storage.getLocalItem('logged-guest')) {
                self.permissionDenied();
                return;
            }

            var fijoLoginAccounts = app.utils.Storage.getSessionItem('accounts-list-telefonia');

            if (fijoLoginAccounts.length > 0) {
                app.utils.Storage.setSessionItem('selected-tab', 2);
                $('#tab-postpago').removeClass('on');
                $('#tab-prepago').removeClass('on');
                $('#tab-telephony').addClass('on');
                self.selectAccount(fijoLoginAccounts[0]);
            } else {
                var lastPage = app.router.history[app.router.history.length-1];
                app.utils.Storage.setSessionItem('is-from-dashboard', lastPage == 'menu');
                app.utils.Storage.setSessionItem('selected-tab-empty', 2);
                app.router.navigate('no_product_associated',{trigger: true});
            }
        },

        selectAccount: function (account, back) {
            var self = this;
            self.getAccountDetails(account,
                function (response) {
                    if (back == true) {
                        app.router.back = true;
                        app.router.backPage();
                    } else {
                        self.render(function(){
                            $.mobile.activePage.trigger('pagecreate');
                        });
                    }
                },
                function (message, status) {
                    if (status == 404) {
                        showAlert('Error', 'Verifique su conexi&#243;n de internet.', 'Aceptar');
                    } else {
                        showAlert('Error', message, 'Aceptar');
                    }
                });
        },

        simpleChangeAccount: function(e){
            var self = this;

            const newAccountNumber = $.mobile.activePage.find('#select-account').val();
            const accountNumber = app.utils.Storage.getSessionItem('selected-account-value');

            const accountList = app.utils.Storage.getSessionItem('accounts-list');

            var selectAccount = null;
            $.each(accountList, function (i, object) {
                if (object.Account == newAccountNumber) {
                    selectAccount = object;
                }
            });

            self.getAccountDetails(selectAccount,
                function (response) {
                    if(analytics != null ){
                        analytics.trackEvent('select', 'change', 'select account number on ' + app.router.history[app.router.history.length-1], accountNumber);
                    }
                    self.render(function(){
                        $.mobile.activePage.trigger('pagecreate');
                    });

                },
                app.utils.network.errorRequest
            );
        },

        permissionDenied: function () {
            var self = this;
            this.dialogAccessLimited();
        },

        isCurrentAccountPrepaid: function() {
            var prepaid = false;
            var accountInfo = app.utils.Storage.getSessionItem('account-info');
            if ((accountInfo.accountTypeField == 'I' && accountInfo.accountSubtypeField == 'P') ||
                (accountInfo.accountTypeField == 'I3' && accountInfo.accountSubtypeField == 'P') ){
                prepaid = true;
            }
            return prepaid;
        },

        getCurrentAccountPrepaidBalance: function() {
            var balance = 0;
            var subscribers = app.utils.Storage.getSessionItem('subscribers-info');
            if (this.isCurrentAccountPrepaid()){
                var selectedSubscriberValue = app.utils.Storage.getSessionItem('selected-subscriber-value');
                var subscriberObj = null;
                $.each(subscribers, function(index, subscriber) {
                    if (subscriber.subscriberNumberField == selectedSubscriberValue) {
                        subscriberObj = subscriber;
                    }
                });
                if (subscriberObj != null) {
                    balance = subscriberObj.prepaidBalanceField;
                }
            }
            return app.utils.tools.formatAmount(balance);
        },

        getCurrentPrepaidSubscriber: function() {
            var subscribers = app.utils.Storage.getSessionItem('subscribers-info');
            var subscriberObj = null;
            if (this.isCurrentAccountPrepaid()){
                var selectedSubscriberValue = app.utils.Storage.getSessionItem('selected-subscriber-value');
                $.each(subscribers, function(index, subscriber) {
                    if (subscriber.subscriberNumberField == selectedSubscriberValue) {
                        subscriberObj = subscriber;
                    }
                });
            }
            return subscriberObj;
        },
        
        getCurrentAccountPrepaidPlanInfo: function() {
            var planInfo = {};
            var subscribers = app.utils.Storage.getSessionItem('subscribers-info');
            if (this.isCurrentAccountPrepaid()){
                var selectedSubscriberValue = app.utils.Storage.getSessionItem('selected-subscriber-value');
                var subscriberObj = null;
                $.each(subscribers, function(index, subscriber) {
                    if (subscriber.subscriberNumberField == selectedSubscriberValue) {
                        subscriberObj = subscriber;
                    }
                });
                if (subscriberObj != null) {
                    planInfo = subscriberObj.planInfoField;
                }
            }
            return planInfo;
        },
                                                
        myOrder: function(e) {
            var self = this,
                loadAccounts = app.utils.Storage.getSessionItem('load-accounts'),
                analytics = null;

            // close side menu
            if(app.isMenuOpen == true){
                this.closeMenu();
            }

            // send google statistics
            if(analytics !=null ){
                analytics.trackEvent('button', 'click', 'myOrder');
            }

            if(!loadAccounts){
                app.session.menuFunction = this.myOrder;
                app.utils.loader.show();
                return false;
            }

            var accountModel = new app.models.Account();
                app.session.Usage = {},
                accountNumber = app.utils.Storage.getSessionItem('selected-account-value');

            accountModel.accountPackagesInfo(
                //parameter
                app.utils.Storage.getSessionItem('token'),
                accountNumber,

                //success callback
                function(data){
                    console.log('#success ws service');

                    if(!data.HasError){

                       
                        app.utils.Storage.setSessionItem('accountPackagesInfo', data);

                      app.router.navigate('my_order', {
                          trigger: true
                      });

                    }else{
                        app.utils.loader.hide();
                        showAlert('Error', data.Desc, 'Aceptar');

                    }                    
                },

                // error function
                app.utils.network.errorFunction
            );

        },

        myStore: function(e) {
            console.log('my Store Common');

            var self = this,
                loadAccounts = app.utils.Storage.getSessionItem('load-accounts'),
                analytics = null;

            // close side menu
            if(app.isMenuOpen == true){
                this.closeMenu();
            }

            // send google statistics
            if(analytics !=null ){
                analytics.trackEvent('button', 'click', 'myStore');
            }

            if(!loadAccounts){
                app.session.menuFunction = this.myStore;
                app.utils.loader.show();
                return false;
            }

            console.log('my Store Common navigate');

            var ref2 = cordova.InAppBrowser.open('https://miclaro.clarotodo.com/', '_system', null);

        },
    });

});
