var orgApproval = {
  settings: {
    pageSize: 20
  },
  getApprovalList:function (pageNum, params, tmp) {
    var self = this;
    var p = _.extend({}, self.settings, {
      pageNum: pageNum || 1
    });

    p = _.extend(p, params);

    Meteor.call('doPost', 'approve/list', p, function (err, result) {
      var resGot = doProcess(err, result);
      if (resGot) {
        tmp.approves.set(resGot.data);
      }
    });
  }
};

Template.orgApproval.helpers({
  //产品信息
  getProList: function () {
    return Template.instance().productList.get();
  },

  approves: function () {
    return Template.instance().approves.get();
  },

  //审批记录
  approvalRecord: function () {
    return Template.instance().approvalRecord.get();
  },

  identityVerifiedText: function (identityVerified) {
      return identityVerified === 1 ? '已核身' : '未核身';
  }
});

Template.orgApproval.onCreated(function () {
  //产品下拉框信息
  this.productList = new ReactiveVar();

  //存储过滤条件
  this.parameter = new ReactiveVar();

  this.approves = new ReactiveVar();

  //审批记录
  this.approvalRecord = new ReactiveVar();
});

Template.orgApproval.onRendered(function () {
  var tmp = Template.instance();

  //查询产品信息
  queryProList(function (err, proData) {
    tmp.productList.set(proData);
  });

  orgApproval.getApprovalList(null, {}, tmp);

  Meteor.defer(function () {
    tmp.$('.datepicker').datepicker({language: 'zh-CN'});
  });
});

Template.orgApproval.events({

  'click #search': function (evt, tmp) {
    evt.preventDefault();

    var params = {};
    $('#queryForm :input[name]').each(function () {
      var name = $(this).attr("name");
      var rawVal = $(this).val();
      if(rawVal != null){
        var val = rawVal.trim();
        if (val != "" && val != -1) {
          if (name === 'startTime') {
            val = moment(val).startOf('day').format();
          }
          if (name === 'endTime') {
            val = moment(val).endOf('day').format();
          }
          params[name] = val;
        }
      }
    });

    tmp.parameter.set(params);
    orgApproval.getApprovalList(null, params, tmp);
  },

  /* Pagination: Register an event handler to every page changers */
  'click [data-role="pagination"] a': function (e, tmp) {
    var newPageNum = parseInt($(e.currentTarget).attr('data-page'));
    if (newPageNum > 0) {
      orgApproval.getApprovalList(newPageNum, tmp.parameter.get(), tmp);
    }
  },

  //审批
  'click .approvalBtn': function (evt) {
    evt.preventDefault();
    var accountFlag = Session.get("accountFlag");
    Router.go("approvalDetail", {
          loanAppUuid: this.loanAppUuid,
          accountFlag: accountFlag
        }
    );
  },

  //审批记录
  'click .showAuditLog': function (evt, tmp) {
    evt.preventDefault();
    Meteor.call('doPost', 'approve/auditlog', {loanAppUuid: this.loanAppUuid}, function (err, result) {
      var resGot = doProcess(err, result);
      if (resGot) {
        tmp.approvalRecord.set(resGot.data);
        tmp.$("#approvalRecord").modal({'show': true, 'backdrop': "static"});
      }
    });
  }
});

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
