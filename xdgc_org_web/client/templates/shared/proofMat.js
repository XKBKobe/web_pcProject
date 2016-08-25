/** 模板 helpers 配置开始     **/
Template.proofMat.helpers({

  //当前操作的文件fileid
  fileid: function () {
    return Template.instance().fileid.get();
  },
  //当前店铺ileid
  propertyUuid: function () {
    return Template.instance().propertyUuid.get();
  },

  //当前是什么操作
  action: function () {
    return Template.instance().action.get();
  },

  //当前文件类型
  currentMatTypeCode: function () {
    return Template.instance().currentMatTypeCode.get();
  },

  //当前文件UUID
  currentProofMatUuid: function () {
    return Template.instance().currentProofMatUuid.get();
  },

  //文件资料集
  proofMats: function () {
    return Template.instance().proofMats.get();
  },

  showAction: function (action) {
    var currentAction = Template.instance().action.get();
    return currentAction == action ? true : false;
  },

  isImage: function (matTypeCode,matUrl) {
    if(matTypeCode == "LEASE_CONTRACT" ||
      matTypeCode == "SHOP_OTHER_MATERIAL"){
      if(matUrl.indexOf("/")<0){//万象优图
        return true;
      }else{
        return false;
      }
    }else{
      if (matTypeCode == "USER_IDENTITY_COPY" ||
        matTypeCode == "USER_OTHER_MATERIAL" ||
        matTypeCode == "LOAN_INFO_LIST" ) {
        return false;
      } else {
        return true;
      }
    }
  }

});
/** 模板 helpers 配置结束     **/

Template.proofMat.onCreated(function () {
  //当前操作的文件fileid
  this.fileid = new ReactiveVar();

  //当前店铺propertyUuid
  this.propertyUuid = new ReactiveVar();

  //当前是什么操作
  this.action = new ReactiveVar();

  //当前文件类型
  this.currentMatTypeCode = new ReactiveVar();

  //当前文件UUID
  this.currentProofMatUuid = new ReactiveVar();

  //文件资料集
  this.proofMats = new ReactiveVar();

  this.partyUuid = new ReactiveVar();

  this.loanAppUuid = new ReactiveVar();

});

