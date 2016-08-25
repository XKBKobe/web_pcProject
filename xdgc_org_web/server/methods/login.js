Meteor.methods({
  doLogin: function(username, password, orgCode){
    try {
      var resGot = HTTP.call('POST', XDGC.be.baseUrl + '/system/login', {
        params: {
          userName: username,
          passWord: password,
          orgCode: orgCode
        }
      });
      if(resGot && resGot.data){
        var resBody = resGot.data;
        if(resBody.respCode == '100200') {
          // 登录成功
          var userFound = Meteor.users.findOne({username: username});
          if (!!userFound) {
            // 本地中有登录成功的用户信息
            // 查看这个用户验证信息是否和界面提供的一致
            if (!isSamePassword(password, userFound)) {
              // 不一致
              Accounts.setPassword(userFound._id, password);
            }
          }else{
            Accounts.createUser({
              username: username, password: password});
          }
        }
        return resBody;
      }
    } catch (e) {
      var details = 'login 失败，服务器故障。';
      logger.info(details);
      throw new Meteor.Error('doPost', '服务器故障', details);
    }
  }, // doLogin()

  doSSOLogin: function (username, password, orgCode) {
    try {
      var resGot = HTTP.call('POST', XDGC.be.ssoServerURI + '/app/ticket/pwdLogin', {
        params: {
          username: username,
          password: password,
          vhost: orgCode,
          target: "https://www.yuanbaopu.com"
        }
      });
      var resData = resGot.data;

      if(resGot && resData){
        if(resData.code === 200) {
          // 登录成功
          var userFound = Meteor.users.findOne({username: username});
          if (!!userFound) {
            // 本地中有登录成功的用户信息
            // 查看这个用户验证信息是否和界面提供的一致
            if (!isSamePassword(password, userFound)) {
              // 不一致
              Accounts.setPassword(userFound._id, password);
            }
          }else{
            Accounts.createUser({
              username: username, password: password});
          }
        }
        return resData;
      }
    } catch (e) {
      var details = 'login 失败，服务器故障。';
      logger.info(details);
      throw new Meteor.Error('doPost', '服务器故障', details);
    }
  },

  'login.setToken': XDGC.setToken,
  'login.getToken': XDGC.getToken,
  'login.setUserFields': XDGC.setUserFields
});

var bcrypt = Package['npm-bcrypt'].NpmModuleBcrypt;
var bcryptHash = Meteor.wrapAsync(bcrypt.hash);
var bcryptCompare = Meteor.wrapAsync(bcrypt.compare);

var _bcryptRounds = 10;
var hashPassword = function (password) {
   password = SHA256(password);
   return bcryptHash(password, _bcryptRounds);
};

function isSamePassword(password,user) {
   password = SHA256(password);
   return bcryptCompare(password, user.services.password.bcrypt);
}
