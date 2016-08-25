Template.registerHelper("token", function() {
  return Session.get('token');
});

Template.registerHelper('truncate', function(string, length) {
  var cleanString = _(string).stripTags();
  return _(cleanString).truncate(length);
});

//当天时间
Template.registerHelper("endTime", function() {
  return  new Date();
});

Template.registerHelper("formatDate", function(datE) {
  return !!datE ? moment(datE).format('YYYY-MM-DD') : '';
});

Template.registerHelper("substr", function(str, lenght) {
  if( !!lenght ) lenght = 50;
  return str.substring(0,lenght);
});
Template.registerHelper("formatEmptyNum", function(value) {
  if ( _.isNull(value) || value == '' )
    return '0';
  else
    return value;
});


Template.registerHelper("countPercent", function(numA, numB){
  if ( _.isNull(numB) || numB == '' ) return '0%';
  if ( _.isNull(numA) || numA == '' ) numA = 0;
  var percentNum = parseInt(numA)/parseInt(numB)*100;
  if (percentNum%1==0)
    percentNum = percentNum.toFixed(0);
  else
    percentNum = percentNum.toFixed(2);

  return percentNum + "%";
});
Template.registerHelper("countPercentNumber", function(numA, numB){
  if ( _.isNull(numB) || numB == '' ) return '0';
  if ( _.isNull(numA) || numA == '' ) numA = 0;
  var percentNum = parseInt(numA)/parseInt(numB)*100;
  if (percentNum%1==0)
    percentNum = percentNum.toFixed(0);
  else
    percentNum = percentNum.toFixed(2);

  return percentNum;
});

formatDateTime = function(datE) {
  return !!datE ? moment(datE).format('YYYY-MM-DD HH:mm') : '';
};

Template.registerHelper("formatDateTime", formatDateTime);

Template.registerHelper("formatDateTimeS", function(datE) {
  return !!datE ? moment(datE).format('YYYY-MM-DD HH:mm:ss') : '';
});

Template.registerHelper("timeParse", function(datE, fmt) {
  return !!datE ? moment(datE).format(fmt) : '';
});

Template.registerHelper("formatMoney", function(data) {

  // parse data from string to float number
  if (typeof data === 'string') {
    data = parseFloat(data);
  }

  // if still not a number
  if (typeof data !== 'number') {
    data = 0;
  }

  return "￥" + _.numberFormat(data, 2, '.', ',');

});

//获得当前时间
Template.registerHelper("getCurrentTime", function() {
  var date = new Date();
  var year = date.getFullYear();
  var mon = date.getMonth() + 1;
  var day = date.getDate();
  var h = date.getHours();
  var m = date.getMinutes();
  var s = date.getSeconds();
  var currentDate = year + '-' + (mon < 10 ? "0" + mon : mon) + '-' + (day < 10 ? "0" + day : day);
  var currentTime = (h < 10 ? "0" + h : h) + ':' + (m < 10 ? "0" + m : m) + ':' + (s < 10 ? "0" + s : s);

  return currentDate + ' ' + currentTime;
});

selectedEqual = function(valOfThis, valOfExpected) {
  return valOfThis == valOfExpected ? 'selected' : '';
};

Template.registerHelper("selectedEqual", selectedEqual);

checkedItem = function(str, code) {
  if(str) {
    if(str == code){
      return "checked";
    }else {
      var array = str.split("|");
      for (var i = 0; i < array.length; i++) {
        if (array[i] == code) {
          return "checked";
        }
      }
    }
  }
  return "";
};

Template.registerHelper("checkedItem", checkedItem);

notHidden = function (right) {
  var rights = Session.get("myMenus");
  if(rights.indexOf(right) == -1) {
    return false;
  }else{
    return true;
  }
};

Template.registerHelper("notHidden", notHidden);

Template.registerHelper("isMatched", isMatched);

function isMatched(valOfThis, arrayObject) {
  if (arrayObject instanceof Array) {
    for (var i = 0; i < arrayObject.length; i++) {
      if (valOfThis == arrayObject[i]) {
        return 'matched';
      }
    }
  }
  return '';
}

isNotNull = function(valOfThis) {
  if (valOfThis == 0 || (valOfThis != null && valOfThis != "")) {
    return "isNotNull";
  } else {
    return '';
  }
};

Template.registerHelper("isNotNull", isNotNull);