/** 模板 onRendered 配置开始     **/
Template.proofMat.onRendered(function () {
  var template = Template.instance();
  var query = Template.parentData(1).query;
  var partyUuid = query.partyUuid; //传递过来的partyUuid
  var propertyUuid = query.propertyUuid; //传递过来的propertyUuid
  var loanAppUuid = query.loanAppUuid; //传递过来的loanAppUuid
  var uploadType = Template.currentData(); //1:表示个人资料文件上传（全部）；2：表示店铺资料上传（单个店铺）；3:表示个人（贷款需要）资料上传；4：表示店铺资料上传（贷款需要）
  var options = {};//文件上传配置


  // 1:表示个人资料文件上传（全部）；
  if (uploadType == "1") {
    options = { //文件上传配置
      getFiles: {
        url: "custom/queryProofMatByCustomer",
        params: {"partyUuid": partyUuid}
      },
      uploadFile: {
        url: "custom/addProofMat",
        params: {"partyUuid": partyUuid}
      }
    };
    template.partyUuid.set(partyUuid);
  }

  // 2：表示店铺资料上传（单个店铺）
  if (uploadType == "2") {
    options = { //文件上传配置
      getFiles: {
        url: "property/queryProofMatByShop",
        params: {"propertyUuid": propertyUuid}
      },
      uploadFile: {
        url: "property/addProofMat",
        params: {"propertyUuid": propertyUuid}
      }
    };
    Meteor.call("doPost", "property/queryShopHolder", {"propertyUuid": propertyUuid}, function (err, result) {
      var resGot = doProcess(err, result);
      if (resGot) {//成功
        var data = resGot.data;
        if (data.length > 0) {
          template.partyUuid.set(data[0].partyUuid);
        }
      }
    });
    template.propertyUuid.set(propertyUuid);
  }

  // 3:表示个人（贷款需要）资料上传
  if (uploadType == "3") {
    options = { //文件上传配置
      getFiles: {
        url: "custom/queryProofMatByLoan",
        params: {"loanAppUuid": loanAppUuid}
      },
      uploadFile: {
        url: "custom/addProofMat",
        params: {"partyUuid": partyUuid}
      }
    };
    template.partyUuid.set(partyUuid);
    template.loanAppUuid.set(loanAppUuid);

  }

  // 4：表示店铺资料上传（贷款需要）
  if (uploadType == "4") {
    options = { //文件上传配置
      getFiles: {
        url: "property/queryProofMatByLoan",
        params: {"propertyUuid": propertyUuid, "loanAppUuid": loanAppUuid}
      },
      uploadFile: {
        url: "property/addProofMat",
        params: {"propertyUuid": propertyUuid}
      }
    };
    Meteor.call("doPost", "property/queryShopHolder", {"propertyUuid": propertyUuid}, function (err, result) {
      var resGot = doProcess(err, result);
      if (resGot) {//成功
        var data = resGot.data;
        if (data.length > 0) {
          template.partyUuid.set(data[0].partyUuid);
        }
      }
    });
    template.propertyUuid.set(propertyUuid);
  }

  //获取资料信息
  Meteor.call("doPost", options.getFiles.url, options.getFiles.params, function (err, result) {
    var resGot = doProcess(err, result);
    if (resGot) {//成功
      var proofMats = resGot.data;
      for (var i in proofMats) {
        proofMats[i].index = parseInt(i) + 1;
      }
      template.proofMats.set(proofMats);
    }
  });

  var done = function (res) {
    if (res.code == 0) {
      var data = res.data;
      var fileid = data.fileid;
      if (!fileid) {
        var urls = data.access_url.split("/");
        var partyUuid = template.partyUuid.get();
        fileid = partyUuid + "/" + urls[urls.length - 1];
      }
      template.fileid.set(fileid);
      var formData = {};
      formData.matUrl = fileid;
      var proofMatUuid = template.currentProofMatUuid.get();
      var matTypeCode = template.currentMatTypeCode.get();
      if (proofMatUuid) {//更新文件记录
        formData.proofMatUuid = proofMatUuid;
        Meteor.call("doPost", "proofMat/updateProofMatFile", formData, function (err, result) {
          var resGot = doProcess(err, result);
          if (resGot) {
            var proofMat = resGot.data;
            //个人（贷款需要）资料查询
            Meteor.call("doPost", options.getFiles.url, options.getFiles.params, function (err, result) {
              var resGot = doProcess(err, result);
              if (resGot) {//成功
                var proofMats = resGot.data;
                for (var i in proofMats) {
                  proofMats[i].index = parseInt(i) + 1;
                }
                template.proofMats.set(proofMats);
              }
            });
          }
        });
      } else {//增加文件记录
        formData.matTypeCode = matTypeCode;
        _.extend(formData, options.uploadFile.params);
        Meteor.call("doPost", options.uploadFile.url, formData, function (err, result) {
          var resGot = doProcess(err, result);
          if (resGot) {
            var proofMat = resGot.data;
            //获取店铺资料信息
            Meteor.call("doPost", options.getFiles.url, options.getFiles.params, function (err, result) {
              var resGot = doProcess(err, result);
              if (resGot) {//成功
                var proofMats = resGot.data;
                for (var i in proofMats) {
                  proofMats[i].index = parseInt(i) + 1;
                }
                template.proofMats.set(proofMats);
              }
            });
          }
        });
      }
    } else {
      sAlert.error({sAlertIcon: 'warning', message: "文件上传失败！"});
    }
  }
  var fail = function (res) {
    sAlert.error({sAlertIcon: 'warning', message: "文件上传失败！"});
  }
  qcloud.initForm(template.$('#fileFormId'), done, fail);
});

