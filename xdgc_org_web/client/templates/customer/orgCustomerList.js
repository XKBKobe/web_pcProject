/**
 * Created by Administrator on 2016/2/18.
 */

var orgCustomerList = {
  settings: {
    pageSize: 20
  },
  getCustomersInfo: function (pageNumber, params, tmp) {
    var self = this;
    var p = _.extend({}, self.settings, {
      pageNum: pageNumber || 1
    });

    params = _.extend(p, params);

    Meteor.call("doPost", "customer/list", params, function (err, result) {
      var resGot = doProcess(err, result);
      if (resGot) {
        var customersInfo = resGot.data;
        tmp.customers.set(customersInfo);
      }
    });
  }
};


Template.orgCustomerList.helpers({

  //菜单列表信息获取
  customers: function () {
    return Template.instance().customers.get();
  }


});

Template.orgCustomerList.onCreated(function () {
  //存储过滤条件
  this.parameter = new ReactiveVar();

  //客户列表信息对象：
  this.customers = new ReactiveVar();

});

Template.orgCustomerList.onRendered(function () {

  var tmp = Template.instance();

  // 初始化数据
  var loanFlag = tmp.$("[name=loanFlag]").val();
  orgCustomerList.getCustomersInfo(null, {loanFlag: loanFlag}, tmp);

  Meteor.defer(function () {
    tmp.$('.datepicker').datepicker({language: 'zh-CN'});
  });

});

Template.orgCustomerList.events({

  //单击筛选按钮：
  "click #searchCustomer": function (evt, tmp) {
    evt.preventDefault();

    var json = {};
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
          json[name] = val;
        }
      }

    });
    tmp.parameter.set(json);

    orgCustomerList.getCustomersInfo(null, json, tmp);
  },

  /* Pagination: Register an event handler to every page changers */
  'click [data-role="pagination"] a': function (e, tmp) {
    var newPageNum = parseInt($(e.currentTarget).attr('data-page'));
    if (newPageNum > 0) {
      orgCustomerList.getCustomersInfo(newPageNum, tmp.parameter.get(), tmp);
    }
  }

});