Template.registerHelper("getCodeList", function(codeTypeName) {
  return xdgc_assets.statelist.getCodeListToArray(codeTypeName);
});
getCodeName = function(codeTypeName, codeValue) {
  var _data = xdgc_assets.statelist.getCodeList(codeTypeName);
  return _data && _data[codeValue]?_data[codeValue]:'';
};
Template.registerHelper("getCodeName", getCodeName);

Template.registerHelper("getCodeValue", function(codeTypeName, codeName) {
  var _data = xdgc_assets.statelist.getCodeList(codeTypeName);
  if (_data) {
    for (var key in _data) {
      if (_data[key] == codeName) {
        return key;
      }
    }
  }
  return "";
});
//
////日期格式转换
//Date.prototype.pattern=function(fmt) {
//  var o = {
//    "M+" : this.getMonth()+1, //月份
//    "d+" : this.getDate(), //天
//    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
//    "H+" : this.getHours(), //小时
//    "m+" : this.getMinutes(), //分钟
//    "s+" : this.getSeconds(), //秒
//    "q+" : Math.floor((this.getMonth()+3)/3), //季度
//    "S" : this.getMilliseconds() //毫秒
//  };
//  var week = {
//    "0" : "/u65e5",
//    "1" : "/u4e00",
//    "2" : "/u4e8c",
//    "3" : "/u4e09",
//    "4" : "/u56db",
//    "5" : "/u4e94",
//    "6" : "/u516d"
//  };
//  if(/(y+)/.test(fmt)){
//    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
//  }
//  if(/(E+)/.test(fmt)){
//    fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
//  }
//  for(var k in o){
//    if(new RegExp("("+ k +")").test(fmt)){
//      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
//    }
//  }
//  return fmt;
//}
//
//Template.registerHelper("timeParse", function(time,fmt){
//  if(time){
//    try {
//      var _data = new Date(parseInt(time));
//      return _data.pattern(fmt);
//    } catch(e){
//      return time;
//    }
//  }else{
//    return "";
//  }
//});

Template.registerHelper("getProvinceNameByCode", function(code) {
  return common_assets.cities.getProvinceNameByCode(code);
});

Template.registerHelper("getCityNameByCode", function(pCode, cCode, flag) {
  flag = typeof flag === 'undefined' ? true : !!flag;
  return common_assets.cities.getCityNameByCode(pCode, cCode, flag);
});

Template.registerHelper("getAreaNameByCode", function(pCode, cCode, aCode, flag) {
  flag = typeof flag === 'undefined' ? true : !!flag;
  return common_assets.cities.getAreaNameByCode(pCode, cCode, aCode, flag);
});

//元转换成万元
toTenThousand = function(money) {
  var money = parseInt(money) || 0;
  return money / 10000;
};

Template.registerHelper("toTenThousand", toTenThousand);


//元转换成十万元
toHunThousand = function(money) {
  var money = parseInt(money) || 0;
  return money / 100000;
};

Template.registerHelper("toHunThousand", toHunThousand);

//登录者自己锁定
Template.registerHelper("lockedByMe", function(uuid) {
  return uuid == XDGC.getUserPartyUuid();
});

//切换锁定或解锁id
Template.registerHelper("lockOrRelease", function() {
  var self = this;

  var isLocked = (self.lockFlag == 1);
  var isLockedByMe = (self.lockPartyUuid == XDGC.getUserPartyUuid());

  if (!isLocked) {
    return "lock";
  } else if (isLockedByMe) {
    return "release-lock";
  }

});

//小数转换成百分比
toPercentage = function(value) {
  var changeValue = _.numberFormat(parseFloat(value) * 100, 2) || 0;
  return changeValue + '%';
};
Template.registerHelper("toPercentage", toPercentage);

//YYYYMM转成YYYY-MM
toDateForm = function(string) {
  return string.substring(0, 4) + "-" + string.substring(4, string.length);
};
Template.registerHelper("toDateForm", toDateForm);

//YYYYMMDD转换成YYYY-MM-DD
toYearMonthDayForm = function(string) {
  var year = string.substring(0, 4);
  var monthDay = string.substring(4, 6);
  return year + '-' + monthDay + "-" + string.substring(6, string.length);
};
Template.registerHelper("toYearMonthDayForm", toYearMonthDayForm);

//YYYYMMDD转换成MM-DD
toMonthDayForm = function(string) {
  var monthDay = string.substring(4);
  var month = monthDay.substring(0, 2);
  var day = monthDay.substring(2);
  return month + '-' + day;
};
Template.registerHelper("toMonthDayForm", toMonthDayForm);

