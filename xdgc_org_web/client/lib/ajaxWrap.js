/**
 * @author: wangxq
 * @date: Aug 21, 2015
 */

(function($) {
  var _ajax = $.ajax;
  $.ajax = function() {
    if (loading && loading.initialized) loading.pleaseWait();
    var req = _ajax.apply($, arguments);
    req.always(function() {
      if (loading && loading.initialized) loading.done();
    });
    return req;
  };
})(jQuery);
