Template.orgSubDetail.helpers({
    org: function() {
        return Template.instance().org.get();
    },

    //获得初始化职位数据
    getOrgPosList: function () {
        return Template.instance().orgPosList.get();
    }
});

Template.orgSubDetail.onCreated(function() {
    this.org = new ReactiveVar({});

    //初始化职位信息
    this.orgPosList = new ReactiveVar();
});

Template.orgSubDetail.onRendered(function() {
    var tmp = Template.instance();
    Meteor.amapUtils.init({tmp: tmp});
    queryRoleList(tmp);

    //查询机构菜单
    rightsConfigure(tmp, MENUS, menusChecked(MENUS), "treeViewData");

    //查询人员菜单
    rightsConfigure(tmp, PMENUS, menusChecked(PMENUS), "treeViewData2");

    var innerCode = this.data.query.innerCode;
    if (innerCode && innerCode !== 'new') {
        tmp.$('#orgDetailForm :input[name=username]').attr('disabled', 'disabled');
        Meteor.call('doPost', 'org/detail', {
            innerCode: innerCode
        }, function(err, result) {
            var resGot = doProcess(err, result);
            if (resGot) {
                var data = resGot.data;
                tmp.org.set(data);
                Meteor.amapUtils.render(data);
            }
        });
    }
});

Template.orgSubDetail.events({

    "click #saveOrg": function(evt, tmp) {
        evt.preventDefault();
        var $form = tmp.$("#orgDetailForm");
        $form.validator("validate");
        if (formHasError($form)) {
            return;
        }

        var textVal = {};
        $('#orgDetailForm :input[name]').each(function() {
            var name = $(this).attr("name");
            var rawVal = $(this).val();
            if (rawVal != null) {
                var val = rawVal.trim();
                if (val != "" && val != -1) {
                    textVal[name] = val;
                }
            }
        });
        var orgCode = Session.get("orgCode");
        var orgMenuCodes = checkedCodesStr(tmp.$('#treeViewData').data('treeview').getChecked());
        var managerMenuCodes = checkedCodesStr(tmp.$('#treeViewData2').data('treeview').getChecked());
        //var roleIds = [];
        //tmp.$(".initialPos").find("input:checked").each(function () {
        //    roleIds.push($(this).val());
        //});
        //var extendsRoleIds = roleIds.join(",");
        var params = _.extend(textVal, {
            orgMenuCodes: orgMenuCodes,
            managerMenuCodes: managerMenuCodes
        });

        var url = params.innerCode ? "org/update" : "org/create";

        params = (url == "org/create") ? _.extend(params, {orgCode: orgCode}) : params;

        Meteor.call('doPost', url, params, function (err, result) {
            var resGot = doProcess(err, result);
            if (resGot) {
                tmp.$("#orgModalID").modal("hide");
                sAlert.success({
                    sAlertIcon: 'check',
                    message: params.innerCode ? "保存成功！" : "新增成功！"
                });
                setTimeout(function () {
                    Router.go("orgSubBank");
                }, 1500);
            }
        });

    },

    //恢复默认密码
    "click #resetPwd": function (evt) {
        evt.preventDefault();
        bootbox.confirm({
            message: '确定要恢复系统默认密码000000吗？',
            buttons: {
                confirm: {
                    label: "<i class='fa fa-check'></i> 确认",
                    className: "btn-sm btn-success"
                },
                cancel: {
                    label: "<i class='fa fa-reply'></i> 取消",
                    className: "btn-sm btn-danger"
                }
            },
            callback: function (result) {
                if (result) {
                    var partyUuid = $(evt.target).attr("data-uuid");
                    var orgCode = Session.get("orgCode");
                    var params = {
                        partyUuid: partyUuid,
                        orgCode: orgCode
                    };

                    Meteor.call('doPost', 'system/resetPasswd', params, function (err, result) {
                        var resGot = doProcess(err, result);
                        if (resGot) {
                            sAlert.success({sAlertIcon: 'check', message: "恢复系统默认密码成功！"});
                        }
                    });
                }
            }
        });
    }
});

//勾选的值转成str
function checkedCodesStr(checkedData){
    var codes = [];
    for (var i in checkedData) {
        var code = checkedData[i].code;
        codes.push(code);
    }
    return codes.join(",");
}

//初始化职位查询
function queryRoleList(tmp) {
    Meteor.call('doPost', 'role/queryRoleList', {}, function (err, result) {
        var resGot = doProcess(err, result);
        if (resGot) {
            var data = resGot.data;
            tmp.orgPosList.set(data);
        }
    });
}

//派发权限菜单过滤
function menusChecked(menus){
    var checkedData = [];
    for (var i in menus) {
        if(menus[i].code != "loanProduct") {
            var childrenData = menus[i].children;
            if (childrenData) {
                for (var j in childrenData) {
                    if(childrenData[j].code != "orgPosition") {
                        checkedData.push(childrenData[j].code);
                    }
                }
            }
            checkedData.push(menus[i].code);
        }
    }

    return checkedData;
}
