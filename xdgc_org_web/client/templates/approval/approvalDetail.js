

Template.approvalDetail.helpers({

  loanAppUuid: function () {
    return Template.instance().loanAppUuid.get();
  },

  personInfo: function () {
    return Template.instance().personInfo.get();
  },

  proofmat: function () {
    return Template.instance().proofmat.get();
  },

  property: function () {
    return Template.instance().property.get();
  },

  loan: function () {
    return Template.instance().loan.get();
  },

  isCanApprocal: function (applyStatus) {
    if(applyStatus=="ORG_APPLY"||applyStatus=="REPLENISH_DATUM"||applyStatus=="FOLLOW_PASS"||applyStatus=="FIRST_TRIAL_PASS"){
      return true;
    }else{
      return false;
    }
  },

  accountFlag: function () {
    return Template.instance().accountFlag.get();
  }

});

Template.approvalDetail.onCreated(function () {

  this.loanAppUuid = new ReactiveVar();

  this.personInfo = new ReactiveVar();

  this.proofmat = new ReactiveVar();

  this.loan = new ReactiveVar();

  this.property = new ReactiveVar();

  this.accountFlag = new ReactiveVar();

});

Template.approvalDetail.onRendered(function () {

  var tmp = Template.instance();
  var self = this;
  var loanAppUuid = self.data.query.loanAppUuid; //传递过来的loanAppUuid
  var accountFlag = self.data.query.accountFlag;

  tmp.loanAppUuid.set(loanAppUuid);
  tmp.accountFlag.set(accountFlag);

  //获取人信息：
  Meteor.call('doPost', 'customer/details', {"loanAppUuid": loanAppUuid}, function (err, result) {
    var resGot = doProcess(err, result);
    if (resGot) {
      tmp.personInfo.set(resGot.data);
    }
  });

  //贷款信息：
  Meteor.call('doPost', 'approve/details', {"loanAppUuid": loanAppUuid}, function (err, result) {
    var resGot = doProcess(err, result);
    if (resGot) {
      tmp.loan.set(resGot.data);
    }
  });

  //证件信息：
  Meteor.call('doPost', 'approve/pml', {"loanAppUuid": loanAppUuid}, function (err, result) {
    var resGot = doProcess(err, result);
    if (resGot) {
      var proofmat = resGot.data;
      if(proofmat){
        for (var i = 0; i < proofmat.length;) {
            proofmat[i].index = ++i;
        }
      }
      tmp.proofmat.set(proofmat);
    }
  });

  //数据源信息：
  Meteor.call('doPost', 'property/list', {'loanAppUuid': loanAppUuid, 'flag': Session.get('accountFlag')}, function (err, result) {
    //添加额外属性
    var _addAttr = function (ps) {
      var _setting = {
        ALIPAY: {
          btns:[{
            text: '下载流水',
            params: ['propertyUuid'],
            url: '/property/download',
            test: {
              notEmpty: ['fileUrl']
            }
          }, {
            text: '下载分析报告',
            url: '/approve/dlar',
            params: ['propertyUuid'],
            test: {
              true: ['flag']
            },
            disabledClass: 'alipay-report-download-disabled'
          }]
        },
        _default: {
          btns:[{
            text: '下载流水',
            url: '/property/download',
            params: ['propertyUuid'],
            test: {
              notEmpty: ['fileUrl']
            }
          }]
        }
      };
      function _doTest(test, obj) {
        return !test || (_testTrue(test.true, obj) && _testNotEmpty(test.notEmpty, obj));
      }
      function _testTrue(property, obj) {
        if (property) {
          var _result = true;
          for (var i = 0; i < property.length; i++) {
            _result = _result && obj[property[i]];
          }
          return _result;
        }
        return true;
      }
      function _testNotEmpty(property, obj) {
        if (property) {
          for (var i = 0; i < property.length; i++) {
            if (!obj[property[i]]) {
              return false;
            }
          }
        }
        return true;
      }
      function _geneUrl(url, params, obj) {
        var _result = '#';
        if (url && obj) {
          _result = '/property/download?url=' + url + '&loanAppUuid=' + tmp.loanAppUuid.get() + '&token=' + Meteor.user().profile.token + '&flag=' + Session.get('accountFlag');
          if (params) {
            for (var i = 0; i < params.length; i++) {
              _result += '&' + params[i] + '=' + obj[params[i]];
            }
          }
        }
        return _result;
      }
      function _geneATag(btns, obj) {
        var _result = '';
        if (btns) {
          for (var i = 0; i < btns.length; i++) {
            var _btn = btns[i];
            var _disabled = !_doTest(_btn.test, obj);
            var _disabledClass = _btn.disabledClass || 'property-download-disabled';
            _result += '<a href="';
            _result += _geneUrl(_btn.url, _btn.params, obj);
            _result += '" class="btn btn-sm ';
            _result += _disabled ? 'btn-default ' + _disabledClass : 'btn-success btn-random-url';
            _result += '">';
            _result += _btn.text;
            _result += '</a>\n';
          }
        }
        return _result;
      }
      if (ps) {
        for (var _preFirst, _index = 0, i = 0; i < ps.length; i++) {
          var __p = ps[i];
          var __setting = _setting[__p.propertyType] || _setting['_default'];
          __p.isZip = __setting.isZip;
          __p.btns = _geneATag(__setting.btns, __p);
          if (_preFirst && _preFirst.propertyType === __p.propertyType) {
            _preFirst.rowspan++;
          } else {
            _preFirst = __p;
            _preFirst.index= ++_index;
            _preFirst.rowspan = 1;
          }
        }
      }
    };
    var resGot = doProcess(err, result);
    if (resGot) {
      var property = resGot.data;
      _addAttr(property);
      tmp.property.set(property);
    }
  });


});

