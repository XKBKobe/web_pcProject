/**
 * Created by Administrator on 2015/11/30.
 */

DataPermission = (function(){
  //需要数据控制处理的url：(手机号权限处理--mobileColumn)
  var URL_RULES = [
    {
      "url" : "custom/queryLoanCustomList",
      "columns" : [
        {
          "name" : "mobile",
          "fun" : mobileFun
        }
      ]
    },
    {
      "url" : "custom/queryCustomByUuid",
      "columns" : [
        {
          "name" : "mobile",
          "fun" : mobileFun
        },{
          "name" : "firstLinkPersonMobile",
          "fun" : mobileFun
        },{
          "name" : "secondLinkPersonMobile",
          "fun" : mobileFun
        },{
          "name" : "thirdLinkPersonMobile",
          "fun" : mobileFun
        }
      ]
    },
    {
      "url" : "matsnap/select",
      "columns" : [
        {
          "name" : "mobile",
          "fun" : mobileFun
        },{
          "name" : "firstLinkPersonMobile",
          "fun" : mobileFun
        },{
          "name" : "secondLinkPersonMobile",
          "fun" : mobileFun
        },{
          "name" : "thirdLinkPersonMobile",
          "fun" : mobileFun
        }
      ]
    },
    {
      "url" : "custom/queryAccountByLoan",
      "columns" : [
        {
          "name" : "account",
          "fun" : mobileFun
        }
      ]
    },
    {
      "url" : "acceptloan/select",
      "columns" : [
        {
          "name" : "mobile",
          "fun" : mobileFun
        }
      ]
    },
    {
      "url" : "firsttrial/select",
      "columns" : [
        {
          "name" : "mobile",
          "fun" : mobileFun
        }
      ]
    },
    {
      "url" : "recheckloan/select",
      "columns" : [
        {
          "name" : "mobile",
          "fun" : mobileFun
        }
      ]
    },
    {
      "url" : "finaltrial/select",
      "columns" : [
        {
          "name" : "mobile",
          "fun" : mobileFun
        }
      ]
    },
    {
      "url" : "queryLoanApp/query",
      "columns" : [
        {
          "name" : "mobile",
          "fun" : mobileFun
        }
      ]
    },
    {
      "url" : "loansign/selectLoanAppList",
      "columns" : [
        {
          "name" : "mobile",
          "fun" : mobileFun
        }
      ]
    },
    {
      "url" : "clientwarning/queryCustomList",
      "columns" : [
        {
          "name" : "mobile",
          "fun" : mobileFun
        }
      ]
    },
    {
      "url" : "analysisReport/queryShopAnalysisReport",
      "columns" : [
        {
          "name" : "mobile",
          "fun" : mobileFun
        }
      ]
    },
    {
      "url" : "clientwarning/firstlist",
      "columns" : [
        {
          "name" : "mobile",
          "fun" : mobileFun
        }
      ]
    },
    {
      "url" : "clientwarning/rechecklist",
      "columns" : [
        {
          "name" : "mobile",
          "fun" : mobileFun
        }
      ]
    },
    {
      "url" : "stepaccept/stepacceptlist",
      "columns" : [
        {
          "name" : "mobile",
          "fun" : mobileFun
        }
      ]
    },
    {
      "url" : "/common/loanAndcust",
      "columns" : [
        {
          "name" : "mobile",
          "fun" : mobileFun
        },{
          "name" : "firstLinkPersonMobile",
          "fun" : mobileFun
        },{
          "name" : "secondLinkPersonMobile",
          "fun" : mobileFun
        },{
          "name" : "thirdLinkPersonMobile",
          "fun" : mobileFun
        }
      ]
    }

  ];

  //是否处理
  function isHandle(){
    var myMenus = Meteor.user().profile.menus;
    for(var i in myMenus){
      if("mobileColumn" == myMenus[i]){
        return false;
      }
    }
    return true;
  }

  /**
   * 处理函数
   * @param resGot
   * @param url
   */
  function processResGot(resGot, url) {
    for(var key in resGot) {
      var res = resGot[key];
      if(hasNest(res)) {
        processResGot(res,url);
      } else {
        var fun = getFun(url,key);
        if(fun) {
          resGot[key] = fun(resGot[key]);
        }
      }
    }
  }

  /**
   * 根据url和字段获取处理器
   * @param url
   * @param field
   * @returns {*}
   */
  function getFun(url,field) {
    for(var i in URL_RULES ) {
      if(URL_RULES[i].url == url) {
        var columns =  URL_RULES[i].columns;
        for(var j in columns) {
          if(columns[j].name == field) {
            return columns[j].fun;
          }
        }
      }
    }
    return null;
  }

  /**
   * 判断处理对象（对象类型和数组类型）
   * @param object
   * @returns {boolean}
   */
  function hasNest(object) {
    if(!object) {
      return false;
    }
    if(typeof object == 'string' || typeof object == 'number' || typeof object == 'boolean') {
      return false;
    }
    return true;
  }

  /**
   * 处理函数（手机）
   * @param value
   * @returns {string}
   */
  function mobileFun(value) {
    if(value){
      return value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    }
    return value;
  }

  return {
    handleData : function(resGot, url){
      if(isHandle()){
        processResGot(resGot, url)
      }
    }
  }
})();