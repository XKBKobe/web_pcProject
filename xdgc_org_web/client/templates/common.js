/**
 * 回调结果处理：
 * @param err
 * @param result
 * @param cb
 * @returns {*}
 */
doProcess = function (err, result, cb) {
  if (!err) {
    if (result.data.respCode !== "100200") {//something wrong,do to note the user
      if (result.data.respCode === '204404' || result.data.respCode === '204423') {
        Meteor.setTimeout(function () {
          window.location = '/';
        }, 500);
      }

      if (cb) {
        cb(err, result);
      } else {
        var message = "[" + result.data.respCode + "]: " + result.data.respMsg;
        sAlert.error({sAlertIcon: 'warning', message: message});
      }
      //do some to note user
      return false;
    }
    return result.data;
  } else {
    //do some to process error.
    if (err.error == 'doPost') {
      sAlert.error({sAlertIcon: 'warning', message: 'POST 请求失败：' + err.reason});
    }
  }
};

doDopProcess = function (err, result, cb) {
  if (!err) {
    if ('' + result.statusCode !== "200") {//something wrong,do to note the user


      if (cb) {
        cb(err, result);
      } else {
        sAlert.error({sAlertIcon: 'warning', message: '请求失败：'});
      }
      //do some to note user
      return false;
    }
    var retObj = JSON.parse(result.content);

    if ('' + retObj.code !== "200") {
        var message = "[" + retObj.code + "]: " + retObj.message;
        sAlert.error({sAlertIcon: 'warning', message: message});
        return false;
    }

    return retObj;
  } else {
    //do some to process error.
    if (err.error) {
      sAlert.error({sAlertIcon: 'warning', message: '请求失败：' + err.reason});
    }
  }
};

doDrpProcess = function (err, result, cb) {
  if (!err) {
    if ('' + result.statusCode !== "200") {//something wrong,do to note the user


      if (cb) {
        cb(err, result);
      } else {
        sAlert.error({sAlertIcon: 'warning', message: '请求失败：'});
      }
      //do some to note user
      return false;
    }
    var retObj = JSON.parse(result.content);

    if ('' + retObj.code !== "200") {
      var message = "[" + retObj.code + "]: " + retObj.message;
      sAlert.error({sAlertIcon: 'warning', message: message});
      return false;
    }

    return retObj;
  } else {
    //do some to process error.
    if (err.error) {
      sAlert.error({sAlertIcon: 'warning', message: '请求失败：' + err.reason});
    }
  }
};

/**
 * 菜单增加事件（效果）
 * @param template
 */
registerHandlersToMenues = function (template) {
  //Collapsible Sidebar Menu
  template.$('.showCurrent > a').click(function () {
    template.$('aside li').removeClass('active');
    $(this).parent().siblings().children('.submenu').slideUp();
    $(this).parent().siblings().find('.submenu-label ').removeClass("white");
  });

  template.$('.openable > a').click(function () {
    if (!$('#wrapper').hasClass('sidebar-mini')) {
      if ($(this).parent().children('.submenu').is(':hidden')) {
        $(this).parent().siblings().removeClass('open').children('.submenu').slideUp();
        $(this).parent().addClass('open').children('.submenu').slideDown();
        $(this).parent().find('.submenu-label ').removeClass("white");
        $(this).parent().siblings().removeClass('active');
      }
      else {
        $(this).parent().removeClass('open').children('.submenu').slideUp();
      }
    }

    return false;
  });
};

/**
 * 文件下载
 * @param url
 */
downloadFile = function (url) {
  try {
    var elemIF = document.createElement("iframe");
    elemIF.src = url;
    elemIF.style.display = "none";
    document.body.appendChild(elemIF);
  } catch (e) {
    sAlert.error({sAlertIcon: 'warning', message: '文件下载出错！'});
  }
};

/**
 * meteor启动初始化：
 */
Meteor.startup(function () {

  /**
   * 提示框组件（sAlert）出事配置：
   */
  sAlert.config({
    effect: '',
    position: 'top-right',
    timeout: 2000,
    html: false,
    onRouteClose: true,
    stack: true,
    offset: 5,
    beep: false
  });
});
