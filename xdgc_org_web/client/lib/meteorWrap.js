/**
 * @author: wangxq
 * @date: Aug 21, 2015
 */

var NAME = 'meteorWrap';

['Meteor', '_', 'loading'].forEach(function(ind, dep) {
  if (typeof _ === 'undefined') {
    throw new Meteor.Error(NAME, dep + ' is required by ' + NAME + '.');
  }
});

Meteor.call = _.wrap(Meteor.call, function(meteor_call) {
  // BEFORE
  // wrapper for loading module
  var args = [].slice.call(arguments, 1, -1), cb = arguments[arguments.length - 1];

  if(typeof cb === 'function'){
    if (loading.initialized) loading.pleaseWait();
  }

  [].push.call(args, function(cb){ // process last argument
    return typeof cb !== 'function' ? cb : _.wrap(cb, function(cbo) {
      var res = null;
      try {
        res = cbo.apply(cbo, [].slice.call(arguments, 1));
      } catch (e) { throw e; } finally {
        // make sure loading complete even if there are exceptions.
        if (loading.initialized) loading.done();
      }
      return res;
    });
  }(cb));

  // DOING
  return meteor_call.apply(Meteor, args);
});
