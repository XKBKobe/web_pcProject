var orgSubBank = {

    getPageNumber: new ReactiveVar(),

    settings: {
        pageSize: 20
    },

    getOrgDropdown: function (tmp) {
        Meteor.call('doPost', 'org/dropdownList', {}, function (err, result) {
            var resGot = doProcess(err, result);
            if (resGot) {
                var data = resGot.data;
                tmp.orgDropdown.set(data);
            }
        });
    },

    //获得下属机构列表数据
    getOrgSubBankList:function (pageNum, params, tmp) {
        var self = this;
        var p = _.extend({}, self.settings, {
            pageNum: pageNum || 1
        });

        p = _.extend(p, params);

        Meteor.call('doPost', 'org/list', p, function (err, result) {
            var resGot = doProcess(err, result);
            if (resGot) {
                var data = resGot.data;
                orgSubBank.getPageNumber.set(pageNum);
                tmp.orgSubBankList.set(data);
            }
        });
    }
};


Template.orgSubBank.onCreated(function () {
    //存储过滤条件
    this.parameter = new ReactiveVar();

    //下属银行列表数据
    this.orgSubBankList = new ReactiveVar();

    this.orgDropdown = new ReactiveVar();
});

Template.orgSubBank.onRendered(function () {
    var tmp = Template.instance();
    Meteor.defer(function () {
        tmp.$('.datepicker').datepicker({language: 'zh-CN'});
    });
    orgSubBank.getOrgSubBankList(null, {}, tmp);
    orgSubBank.getOrgDropdown(tmp);
});

Template.orgSubBank.helpers({
    //获得本行列表数据
    getOrgSubBankList: function () {
        return Template.instance().orgSubBankList.get();
    },
    getOrgDropdown: function () {
        return Template.instance().orgDropdown.get();
    }
});

Template.orgSubBank.events({
    //检索
    "click #orgSubBankSearch": function(evt, tmp){
        evt.preventDefault();

        var params = {};
        $('#formData :input[name]').each(function () {
            var name = $(this).attr("name");
            var rawVal = $(this).val();
            if(rawVal != null){
                var val = rawVal.trim();
                if (val != "" && val != -1) {
                    if (name === 'startCreateTime') {
                        val = moment(val).startOf('day').format();
                    }
                    if (name === 'endCreateTime') {
                        val = moment(val).endOf('day').format();
                    }
                    params[name] = val;
                }
            }
        });

        tmp.parameter.set(params);
        orgSubBank.getOrgSubBankList(null, params, tmp);
    },

    //分页
    'click [data-role="pagination"] a': function (e, tmp) {
        var newPageNum = parseInt($(e.currentTarget).attr('data-page'));
        if (newPageNum > 0) {
            orgSubBank.getPageNumber.set(newPageNum);
            orgSubBank.getOrgSubBankList(newPageNum, tmp.parameter.get(), tmp);
        }
    },

    //创建机构
    "click #createOrg": function(evt, tmp){
        evt.preventDefault();
        Router.go("orgSubDetail", {
            innerCode: "new"
        });
    },

    "click .orgDetail": function (evt, tmp) {
        evt.preventDefault();
        Router.go("orgSubDetail", {
            innerCode: this.innerCode
        });
    },


    "click .orgDelete": function (evt, tmp) {
        evt.preventDefault();
        var innerCode = this.innerCode;
        bootbox.confirm({
            message: '确定要删除？',
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
                    Meteor.call('doPost', 'org/delete', {innerCode: innerCode, orgCode: Session.get('orgCode')}, function (err, result) {
                        var resGot = doProcess(err, result);
                        if (resGot) {
                            orgSubBank.getOrgSubBankList(null, tmp.parameter.get(), tmp);
                            orgSubBank.getOrgDropdown(tmp);
                            sAlert.success({sAlertIcon: 'check', message: "删除成功！"});
                        }
                    });
                }
            }
        });
    }
});