/** 模板 onRendered 配置结束     **/
Template.proofMat.events({
  //预览文件：
  "click .fileView": function (evt, tmp) {
    evt.preventDefault();
    var fileid = $(evt.target).attr("data") ? $(evt.target).attr("data") : $(evt.target).parent("a").attr("data");
    Meteor.call('fileSign', fileid, function (err, result) {
      tmp.action.set("view");
      tmp.fileid.set(result);
    });
  },

  //下载文件：
  "click .fileDownLoad": function (evt, tmp) {
    evt.preventDefault();
    var fileid = $(evt.target).attr("data") ? $(evt.target).attr("data") : $(evt.target).parent("a").attr("data");
    Meteor.call('fileCOSSign', fileid, function (err, result) {
      //window.location = result;
      downloadFile(result);
    });
  },

  //上传文件(增加)：
  "click .fileUploadAdd": function (evt, tmp) {
    evt.preventDefault();
    tmp.$('#fileFormId').find('[name=filecontent]').val("");
    tmp.$('#fileFormId').find('[name=filecontent]').trigger('click');
    var matTypeCode = $(evt.target).attr("data") ? $(evt.target).attr("data") : $(evt.target).parent("a").attr("data");
    tmp.currentMatTypeCode.set(matTypeCode);
    tmp.currentProofMatUuid.set(null);
  },

  //上传文件(更新)：
  "click .fileUpload": function (evt, tmp) {
    evt.preventDefault();
    tmp.$('#fileFormId').find('[name=filecontent]').val("");
    tmp.$('#fileFormId').find('[name=filecontent]').trigger('click');
    var proofMatUuid = $(evt.target).attr("data") ? $(evt.target).attr("data") : $(evt.target).parent("a").attr("data");
    var matTypeCode = $(evt.target).attr("data-type") ? $(evt.target).attr("data-type") : $(evt.target).parent("a").attr("data-type");
    tmp.currentMatTypeCode.set(matTypeCode);
    tmp.currentProofMatUuid.set(proofMatUuid);
  },

  //删除文件:
  "click .deleteProof": function (evt, tmp) {
    evt.preventDefault();
    var proofMatUuid = $(evt.target).attr("data") ? $(evt.target).attr("data") : $(evt.target).parent("a").attr("data");
    tmp.action.set("delete");
    tmp.currentProofMatUuid.set(proofMatUuid);
  },

  //文件上传确定:
  "change [name=filecontent]": function (evt, tmp) {
    evt.preventDefault();
    var partyUuid = tmp.partyUuid.get();
    var $form = $(evt.target).closest('form');
    var filename = $form.find('[name=filecontent]').val();
    var fileSuffix = filename.substr(filename.lastIndexOf(".") + 1);
    fileSuffix = fileSuffix.toLocaleLowerCase();
    var matTypeCode = tmp.currentMatTypeCode.get();
    if (matTypeCode == "USER_IDENTITY_COPY") {
      if (fileSuffix == "jpg" ||
        fileSuffix == "png" ||
        fileSuffix == "jpeg" ||
        fileSuffix == "gif" ||
        fileSuffix == "bmp" ||
        fileSuffix == "doc" ||
        fileSuffix == "docx") {
          $form.find('[name=uploadTarget]').val("cos");
          $form.find('[name=path]').val(partyUuid + "/");
          $form.find('[name=filename]').val(qcloud.genFileId(filename));
          $form.attr("action", "/proofMat/updateProofMatFile");
          $form.submit();
          tmp.$("#uploadFileModalID").modal('hide');
      } else {
        sAlert.error({sAlertIcon: 'warning', message: "文件格式不正确，请上传以下格式（jpg,png,jpeg,gif,bmp,doc,docx）文件"});
      }
    } else if (matTypeCode == "LOAN_INFO_LIST") {
      if (fileSuffix == "xls" ||
        fileSuffix == "xlsx" ||
        fileSuffix == "doc" ||
        fileSuffix == "docx") {
          $form.find('[name=uploadTarget]').val("cos");
          $form.find('[name=path]').val(partyUuid + "/");
          $form.find('[name=filename]').val(qcloud.genFileId(filename));
          $form.attr("action", "/proofMat/updateProofMatFile");
          $form.submit();
          tmp.$("#uploadFileModalID").modal('hide');
      } else {
        sAlert.error({sAlertIcon: 'warning', message: "文件格式不正确，请上传以下格式（doc,docx,xls,xlsx）文件"});
      }
    } else if (matTypeCode == "USER_OTHER_MATERIAL" ||
      matTypeCode == "SHOP_OTHER_MATERIAL" ||
      matTypeCode == "LEASE_CONTRACT") {
      if (fileSuffix == "jpg" ||
        fileSuffix == "png" ||
        fileSuffix == "jpeg" ||
        fileSuffix == "gif" ||
        fileSuffix == "bmp" ||
        fileSuffix == "xls" ||
        fileSuffix == "doc" ||
        fileSuffix == "zip" ||
        fileSuffix == "rar" ||
        fileSuffix == "docx") {
          $form.find('[name=uploadTarget]').val("cos");
          $form.find('[name=path]').val(partyUuid + "/");
          $form.find('[name=filename]').val(qcloud.genFileId(filename));
          $form.attr("action", "/proofMat/updateProofMatFile");
          $form.submit();
          tmp.$("#uploadFileModalID").modal('hide');
      } else {
        sAlert.error({sAlertIcon: 'warning', message: "文件格式不正确，请上传以下格式（jpg,png,jpeg,gif,bmp,xls,doc,zip,rar,docx）文件"});
      }
    } else {
      if (fileSuffix == "jpg" ||
        fileSuffix == "png" ||
        fileSuffix == "jpeg" ||
        fileSuffix == "gif" ||
        fileSuffix == "bmp") {
          $form.find('[name=uploadTarget]').val("image");
          $form.find('[name=path]').val("");
          $form.find('[name=filename]').val(qcloud.getImageFileId());
          $form.attr("action", "/proofMat/updateProofMatFile");
          $form.submit();
          tmp.$("#uploadFileModalID").modal('hide');
      } else {
        sAlert.error({sAlertIcon: 'warning', message: "文件格式不正确，请上传以下格式（jpg,png,jpeg,gif,bmp）文件"});
      }
    }
  },

  //删除文件确定：
  "click #confirmDeleteID": function (evt, tmp) {
    evt.preventDefault();
    var proofMatUuid = tmp.currentProofMatUuid.get();
    var queryType = Template.currentData();
    var partyUuid = tmp.partyUuid.get();
    var propertyUuid = tmp.propertyUuid.get();
    var loanAppUuid = tmp.loanAppUuid.get();
    var options = {};
    if (queryType == "1") {
      options = {
        getFiles: {
          url: "custom/queryProofMatByCustomer",
          params: {"partyUuid": partyUuid}
        }
      };
    }
    if (queryType == "2") {
      options = {
        getFiles: {
          url: "property/queryProofMatByShop",
          params: {"propertyUuid": propertyUuid}
        }
      };
    }

    if (queryType == "3") {
      options = { //文件上传配置
        getFiles: {
          url: "custom/queryProofMatByLoan",
          params: {"loanAppUuid": loanAppUuid}
        }
      };
    }

    // 4：表示店铺资料上传（贷款需要）
    if (queryType == "4") {
      options = { //文件上传配置
        getFiles: {
          url: "property/queryProofMatByLoan",
          params: {"propertyUuid": propertyUuid, "loanAppUuid": loanAppUuid}
        }
      };
    }

    Meteor.call("doPost", "proofMat/deleteProofMat", {"proofMatUuid": proofMatUuid}, function (err, result) {
      var resGot = doProcess(err, result);
      if (resGot) {
        //获取店铺资料信息
        Meteor.call("doPost", options.getFiles.url, options.getFiles.params, function (err, result) {
          var resGot = doProcess(err, result);
          if (resGot) {//成功
            var proofMats = resGot.data;
            for (var i in proofMats) {
              proofMats[i].index = parseInt(i) + 1;
            }
            tmp.proofMats.set(proofMats);
          }
        });
      }
    });
  }
});