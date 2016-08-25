var orgAgent = {

    getPageNumber: new ReactiveVar(),

    settings: {
        pageSize: 20
    },

    //获得本行列表数据
    getOrgAgentList:function (pageNum, params, tmp) {
        var self = this;
        var p = _.extend({}, self.settings, {
            pageNum: pageNum || 1
        });

        p = _.extend(p, params);

        Meteor.call('doPost', 'cmanager/cmlist', p, function (err, result) {
            var resGot = doProcess(err, result);
            if (resGot) {
                var data = resGot.data;

                if(data && data.list){
                    _.map(data.list, function (v) {
                        if(v.pngUrl){
                            Meteor.call('fileSign', v.pngUrl, function (err, result) {
                                v.pngUrl = result;
                                tmp.orgAgentList.set(data);
                            });
                        }
                    });
                }
                orgAgent.getPageNumber.set(data.pageNum);
                tmp.orgAgentList.set(data);
            }
        });
    }
};

Template.orgAgent.onCreated(function(){
    //查询职位
    this.posList = new ReactiveVar();

    //存储过滤条件
    this.parameter = new ReactiveVar();

    //本行客户经理列表数据
    this.orgAgentList = new ReactiveVar();

    //当前条记录数据
    this.currentData = new ReactiveVar();

    //存储角色对应的权限
    this.rights = new ReactiveVar();
});

Template.orgAgent.onRendered(function(){
    var tmp = Template.instance();

    Meteor.defer(function () {
        tmp.$(".agent-select").chosen();
        tmp.$('.datepicker').datepicker({language: 'zh-CN'});
    });

    //职位查询
    queryRoleList(function (err, data) {
        tmp.posList.set(data)
    });

    orgAgent.getOrgAgentList(null, {}, tmp);
});

Template.orgAgent.helpers({
    //职位查询
    getPosList: function () {
        return Template.instance().posList.get();
    },

    //获得本行列表数据
    getOrgAgentList: function () {
        return Template.instance().orgAgentList.get();
    },

    //当前条记录数据
    getCurrentData: function () {
        return Template.instance().currentData.get();
    },

    //查询角色对应的权限
    getRights: function () {
        return Template.instance().rights.get();
    },

    //有职位配置权限
    isDisabled: function () {
        var rights = Session.get("myMenus");
        return (rights.indexOf("orgPosition") == -1) ? "disabled" : "";
    }
});

