var orgBank = {

    getPageNumber: new ReactiveVar(),

    settings: {
        pageSize: 20
    },

    //获得本行列表数据
    getOrgLoanList:function (pageNum, params, tmp) {
        var self = this;
        var p = _.extend({}, self.settings, {
            pageNum: pageNum || 1
        });

        p = _.extend(p, params);

        Meteor.call('doPost', 'loan/queryloan', p, function (err, result) {
            var resGot = doProcess(err, result);
            if (resGot) {
                tmp.orgLoanList.set(resGot.data);
            }
        });
    }
};

Template.orgBank.onCreated(function () {
    //产品下拉框信息
    this.productList = new ReactiveVar();

    //存储过滤条件
    this.parameter = new ReactiveVar();

    //客户经理下拉列表数据
    this.orgAgentList = new ReactiveVar();

    //本行贷款列表数据
    this.orgLoanList = new ReactiveVar();

    //所有客户经理信息
    this.agentsInfo = new ReactiveVar();

    //客户经理信息
    this.agentInfo = new ReactiveVar();

    //贷款Uuid
    this.loadAppUuid = new ReactiveVar();

    //审批记录
    this.approvalRecord = new ReactiveVar();

    //排序切换计数
    this.count = 0;
});

Template.orgBank.onRendered(function () {
    var tmp = Template.instance();

    Meteor.defer(function () {
        tmp.$('.datepicker').datepicker({language: 'zh-CN'});
    });

    //查询产品信息
    queryProList(function (err, proData) {
        tmp.productList.set(proData);
    });

    //查询客户经理数据
    queryAgentList(function (err, agentData) {
        tmp.orgAgentList.set(agentData);
        Meteor.defer(function () {
            tmp.$('.chosen-select').chosen();
        });
    });

    orgBank.getOrgLoanList(null, {}, tmp);
});

Template.orgBank.helpers({
    //产品信息
    getProList: function () {
        return Template.instance().productList.get();
    },

    //客户经理下拉列表数据
    getAgentData: function () {
        return Template.instance().orgAgentList.get();
    },

    //获得本行列表数据
    getOrgLoanList: function () {
        return Template.instance().orgLoanList.get();
    },

    //获得客户经理信息
    getAgentInfo: function () {
        return Template.instance().agentInfo.get();
    },

    //获得审批记录
    getApprovalRecord: function () {
        return Template.instance().approvalRecord.get();
    },

    //分配弹出框客户经理下拉框
    filterAgent: function (){
        return Template.instance().agentsInfo.get();
    },

    distributeClass: function (status) {
        status = status || '';
        switch (status) {
            case 'ACCOUNT_WAIVE':
            case 'FINAL_JUDGMENT_REJECT':
            case 'FINAL_JUDGMENT_PASS':
            case 'FIRST_TRIAL_REJECT':
            case 'AWAIT_SIGN_FINISH':
                return 'disabled';
            default: return '';
        }
    },

    identityVerifiedText: function (identityVerified) {
        return identityVerified === 1 ? '已核身' : '未核身';
    }

});

