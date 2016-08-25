Package.describe({
  version: '0.0.1', 
  summary: 'perform http request on both cordova environment or pure server environment', 
  git: '', 
  documentation: 'README.md'
});

Npm.depends({
  "iconv-lite": "0.2.11" , "jquery" : "2.1.3"  , "jsdom" : "3.1.1" , "q" : "1.1.2" , "request" : "2.40.0"
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');
  api.use(['underscore'],['server','client']); 
  api.addFiles(['ymp-request-libs.js'] , ['server']);
  api.addFiles(['ymp-request-common.js','ymp-request-cookie.js'] , ['client','server']);
  api.addFiles(['.npm/package/node_modules/q/q.js','ymp-request-client.js'] , ['client']);
  api.addFiles(['ymp-request-server.js'] , ['server']);
  api.export(['iconv','jQuery','Q','executeLater','waitFor'], ['server']);
  api.export(['CookieManager','http_request','stringifyArrayBuffer'], ['server','client']); 
});

Package.onTest(function(api) {
  api.use('tinytest');	
  api.use(['underscore'],['server','client']); 
  api.addFiles(['ymp-request-libs.js'] , ['server']);
  api.addFiles(['ymp-request-common.js','ymp-request-cookie.js'] , ['client','server']);
  api.addFiles(['.npm/package/node_modules/q/q.js','ymp-request-client.js'] , ['client']);
  api.addFiles(['ymp-request-server.js'] , ['server']);
  api.addFiles('ymp-request-tests.js');
  api.addFiles('ymp-request-tests-client.js','client');
  api.addFiles('ymp-request-tests-server.js','server');
});
