
/**
 * <pre>
 * usage: new http_request().get(uri , headers , attrsOfForm , cookies , function(errFound,statusCode,headers,body){});
 * 
 *        new http_request().post(uri , headers , attrsOfForm , cookies , function(errFound,statusCode,headers,body){});
 *        
 *        new http_request().upload(uri , headers , attrsOfForm , cookies , function(errFound,statusCode,headers,body){});
 * 
 * access timeout:
 *        new http_request().post(
 *              uri  
 *            , { timeout : 100*1000 } // 100 seconds 
 *            , attrsOfForm
 *            , cookies , function(errFound,statusCode,headers,body){});  
 *            
 * download attachment from remote server:
 *         new http_request().get(
 *              uri  
 *            , { responseType : "arraybuffer" } 
 *            , attrsOfForm
 *            , cookies , function(errFound,statusCode,headers,body){});        
 *        
 * upload attachment to remote server:
 *        new http_request().upload(
 *              uri  
 *            , headers 
 *            , { IMG : { buffer: attachmentBuffer , filename: "photo.jpg" , "content-type" : "image/jpg" } } 
 *            , cookies , function(errFound,statusCode,headers,body){});        
 * </pre>       
 * @param uri : the requested address
 * @param headers.responseType : <arraybuffer> expected remote return arraybuffer stream, on browser side implementation need this info to do pre-process on server side this field is ignored
 * @param headers.timeout: millsecs expected timeout for this operation
 * @param headers.async  : whether call it in async mode
 * @param attrsOfForm: content of form submit to remote
 * 
 * @param attrsOfForm.attachmentFormFieldName: the attachment would send to remote server when using http_request.upload
 * @param attrsOfForm.attachmentFormFieldName.buffer: buffer of the attachment would send to remote server when using http_request.upload
 * @param attrsOfForm.attachmentFormFieldName.content-type: content-type of the attachment would send to remote server when using http_request.upload
 * @param attrsOfForm.attachmentFormFieldName.filenam: filename of the attachment would send to remote server when using http_request.upload

 * @param cookies: the cookies will be used for this operation 
 * 
 */	

var http_request_pluginEnabled = null   ;
var http_request_plugin_map    = {}     ;
var http_request_plugin_id     = 0      ;
var http_request_timerEnabled  = false  ;
var http_request_concurrent    = 50     ;

function http_request_timer() {	
	var inprogress = 0 ;
	_.each(http_request_plugin_map,function(cfg,funcId){
		if (cfg.started) {
			if ( (new Date() - cfg.started) >= (cfg.timeout || HTTP_REQUEST_TIMEOUT) ) {
				delete http_request_plugin_map[funcId] ;
				if (cfg.cbFunc) {
					setTimeout( cfg.cbFunc.bind({} , 'TIMEOUT') , 0);
				}
			} else {
				inprogress ++ ;
			}
		}
	});
	_.each(http_request_plugin_map,function(cfg,funcId){
		if (!cfg.started && inprogress < http_request_concurrent ) {
			inprogress ++ ;
			cfg.started = new Date() ;
			window.postMessage( {
				  to : "chrome_plugin_contentPage"
				, message: "http_request" 
				, args   : cfg.args 
				, funcId : funcId 
				, method : cfg.method 				
			} , "*" );
		}
	});
	
	setTimeout(http_request_timer,100);
}

if (http_request_pluginEnabled === null && window.addEventListener && window.postMessage) {
	http_request_pluginEnabled = false ;
	var windowThis = window ;
	var theFunc    = function(event) {
		if (event.data && event.data.to === 'chrome_plugin_visitedPage'){
			http_request_pluginEnabled = true ;
			if (event.data.funcId) {
				try { 
					var cbFunc = (http_request_plugin_map[event.data.funcId]||{}).cbFunc ;
					if (cbFunc) cbFunc.apply(this,event.data.resGot||[event.data.errFound]); 
				} finally {
					delete http_request_plugin_map[event.data.funcId] ;
				}
			}
			if (!http_request_timerEnabled) {
				http_request_timerEnabled = true ;
				http_request_timer() ;
			}
		}
	} ;					
	windowThis.addEventListener("message", theFunc );
	windowThis.postMessage({ message : "sayHello" , to : "chrome_plugin_contentPage"}, "*"); 
} 	 

http_request = function(){
	for (var idx=0; idx < METHODS_SUPPORTED.length; idx ++) {
		this[METHODS_SUPPORTED[idx]] = (function(method){
			return function(uri , headers , formAttrs , cookieTree , cbFunc  ) {
				
				if (method === 'upload') {
					throw "UNSUPPORTED" ;
				}
				
				if (http_request_pluginEnabled) {
					var funcId = ++http_request_plugin_id ;
					
					http_request_plugin_map[funcId] = { 
						  args : [ uri , headers , formAttrs , cookieTree ]  
						, method : method 
						, cbFunc : cbFunc
						, timeout: headers.timeout || HTTP_REQUEST_TIMEOUT
					} ;
					
				} else {
					Meteor.call('http_request', uri , headers , formAttrs , cookieTree , method , function(errFound,resp){
						if (errFound) {
							cbFunc(errFound);
						} else {
							if (resp.cookieTree) {
								for (var domain in resp.cookieTree) {
									cookieTree[domain] = cookieTree[domain] || {} ;
									for (var path in resp.cookieTree[domain]) {
										cookieTree[domain][path] = cookieTree[domain][path] || {} ;
										for (var name in resp.cookieTree[domain][path]) {
											cookieTree[domain][path][name] = resp.cookieTree[domain][path][name];
										}
									}
								}
							}
							cbFunc(resp.errFound,resp.statusCode,resp.headers,resp.body);
						}
					});
				}
			};
		})(METHODS_SUPPORTED[idx]); 
	}
} 
