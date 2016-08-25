CookieManager  = {} ;

var DATE_DELIM = /[\x09\x20-\x2F\x3B-\x40\x5B-\x60\x7B-\x7E]/;


// From RFC2616 S2.2:
var TOKEN = /[\x21\x23-\x26\x2A\x2B\x2D\x2E\x30-\x39\x41-\x5A\x5E-\x7A\x7C\x7E]/;

// From RFC6265 S4.1.1
// note that it excludes \x3B ";"
var COOKIE_OCTET  = /[\x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E]/;
var COOKIE_OCTETS = new RegExp('^'+COOKIE_OCTET.source+'$');

// The name/key cannot be empty but the value can (S5.2):
var COOKIE_PAIR_STRICT = new RegExp('^('+TOKEN.source+'+)=("?)('+COOKIE_OCTET.source+'*)\\2$');
var COOKIE_PAIR = /^([^=\s]+)\s*=\s*("?)\s*(.*)\s*\2\s*$/;

// RFC6265 S4.1.1 defines extension-av as 'any CHAR except CTLs or ";"'
// Note ';' is \x3B
var NON_CTL_SEMICOLON = /[\x20-\x3A\x3C-\x7E]+/;
var EXTENSION_AV = NON_CTL_SEMICOLON;
var PATH_VALUE = NON_CTL_SEMICOLON;

// Used for checking whether or not there is a trailing semi-colon
var TRAILING_SEMICOLON = /;+$/;

/* RFC6265 S5.1.1.5:
 * [fail if] the day-of-month-value is less than 1 or greater than 31
 */
var DAY_OF_MONTH = /^(0?[1-9]|[12][0-9]|3[01])$/;

/* RFC6265 S5.1.1.5:
 * [fail if]
 * *  the hour-value is greater than 23,
 * *  the minute-value is greater than 59, or
 * *  the second-value is greater than 59.
 */
var TIME = /(0?[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])/;
var STRICT_TIME = /^(0?[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;

var MONTH = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/i;
var MONTH_TO_NUM = {
  jan:0, feb:1, mar:2, apr:3, may:4, jun:5,
  jul:6, aug:7, sep:8, oct:9, nov:10, dec:11
};
var NUM_TO_MONTH = [
  'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'
];
var NUM_TO_DAY = [
  'Sun','Mon','Tue','Wed','Thu','Fri','Sat'
];

var YEAR = /^([1-9][0-9]{1,3})$/; // 2 to 4 digits

var MAX_TIME = 2147483647000; // 31-bit max
var MIN_TIME = 0; // 31-bit min


// RFC6265 S5.1.1 date parser:
function parseDate(str,strict) {
  if (!str) {
    return;
  }
  var found_time, found_dom, found_month, found_year;

  /* RFC6265 S5.1.1:
   * 2. Process each date-token sequentially in the order the date-tokens
   * appear in the cookie-date
   */
  var tokens = str.split(DATE_DELIM);
  if (!tokens) {
    return;
  }

  var date = new Date();
  date.setMilliseconds(0);

  for (var i=0; i<tokens.length; i++) {
    var token = tokens[i].trim();
    if (!token.length) {
      continue;
    }

    var result;

    /* 2.1. If the found-time flag is not set and the token matches the time
     * production, set the found-time flag and set the hour- value,
     * minute-value, and second-value to the numbers denoted by the digits in
     * the date-token, respectively.  Skip the remaining sub-steps and continue
     * to the next date-token.
     */
    if (!found_time) {
      result = (strict ? STRICT_TIME : TIME).exec(token);
      if (result) {
        found_time = true;
        date.setUTCHours(result[1]);
        date.setUTCMinutes(result[2]);
        date.setUTCSeconds(result[3]);
        continue;
      }
    }

    /* 2.2. If the found-day-of-month flag is not set and the date-token matches
     * the day-of-month production, set the found-day-of- month flag and set
     * the day-of-month-value to the number denoted by the date-token.  Skip
     * the remaining sub-steps and continue to the next date-token.
     */
    if (!found_dom) {
      result = DAY_OF_MONTH.exec(token);
      if (result) {
        found_dom = true;
        date.setUTCDate(result[1]);
        continue;
      }
    }

    /* 2.3. If the found-month flag is not set and the date-token matches the
     * month production, set the found-month flag and set the month-value to
     * the month denoted by the date-token.  Skip the remaining sub-steps and
     * continue to the next date-token.
     */
    if (!found_month) {
      result = MONTH.exec(token);
      if (result) {
        found_month = true;
        date.setUTCMonth(MONTH_TO_NUM[result[1].toLowerCase()]);
        continue;
      }
    }

    /* 2.4. If the found-year flag is not set and the date-token matches the year
     * production, set the found-year flag and set the year-value to the number
     * denoted by the date-token.  Skip the remaining sub-steps and continue to
     * the next date-token.
     */
    if (!found_year) {
      result = YEAR.exec(token);
      if (result) {
        var year = result[0];
        /* From S5.1.1:
         * 3.  If the year-value is greater than or equal to 70 and less
         * than or equal to 99, increment the year-value by 1900.
         * 4.  If the year-value is greater than or equal to 0 and less
         * than or equal to 69, increment the year-value by 2000.
         */
        if (70 <= year && year <= 99) {
          year += 1900;
        } else if (0 <= year && year <= 69) {
          year += 2000;
        }

        if (year < 1601) {
          return; // 5. ... the year-value is less than 1601
        }

        found_year = true;
        date.setUTCFullYear(year);
        continue;
      }
    }
  }

  if (!(found_time && found_dom && found_month && found_year)) {
    return; // 5. ... at least one of the found-day-of-month, found-month, found-
            // year, or found-time flags is not set,
  }

  return date;
}

function formatDate(date) {
  var d = date.getUTCDate(); d = d >= 10 ? d : '0'+d;
  var h = date.getUTCHours(); h = h >= 10 ? h : '0'+h;
  var m = date.getUTCMinutes(); m = m >= 10 ? m : '0'+m;
  var s = date.getUTCSeconds(); s = s >= 10 ? s : '0'+s;
  return NUM_TO_DAY[date.getUTCDay()] + ', ' +
    d+' '+ NUM_TO_MONTH[date.getUTCMonth()] +' '+ date.getUTCFullYear() +' '+
    h+':'+m+':'+s+' GMT';
}

CookieManager.parseCookie = function(str, strict) {
  str = str.trim();

  // S4.1.1 Trailing semi-colons are not part of the specification.
  // If we are not in strict mode we remove the trailing semi-colons.
  var semiColonCheck = TRAILING_SEMICOLON.exec(str);
  if (semiColonCheck) {
    if (strict) {
      return;
    }
    str = str.slice(0, semiColonCheck.index);
  }

  // We use a regex to parse the "name-value-pair" part of S5.2
  var firstSemi = str.indexOf(';'); // S5.2 step 1
  var pairRx = strict ? COOKIE_PAIR_STRICT : COOKIE_PAIR;
  var result = pairRx.exec(firstSemi === -1 ? str : str.substr(0,firstSemi));

  // Rx satisfies the "the name string is empty" and "lacks a %x3D ("=")"
  // constraints as well as trimming any whitespace.
  if (!result) {
    return;
  }

  var c = {};
  c.key = result[1]; // the regexp should trim() already
  c.value = result[3]; // [2] is quotes or empty-string

  if (firstSemi === -1) {
    return c;
  }

  // S5.2.3 "unparsed-attributes consist of the remainder of the set-cookie-string
  // (including the %x3B (";") in question)." plus later on in the same section
  // "discard the first ";" and trim".
  var unparsed = str.slice(firstSemi).replace(/^\s*;\s*/,'').trim();

  // "If the unparsed-attributes string is empty, skip the rest of these
  // steps."
  if (unparsed.length === 0) {
    return c;
  }

  /*
   * S5.2 says that when looping over the items "[p]rocess the attribute-name
   * and attribute-value according to the requirements in the following
   * subsections" for every item.  Plus, for many of the individual attributes
   * in S5.3 it says to use the "attribute-value of the last attribute in the
   * cookie-attribute-list".  Therefore, in this implementation, we overwrite
   * the previous value.
   */
  var cookie_avs = unparsed.split(/\s*;\s*/);
  while (cookie_avs.length) {
    var av = cookie_avs.shift();

    if (strict && !EXTENSION_AV.test(av)) {
      return;
    }

    var av_sep = av.indexOf('=');
    var av_key, av_value;
    if (av_sep === -1) {
      av_key = av;
      av_value = null;
    } else {
      av_key = av.substr(0,av_sep);
      av_value = av.substr(av_sep+1);
    }

    av_key = av_key.trim().toLowerCase();
    if (av_value) {
      av_value = av_value.trim();
    }

    switch(av_key) {
    case 'expires': // S5.2.1
      if (!av_value) {if(strict){return;}else{break;} }
      var exp = parseDate(av_value,strict);
      // "If the attribute-value failed to parse as a cookie date, ignore the
      // cookie-av."
      if (exp == null) { if(strict){return;}else{break;} }
      c.expires = exp;
      // over and underflow not realistically a concern: V8's getTime() seems to
      // store something larger than a 32-bit time_t (even with 32-bit node)
      break;

    case 'max-age': // S5.2.2
      if (!av_value) { if(strict){return;}else{break;} }
      // "If the first character of the attribute-value is not a DIGIT or a "-"
      // character ...[or]... If the remainder of attribute-value contains a
      // non-DIGIT character, ignore the cookie-av."
      if (!/^-?[0-9]+$/.test(av_value)) { if(strict){return;}else{break;} }
      var delta = parseInt(av_value,10);
      if (strict && delta <= 0) {
        return; // S4.1.1
      }
      // "If delta-seconds is less than or equal to zero (0), let expiry-time
      // be the earliest representable date and time."
      if (delta === Infinity || delta === -Infinity) {      
	    c.maxAge = delta.toString(); // so JSON.stringify() works
	  } else {
	    c.maxAge = delta;
	  }
      break;

    case 'domain': // S5.2.3
      // "If the attribute-value is empty, the behavior is undefined.  However,
      // the user agent SHOULD ignore the cookie-av entirely."
      if (!av_value) { if(strict){return;}else{break;} }
      // S5.2.3 "Let cookie-domain be the attribute-value without the leading %x2E
      // (".") character."
      var domain = av_value.trim().replace(/^\./,'');
      if (!domain) { if(strict){return;}else{break;} } // see "is empty" above
      // "Convert the cookie-domain to lower case."
      c.domain = domain.toLowerCase();
      break;

    case 'path': // S5.2.4
      /*
       * "If the attribute-value is empty or if the first character of the
       * attribute-value is not %x2F ("/"):
       *   Let cookie-path be the default-path.
       * Otherwise:
       *   Let cookie-path be the attribute-value."
       *
       * We'll represent the default-path as null since it depends on the
       * context of the parsing.
       */
      if (!av_value || av_value.substr(0,1) != "/") {
        if(strict){return;}else{break;}
      }
      c.path = av_value;
      break;

    case 'secure': // S5.2.5
      /*
       * "If the attribute-name case-insensitively matches the string "Secure",
       * the user agent MUST append an attribute to the cookie-attribute-list
       * with an attribute-name of Secure and an empty attribute-value."
       */
      if (av_value != null) { if(strict){return;} }
      c.secure = true;
      break;

    case 'httponly': // S5.2.6 -- effectively the same as 'secure'
      if (av_value != null) { if(strict){return;} }
      c.httpOnly = true;
      break;

    default:
      c.extensions = c.extensions || [];
      c.extensions.push(av);
      break;
    }
  }

  // ensure a default date for sorting:
  c.creation = new Date();
  return c;
}  

CookieManager.stringifyCookie = function(cookie) {
  var str = cookie.key+'=' + (cookie.value||'');

  if (cookie.expires != Infinity) {
    if (cookie.expires instanceof Date) {
      str += '; Expires='+formatDate(cookie.expires);
    } else if (cookie.expires) {
      str += '; Expires='+cookie.expires;
    }
  }

  if (cookie.maxAge != null && cookie.maxAge != Infinity) {
    str += '; Max-Age='+cookie.maxAge;
  }

  if (cookie.domain && !cookie.hostOnly) {
    str += '; Domain='+cookie.domain;
  }
  if (cookie.path) {
    str += '; Path='+cookie.path;
  }

  if (cookie.secure) {
    str += '; Secure';
  }
  if (cookie.httpOnly) {
    str += '; HttpOnly';
  }
  if (cookie.extensions) {
    cookie.extensions.forEach(function(ext) {
      str += '; '+ext;
    });
  }
  return str;
};
 	
CookieManager.takeHeaderCookies =  function (cookiesCached,headers,uri) {
	var nowTime     = new Date(); 
	var cookieLines = [] ;
	if (headers) {
		if (headers["set-cookie"]) {
			cookieLines = headers["set-cookie"] ;
		} 
	    else {
			for (var idx=0; idx < headers.length; idx ++ ) {
		        var k = headers[idx].substring(0,headers[idx].indexOf(":"));
		        if ( "set-cookie" == k.toLowerCase()) {
		        	var cookieLine  = headers[idx].substring(headers[idx].indexOf(":")+1);    
		        	cookieLines.push(cookieLine);
		        }
		    }		
		}
	} 
		
	for (var idx=0; idx < cookieLines.length; idx++) {
		var cookie   = CookieManager.parseCookie( cookieLines[idx] );
		cookie.path  = cookie.path || "/" ;
		if (!cookie.domain && uri) {
			var domain = (uri.split("://")[1] || "").split("/")[0] ;
			if (domain) {
				cookie.domain = domain ;
			} 
		}
		 
		if (!cookie.domain) {
		    continue ;	
		}
		
		var cached = cookiesCached[cookie.domain] = cookiesCached[cookie.domain] || {} ;
		cached = cached[cookie.path] = cached[cookie.path] || {} ;
		
	    if (cookie.expires && cookie.expires < nowTime ) {
	     	if (cached[cookie.key]) delete cached[cookie.key];
		} else {
			cookie.expires     = cookie.expires || "Infinity" ;
			cached[cookie.key] = cookie;
		} 
	}
}

CookieManager.prepareJaredCookie = function( cookieTree ) {  
    var jaredCookie = request.jar() ;
    for (var domain in cookieTree) {
    	for (var path in cookieTree[domain]) {
    	    for( var name in cookieTree[domain][path]) {
    	    	var cookie   = cookieTree[domain][path][name];	 
	    	    jaredCookie.setCookie(CookieManager.stringifyCookie(cookie) , (cookie.secure? "https://" : "http://") + cookie.domain + cookie.path ); 
    	    }
    	}
    } 
    return jaredCookie;
}

CookieManager.treeJaredCookie = function(cookieTree,idxOfJaredCookie){
	for (var domain in idxOfJaredCookie) {
		cookieTree[domain] = cookieTree[domain] || {} ;
    	for (var path in idxOfJaredCookie[domain]) {
    		cookieTree[domain][path] = cookieTree[domain][path] || {} ;
    	    for( var name in idxOfJaredCookie[domain][path]) {
    	    	cookieTree[domain][path][name] = cookieTree[domain][path][name] || {} ;
    	    	var cookie = idxOfJaredCookie[domain][path][name];
    	    	cookie = JSON.parse(JSON.stringify(cookie));
    	    	cookie.domain = cookie.domain || domain ;
    	    	cookie.path   = cookie.path || path ;    	    	
    	    	cookieTree[domain][path][name] = cookie ;
    	    }
    	}
    } 
}

