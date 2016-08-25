Package.describe({
  version: '0.0.1', 
  summary: 'form upload',
  git: ''
});

Npm.depends({
  "formidable" : "1.0.17",
  "tencentyun" : "2.0.3"
});

Package.onUse(function(api) {
  api.use(['underscore','json'],['client']); 
  api.addFiles(['ymp-formidable.js'] , ['server']);
  api.export(['IncomingForm'], ['server']);
  api.export(['tencentyunFun'], ['server']);
});
