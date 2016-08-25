/**
 * Created by akai on 15/12/16.
 */
var pageUtils = {};

/**
 * 默认分页大小
 * @type {number}
 */
pageUtils['defaultPageSize'] = 20;

pageUtils['queryByPageUrlFormat'] = function(url, pageNum, pageSize){
  if(!arguments[1]) pageNum = 1;
  if(!arguments[2]) pageSize = this.defaultPageSize;
  if ( url.indexOf('?') == -1 )
    url += '?';
  else
    url += '&';
  url += 'page_number='+pageNum+"&page_size="+pageSize;
  return url;
};

/**
 * 为分页添加自增长序号
 * @param page
 */
pageUtils['addAutoncrement'] = function(page){
  var list = page.objects;
  var pageNumber = page.pageNumber;
  var pageSize = page.pageSize;
  var start = pageNumber*pageSize-pageSize;
  for (var i = 0; i< list.length; i++){
    list[i]['_pageIndex'] = (i+1)+start;
  }
};


pageUtils['queryCurNewPage'] = function(){};


Meteor.pageUtils = pageUtils;