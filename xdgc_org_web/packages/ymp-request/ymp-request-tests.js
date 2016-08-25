Tinytest.add('verify jQuery', function (test) {
  test.isNotNull(jQuery);
  test.equal(jQuery("<div><div id='test'></div></div>").find("#test").length,1);
});

Tinytest.add('CookieManager - parseCookie', function (test) { 
});

Tinytest.add('CookieManager - stringifyCookie', function (test) { 
});

Tinytest.add('CookieManager - takeHeaderCookies', function (test) { 
});

