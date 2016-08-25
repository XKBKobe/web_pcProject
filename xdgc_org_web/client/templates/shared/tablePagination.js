//USAGE: need to register a event handler to every pages changer.
//----------------
// Template.productList.events({
//   'click [data-role="pagination"] a': function (e, template) {
//     var newPageNum = parseInt( $(e.currentTarget).attr('data-page') );
//     if (newPageNum > 0) {
//       productList.getProducts(newPageNum);
//     }
//   }
// });


Template.tablePagination.helpers({

  classIsGoodPage: function (page) {
    return page == 0 ? 'ui-state-disabled' : '';
  },
  hasPageInfo: function () {
    var data = Template.instance().data;
    if (data.pageInfo) {
      return true;
    } else {
      return false;
    }
  }

});

Template.dopTablePagination.helpers({
  dopPageInfo: function () {
    if (!this.pageInfo) {
      return {};
    }
    var pageInfo = this.pageInfo;
    return {
      pageNum: pageInfo.pageNumber,
      total: pageInfo.recordTotal,
      pages: pageInfo.pageTotal,
      prePage: pageInfo.pageNumber - 1,
      nextPage: pageInfo.pageNumber === pageInfo.pageTotal ? 0 : pageInfo.pageNumber + 1,
      startRow: (pageInfo.pageNumber - 1) * pageInfo.pageSize + 1,
      endRow: pageInfo.pageNumber === pageInfo.pageTotal ? pageInfo.recordTotal : pageInfo.pageNumber * pageInfo.pageSize
    };
  }
});


Template.dopTablePagination.events({
  /* Pagination: Register an event handler to every page changers */
  'click [data-role="pagination"] a': function (e, template) {
    var newPageNum = parseInt($(e.currentTarget).attr('data-page'));
    if (newPageNum > 0) {
      Meteor.pageUtils.queryCurNewPage(newPageNum);
    }
  }
});
Template.tablePagination.events({
  /* Pagination: Register an event handler to every page changers */
  'click [data-role="pagination"] a': function (e, template) {
    var newPageNum = parseInt($(e.currentTarget).attr('data-page'));
    if (newPageNum > 0) {
      Meteor.pageUtils.queryCurNewPage(newPageNum);
    }
  }
});
