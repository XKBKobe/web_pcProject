/**
 * Created by akai on 15/12/15.
 * 表单相关Utils
 * dependent: jquery
 */

/**
 * 表单相关工具
 * @type {{}}
 */
var formUtils = {};

/**
 * 获得表单对象
 * @param formId <form>元素id 默认为：fromData
 * @returns {{}}
 */
formUtils['getFormJson'] = function(formId){
  if(!arguments[0]) formId = "formData";

  var json = {};

  $('#'+formId+' :input[name]').each(function () {
    var name = $(this).attr("name");
    var val = $(this).val()+"";
    val = val.trim();
    if (val != null && val != "" && val != -1 && val != 'null') {
      json[name] = val;
    }
  });

  return json;
};
formUtils['clearFormJson'] = function(formId){
  if(!arguments[0]) formId = "formData";

  $('#'+formId+' :input[name]').each(function () {
    $(this).val("");
  });

};

formUtils['formatMultipleInput'] = function(value){
  if( value == 'null' || typeof value == 'undefined' ){
    value = [];
  }else{
    value = (value+"").split(',');
  }
  return value;
};
formUtils['formatInput'] = function(value){
  if( value == 'null' || typeof value == 'undefined' ){
    value = '';
  }
  return value;
};
formUtils['formatStartTimeInput'] = function(time){
  if ( typeof time == 'undefined' ) return '';
  return parseInt(moment(time).format('YYYYMMDD')+'000000000');
};
formUtils['formatEndTimeInput'] = function(time){
  if ( typeof time == 'undefined' ) return '';
  return parseInt(moment(time).format('YYYYMMDD')+'235959999');
};
formUtils['formatStartInput'] = function(time){
  if ( typeof time == 'undefined' ) return '';
  return parseInt(moment(time).format('YYYYMMDD'));
};
formUtils['formatEndInput'] = function(time){
  if ( typeof time == 'undefined' ) return '';
  return parseInt(moment(time).format('YYYYMMDD'));
};
formUtils['formatBoolean'] = function(b){
  return b=='true' ? (true):( (b=='false')? false: '');
};

Meteor.formUtils = formUtils;