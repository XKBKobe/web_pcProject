// Write your tests here!
// Here is an example.
Tinytest.add('Namespace with function', function(test) {
  Namespace('foo', function() {
    this.bar = 'bar info';
  });
  test.equal(foo.bar, 'bar info', 'foo.bar should as a global namespace.');
});

Tinytest.add('Namespace with object', function(test) {
  Namespace('foo', {
    bar1: 'bar1 info',
    bar2: 'bar2 info'
  });
  test.equal(foo.bar1, 'bar1 info', 'foo.bar should as a global namespace.');
});

Tinytest.add('Namespace accesses foo added above', function(test) {
  test.equal(foo.bar, 'bar info');
  test.equal(foo.bar1, 'bar1 info');
  test.equal(foo.bar2, 'bar2 info');
});

Tinytest.add('Namespace client only', function(test) {
  Namespace.client('clientonly', { sure: true });
  if (Meteor.isClient) {
    test.equal(clientonly.sure, true);
  } else {
    test.isUndefined(GLOBAL.clientonly);
  }
});

Tinytest.add('Namespace server only', function(test) {
  Namespace.server('serveronly', { sure: true });
  if (Meteor.isServer) {
    test.equal(serveronly.sure, true);
  } else {
    test.isUndefined(window.serveronly);
  }
});
