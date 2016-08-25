Template.productDetail.onCreated(function () {
    var self = this;

    //产品详情
    this.proDetails = new ReactiveVar();

    //产品Uuid
    this.productCustUuid = new ReactiveVar();

    //图片fileId
    this.fileId = new ReactiveVar();

    //图片picUrl
    this.picUrl = new ReactiveVar();

    //存储图库图片
    this.picStorage = new ReactiveVar();

    //图库数据获取
    showPicStorage(function(err, pic) {
        Meteor.call('fileSign', pic, function (err, result) {
            var pics = self.picStorage.get() || [];
            pics.push({"picId": pic, "url": result});
            self.picStorage.set(pics);
        });
    });
});

Template.productDetail.onRendered(function () {
    var tmp = Template.instance();
    var productCustUuid = this.data.query.productCustUuid;
    tmp.productCustUuid.set(productCustUuid);

    if(productCustUuid) {
        //产品详情
        Meteor.call('doPost', 'product/details', {productCustUuid: productCustUuid}, function (err, result) {
            var resGot = doProcess(err, result);
            if (resGot) {
                var data = resGot.data;
                if(data){
                    var dataArray = [data.privateMat, data.basicMat, data.dataSource];
                    dataArray.forEach(function (e) {
                        if(e !== null) {
                            var arrayData = e.split("|");
                            arrayData.forEach(function (e) {
                                tmp.$(".checkbox-item").find("input[value=" + e + "]").prop('checked', true);
                            });
                        }
                    });

                    if(data.pngUrl){
                        Meteor.call('fileSign', data.pngUrl, function (err, result) {
                            tmp.picUrl.set(result);
                        });
                    }
                }
                tmp.proDetails.set(data);
            }
        });
    }

    //图片上传
    var done = function (res) {
        if (res.code == 0) {
            var data = res.data;
            var fileid = data.fileid;
            if (!fileid) {
                var urls = data.access_url.split("/");
                fileid = productCustUuid + "/" + urls[urls.length - 1];
            }
            tmp.fileId.set(fileid);
            Meteor.call('fileSign', fileid, function (err, result) {
                tmp.picUrl.set(result);
            });
        }
    };

    var fail = function () {
        sAlert.error({sAlertIcon: 'warning', message: "图片上传失败！"});
    };

    qcloud.initForm(tmp.$('#fileFormId'), done, fail);
});

Template.productDetail.helpers({
    //产品详情
    proDetails: function () {
        return Template.instance().proDetails.get();
    },

    //图片picUrl
    picUrl: function () {
        return Template.instance().picUrl.get();
    },

    //得到图片URL
    getPicUrlList: function () {
        return Template.instance().picStorage.get();
    },

    //贷款类型、爆款默认选中
    defaultChecked: function (val, code) {
        if((val != code && code == "2") || (val && val == code)){
            return "checked";
        }
        return "";
    }
});

