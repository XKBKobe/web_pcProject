//		bucket ybpimg
//		appid 10002032
//		secretID AKIDt6p2sdDrzSoLvYymMxV8Bv0h3sOPqdYR
//		secretKey jXfLK2MOtyZXHaPuOyq92fE6iqQTKmLQ
Meteor.methods({
	getImageSign : function(fileid){
		var tencentyun = getImageTy();
		var expired = parseInt(Date.now() / 1000) + 60;
		var sign = tencentyun.auth.getAppSignV2(getImageBucket(), fileid, expired);
		return sign;
	},
	getFileSignMore : function() {
		var expired = parseInt(Date.now() / 1000) + 60;
		var sign =  getFileTy().auth.signMore(getFileBucket(), expired);
		//console.log("file sign more:" + sign);
		return sign;
	},
	getFileSignOnce : function(fileid) {
		var conf = getFileTy().conf;
		var sign = getFileTy().auth.signOnce(getFileBucket(), fileid);
		return sign;
	}
});

//bucket ybpfile
//appid 10002032
//secretID AKIDt6p2sdDrzSoLvYymMxV8Bv0h3sOPqdYR
//secretKey jXfLK2MOtyZXHaPuOyq92fE6iqQTKmLQ


getImageTy = function() {
	var tencentyun = new tencentyunFun();
	tencentyun.conf.setAppInfo('10002631', 'AKIDRTuGSeHqqB9kIuySAYStjw0B7eGvBJiU', 'STNPkOZEdWB6okxMmddyDTSezQvSpqj5');
	return tencentyun;
};

getFileTy = function() {
	var fileYun = new qcloudCos();
	fileYun.conf.setAppInfo('10002631', 'AKIDRTuGSeHqqB9kIuySAYStjw0B7eGvBJiU', 'STNPkOZEdWB6okxMmddyDTSezQvSpqj5');
	return fileYun;
};

getImageBucket = function() {
	return "ybpimg";
};

getFileBucket = function() {
	return "docs";
};