Template.orgAgent.events({
    //检索
    "click #orgAgentSearch": function(evt, tmp, pageNum){
        evt.preventDefault();

        var params = {};
        $('#formData :input[name]').each(function () {
            var name = $(this).attr("name");
            var value = $(this).val();
            if(value != null){
                var val = value.trim();
                if (val != "" && val != -1) {
                    params[name] = val;
                }
            }
        });

        tmp.parameter.set(params);
        orgAgent.getOrgAgentList(pageNum, params, tmp);
    },

    //分页
    'click [data-role="pagination"] a': function (e, tmp) {
        var newPageNum = parseInt($(e.currentTarget).attr('data-page'));
        if (newPageNum > 0) {
            orgAgent.getPageNumber.set(newPageNum);
            orgAgent.getOrgAgentList(newPageNum, tmp.parameter.get(), tmp);
        }
    },

    //图片预览
    'click .gallery-zoom': function (evt,tmp) {
        evt.preventDefault();
        tmp.$('.gallery-zoom').colorbox({
            rel:'gallery',
            maxWidth: '90%',
            width: '800px',
            photo:true,
            current: false
        });
    },

    //删除
    "click .deleteBtn": function (evt, tmp) {
        evt.preventDefault();

        var partyUuid = this.partyUuid;
        bootbox.confirm({
            message: '确定删除客户经理' + this.name + '？',
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
            callback: function(result) {
                if(result) {
                    Meteor.call("doPost", "cmanager/delete", {partyUuid: partyUuid, orgCode: Session.get('orgCode')}, function (err, result) {
                        var resGot = doProcess(err, result);
                        if (resGot) {
                            var pageNum = orgAgent.getPageNumber.get();
                            $("#orgAgentSearch").trigger('click', pageNum);
                            sAlert.success({sAlertIcon: 'check', message: "删除成功！"});
                        }
                    });
                }
            }
        });
    },

    //新增
    "click #addAgent": function (evt, tmp) {
        evt.preventDefault();

        var $form = tmp.$("#addUserForm");
        formErrorClear($form);
        tmp.currentData.set(null);
        tmp.$("#addUserForm input[name]").each(function () {
            $(this).val("");
        });
        /*v2.1-var $select = tmp.$("#addUserForm select[name=roleId]");
        if($select.attr("disabled") === undefined){
            $select.val("");
        }*/
        tmp.$("#agentModalID").modal({'show': true, 'backdrop': "static"});
    },

    //新增保存
    "click #addBtn": function (evt, tmp) {
        evt.preventDefault();
        var $form = tmp.$("#addUserForm");
        $form.validator("validate");
        if (formHasError($form)) {
            return;
        }

        var account = tmp.$("#addUserForm input[name=account]");
        if(XDGC.helpers.regexps["mobile"].test(account.val())){
            sAlert.error({sAlertIcon: 'warning', message: "账号请勿用手机号码注册！"});
            return;
        }
        /*v2.1-if(!tmp.$('#addUserForm select[name=roleId]').val()){
            sAlert.error({sAlertIcon: 'warning', message: "请选择职位！"});
            return;
        }*/

        var orgCode = Session.get("orgCode");
        var roleName = tmp.$('#addUserForm select[name=roleId] option:checked').text();
        var json = {};
        $('#addUserForm :input[name]').each(function () {
            var name = $(this).attr("name");
            var val = $(this).val().trim();
            json[name] = val;
        });

        var params = _.extend(json, {orgCode: orgCode, roleName: roleName});
        Meteor.call('doPost', 'cmanager/create', params, function (err, result) {
            var resGot = doProcess(err, result);
            if (resGot) {
                //sAlert.success({sAlertIcon: 'check', message: '新增成功！'});
                var pageNum = orgAgent.getPageNumber.get();
                $("#orgAgentSearch").trigger('click', pageNum);
                $("#agentModalID").modal("hide");
                bootbox.alert('新增成功！推荐码为[' + resGot.data + ']');
                var _roleId = tmp.$('#addUserForm select[name=roleId]').val();
                $("#addUserForm").get(0).reset();
                tmp.$('#addUserForm select[name=roleId]').val(_roleId);
            }
        });
    },

    //编辑
    "click .editBtn": function (evt, tmp) {
        evt.preventDefault();

        tmp.currentData.set(null);
        tmp.rights.set(null);
        Meteor.call('doPost', 'cmanager/details', {partyUuid: this.partyUuid}, function (err, result) {
            var resGot = doProcess(err, result);
            if (resGot) {
                var data = resGot.data;
                tmp.currentData.set(data);
                if(data.roleId){
                    queryRights(data.roleId, function (err, rightsData) {
                        tmp.rights.set(rightsData);
                        tmp.$("#editAgentInfo").modal({'show':true,'backdrop':"static"});
                    });
                }else{
                    tmp.$("#editAgentInfo").modal({'show':true,'backdrop':"static"});
                }
            }
        });
    },

    //恢复默认密码
    "click #resetPwd": function (evt) {
        var partyUuid = $(evt.target).attr("data-uuid");
        var orgCode = Session.get("orgCode");
        var params = {
            partyUuid: partyUuid,
            orgCode: orgCode
        };
        Meteor.call('doPost', 'system/resetPasswd', params, function (err, result) {
            var resGot = doProcess(err, result);
            if (resGot) {
                $("#editAgentInfo").modal("hide");
                sAlert.success({sAlertIcon: 'check', message: "恢复系统默认密码成功！"});
            }
        });
    },

    //选择角色查相应权限
    "change select[name=addRoleId]": function (evt, tmp) {
        var roleId = tmp.$("select[name=addRoleId] option:checked").val();
        if(roleId){
            queryRights(roleId, function (err, data) {
                tmp.rights.set(data);
            });
        }else{
            tmp.rights.set(null);
        }
    },

    //保存编辑信息
    "click #saveRoleInfo": function (evt, tmp) {
        evt.preventDefault();

        var partyUuid = $(evt.target).attr("data-uuid");
        var $selected = tmp.$("select[name=addRoleId] option:checked");
        var roleId = $selected.val();
        var roleName = $selected.text();

        var params = {
            partyUuid: partyUuid,
            roleName: roleName,
            roleId: roleId
        };

        Meteor.call('doPost', 'cmanager/modify', params, function (err, result) {
            var resGot = doProcess(err, result);
            if (resGot) {
                sAlert.success({sAlertIcon: 'check', message: "修改成功！"});
                var pageNum = orgAgent.getPageNumber.get();
                $("#orgAgentSearch").trigger('click', pageNum);
                $("#editAgentInfo").modal("hide");
            }
        });
    }
});

//职位查询
function queryRoleList(cb) {
    Meteor.call('doPost', 'role/queryRoleList', {}, function (err, result) {
        var resGot = doProcess(err, result);
        if (resGot) {
            cb(null, resGot.data);
        }
    });
}

//查询职位对应的权限
function queryRights(roleId, cb){
    Meteor.call('doPost', 'role/queryRoleMenuCodes', {id: roleId}, function (err, result) {
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
                }
            }
            cb(null, checkedData);
        }
    });
}
