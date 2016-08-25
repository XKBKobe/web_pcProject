Package.describe({
  name: 'endless-ui',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Endless UI templates as meteor package.',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

var assets = [
  "css/font-awesome.min.css",
  "css/pace.css",
  "css/colorbox/colorbox.css",
  "css/morris.css",
  'css/bootstrap-timepicker.css',
  'css/jquery.dataTables_themeroller.css',
  "css/endless.css",
  "css/endless-skin.css",

  'js/bootstrap-timepicker.min.js',
  'js/jquery.dataTables.min.js',
  'js/jquery.flot.min.js',
  'js/rapheal.min.js',
  'js/morris.min.js',
  'js/jquery.colorbox.min.js',
  'js/jquery.sparkline.min.js',
  'js/uncompressed/pace.js',
  'js/modernizr.min.js',
  'js/pace.min.js',
  'js/jquery.popupoverlay.min.js',
  'js/jquery.slimscroll.min.js',
  'js/jquery.cookie.min.js'
];


var path = Npm.require('path');
var fs = Npm.require('fs');

function colorboxAssets() {
  return [
    'images/border.png',
    'images/controls.png',
    'images/loading.gif',
    'images/loading_background.png',
    'images/overlay.png'
  ];
}

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use('jquery@1.0.1', 'client');
  api.use('twbs:bootstrap@3.3.5','client');

  assets.concat(colorboxAssets());

  api.addFiles(assets, 'client');
  api.addFiles(path.join('endless-css-override.css'), 'client');
  api.addFiles('endless-ui.js', 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('endless-ui');
  api.addFiles('endless-ui-tests.js');
});
