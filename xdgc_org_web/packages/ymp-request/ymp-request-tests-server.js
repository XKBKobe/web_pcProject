Tinytest.add('verify server side iconv', function (test) {
  test.isNotNull(iconv); 
  test.equal(iconv.decode("HELLO","UTF-8"),"HELLO");
});

Tinytest.add('httpFetch', function (test,onComplete) { 
	var cookies         = {} ;
	var cookieHeaders   = {} ;
	var requestInstance = new http_request() ; 
	var cookiesCached   = {} ;

	requestInstance.get( 'http://login.m.taobao.com/login.htm' , {} , {} , cookies , function(errFound,statusCode,headers,body){
		test.equal(statusCode,200);
		CookieManager.takeHeaderCookies(cookieHeaders,headers,"http://login.m.taobao.com/login.htm");
	}) ;
	
	requestInstance.get( 'http://www.baidu.com' , {} , {} , cookies , function(errFound,statusCode,headers,body){
		test.equal(statusCode,200);
		CookieManager.takeHeaderCookies(cookieHeaders,headers,"http://www.baidu.com");
		
	}) ; 
		
	requestInstance.get( 'https://c9.io/' , {} , {} , cookies , function(errFound,statusCode,headers,body){
		test.equal(statusCode,200);
		CookieManager.takeHeaderCookies(cookieHeaders,headers,"https://c9.io/");
	}) ;
		
	var json = JSON.stringify(cookies);	
	test.isTrue( json.indexOf("baidu.com")  > 0 , "baidu cookies should be captured" );
	test.isTrue( json.indexOf("taobao.com") > 0 , "taobao.com cookies should be captured" );
	test.isTrue( json.indexOf("c9.io") > 0 , "c9.io cookies should be captured" );  
	
	json = JSON.stringify(cookieHeaders);	
	test.isTrue( json.indexOf("baidu.com")  > 0 , "baidu cookies should be captured" );
	test.isTrue( json.indexOf("taobao.com") > 0 , "taobao.com cookies should be captured" );
	test.isTrue( json.indexOf("c9.io") > 0 , "c9.io cookies should be captured" );   
});

