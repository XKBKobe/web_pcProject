/**
 * Created by akai on 15/12/25.
 */

var mathUtils = {};

/**
 * 默认分页大小
 * @type {number}
 */


mathUtils['queryCurNewPage'] = function(){};

mathUtils['divide'] = function (numA, numB) {
  if ( _.isNull(numB) || numB == '' ) return '0';
  if ( _.isNull(numA) || numA == '' ) numA = 0;
  var percentNum = parseInt(numA) / parseInt(numB);

  return percentNum.toFixed(2);
};
mathUtils['toDurationForm'] = function(sec) {
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
Meteor.mathUtils = mathUtils;