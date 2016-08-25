// ---------
// Usage:
// ---------
// <template name="myTemplate">
// 	<form id="upload" action="http://web.file.myqcloud.com/files/v1" method="post" enctype="multipart/form-data">
// 		<input type="hidden" name="op" value="upload">
// 		<input type="file" name="filecontent" value="">
// 		<input type="submit" name="submit" value="Submit">
// 	</form>
// </template>
//
// Template.myTemplate.onRendered(function() {
//   var done = function(res) {
// 		console.log('=======================DONE');
// 		console.log(res);
// 	};
//
// 	var fail = function(res) {
// 		console.log('=======================FAIL');
// 		console.log(res);
// 	};
//
// 	qcloud.initForm($('#upload'), done, fail);
// });
//
// Template.myTemplate.events({
//   "click [name=submit]": function(event, template){
//     event.preventDefault();
//     var $form = $(event.currentTarget).closest('form');
//     var filename = $form.find('[name=filecontent]').val();
//     Meteor.call('getFileSignMore', function(error, sign) {
//       $form.attr("action", qcloud.genUrl(sign, filename, 'product/archive/'));
//       $form.submit();
//     });
//     return false;
//   }
// });

qcloud = {
  options: {
    "appId": "10002631",
    "cosBucket": "docs",
    "imageBucket": "ybpimg",
    "baseFileUrl": "http://web.file.myqcloud.com/files/v1",//cos地址
    "baseImageUrl": "http://web.image.myqcloud.com/photos/v2"//万象优图地址
  },
  genFileId: function (filename, prefix) {
    var suffix = "";
    prefix = prefix || '';
    if (filename.lastIndexOf(".") > -1) {
      // suffix from filename
      suffix = filename.substr(filename.lastIndexOf("."));
    }
    return prefix + 'xdgc_file_' + new Date().getTime() + suffix;
  },

  genUrlFolder: function (sign, folderName, prefix) {
    return this.options.baseFileUrl + "/" + this.options.appId +
      "/" + this.options.cosBucket + "/" + folderName + "?sign=" + encodeURIComponent(sign);
  },

  genUrl: function (sign, filename, prefix) {
    return this.options.baseFileUrl + "/" + this.options.appId +
      "/" + this.options.cosBucket + "/" + this.genFileId(filename, prefix) + "?sign=" + encodeURIComponent(sign);

  },

  genUrl1:function(sign,partyUuid,shopName,etlDataSource,orderFilename){
    var date = new Date().getTime();
    date = moment(date).format('YYYYMMDDHHmmss');
    var filename = orderFilename.substr(0,orderFilename.lastIndexOf("."));
    var suffix = orderFilename.substr(orderFilename.lastIndexOf("."));
    var path = this.options.baseFileUrl + "/" + this.options.appId +
        "/" + this.options.cosBucket + "/" +partyUuid+ etlDataSource  + "_"+date + suffix + "?sign=" + encodeURIComponent(sign);
    console.log(path);
    return path;
  },

  getImageFileId: function () {
    return "xdgc_" + new Date().getTime();
  },

  genImgUrl: function (sign) {
    return this.options.baseImageUrl + "/" + this.options.appId +
      "/" + this.options.imageBucket + "/0/" + this.getImageFileId() + "?sign=" + encodeURIComponent(sign);
  },

  initForm: function ($form, done, fail) {
    var options = {
      type: 'post',
      dataType: 'json',
      success: done,
      error: fail
    };
    return $form.ajaxForm(options);
  }
};