//YYYYMMDDHHssmm转换成YYYY-MM-DD HH:ss:mm
toHourMinSecForm = function(num) {
  var date = ("" + num).substring(0, 8);
  var dateString = toYearMonthDayForm(date);
  var time = ("" + num).substring(8);
  var timeString = time.substring(0, 2) + ':' + time.substring(2, 4) + ":" + time.substring(4);

  return dateString + ' ' + timeString;
};
Template.registerHelper("toHourMinSecForm", toHourMinSecForm);

//把秒转换成HH:ss:mm
toDurationForm = function(sec) {
  if ( _.isNull(sec) || sec=='' ) return '00:00:00';
  var tplFormat = _.template("<%= h %>:<%= m %>:<%= s %>");
  var h, m, s;
  var nt = function(m) {
    var n;
    return (n = Math.floor(m)) < 10 ? ("0" + n) : n
  };
  var data = {
    h: nt(sec / 3600),
    m: nt(sec % 3600 / 60),
    s: nt(sec % 3600 % 60)
  };

  return tplFormat(data);
};
Template.registerHelper("toDurationForm", toDurationForm);

// form validators
Namespace('XDGC.helpers.regexps', {
  /**
   * 手机号码格式
   * 以1XX开头的手机号码
   * 如：13012345678、15929224344、18201234676
   */
  // mobile: /^1\d{10}$/,
  mobile: /^(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/,
  /**
   * 固定电话号码格式
   * 因为固定电话格式比较复杂，情况比较多，主要验证了以下类型
   * 如：010-12345678、0912-1234567、0571-12345678、(010)-12345678、(0912)1234567、(010)12345678、(0912)-1234567、01012345678、09121234567
   */
  phone: /^(^0\d{2}-?\d{8}$)|(^0\d{3}-?\d{7,8}$)|(^\(0\d{2}\)-?\d{8}$)|(^\(0\d{3}\)-?\d{7}$)$/,
  email: /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+(\.[a-zA-Z]{2,3})+$/,
  /**
   * 身份证15位编码规则：dddddd yymmdd xx p
   * dddddd：6位地区编码
   * yymmdd: 出生年(两位年)月日，如：910215
   * xx: 顺序编码，系统产生，无法确定
   * p: 性别，奇数为男，偶数为女
   *
   * 身份证18位编码规则：dddddd yyyymmdd xxx y
   * dddddd：6位地区编码
   * yyyymmdd: 出生年(四位年)月日，如：19910215
   * xxx：顺序编码，系统产生，无法确定，奇数为男，偶数为女
   * y: 校验码，该位数值可通过前17位计算获得
   *
   * 前17位号码加权因子为 Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ]
   * 验证位 Y = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ]
   * 如果验证码恰好是10，为了保证身份证是十八位，那么第十八位将用X来代替
   * 校验位计算公式：Y_P = mod( ∑(Ai×Wi),11 )
   * i为身份证号码1...17 位; Y_P为校验码Y所在校验码数组位置
   */
  idCard: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
  /**
   * 只能为正整数
   */
  integer: /^\d+$/,
  /**
   * 小数保留兩位
   */
  float: /^\d+(\.\d{0,2})?$/,
  /**
   * 邮政编码
   */
  postCode: /^\d{6}$/,
  /**
   * 只能是中文汉字
   */
  chineseOnly: /^[\u4e00-\u9fa5]+$/,
  /**
   * 网址
   * 只允许http、https、ftp这三种
   * 如：http://www.baidu.com
   */
  url: /^(([hH][tT]{2}[pP][sS]?)|([fF][tT][pP]))\:\/\/[wW]{3}\.[\w-]+\.\w{2,4}(\/.*)?$/,
  /**
   * 日期格式验证
   * 因为日期格式比较多，主要验证了以下类型
   * 2012-05-14、2012/05/6、2012.5.14、20120528
   */
  date: /^[1-9]\d{3}([-|\/|\.])?((0\d)|([1-9])|(1[0-2]))\1(([0|1|2]\d)|([1-9])|3[0-1])$/,

  // 电话或者手机号
  mobileOrTel: /(^(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$)|(^(^0\d{2}-?\d{8}$)|(^0\d{3}-?\d{7,8}$)|(^\(0\d{2}\)-?\d{8}$)|(^\(0\d{3}\)-?\d{7}$)$)/,

  // 工商注册号 15 位数字
  institutionNum: /^\d{15}$/,

  //字母或者数字
  letterOrNum:/^[A-Za-z0-9]+$/,

  //至少有一个为非空字符
  nonBlankCharacter: /^.*[^\s]+.*$/
});

Template.registerHelper("getRegExp", function(name) {
  return XDGC.helpers.regexps[name] || null;
});

Template.registerHelper("getRegExpNoSlash", function(name) {
  if (XDGC.helpers.regexps[name]) {
    var regStr = XDGC.helpers.regexps[name].toString();
    return regStr.substring(1, regStr.length - 1);
  }
  return null;
});


formHasError = function($form) {
  var hasError = false;
  $form.find("span.help-block.with-errors").each(
    function() {
      if ($(this).html()) {
        hasError = true;
      }
    }
  );
  $form.find(".customErrorHelper").each(
    function() {
      if ($(this).html()) {
        hasError = true;
      }
    }
  );
  if($form.find(".form-group").hasClass("has-error")){
      hasError = true;
  }
  return hasError;
};

formErrorClear = function($form) {
  $form.find("span.help-block").html('');
  $form.find(".form-group").removeClass("has-error");
};

//保留两位小数
toFixed = function(num) { // num could be string
  if (+num % 1 === 0) {
    return +num;
  }
  var f = parseFloat(num) || 0;
  return f.toFixed(2);
};

Template.registerHelper("toFixed", toFixed);


//保留固定位小数
toFixedByNum = function(num, fixedNum) { // num could be string
  if (+num % 1 === 0) {
    return +num;
  }
  var f = parseFloat(num) || 0;
  return f.toFixed(fixedNum);
};

Template.registerHelper("toFixedByNum", toFixedByNum);

//保留固定位小数,整数也保留固定小数位数
toFixedData = function(num, fixedNum) { // num could be string
  if (+num % 1 === 0) {
    return +num.toString() + '.0';
  }
  var f = parseFloat(num) || 0;
  return f.toFixed(fixedNum);
};

Template.registerHelper("toFixedData", toFixedData);

//先转成万再保留两位小数
changeDataForm = function(num) {
  var numberOne = parseInt(num) || 0;
  var numberTwo = numberOne / 10000;

  if (+numberTwo % 1 === 0) {
    return +numberTwo;
  }
  var f = parseFloat(numberTwo) || 0;
  return f.toFixed(2);
};

Template.registerHelper("changeDataForm", changeDataForm);

//厘转成万再保留两位小数
changeMoneyForm = function(num, fixedNum) {
  var numberOne = parseInt(num) || 0;
  var numberTwo = numberOne / 10000000;

  var f = parseFloat(numberTwo) || 0;
  return f.toFixed(fixedNum);
};


//先转成万再保留固定位小数
changeData = function(num, fixedNum) {
  var numberOne = parseInt(num) || 0;
  var numberTwo = numberOne / 10000;

  if (+numberTwo % 1 === 0) {
    return +numberTwo.toString() + '.0';
  }
  var f = parseFloat(numberTwo) || 0;
  return f.toFixed(fixedNum);
};


//求 a ,b 中 a的百分比
toPenct = function(a, b) {
  var per = a / (a + b);
  var changeValue = _.numberFormat(parseFloat(per) * 100, 2) || 0;
  return changeValue + '%';
};

Template.registerHelper("toPenct", toPenct);

//转换成百分比，并保留两位小数
changeToPercent = function(num) {
  var a = +num * 100;
  if ( a % 1 === 0) {
    return a;
  }
  var f = _.numberFormat(parseFloat(num) * 100, 2) || 0;
  return f;
};

Template.registerHelper("changeToPercent", changeToPercent);

//保留固定位小数,整数也保留固定小数位数
toFixedDop = function(num, fixedNum) {
  var f = parseFloat(num) || 0;
  return f.toFixed(fixedNum);
};

toFixedKeepNull = function (n) {
  if (n == null) {
    return null;
  }
  var f = parseFloat(n) || 0;
  return f.toFixed(2);

};
Template.registerHelper("toFixedKeepNull", toFixedKeepNull);

Template.registerHelper("toFixedDop", toPenct);

Template.registerHelper("changeMoneyForm", changeMoneyForm);

Template.registerHelper("changeData", changeData);

//判断店铺是否属于B店
Template.registerHelper("isBShop", function(shopType) {
  return "1" == (shopType) ? false : true;
});

Template.registerHelper("assetsUrl", function(name) {
  return Meteor.settings.public.assets[name];
});


arrayify = function(obj) {
  var result = [];
  for (var key in obj)
    result.push({
      name: key,
      value: obj[key]
    });
  if(result){
    return _.sortBy(result, 'name').reverse();
  }else{
    return null;
  }
};

Template.registerHelper("arrayify", arrayify);



checkAllMobiles = function(names) {
  var values = [];
  names.forEach(function(e) {
    var inputVal = $('input[name="' + e + '"]').val();
    if (inputVal) {
      if (values.indexOf(inputVal) === -1) {
        values.push(inputVal);
      } else {
        // already exists
        var $input = $('input[name="' + e + '"]');
        $input.closest(".form-group")
          .addClass("has-error");
        sAlert.error({
          sAlertIcon: 'warning',
          message: '不同的人电话不能相同'
        });
      }
    }
  });

};

// 如果填写了联系人姓名后电话身份证号必填
checkMobileId = function($form) {
  var firstVal = $form.find('input[name="firstLinkPersonName"]').val();
  var secondVal = $form.find('input[name="secondLinkPersonName"]').val();
  var spouseVal = $form.find('input[name="spouseName"]').val();


  if (firstVal) {
    $form.find('input[name="firstLinkPersonMobile"]').prop('required', true);
  } else {
    $form.find('input[name="firstLinkPersonMobile"]').removeProp('required');
  }
  if (secondVal) {
    $form.find('input[name="secondLinkPersonMobile"]').prop('required', true);
  } else {
    $form.find('input[name="secondLinkPersonMobile"]').removeProp('required');

  }
  if (spouseVal) {
    $form.find('input[name="spouseMobile"]').prop('required', true);
    $form.find('input[name="spouseIdNaumber"]').prop('required', true);

  } else {
    $form.find('input[name="spouseMobile"]').removeProp('required');
    $form.find('input[name="spouseIdNaumber"]').removeProp('required');

  }
};

/**
 * 递归生成菜单树需要的数据：
 * @param datas
 * @param srcMenus
 * @param menus
 * @returns {*}
 */
getMenuTreeData = function(datas, srcMenus, menus) {
  for (var i in srcMenus) {
    var menu = srcMenus[i];
    var data = {};
    data.text = menu.name;
    data.code = menu.code;
    var checked = false;
    for (var j in menus) {
      if (menus[j] == menu.code) {
        checked = true;
        break;
      }
    }
    data.state = {
      checked: checked,
      expanded: false
    };
    if (menu.children) {
      data.nodes = [];
      getMenuTreeData(data.nodes, menu.children, menus);
    }
    datas.push(data);
  }
};

/**
 * 获取所有菜单code
 * @param srcMenus
 */
getAllMenuCode = function(codes,srcMenus) {
  for (var i in srcMenus) {
    var menu = srcMenus[i];
    var code = menu.code;
    if (menu.children) {
      getAllMenuCode(codes, menu.children);
    }
    if(code.substring(0,7)!="orgCode"){
      codes.push(code);
    }
  }
};

/**
 * 获取所有菜单
 * @param allMenus,menus
 */
getAllMenus = function(allMenus) {
  var datas = [];
  getMenuData = function(srcMenus, datas) {
    for (var i in srcMenus) {
      var menu = srcMenus[i];
      if(menu.type != "menu"){
        break;
      }
      var data = {};
      data.name = menu.name;
      data.code = menu.code;
      data.url = menu.url;
      data.type = menu.type;
      data.icon = menu.icon;
      if (menu.children) {
        data.children = [];
        getMenuData(menu.children, data.children);
      }
      datas.push(data);
    }
  };
  getMenuData(allMenus, datas);

  return datas;
};

/**
 * 配置treeView
 * @param tree, node
 */
nodeCheckedFun = function (tree, node) {
  tree.checkNode(node.nodeId, {silent: true});
  var sons = node.nodes;
  if (sons) {
    tree.expandNode(node.nodeId, {silent: false});
    for (var i in sons) {
      nodeCheckedFun(tree, sons[i]);
    }
  }
};

nodeUnCheckedFun = function (tree, node) {
  tree.uncheckNode(node.nodeId, {silent: true});
  var sons = node.nodes;
  if (sons) {
    tree.expandNode(node.nodeId, {silent: false});
    for (var i in sons) {
      nodeUnCheckedFun(tree, sons[i]);
    }
  }
};

nodeCheckedParentFun = function (tree, node) {
  var parentNode = tree.getParent(node.nodeId);
  if (parentNode) {
    tree.checkNode(parentNode.nodeId, {silent: true});
    nodeCheckedParentFun(tree, parentNode);
  }
};

nodeUnCheckedParentFun = function (tree, node) {
  var parentNode = tree.getParent(node.nodeId, {silent: true});
  if (parentNode) {
    var sons = parentNode.nodes;
    var flag = false;//true 表示有子节点被checked
    for (var i in sons) {
      var son = sons[i];
      if (son.state.checked) {
        flag = true;
        break;
      }
    }
    nodeUnCheckedParentFun(tree, parentNode);
  }
};

/**
 * 展示treeView
 * @param tmp, rightsData， menus
 */
rightsConfigure = function (tmp, rightsData, menus, id){
  var data = [];
  getMenuTreeData(data, rightsData, menus);
  tmp.$('#' + id).treeview({
    data: data,
    showCheckbox: true,
    onNodeChecked: function (event, node) {
      nodeCheckedFun(tmp.$('#' + id).data('treeview'), node);
      nodeCheckedParentFun(tmp.$('#' + id).data('treeview'), node);
    },
    onNodeUnchecked: function (event, node) {
      nodeUnCheckedFun(tmp.$('#' + id).data('treeview'), node);
      nodeUnCheckedParentFun(tmp.$('#' + id).data('treeview'), node);
    }
  });
};

/**
 * 路由比对是否在登陆用户权限code
 * @param routerName
 * @returns {boolean}
 */
isCanSeeUrl = function(routerName){
  var myMenus = Session.get("myMenus");
  for(var i in myMenus){
    if(routerName === myMenus[i]){
      return true;
    }
  }
  return false;
};

Template.registerHelper("isCanSeeUrl", isCanSeeUrl);
parseArea = function(area) {
  var _area = area.replace(/--/g,' ');
  if (_area && !/^\s+$/.test(_area)) {
    if(area && /^([^ \-]+( |--)){1}$/.test(area)) {
      return _area + ' ' + '未知';
    }
    return _area;
  }else {
    return '未知地区';
  }
};

Template.registerHelper("parseArea", parseArea);

//品牌首页标识转换
parseHomeFlag = function(f, sourcesList) {
  var flag, ending;
  if (f.indexOf('|') > -1) {
    var arr = f.split('|');
    if (arr.length !== 2) {
      return f;
    } else {
      flag = arr[0];
      ending = arr[1];
    }

    for (var i in sourcesList) {
      var sourceList = sourcesList[i];
      if (flag == sourceList.flag) {
        return sourceList.source + '|' + ending;
      }
    }

    return f;
  } else {
    return f;
  }

};

//判断还款方式状态
periodStatus = function(code, status){
  if(code == "0"){
    return '随借随还';
  }else if(code != null && code != ""){
    return '分' + code + '期';
  }else{
    return (status == 'initial') ? '/' : '待分配';
  }
};
Template.registerHelper("periodStatus", periodStatus);

//贷前审批列表顶部滚动条
scrollWindow = function (obj, id) {
  document.getElementById(id).scrollLeft = obj.scrollLeft;
};


// 测算额度
/*
avg: 月均
fakeRate: 刷单率,
type:分期类型,
ref:参考授信
*/
calLimit = function (avg, fakeRate, type, refer) {

  if (avg == null || fakeRate == null) {
    type = null; // 当avg或fakeRate为空，直接返回refer值
  }

  var result, refer = refer || 0, fakeRate = +fakeRate || 0, avg = +avg || 0;

  switch (type) {
    case '6':
      result = 1.2 * avg * (1 - fakeRate);
      break;
    case '9':
      result = 1.5 * avg * (1 - fakeRate);
      break;
    case '12':
      result = 1.8 * avg * (1 - fakeRate);
      break;
    case '0':
      result = 0.6 * avg * (1 - fakeRate);
      break;
    default:
      result = refer;
      break;

  };

  return changeDataForm(result);

};

Template.registerHelper("calLimit", calLimit);

//判断是否已经解绑
unLinked = function(unLinked){
  return unLinked == '1';

};
Template.registerHelper("unLinked", unLinked);
