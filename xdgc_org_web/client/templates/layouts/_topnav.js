
Template._topnav.onCreated(function () {

  this.orgData = new ReactiveVar();

});

Template._topnav.helpers({

  username: function () {
    return Session.get('username');
  },

  //机构定制数据
  orgData:function(){
    return Template.instance().orgData.get();
  }

});


Template._topnav.onRendered(function () {
  var tmp = Template.instance();
  var hostname = window.location.hostname;
  Meteor.call("getResources", hostname,
    function (respErr, result) {
      tmp.orgData.set(result);
    });

});

Template._topnav.events({
  //点击logo回到系统首页
  "click #topLogo": function (evt) {
    evt.preventDefault();
    var homeName = $("aside li:first").attr("id");
    Router.go(homeName);
  },

  //单击修改密码
  "click #updatePwdBtn": function (evt, tmp) {
    evt.preventDefault();
    tmp.$("#modifyPwdForm :input[name=password]").val("");
    tmp.$("#modifyPwdForm :input[name=newPassword]").val("");
    tmp.$("#modifyPwdForm :input[name=reNewPassword]").val("");
    tmp.$("#modifyPwd").modal({'show': true, 'backdrop': "static"});
  },

  //单击修改密码确认按钮
  "click #confirmBtn": function (evt, tmp) {
    evt.preventDefault();
    var $form = tmp.$('#modifyPwdForm');
    $form.validator("validate");
    if ($form.find('.has-error').length > 0) {
      return;
    }

    var formData = {};

    var password = tmp.$("#modifyPwdForm :input[name=password]").val().trim();
    if (password != null && password != "" && password != -1) {
      formData["password"] = XDGC.md5For16(password);
    }else{
      sAlert.error({sAlertIcon: 'warning', message: "请输入旧密码！"});
      return;
    }
    var newPassword = tmp.$("#modifyPwdForm :input[name=newPassword]").val().trim();
    if (newPassword != null && newPassword != "" && newPassword != -1) {
      formData["newPassword"] = XDGC.md5For16(newPassword);
    }else{
      sAlert.error({sAlertIcon: 'warning', message: "请输入新密码！"});
      return;
    }
    var reNewPassword = tmp.$("#modifyPwdForm :input[name=reNewPassword]").val().trim();
    if (reNewPassword != null && reNewPassword != "" && reNewPassword != -1) {
      formData["reNewPassword"] = XDGC.md5For16(reNewPassword);
    }else{
      sAlert.error({sAlertIcon: 'warning', message: "请再次输入新密码！"});
      return;
    }
    if(newPassword!=reNewPassword){
      sAlert.error({sAlertIcon: 'warning', message: "两次输入新密码不一致！"});
      return;
    }
    Meteor.call("doPost", "user/updatePwd", formData, function (err, result) {
      var resGot = doProcess(err, result);
      if (resGot) {
        sAlert.success({sAlertIcon: 'check', message: "修改密码成功！"});
        tmp.$("#modifyPwd").modal("hide");
      }
    });

  }
})