Template.productDetail.events({
    //利率范围
    "change input[name='downRate'], change input[name='upperRate']": function (evt, tmp) {
        var low = $("input[name='downRate']").val();
        var up = $("input[name='upperRate']").val();
        var alertMsg = "";
        if (parseFloat(low) > parseFloat(up)) {
            alertMsg = "利率下限不能大于上限";
        }else if((low == "" && up != "") || (low != "" && up == "") || (low == "" && up == "")){
            alertMsg = "请输入正确的利率范围";
        }
        tmp.$(".customErrorHelper").html(alertMsg).css("color", "#a94442");
    },

    //上传图片
    "click .photoUpload": function (evt, tmp) {
        evt.preventDefault();
        tmp.$('#fileFormId').find('#fileContent').val("");
        tmp.$('#fileFormId').find('#fileContent').trigger('click');
    },

    //上传图片确定
    "change #fileContent": function (evt, tmp) {
        evt.preventDefault();
        var $form = tmp.$("#fileFormId");
        var filename = $form.find('#fileContent').val();
        var fileSuffix = filename.substr(filename.lastIndexOf(".") + 1);
        fileSuffix = fileSuffix.toLocaleLowerCase();
        if (fileSuffix == "jpg" ||
            fileSuffix == "png" ||
            fileSuffix == "jpeg" ||
            fileSuffix == "gif" ||
            fileSuffix == "bmp") {
            Meteor.call('getImageSign', function (error, sign) {
                $form.attr("action", qcloud.genImgUrl(sign).replace('http://', 'https://'));
                $form.submit();
            });
        } else {
            sAlert.error({sAlertIcon: 'warning', message: "图片格式不正确，请上传以下格式(jpg,png,jpeg,gif,bmp)"});
        }
    },

    //确定选择图标
    "click #confirmPic": function (evt, tmp) {
        evt.preventDefault();

        var checkedPic = tmp.$("input[name=picRadio]:checked").attr("data-id");
        tmp.fileId.set(checkedPic);
        Meteor.call('fileSign', checkedPic, function (err, result) {
            tmp.picUrl.set(result);
            tmp.$("#galleryModal").modal("hide");
        });
    },

    //全选
    "click .checkAll": function (evt) {
        evt.preventDefault();

        var item = $(evt.target).attr("name");
        $(evt.target).parents("." + item).find(".chk-item").each(function()	{
            $(this).prop('checked', true);
        });
    },

    //全不选
    "click .unCheckAll": function (evt) {
        evt.preventDefault();

        var item = $(evt.target).attr("name");
        $(evt.currentTarget).parents("." + item).find(".chk-item").each(function()	{
            $(this).prop('checked', false);
        });
    },

   //点击保存
   "click #savePro": function (evt, tmp) {
       evt.preventDefault();

       var $form = tmp.$("#loanProForm");
       $form.validator("validate");
       if (formHasError($form)) {
           sAlert.error({sAlertIcon: 'warning', message: "请完善产品信息！"});
           return;
       }

       var $checkbox = tmp.$(".checkbox-item");
       $checkbox.each(function () {
           if(!$(this).find("input").is(":checked")){
               $(this).find(".form-group").addClass("has-error");
           }
       });

       var jsonData = getJsonData();
       var textData = ["description", "applyDesc", "paybackDesc"];
       textData.forEach(function (e) {
           if(!jsonData[e]){
               tmp.$(":input[name=" + e + "]").parents(".form-group").addClass("has-error");
           }
       });

       if($form.find(".form-group").hasClass("has-error")) {
           sAlert.error({sAlertIcon: 'warning', message: "请完善产品信息！"});
           return;
       }

       if(tmp.$(".photoArea").attr("href") === undefined){
           sAlert.error({sAlertIcon: 'warning', message: "您未上传产品图标！"});
           return;
       }

       var pngId1 = tmp.fileId.get();
       var pngId2 = tmp.$(".photoArea").attr("data-id");
       var pngUrl = pngId1 ? pngId1 : pngId2;
       var proInfo = _.extend(getJsonData(), {pngUrl: pngUrl});
       var productCustUuid = tmp.productCustUuid.get();
       var api = productCustUuid ? "product/modify" : "product/create";

       var params = (api == "product/modify") ? _.extend(proInfo, {productCustUuid: productCustUuid}) : proInfo;

       Meteor.call("doPost", api, params, function (err, result) {
           var resGot = doProcess(err, result);
           if (resGot) {
               sAlert.success({sAlertIcon: 'check', message: "保存成功！"});
               setTimeout(function () {
                   Router.go("loanProduct");
               }, 1500);
           }
       });
   },

   //textarea粘贴文字长度限制
   "input :input[name=description], keyup :input[name=applyDesc], keyup :input[name=paybackDesc]": function (evt) {
       var area = $(evt.target);
       var max = parseInt(area.attr("maxlength"), 10) - 2;
       if(max > 0) {
           if (area.val().length >= max) {
               area.val(area.val().substr(0, max));
           }
       }
   },

   //选择图片勾选单选
   "click .choseTarget": function (evt) {
       evt.preventDefault();

       var $this = $(evt.currentTarget);
       $this.parent().find("input[name=picRadio]").prop("checked", true);
   }
});

// ------------------------------------------------------------
// Functions
// ------------------------------------------------------------

//所填产品信息json
function getJsonData(){
    var jsonData = {};
    var textData = ["name", "rateType", "downRate", "upperRate", "loanDay", "description", "applyDesc", "paybackDesc"];
    var checkedData = ["targetCustomer", "type", "recommendType", "privateMat", "basicMat", "dataSource"];

    textData.forEach(function (e) {
        jsonData[e] = $('[name="' + e + '"]').val().trim();
    });

    checkedData.forEach(function (e) {
        jsonData[e] = getCheckboxVal(e);
    });

    return jsonData;
}

//单选复选框选中值
function getCheckboxVal(checkInfo){
    var checkInfoArray = [];

    $('input[name=' + checkInfo + ']:checked').each(function () {
        checkInfoArray.push($(this).val());
    });

    return checkInfoArray.join("|");
}

//得到图库图片Id
function showPicStorage(cb){
    $.getJSON("/resource/iconsIdStorage.json", function (result) {
        if (result.iconsId) {
            var iconsId = result.iconsId;
            for (var i = 0; i < iconsId.length; i++) {
                var pic = iconsId[i];
                cb(null, pic);
            }
        }
    });

}
