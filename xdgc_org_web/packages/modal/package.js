Package.describe({
  name: 'modal',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.use(['minimongo', 'mongo-livedata', 'templating'], 'client');
  api.use('twbs:bootstrap', 'client');
  api.use('reactive-var', 'client');
  api.addFiles(['client/modal.html', 'client/modal.js'], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('modal');
  api.addFiles('modal-tests.js');
});
