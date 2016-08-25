Package.describe({
  name: 'wxqee:editor',
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
  api.addFiles(['editor.js',
    //"wysibb/preset/phpbb3.js",
    "wysibb/lang/cn.js",
    "wysibb/jquery.wysibb.min.js",
    "wysibb/theme/default/wbbtheme.css"
  ], 'client');
  api.addAssets([
    "wysibb/theme/fonts/wysibbiconfont-wb.ttf",
    "wysibb/theme/fonts/wysibbiconfont-wb.woff",
    "wysibb/theme/fonts/wysibbiconfont-wb.eot"
  ], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('wxqee:editor');
  api.addFiles('editor-tests.js');
});
