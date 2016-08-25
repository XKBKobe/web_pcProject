Package.describe({
  summary: "Random code/tools we use across our Meteor projects (at Percolate Studio)."
});

Package.on_use(function (api) {
  api.use(['underscore','mongo'], ['client', 'server']); 
  api.use(['ui', 'templating', 'mrt:moment', 'iron:router', 'oauth'], 'client'); 
  
  api.add_files([ 'underscore-extensions.js' ], ['client', 'server']); 
  api.add_files([ 'acts-as-form.js' ], 'client');
  api.export(['ActsAsForm'], 'client');
});