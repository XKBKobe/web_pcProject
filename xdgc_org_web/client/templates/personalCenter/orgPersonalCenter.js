Template.orgLocDetail.helpers({

    org: function () {
        return Template.instance().org.get();
    }

});

Template.orgLocDetail.onCreated(function () {

    this.org = new ReactiveVar();

});

Template.orgLocDetail.onRendered(function () {

    var tmp = Template.instance();
    Meteor.amapUtils.init({tmp: tmp});

    Meteor.call('doPost', 'org/detail', {}, function(err, result) {
        var resGot = doProcess(err, result);
        if (resGot) {
            var data = resGot.data;
            tmp.org.set(data);
            Meteor.amapUtils.render(data);
        }
    });

});

Template.orgLocDetail.events({

    "click #saveOrg": function(evt, tmp) {
        evt.preventDefault();
        var params = {};
        $('#orgLocForm :input[name]').each(function() {
            var name = $(this).attr("name");
            var rawVal = $(this).val();
            if (rawVal != null) {
                var val = rawVal.trim();
                if (val != "" && val != -1) {
                    params[name] = val;
                }
            }
        });
        Meteor.call('doPost', "org/update", params, function(err, result) {
            var resGot = doProcess(err, result);
            if (resGot) {
                tmp.$("#orgModalID").modal("hide");
                sAlert.success({
                    sAlertIcon: 'check',
                    message: "保存成功！"
                });
            }
        });
    }

});

Template.orgPersonalCenter.helpers({
    //个人信息
    personInfo: function () {
        return Template.instance().personInfo.get();
    },

    //照片fileid
    fileid: function () {
        return Template.instance().fileid.get();
    },

    //登录用户为个人或组织标识
    accountFlag: function () {
        return Template.instance().accountFlag.get();
    },

    orgCode: function () {
        return Session.get("orgCode");
    }
});
Template.orgPersonalCenter.onCreated(function () {
    //个人信息
    this.personInfo = new ReactiveVar();

    //照片fileid
    this.fileid = new ReactiveVar();

    //登录用户为个人或组织标识
    this.accountFlag = new ReactiveVar();
});

Template.orgPersonalCenter.onRendered(function () {

    var tmp = Template.instance();
    var partyUuid = XDGC.getUserPartyUuid();
    var accountFlag = Session.get("accountFlag");
    tmp.accountFlag.set(accountFlag);

    //获取个人信息：
    Meteor.call('doPost', 'system/queryPersonalInfo', {flag: accountFlag}, function (err, result) {
        var resGot = doProcess(err, result);
        if (resGot) {
            var data = resGot.data;
            if(data && data.faceUrl){
                Meteor.call('fileSign', data.faceUrl, function (err, result) {
                    tmp.fileid.set(result);
                });
            }
            tmp.personInfo.set(data);
        }
    });

    var done = function (res) {
        if (res.code == 0) {
            var data = res.data;
            var fileid = data.fileid;
            if (!fileid) {
                var urls = data.access_url.split("/");
                fileid = partyUuid + "/" + urls[urls.length - 1];
            }
            tmp.fileid.set(fileid);
            var params = {};
            var orgCode  = Session.get("orgCode");
            params.faceUrl = fileid;
            params.partyUuid = partyUuid;
            params.orgCode = orgCode;
            Meteor.call("doPost", "system/modifyUserFace", params, function (err, result) {
                var resGot = doProcess(err, result);
                if (resGot) {
                    Meteor.call('fileSign', fileid, function (err, result) {
                        tmp.fileid.set(result);
                        sAlert.success({sAlertIcon: 'check', message: "图片添加成功！"});
                    });
                }
            });
        }
    };

    var fail = function () {
        sAlert.error({sAlertIcon: 'warning', message: "图片上传失败！"});
    };

    qcloud.initForm(tmp.$('#fileFormId'), done, fail);
});

