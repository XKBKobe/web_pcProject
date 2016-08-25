Package.describe({
  name: 'qcloud',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  "qcloud_cos": "1.0.1"
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.addFiles('qcloud.js');
  api.export(['qcloudCos'], ['server']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('qcloud');
  api.addFiles('qcloud-tests.js');
});
