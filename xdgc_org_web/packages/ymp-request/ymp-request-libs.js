/**
 * 
 * server side jquery usage together with jsdom, attention, jsdom requires g++,make and python environment 
 * 
 */

var Future = Npm.require("fibers/future");
var jsdom  = Npm.require("jsdom") ;
request    = Npm.require("request");

jQuery = function(html) {
	var future   = new Future();
	jsdom.env({ html : html, done : function(err,window){
		future["return"](Npm.require('jquery')(window));
	}});
	return future.wait();
}

/**
 * server side iconv
 * 
 */
iconv = Npm.require('iconv-lite');	

/**
 * Q library
 */
Q = Npm.require('q');

var Future        = Npm.require("fibers/future");

/**
 * call given function in delayed timerLater(ms), but make the code wrapped in Fiber so the code style still in sequence
 */
executeLater = function(timerLater , cbFunc ) {
	var self = this ;
	var args = Array.prototype.slice.call(arguments,2);
	var future = new Future();
	setTimeout(function(){
		future["return"]( cbFunc.apply(this,args) );    
	},timerLater);
	return future.wait(); 
}

/**
 * take result through resultTakeFunc until got the result or timeout
 */
waitFor = function(timeout , freq , resultTakeFunc ) { 
	var self  = this ;
	var args  = Array.prototype.slice.call(arguments,1);
	var resGot= null;
	var time  = new Date();
	do {
		resGot     = resultTakeFunc() ;
		var future = new Future();
		setTimeout(function(){
			future["return"]();    
		},freq);
		future.wait(); 
	} while ( !resGot && (new Date() - time ) < timeout );
	
	return resGot ;
}
