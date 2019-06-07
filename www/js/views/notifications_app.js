$(function() {

    // Register step 1 View
    // ---------------

    app.views.NotificationsAppView = app.views.CommonView.extend({

        name: 'notifications_app',

        // The DOM events specific.
        events: {
            // events
            'pagecreate':                           'pageCreate',
        },

        // Render the template elements
        render: function(callback) {

            if (app.utils.Storage.getSessionItem('token') == null) {
                document.location.href = 'index.html';
                return;
            }

            var notifications = app.utils.Storage.getSessionItem('notifications');

            var self = this,
                variables = {
                    notifications: notifications.MessagesList,
                    name: app.utils.Storage.getSessionItem('name'),
                    convertCaseStr: app.utils.tools.convertCase,
                    accounts: this.getSelectTabAccounts(),
                    selectedTab: app.utils.Storage.getSessionItem('selected-tab'),
                    selectedAccount: app.utils.Storage.getSessionItem('selected-account'),
                    accountSections: this.getUserAccess(),
                    showBackBth: true
                };

            app.TemplateManager.get(self.name, function(code) {
                var template = cTemplate(code.html());
                $(self.el).html(template(variables));
                callback();
                return this;
            });
            $(document).scrollTop();
        },

        pageCreate: function(e) {
            var self = this;
            self.activateMenu(e);
            self.updateNotifications();
        },

        updateNotifications: function () {
            var self = this;
            var notifications = app.utils.Storage.getSessionItem('notifications');
            if (notifications.MessagesList != null) {
                notifications.MessagesList.forEach(function(notification) {
                    if (notification) {
                        if (notification.status == 0) {
                            self.options.userModel.updateNotification(notification.id_message, notification.account,
                                function (response) {
                                    if (!response.hasError) {
                                        var notificationsNew = app.utils.Storage.getSessionItem('notifications');
                                        notificationsNew.newMessageCounter = notificationsNew.newMessageCounter - 1;
                                        notificationsNew.MessagesList.forEach(function(notificationNew) {
                                            if (notificationNew.id_message == notification.id_message) {
                                                notificationNew.status = 1;
                                            }
                                        });
                                        app.utils.Storage.setSessionItem('notifications', notificationsNew);
                                    }
                                },
                                function (error) {
                                    // nothing to do
                                });
                            }
                    }
                });
            }
        }
    });

});
