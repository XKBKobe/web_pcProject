/**
 * Created by huangwb on 2015/8/1.
 */
var fs = Npm.require('fs');

var getUploadedFiles = function(fileIds) {
  var files = _(fileIds).map(function(fileId) {
    var file = PDFs.findOne({
      _id: fileId
    });
    try {
      var fileName = PDFs.primaryStore.path + '/' +
        PDFs.primaryStore.name + '-' + fileId + '-' + file.name();
      return fs.createReadStream(fileName);
    } catch (e) {
      return null;
    }
  });
  return files;
};

Meteor.methods({
  doPost: function(url, args) {
    logger.info("输入URL：" + url + ",参数：" + EJSON.stringify(args));
    var uri = XDGC.getBeUri(url),
      token = XDGC.getToken();

    //TODO token需要通过其他方式获取，暂时先写死
    logger.info("请求URL全路径：" + uri + '?token=' + token);
    var resGot;
    try {
      resGot = HTTP.call('POST', uri + '?token=' + token, {
        params: args,
        timeout:10000
      });
    } catch (e) {
      var details = 'Meteor.call doPost 失败，服务器故障。';
      logger.info(details);
      throw new Meteor.Error('doPost', '服务器故障', details);
    }

    logger.info("输出：" + EJSON.stringify(resGot));
    DataPermission.handleData(resGot,url);
    return resGot;
  },

  //聚信立post方法
  doJxlPost: function(url, args) {
    logger.info("输入URL：" + url + ",参数：" + EJSON.stringify(args));
    var uri = XDGC.getJxlUri(url),
        token = XDGC.getToken();

    //TODO token需要通过其他方式获取，暂时先写死
    logger.info("请求URL全路径：" + uri + '?token=' + token);
    var resGot;
    try {
      resGot = HTTP.call('POST', uri + '?token=' + token, {
        params: args
      });
    } catch (e) {
      var details = 'Meteor.call doPost 失败，服务器故障。';
      logger.info(details);
      throw new Meteor.Error('doPost', '服务器故障', details);
    }

    logger.info("输出：" + EJSON.stringify(resGot));
    DataPermission.handleData(resGot,url);
    return resGot;
  },

  //后台实体接收参数（application/json）
  doJsonPost: function(url, args) {
    logger.info("输入URL：" + url + ",参数：" + EJSON.stringify(args));
    var uri = XDGC.getBeUri(url),
      token = XDGC.getToken();
    logger.info("请求URL全路径：" + uri);
    args = _.extend(args, {
      token: token
    });
    var resGot;
    try {
      resGot = HTTP.call('POST', uri+ '?token=' + token, {
        data : args,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (e) {
      var details = 'Meteor.call doJsonPost 失败，服务器故障。';
      logger.info(details);
      throw new Meteor.Error('doPost', '服务器故障', details);
    }

    logger.info("输出：" + EJSON.stringify(resGot));
    return resGot;
  },
  //新增产品，token放在url里
  doJsonPostTokenInUrl: function(url, args) {
    logger.info("输入URL：" + url + ",参数：" + EJSON.stringify(args));
    var uri = XDGC.getBeUri(url),
        token = XDGC.getToken();
    logger.info("请求URL全路径：" + uri + '?token=' + token);

    var resGot;
    try {
      resGot = HTTP.call('POST', uri+'?token='+token, {
        data: args,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (e) {
      var details = 'Meteor.call doJsonPostTokenInUrl 失败，服务器故障。';
      logger.info(details);
      throw new Meteor.Error('doPost', '服务器故障', details);
    }

    logger.info("输出：" + EJSON.stringify(resGot));
    return resGot;
  },
  // upload file
  doFormDataPost: function(url, fileIds, args) {
    logger.info("输入URL：" + url + ",参数：" + EJSON.stringify(args));
    var requestWithFormData = request.defaults({
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    var uri = XDGC.getBeUri(url),
      token = XDGC.getToken();
    //TODO token需要通过其他方式获取，暂时先写死
    logger.info("请求URL全路径：" + uri + '?token=' + token + '&matType=pdf');

    var formData = {
      token: token,
      matType: 'pdf',
      files: getUploadedFiles(fileIds)
    };
    formData = _.extend(formData, args);

    // var reqUrl = uri+'?token='+token+'&matType=pdf';
    var res = {};
    try {
      res = requestWithFormData.postSync(uri, {
        url: uri,
        formData: formData
      });
    } catch (e) {
      res.error = e;
      // console.log(EJSON.stringify(e));
    }
    logger.info("输出：" + EJSON.stringify(res.body, {
      indent: true
    }));
    return res.body;
  }

});