Template.approvalDetail.events({

  /**
   * 图片预览
   * @param evt
   */
  'click .gallery-zoom': function (evt,tmp) {
    evt.preventDefault();
    //Colorbox
    tmp.$('.gallery-zoom').colorbox({
      rel:'gallery',
      maxWidth: '90%',
      width: '800px',
      photo:true,
      current: false
    });
  },

  /**
   * 个人基本信息下载
   * @param evt
   */
  'click #downLoadPersonInfoBtn': function (evt,tmp) {
    var token = Meteor.user().profile.token;
    var loanAppUuid = tmp.loanAppUuid.get();//贷款uuid
    var url = Meteor.randomUtils.geneUrl('/approve/dlc?token=' + token + '&loanAppUuid=' + loanAppUuid);
    $(evt.currentTarget).attr('href', url);
    return true;
  },

  /**
   * 证件信息下载
   * @param evt
   */
  'click #downLoadProofmatBtn': function (evt,tmp) {
    var token = Meteor.user().profile.token;
    var loanAppUuid = tmp.loanAppUuid.get();//贷款uuid
    var status = tmp.$("#downLoadProofmatBtn").attr("disabled");
    var url = (status == 'disabled') ? '#' : Meteor.randomUtils.geneUrl('/approve/dlpm?token=' + token + '&loanAppUuid=' + loanAppUuid);
    $(evt.currentTarget).attr('href', url);
    return true;
  },

  'click .btn-random-url': function (evt, tmp) {
    var url = Meteor.randomUtils.geneUrl($(evt.currentTarget).attr('href'));
    $(evt.currentTarget).attr('href', url);
    return true;
  },

  /**
   * 数据源不可下载提示
   * @param evt
   */
  'click .property-download-disabled': function (evt, tmp) {
    evt.preventDefault();
    bootbox.alert({
      buttons: {
        ok: {
          label: '<i class="fa fa-reply"></i> 取消',
          className: 'btn btn-sm btn-danger'
        }
      },
      message: '暂无数据。数据正在抓取或无该项流水数据，请稍候再试！'
    });
  },


  /**
   * 分析报告不可下载提示
   * @param evt
   */
  'click .alipay-report-download-disabled': function (evt, tmp) {
    evt.preventDefault();
    bootbox.alert({
      buttons: {
        ok: {
          label: '<i class="fa fa-reply"></i> 取消',
          className: 'btn btn-sm btn-danger'
        }
      },
      message: '分析报告不可下载！'
    });
  },


  /**
   * 审批按钮
   * @param evt
   */
  'click #approvalBtn': function (evt,tmp) {
    evt.preventDefault();
    var loanAppUuid = tmp.loanAppUuid.get();//贷款uuid
    var loan = tmp.loan.get();//贷款信息
    var applyStatus = loan.applyStatus;
    var actionOptionHtml = '';
    if(applyStatus=="ORG_APPLY"){//机构审批
      actionOptionHtml = '<option value="FIRST_TRIAL_PASS">预审通过</option><option value="FIRST_TRIAL_REJECT">预审拒绝</option><option value="FOLLOW_PASS">协商跟进</option><option value="REPLENISH_DATUM">资料待补充</option><option value="ACCOUNT_WAIVE">客户放弃</option>';
    }else if(applyStatus=="REPLENISH_DATUM"){//资料待补充
      actionOptionHtml = '<option value="FIRST_TRIAL_PASS">预审通过</option><option value="FIRST_TRIAL_REJECT">预审拒绝</option><option value="FOLLOW_PASS">协商跟进</option><option value="ACCOUNT_WAIVE">客户放弃</option>';
    }else if(applyStatus=="FOLLOW_PASS"){//协商跟进
      actionOptionHtml = '<option value="FIRST_TRIAL_PASS">预审通过</option><option value="FIRST_TRIAL_REJECT">预审拒绝</option><option value="REPLENISH_DATUM">资料待补充</option><option value="ACCOUNT_WAIVE">客户放弃</option>';
    }else if(applyStatus=="FIRST_TRIAL_PASS"){//预审通过
      actionOptionHtml = '<option value="FINAL_JUDGMENT_PASS">终审通过</option><option value="FINAL_JUDGMENT_REJECT">终审拒绝</option><option value="ACCOUNT_WAIVE">客户放弃</option>';
    }

    var option = {};
    option.html = '<div class="row m-top-sm">  ' +
      '<div class="col-md-12"> ' +
      '<form class="form-horizontal"> ' +

      '<div class="form-group"> ' +
      '<label class="col-md-3 control-label" for="name">审批结果</label> ' +
      '<div class="col-md-4"> ' +
      '<select class="form-control input" name="action" id="action">' +
        actionOptionHtml+
      '</select></div> </div>' +

      '<div class="form-group" id="evaluateAmountDiv" style="display:none;"> ' +
      '<label class="col-md-3 control-label" for="name">授信额度（万）</label> ' +
      '<div class="col-md-7"> ' +
      '<input type="number" id="evaluateAmount" min="0" name="evaluateAmount" placeholder="授信额度（万）" class="form-control"></input>'+
      '</div><span class="col-md-1" style="margin-top: 5px;margin-left: -20px;">万</span></div>' +

      '<div class="form-group"> ' +
      '<label class="col-md-3 control-label" for="name">审批意见</label> ' +
      '<div class="col-md-8"> ' +
      '<textarea id="auditIdea" name="auditIdea" placeholder="审批意见" class="form-control" rows="3"></textarea>'+
      '</div> </div>' +

      '</form> </div> </div>';

    bootbox.dialog({
        title: "审批",
        message: option.html,
        buttons: {
          danger: {
            label: "<i class='fa fa-reply'></i> 取消",
            className: "btn btn-sm btn-danger",
            callback: function () {
            }
          },
          success: {
            label: "<i class='fa fa-check'></i> 确定",
            className: "btn-sm btn-success",
            callback: function (evt) {
              var auditIdea = $('#auditIdea').val();
              auditIdea = xdgc.utils.trimString(auditIdea);
              var applyStatus = $('#action').val();
              var approvedAmount = $("#evaluateAmount").val();
              var params = {
                "loanAppUuid": loanAppUuid,
                "auditIdea": auditIdea,
                "applyStatus": applyStatus,
                "approvedAmount": approvedAmount
              };

              if($("#evaluateAmountDiv").is(":visible") && (!approvedAmount || approvedAmount <= 0 || approvedAmount > 10000)){
                sAlert.error({sAlertIcon: 'warning', message: "请输入正确的授信额度！额度需大于0万，小于10000万"});
                return false;
              }

              if(!auditIdea){
                sAlert.error({sAlertIcon: 'warning', message: "请输入审批意见！"});
                return false;
              }

              var pushInfo = Session.get("pushInfo");
              params = _.extend(params, pushInfo);

              //审批操作：
              Meteor.call('doPost', 'approve/approveex', params, function (err, result) {
                var resGot = doProcess(err, result);
                if (resGot) {
                  sAlert.success({sAlertIcon: 'check', message: "审批操作成功！"});
                  //贷款信息：
                  Meteor.call('doPost', 'approve/details', {"loanAppUuid": loanAppUuid}, function (err, result) {
                    var resGot = doProcess(err, result);
                    if (resGot) {
                      tmp.loan.set(resGot.data);
                    }
                  });

                  setTimeout(function () {
                    Router.go("orgApproval");
                  }, 1500);
                }
              });
            }
          }
        }
      }
    );

    //授信额度是否输入
    var action = $('#action').val();
    if(action=='FIRST_TRIAL_PASS'||action=='FINAL_JUDGMENT_PASS'){
      $("#evaluateAmountDiv").show();
    }else{
      $("#evaluateAmountDiv").hide();
      $("#evaluateAmount").val("");
    }

    $("#action").on("change",function(evt){
      var action = $('#action').val();
      if(action=='FIRST_TRIAL_PASS'||action=='FINAL_JUDGMENT_PASS'){
        $("#evaluateAmountDiv").show();
      }else{
        $("#evaluateAmountDiv").hide();
        $("#evaluateAmount").val("");
      }
    });

  }
});