Template.orgPersonalCenter.events({

    /**
     * 单击修改密码
     * @param evt tmp
     */
    "click .updatePwdBtn": function (evt, tmp) {
        evt.preventDefault();

        var $form = tmp.$("#modifyPwdForm");
        formErrorClear($form);
        tmp.$("#modifyPwdForm :input[name]").each(function () {
            $(this).val("");
        });

        tmp.$("#modifyPwd").modal({'show':true,'backdrop':"static"});
    },

    /**
     * 单击修改密码确认按钮
     * @param evt tmp
     */
    "click #confirmBtn": function (evt, tmp) {
        evt.preventDefault();

        var $form = tmp.$('#modifyPwdForm');
        $form.validator("validate");
        if (formHasError($form)) {
            return;
        }

        var partyUuid = XDGC.getUserPartyUuid();
        var orgCode = Session.get("orgCode");
        var oldPassword = tmp.$("#modifyPwdForm input[name=oldPassword]").val().trim();
        var newPassword = tmp.$("#modifyPwdForm input[name=newPassword]").val().trim();
        var reNewPassword = tmp.$("#modifyPwdForm input[name=reNewPassword]").val().trim();

        if (newPassword != reNewPassword) {
            sAlert.error({sAlertIcon: 'warning', message: "两次输入新密码不一致！"});
            return;
        }
        var formData = {
            "partyUuid": partyUuid,
            "oldPassword": XDGC.md5For16(oldPassword),
            "newPassword": XDGC.md5For16(newPassword),
            "orgCode": orgCode
        };

        Meteor.call("doPost", "system/modifyPassword", formData, function (err, result) {
            var resGot = doProcess(err, result);
            if (resGot) {
                sAlert.success({sAlertIcon: 'check', message: "修改密码成功，请重新登录！"});
                tmp.$("#modifyPwd").modal("hide");
                setTimeout(function () {
                   Router.go("/");
                },1500);
            }
        });
    },

    /**
     * 单击编辑电话
     * @param evt tmp
     */
    "click .mobileEditBtn": function (evt, tmp) {
        evt.preventDefault();

        var $form = tmp.$("#modifyPhoneForm");
        formErrorClear($form);
        tmp.currentStep = 1;
        tmp.$('#wizardTab li:eq(0) a').tab('show');
        tmp.$('#mobileModalID .panel-footer').show();
        tmp.$('#nextStep').show();
        tmp.$('#okStep').hide();

        tmp.$("#modifyPhoneForm :input[name]").each(function () {
            $(this).val("");
        });

        tmp.$("#mobileModalID").modal({'show':true,'backdrop':"static"});
    },

    "click #wizardTab li a": function (evt) {
        evt.preventDefault();
        return false;
    },

    /**
     * 单击下一步
     * @param evt tmp
     */
    "click #nextStep": function (evt, tmp) {
        evt.preventDefault();

        var $form = tmp.$('.wizardContent1');
        $form.validator("validate");
        if (formHasError($form)) {
            return;
        }

        tmp.currentStep++;
        if(tmp.currentStep == 2) {
            tmp.$('#wizardTab li:eq(1) a').tab('show');
            tmp.$('#nextStep').hide();
            tmp.$('#okStep').show();
        }
    },

    /**
     * 单击发送验证码
     * @param evt tmp
     */
    "click #resend": function(evt,tmp){
        evt.preventDefault();

        var phone = tmp.$("#modifyPhoneForm :input[name=phone]").val().trim();
        var msgCode = Session.get("msgCode");
        var params = _.extend({phone: phone}, msgCode);

        Meteor.call('doPost', 'system/sendMsgCode', params, function (err, result) {
            var resGot = doProcess(err, result);
            if (resGot) {
                $("#resend").sendvftCode({"count": 60, "eachstypetime": 1000 });
                sAlert.success({sAlertIcon: 'check', message: "发送验证码成功！"});
            }
        });
    },

    /**
     * 单击提交验证码
     * @param evt tmp
     */
    "click #okStep": function (evt, tmp) {
        evt.preventDefault();

        var $form = tmp.$('.wizardContent2');
        $form.validator("validate");
        if (formHasError($form)) {
            return;
        }

        tmp.currentStep++;

        if(tmp.currentStep == 3){
            var phone = tmp.$("#modifyPhoneForm input[name=phone]").val().trim();
            var regCode = tmp.$("#modifyPhoneForm input[name=regCode]").val().trim();
            var accountFlag = Session.get("accountFlag");
            var formData = {
                "regCode": regCode,
                "phone": phone,
                "flag": accountFlag
            };

            Meteor.call("doPost", "system/modifyPhone", formData, function (err, result) {
                var resGot = doProcess(err, result);
                if (resGot) {
                    tmp.$('#mobileModalID .panel-footer').hide();

                    //获取个人信息：
                    Meteor.call('doPost', 'system/queryPersonalInfo', {flag: accountFlag}, function (err, result) {
                        var resGot = doProcess(err, result);
                        if (resGot) {
                            var data = resGot.data;
                            tmp.personInfo.set(data);
                        }
                    });
                    tmp.$('#wizardTab li:eq(2) a').tab('show');
                    setTimeout(function() {
                        tmp.$("#mobileModalID").modal("hide");
                    }, 1500);
                }else{
                    tmp.currentStep = 2;
                }
            });
        }
    },

    /**
     * 上传图片
     * @param evt tmp
     */
    "click .photoUpload": function (evt, tmp) {
        evt.preventDefault();
        tmp.$('#fileFormId').find('#fileContent').val("");
        tmp.$('#fileFormId').find('#fileContent').trigger('click');
    },

    /**
     * 上传图片确定
     * @param evt tmp
     */
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
            sAlert.error({sAlertIcon: 'warning', message: "图片格式不正确，请上传以下格式（jpg,png,jpeg,gif,bmp）"});
        }
    }
});
