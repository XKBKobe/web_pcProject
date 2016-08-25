Router.configure({
  controller: 'AppController',
  notFoundTemplate: 'notFound'
});

Router.plugin('loading', {loadingTemplate: 'loading'});
Router.plugin('dataNotFound', {dataNotFoundTemplate: 'notFound'});
