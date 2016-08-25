Package.describe({
  summary: "flash-notifications"
});

Package.on_use(function (api, where) {
  api.use([ "meteor", "underscore", "mongo","blaze", "templating", "mrt:moment", "iron:router", "tracker",  "check",  "htmljs"],['client']); 
  api.add_files(['flash_notifications.html','flash-notifications.js'], ['client']); 
  api.export(['FlashNotifications','FlashNotificationCollection'], ['client']); 
});