Template.orgBank.events({
    //检索
    "click #orgLoanSearch": function(evt, tmp, pageNum){
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

        orgBank.getOrgLoanList(pageNum, params, tmp);
    },

    //分页
    'click [data-role="pagination"] a': function (e, tmp) {
        var newPageNum = parseInt($(e.currentTarget).attr('data-page'));
        if (newPageNum > 0) {
            orgBank.getPageNumber.set(newPageNum);
            orgBank.getOrgLoanList(newPageNum, tmp.parameter.get(), tmp);
        }
    },

    //搜索客户经理
    "click #searchAgent": function (evt, tmp) {
        evt.preventDefault();
        var partyUuid = tmp.$("select[name=agentName]").val();
        var agentsData = tmp.agentsInfo.get();

        if(partyUuid) {
            for (var i in agentsData) {
                if (partyUuid == agentsData[i].partyUuid) {
                    var agentData = [];
                    agentData.push(agentsData[i]);
                    tmp.agentInfo.set(agentData);
                }
            }
        }else{
            tmp.agentInfo.set(agentsData);
        }
    },

    //分配量排序
    "click #distributeNumSorted": function (evt, tmp) {
        evt.preventDefault();
        sortData(evt, tmp, "sumLoanNumber");
    },

    //跟进量排序
    "click #trackNumSorted": function (evt, tmp) {
        evt.preventDefault();
        sortData(evt, tmp, "followLoanNumber");
    },

    //分配
    "click .distributeBtn": function (evt, tmp) {
        evt.preventDefault();
        var self = this;
        $(".sortBtn").find("i").removeClass("fa-long-arrow-up").addClass("fa-long-arrow-down");
        var loanAppUuid = this.loanAppUuid;
        tmp.loadAppUuid.set(loanAppUuid);
        Meteor.call('doPost', 'loan/querymloan', {}, function (err, result) {
            var resGot = doProcess(err, result);
            if (resGot) {
                var data = _.filter(resGot.data, function (e) {
                    return e.partyUuid !== self.cmangerPartyUuid;
                });
                tmp.agentInfo.set(data);
                tmp.agentsInfo.set(data);
                Meteor.defer(function () {
                    tmp.$('.chosen-select').chosen();
                });
                tmp.$("#distributeForm").get(0).reset();
                tmp.$("input[name=agentRadio]:checked").attr("checked",false);
                tmp.$("#distributeModal").modal({'show':true,'backdrop':"static"});
            }
        });
    },

    //确认分配
    "click #confirmBtn": function (evt, tmp) {
        evt.preventDefault();
        var partyUuid = tmp.$("input[name=agentRadio]:checked").attr("data-uuid");
        var loanAppUuid = tmp.loadAppUuid.get();
        var params = {
            loanAppUuid: loanAppUuid,
            partyUuid: partyUuid
        };

        if(partyUuid === undefined){
            sAlert.error({sAlertIcon: 'warning', message: "请选择客户经理！"});
        }else{
            Meteor.call('doPost', 'loan/allotmannger', params, function (err, result) {
                var resGot = doProcess(err, result);
                if (resGot) {
                    var pageNum = orgBank.getPageNumber.get();
                    $("#orgLoanSearch").trigger('click', pageNum);
                    $("#distributeModal").modal("hide");
                    sAlert.success({sAlertIcon: 'check', message: "分配成功！"});
                }
            });
        }
    },

    //审批记录
    'click .showAuditLog': function (evt, tmp) {
        evt.preventDefault();
        Meteor.call('doPost', 'approve/auditlog', {loanAppUuid: this.loanAppUuid}, function (err, result) {
            var resGot = doProcess(err, result);
            if (resGot) {
                tmp.approvalRecord.set(resGot.data);
                tmp.$("#approvalRecord").modal({'show':true,'backdrop':"static"});
            }
        });
    }

});

// ------------------------------------------------------------
// Functions
// ------------------------------------------------------------

//查询产品信息
function queryProList(cb){
    var flag = Session.get("accountFlag");
    Meteor.call("doPost", "product/queryprolist", {flag: flag}, function (err, result) {
        var resGot = doProcess(err, result);
        if (resGot) {
            var proData = resGot.data;
            cb(null, proData);
        }
    });
}

//查询客户经理下拉列表数据
function queryAgentList(cb) {
    Meteor.call("doPost", "loan/querymlist", {}, function (err, result) {
        var resGot = doProcess(err, result);
        if (resGot) {
            var agentData = resGot.data;
            cb(null, agentData);
        }
    });
}

//按分配量和跟进量排序
function sortData(evt, tmp, variable){
    tmp.count ++;
    var sortedData;
    var agentsData = tmp.agentsInfo.get();
    if(tmp.count == 1){
        $(evt.target).find("i").removeClass("fa-long-arrow-down").addClass("fa-long-arrow-up");
        sortedData = _.sortBy(agentsData, variable).reverse();
    }else{
        $(evt.target).find("i").removeClass("fa-long-arrow-up").addClass("fa-long-arrow-down");
        sortedData = _.sortBy(agentsData, variable);
        tmp.count = 0;
    }

    tmp.agentInfo.set(sortedData);
}
