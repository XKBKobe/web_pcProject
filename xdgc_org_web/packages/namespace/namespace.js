/**namespace
 * @author wangxq
 * 22 Aug 2015
 */

function namespace(scope, definition) {
  var root = typeof GLOBAL !== 'undefined' ? GLOBAL : window;

  // transform names
  if (typeof scope === 'string') {
    root = _(scope.split('.')).reduce(function(r, name) {
      return r[name] = r[name] || {};
    }, root);
  } else {
    root = scope;
  }

  if (typeof definition === 'function') {
    definition.apply(root);
  } else if (typeof definition === 'object') {
    _.extend(root, definition);
  }
}

namespace.server = function() {
  if (Meteor.isServer) Namespace.apply(this, arguments);
};

namespace.client = function() {
  if (Meteor.isClient) Namespace.apply(this, arguments);
}

Namespace = namespace;


