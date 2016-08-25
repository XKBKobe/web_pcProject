var ERRORS_KEY = 'signinErrors';
Template.login.onCreated(function () {

  Session.set(ERRORS_KEY, {});

  this.orgData = new ReactiveVar();

});

Template.login.helpers({
  errorMessages: function () {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function (key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  },

  orgData:function(){
    return Template.instance().orgData.get();
  }
});

Template.login.onRendered(function () {
  var tmp = Template.instance();
  var hostname = window.location.hostname;
  Meteor.call("getResources", hostname,
    function (respErr, result) {
      Session.setPersistent('skinStyle', result.skinStyle);
      Session.setPersistent('pushInfo', result.pushInfo);
      Session.setPersistent('msgCode', result.msgCode);
      tmp.orgData.set(result);
    });
});

Template.login.events({
  'submit': function (event, template) {
    event.preventDefault();

    var username = template.$('[name=username]').val();
    var rawpassword = template.$('[name=password]').val();
    var orgCode = template.orgData.get().orgCode;
    var password = XDGC.md5For16(rawpassword);

    if(!username){
      sAlert.error({sAlertIcon: 'warning', message: '请输入用户名'});
      return;
    }

    if(!rawpassword){
      sAlert.error({sAlertIcon: 'warning', message: '请输入密码'});
      return;
    }

    Meteor.call("doSSOLogin", username, password, orgCode,
      function (respErr, result) {
          if (result.code === 200) {
            Meteor.loginWithPassword(username, password,
                function (error) {
                  if (error) {
                    /* users always good, should not be here. */
                    sAlert.error({sAlertIcon: 'warning', message: 'Something wrong happends when login.'});
                  } else {
                    Session.set('token', result.token);
                    Session.set('userPartyUuid', result.partyUuid);
                    XDGC.setToken(result.token);

                    Meteor.call('doPost', 'system/loginex', {orgCode: orgCode}, function (err, res) {
                      var resGot = doProcess(err, res);
                      if (resGot) {
                        var data = resGot.data;
                        var flag = data.flag;
                        Session.set('username', data.userName || data.orgName);
                        Session.setPersistent('accountFlag', flag);
                        Session.setPersistent('orgCode', orgCode);

                        //查询当前用户菜单
                        queryUserMenus(flag, function (err, menus) {
                          Session.setPersistent("myMenus", menus);
                          XDGC.setUserFields({
                            partyUuid: data.partyUuid,
                            menus: menus
                          }, function () {
                            if (flag == 1) {
                              goFirstMenu(PMENUS, menus);
                            } else if (flag == 2) {
                              goFirstMenu(MENUS, menus);
                            }
                          });
                        });
                      }
                    });
                }
            });
          }else{
            sAlert.error({sAlertIcon: 'warning', message: '[' + result.code + '] ' + result.msg});
          }
      }); // call(doLogin)
  }
});

//查询当前用户菜单权限
function queryUserMenus(flag, cb){
     var apiUrl;
     if(flag == 1){
         apiUrl = "role/getCurrentManagerMenuCodes";
     }else if(flag == 2){
         apiUrl = "role/queryEnableOrgMenuCodes";
     }

     Meteor.call('doPost', apiUrl, {}, function (err, res) {
         var resGot = doProcess(err, res);
         if (resGot) {
            var data = resGot.data;
            var menus = data.split(",");
            cb(null, menus);
         }
     });
}

//进入第一个菜单界面
function goFirstMenu(allMenus, menus) {
     var routerName;

     for(var i in menus) {
       for (var j in allMenus) {
         if (allMenus[j].children) {
           var childrenData = allMenus[j].children;
           for (var k in childrenData) {
             if (childrenData[k].type == "menu") {
               if(childrenData[k].code == menus[i]){
                 routerName = menus[i];
                 Router.go(routerName);
                 return;
               }
             }else if(allMenus[j].code == menus[i]){
               routerName = menus[i];
               Router.go(routerName);
               return;
             }
           }
         } else if (allMenus[j].code == menus[i]) {
           routerName = menus[i];
           Router.go(routerName);
           return;
         }
       }
     }
}
