/**
 * Created by huangwb on 2015/8/6.
 */
Meteor.methods({
  "fileSign": function (fileid) {
    var tencentyun = new tencentyunFun();
    tencentyun.conf.setAppInfo('10002631', 'AKIDRTuGSeHqqB9kIuySAYStjw0B7eGvBJiU', 'STNPkOZEdWB6okxMmddyDTSezQvSpqj5');
    var bucket = 'ybpimg';
    var fileUrl = "https://ybpimg-10002631.image.myqcloud.com/ybpimg-10002631/0/" + fileid + '/original';
    // 生成私密下载url
    var expired = parseInt(Date.now() / 1000) + 60 * 60 * 24 * 30;
    var sign = tencentyun.auth.getAppSignV2(bucket, fileid, expired);
    return fileUrl + '?sign=' + sign;
  },

  "fileCOSSign": function (fileid) {
    var fileYun = new qcloudCos();
    fileYun.conf.setAppInfo('10002631', 'AKIDRTuGSeHqqB9kIuySAYStjw0B7eGvBJiU', 'STNPkOZEdWB6okxMmddyDTSezQvSpqj5');
    var bucket = 'docs';
    var fileUrl = "https://docs-10002631.file.myqcloud.com/" + fileid;
    // 生成私密下载url
    var expired = parseInt(Date.now() / 1000) + 120;
    var sign =  getFileTy().auth.signMore(bucket, expired);
    return fileUrl + '?sign=' + sign;
  }
})

