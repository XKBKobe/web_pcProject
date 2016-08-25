var Future      = Npm.require("fibers/future");

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
function serverExecute( method ){
	return function(uri , headers , formAttrs , cookieTree , cbFunc  ) {
		var jaredCookie = CookieManager.prepareJaredCookie(cookieTree); 
		var qs          = {}    ; 
		var cbInvoked   = false ;
		
        try {
        	if (method === 'get') {
        		qs = formAttrs ;
            	formAttrs = {} ;
        	}     
        	var timeout     = headers.timeout || HTTP_REQUEST_TIMEOUT ;
        	var upEnabled   = method === 'upload' ;
        	var respFound   = {} ;
    		var future      = headers['async'] ? null : new Future();
        	
    		delete headers['timeout'] ;
    		delete headers['responseType'] ;
    		delete headers['async'] ;
    		
    		var bodyKind = 'form';
    		_.each(headers,function(v,k){
    			if (k.toLowerCase() === 'content-type') {
    				if (v.indexOf('json') > 0) {
    					bodyKind = 'json' ;
    				}
    			}
    		});
    		
    		function returnHandler(respFound) { 
    			if (respFound.errFound) {
	       			if ( respFound.errFound.code === 'ENOTFOUND' || respFound.errFound.code === 'ENETUNREACH') {
	       				respFound.errFound = '访问服务器:[' + uri + ']出错' ;
	       			} else {
	       				respFound.errFound = respFound.errFound.message || respFound.errFound;
	       			}
	       		} else try {
		        	CookieManager.treeJaredCookie(cookieTree,jaredCookie._jar.store.idx);
					var encoding = "UTF-8" ;
					if ((respFound.response||{}).headers) {
						var contentType = respFound.response.headers["content-type"] || '' ;
						if (respFound.body ) {
							if (!contentType || (contentType.indexOf('image') != 0 && !respFound.response.headers["content-disposition"]) ){ 
								encoding = (contentType.match(/.*charset[=](.*)/i )||[])[1] || "UTF-8" ; 
								if (bodyKind !== 'json' || ( bodyKind == 'json' && (respFound.body instanceof Buffer) ) ){
							    	respFound.body = iconv.decode(respFound.body,encoding);
							    }
							}
						}
					}
	       		} catch( err ) {
	       			respFound.errFound = err ;
	       		}
	       		
    			if (future){
    				future["return"](respFound);    
    			} else { 
    				if (!cbInvoked) {
    					cbInvoked = true ;
                	    cbFunc(respFound.errFound,(respFound.response||{}).statusCode, (respFound.response||{}).headers , respFound.body);
    				}
    			}
    		}
    		
        	if (upEnabled) {
        		var upForm = request.post(uri, {encoding:null,followAllRedirects: true , followRedirect : true , headers: headers , timeout : timeout },
        			function( errFound , response , body ){
        				returnHandler({  errFound : errFound , response : response , body : body });    
        			}).form();
        		_.each(formAttrs,function(v,k){
        			if (v && v.buffer && (v.buffer instanceof Buffer) ) {
        				upForm.append(k, v.buffer, { filename: v['filename'] || 'image.jpg', contentType: v['content-type'] || 'image/jpg', knownLength: v.buffer.length });
        			} else {
        				upForm.append(k,v);
        			}
        		}); 
        	} else {
        		var opts      = { encoding:null , followAllRedirects: true , followRedirect : true , timeout : timeout , headers: _.extend( {}, HEADERS_DEFAULT , headers )  , qs:qs , jar : jaredCookie } ;
        		opts[bodyKind]= formAttrs ;
        		request[method](uri,opts ,function( errFound , response , body ){
        			returnHandler({  errFound : errFound , response : response , body : body });    
    			});
        	} 
        	
       		if (future){
       			respFound = future.wait(); 
       			if (!cbInvoked) {
       				cbInvoked = true ;
            	    cbFunc(respFound.errFound,(respFound.response||{}).statusCode, (respFound.response||{}).headers , respFound.body);
       			}
       		}
        } catch( errFound ) {  
        	if (cbInvoked) {
        		throw errFound  ;
   	        } else {
   	     	    cbFunc(errFound);
        	}
        }
	}
}

http_request = function() {
	for ( var idx = 0; idx < METHODS_SUPPORTED.length; idx++) {
		this[METHODS_SUPPORTED[idx]] = serverExecute(METHODS_SUPPORTED[idx]);
	}
}

Meteor.methods({
	'http_request' : function( uri , headers , formAttrs , cookieTree , method ) { 
	    // this.unblock can unblock the ddp message process comes from same client
	    // but if conurrency too big e.g.:2000 would crash the server socket
	    // this.unblock() ;
	    var resp     = {}   ;
	    var whiteURI = false;
	    for (var idx=0; idx < Meteor.settings.request_whitelist.length; idx++) {
	    	if ( uri.indexOf(Meteor.settings.request_whitelist[idx]) == 0) {
	    		whiteURI = true ;
	    		break ;
	    	}
	    }
	    
	    if (this.userId || Meteor.settings.public.debug || whiteURI ) {
		    var instance = new http_request();
		    instance[method](uri , headers , formAttrs , cookieTree , function(errFound,statusCode,headers,body){
		    	resp  = {errFound:errFound,statusCode:statusCode,headers:headers,cookieTree:cookieTree,body:body} ;
			});
	    } else {
	    	resp  = {errFound:'user_not_login'} ;
	    } 
	    return resp ;
    }
});
