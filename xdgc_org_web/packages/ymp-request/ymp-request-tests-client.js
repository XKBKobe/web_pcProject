Tinytest.addAsync('httpFetch', function (test,onComplete) { 
	var cookies         = {} ;
	var cookieHeaders   = {} ;
	var requestInstance = new http_request() ; 
	var cookiesCached   = {} ;

    // https://github.com/bellbind/using-promise-q/	
	var httpGet = function (uri,headers,attrs,cookies) {
        var deferred = Q.defer();
        requestInstance.get(uri,headers,attrs,cookies, function(errFound,statusCode,headers,body){
        	return deferred.resolve( {errFound:errFound,statusCode:statusCode,headers:headers,body:body} );
        });
        return deferred.promise;
    }; 
    
    Q.fcall(function(){
    	return httpGet('http://login.m.taobao.com/login.htm' , {} , {} , cookies);
    }).then(function(resp){ 
    	test.equal(resp.statusCode,200);
    	CookieManager.takeHeaderCookies(cookieHeaders,resp.headers,"http://login.m.taobao.com/login.htm");
    }).then(function(){
    	return httpGet('http://www.baidu.com' , {} , {} , cookies);
    }).then(function(resp){ 
    	test.equal(resp.statusCode,200);
    	CookieManager.takeHeaderCookies(cookieHeaders,resp.headers,"http://www.baidu.com");
    }).then(function(){
    	return httpGet('https://c9.io/' , {} , {} , cookies);
    }).then(function(resp){ 
    	test.equal(resp.statusCode,200);
    	CookieManager.takeHeaderCookies(cookieHeaders,resp.headers,"https://c9.io/");
    }).then(function(){ 
		var json = JSON.stringify(cookies);	
		test.isTrue( json.indexOf("baidu.com")  > 0 , "baidu cookies should be captured" );
		test.isTrue( json.indexOf("taobao.com") > 0 , "taobao.com cookies should be captured" );
		test.isTrue( json.indexOf("c9.io") > 0 , "c9.io cookies should be captured" );  
		
		json = JSON.stringify(cookieHeaders);	
		test.isTrue( json.indexOf("baidu.com")  > 0 , "baidu cookies should be captured" );
		test.isTrue( json.indexOf("taobao.com") > 0 , "taobao.com cookies should be captured" );
		test.isTrue( json.indexOf("c9.io") > 0 , "c9.io cookies should be captured" );      	
    }).then(function(){
    	onComplete();
    });
});
