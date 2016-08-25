METHODS_SUPPORTED = ['post','get' , 'upload'] ; 

HEADERS_DEFAULT   =  {
	  "Connection": "keep-alive"
	, "Accept"    : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
	, "User-Agent" : "Mozilla/5.0 (Windows NT 5.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36"
	, "Accept-Language" : "zh-CN, en-US"
	, "Accept-Charset"  : "utf-8, iso-8859-1, utf-16, *;q=0.7"
	, "x-Getzip"        : "supported"
	, "Cache-Control"   : "no-cache"
};

HTTP_REQUEST_TIMEOUT = 60*1000 ; // TIMEOUT IN ONE MINUTES

stringifyArrayBuffer = function (arraybuffer){
    var data  = new Uint8Array(arraybuffer);
    var arr   = new Array();
    for(var i = 0; i != data.length; ++i) {
    	arr[i]= String.fromCharCode(data[i]);
    }
    return arr.join("");
}
