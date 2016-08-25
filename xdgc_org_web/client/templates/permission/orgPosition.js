Template.orgPosition.onCreated(function () {
    //所有职位信息
    this.orgPosList = new ReactiveVar();

    //判断新增或编辑
    this.action = new ReactiveVar();

    //当前职位信息
    this.posInfo = new ReactiveVar();

});

Template.orgPosition.helpers({
    //获得本行列表数据
    getOrgPosList: function () {
        return Template.instance().orgPosList.get();
    },

    //得到职位信息
    getPosInfo: function () {
        return Template.instance().posInfo.get();
    }
});

Template.orgPosition.onRendered(function () {
    var tmp = Template.instance();

    //列表查询
    queryRoleList(tmp);

    //权限配置展示
    queryManagerMenus(function (err, rightsData) {
        rightsConfigure(tmp, rightsData, ["orgPersonalCenter"], "treeViewData");
    });
});

Template.orgPosition.events({
    //单击新增
    "click #addPosition": function (evt, tmp) {
        evt.preventDefault();

        //权限配置展示
        queryManagerMenus(function (err, rightsData) {
            rightsConfigure(tmp, rightsData, ["orgPersonalCenter"], "treeViewData");
        });
        tmp.action.set("add");

        var $form = tmp.$("#positionForm");
        formErrorClear($form);
        tmp.$("#positionForm :input[name]").each(function () {
            $(this).val("");
        });
        tmp.$("#positionModal").modal({'show': true, 'backdrop': "static"});
    },

    //单击编辑
    "click #editPosition": function (evt, tmp) {
        evt.preventDefault();

        var id = this.id;
        var posInfo = [];
        posInfo.id = id;
        posInfo.name = this.name;
        posInfo.description = this.description;
        tmp.posInfo.set(posInfo);
        tmp.action.set("edit");

        Meteor.call("doPost", "role/queryRoleMenuCodes", {id: id}, function (err, result) {
            var resGot = doProcess(err, result);
            if (resGot) {
                var checkedData = resGot.data;
                var checkedCode = checkedData.split(",");
                checkedCode.push("orgPersonalCenter");
                queryManagerMenus(function (err, rightsData) {
                    rightsConfigure(tmp, rightsData, checkedCode, "treeViewData");
                });

                var $form = tmp.$("#positionForm");
                formErrorClear($form);
                tmp.$("#positionModal").modal({'show': true, 'backdrop': "static"});
            }
        });
    },

    //单击确定
    "click #confirmBtn": function (evt, tmp) {
        evt.preventDefault();

        var action = tmp.action.get();
        var posInfo = tmp.posInfo.get();
        var id = posInfo ? posInfo.id : "";
        var $form = tmp.$("#positionForm");
        var $checkIcon = tmp.$("#treeViewData").find("span.check-icon");
        $form.validator("validate");
        if (formHasError($form)) {
            return;
        }
        if($form.find("textarea").val().trim() == ""){
            $form.find("textarea").parents(".form-group").addClass("has-error");
            return;
        }

        var text = {};
        tmp.$("#positionForm :input[name]").each(function () {
            var name = $(this).attr("name");
            var value = $(this).val().trim();
            text[name] = value;
        });
        var checkedData = tmp.$('#treeViewData').data('treeview').getChecked();
        var codes = [];
        for (var i in checkedData) {
            var code = checkedData[i].code;
            codes.push(code);
        }
        var checkedCodeStr = codes.join(",");
        var params = _.extend(text, {codes: checkedCodeStr});

        if (!$checkIcon.hasClass("glyphicon-check")) {
            sAlert.error({sAlertIcon: 'warning', message: "您未设置权限！"});
        } else {

            var url = (action == "add") ? "role/addRole" : "role/modifyRole";
            params = (action == "add") ? params : _.extend(params, {id: id});
            Meteor.call("doPost", url, params, function (err, result) {
                var resGot = doProcess(err, result);
                if (resGot) {
                    $("#positionModal").modal("hide");
                    sAlert.success({
                        sAlertIcon: 'check',
                        message: (action == "add") ? "新增成功！" : "修改成功！"
                    });
                    queryRoleList(tmp);
                }
            });
        }
    },

    //单击删除
    "click #deletePosition": function (evt, tmp) {
        evt.preventDefault();

        var params = {
            id: this.id,
            name: this.name
        };
        bootbox.confirm({
            message: '确定删除' + this.name + '职位？',
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
                    Meteor.call("doPost", "role/deleteRole", params, function (err, result) {
                        var resGot = doProcess(err, result);
                        if (resGot) {
                            sAlert.success({sAlertIcon: 'check', message: "删除成功！"});
                            queryRoleList(tmp);
                        }
                    });
                }
            }
        });
    }
});

// ------------------------------------------------------------
// Functions
// ------------------------------------------------------------

//查询人员菜单
function queryManagerMenus(cb){
    Meteor.call('doPost', 'role/queryEnableManagerMenuCodes', {}, function (err, result) {
        var resGot = doProcess(err, result);
        if (resGot) {
            var data = resGot.data.split(",");
            var menusData = [];
            var rightsData = getMenuData(menusData, PMENUS, data);
            cb(null, rightsData);
        }
    });
}

//过滤菜单全集
function getMenuData(rightsData, allMenus, partData){
    for (var i in allMenus) {
        var data = {};
        for (var j in partData) {
            var menu = allMenus[i];
            if (partData[j] == menu.code) {
                data.name = menu.name;
                data.code = menu.code;
            }
        }
        if (menu.children) {
            data.children = [];
            getMenuData(data.children, menu.children, partData);
        }
        rightsData.push(data);
    }

    return rightsData;
}

//列表查询
function queryRoleList(tmp) {
    Meteor.call('doPost', 'role/queryRoleList', {}, function (err, result) {
        var resGot = doProcess(err, result);
        if (resGot) {
            var data = resGot.data;
            queryRightsId(data, function (err, id) {
                Meteor.call('doPost', 'role/queryRoleMenuCodes', {id: id}, function (err, result) {
                    var resGot = doProcess(err, result);
                    if (resGot) {
                        var currentRights = resGot.data;
                        var checkedCode = currentRights.split(",");
                        var checkedData = [];
                        var menus = PMENUS;
                        for(var i in checkedCode) {
                            for (var j in menus) {
                                var childrenData = menus[j].children;
                                if (childrenData) {
                                    for (var k in childrenData) {
                                        if (childrenData[k].code == checkedCode[i]) {
                                            checkedData.push(childrenData[k].name);
                                        }
                                    }
                                }else if (menus[j].code == checkedCode[i]) {
                                    checkedData.push(menus[j].name);
                                }

                                for (var j in data) {
                                    if (data[j].id == id) {
                                        data[j].right = checkedData.join("，");
                                    }
                                }
                            }
                        }
                        tmp.orgPosList.set(data);
                    }
                });
            });
        }
    });
}

//权限id查询
function queryRightsId(data, cb){
    if(data){
        for(var i in data){
            var currentId = data[i].id;
            cb(null, currentId);
        }
    }
}

