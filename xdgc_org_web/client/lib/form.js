/**
 * Created by Administrator on 2015/8/19.
 */
getFormFieldsJSON = function ($form) {
    return _($form.serializeArray()).reduce(function(r,it) {
        r[it.name] = it.value; return r;
    }, {});
};


function _cityselector(action) {
  // Trigger cityselector for router when reloading..
  Meteor.defer(function() {
    $('[data-toggle="cityselector"]').cityselector('init');
  });
}
cityselector = _cityselector;
