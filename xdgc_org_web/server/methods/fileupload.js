/**
 * Created by huangwb on 2015/8/4.
 */
var maxSize = 5242880//51200//5242880;
fileupload = function(req,resp) {
    var form = new IncomingForm();
    form.parse(req, function(err, fields, files) {
        Log.info("upload # fields:" + EJSON.stringify(fields));
        var path = fields.path!=null||fields.path!="" ? fields.path : "";//上传文件父父目录
        var fileid = fields.filename;//上传文件名称
        if(fields.uploadTarget && fields.uploadTarget === "cos" ){//上传cos
            tyCos(files.filecontent,path,fileid,resp);
        }else{//上传万象有图
            ty(files.filecontent,path,fileid,resp);
        }
    });
    form.on('error', function(err) {
        Log.info("error:" + err);
        if(err == 'TOLARGE') {
            resp.status = 413;
            return respEnd(resp,413,"上传失败.","文件不能大于5M.");
        } else {
            return respEnd(resp,603,"上传失败.","服务器内部错误");
        }

    });
    form.on('fileBegin', function(name, file) {
        Log.info("file size : " + form.bytesExpected);
        /*if(form.bytesExpected > maxSize) {
         Log.info("文件不能大于5M.");
         this.emit('error', 'TOLARGE');
         }*/
    });
};

function respEnd(resp,statusCode,statusMessage,respString) {
    resp.statusCode = statusCode;
    resp.statusMessage = statusMessage;
    resp.end(respString);
    return false;
}

function ty(file,path,fileid,resp) {
    var tencentyun = new tencentyunFun();
    // 10000002 即项目ID 在http://console.qcloud.com/image/bucket查看
    // 后两项为secretid和secretkey 在http://console.qcloud.com/image/project查看
    tencentyun.conf.setAppInfo('10002631', 'AKIDRTuGSeHqqB9kIuySAYStjw0B7eGvBJiU', 'STNPkOZEdWB6okxMmddyDTSezQvSpqj5');
    // 自定义空间名称，在http://console.qcloud.com/image/bucket创建
    var bucket = 'ybpimg';
    // 自定义文件名
    tencentyun.imagev2.upload(file.path, bucket, path+fileid, function(ret){
        if (0 == ret.code) {
            respEnd(resp,200,'文件上传成功',EJSON.stringify(ret));
        }
    });

}

function tyCos(file,path,fileid,resp) {
    var fileYun = new qcloudCos();
    fileYun.conf.setAppInfo('10002631', 'AKIDRTuGSeHqqB9kIuySAYStjw0B7eGvBJiU', 'STNPkOZEdWB6okxMmddyDTSezQvSpqj5');
    var bucket = 'docs';
    // 自定义文件名
    fileYun.cos.createFolder(bucket, path, null, function(){
        fileYun.cos.upload_slice(file.path, bucket, path+fileid, null, 2*1024*1024, null, function(ret){
            if (0 == ret.code) {
                respEnd(resp,200,'文件上传成功',EJSON.stringify(ret));
            }
        });
    });
}
