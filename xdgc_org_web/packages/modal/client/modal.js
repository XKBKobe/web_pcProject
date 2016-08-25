/**
 * template.$('.modal') 事件：
 *  -> 'shown.modal'，当模版加载完成以后
 **/

/** Example 1
因为重置模版的需要，为此我们增加了session来还原因为 Meteor Blaze 渲染上去的HTML信息。
此时就需要一个方法让客户端很容易得到更新的消息，并重新采用某种行为，类似于 jQuery.Event

    $('#thatModal').on('shown.modal', function() {
      myDropzone = new Dropzone("#shopFileForm", { url: "/proofMat/updateProofMatFile"});
      myDropzone.on("success", cbSuccess);
    });

************************************************************/

Template.modal.onCreated(function() {
  this.show = new ReactiveVar();
});

Template.modal.onRendered(function() {
  var self = this;
  this.$('.modal')
    .on('show.bs.modal', function() {
      self.show.set(true);
    })
    .on('hidden.bs.modal', function() {
      self.show.set(false);
    });
});

Template.modal.helpers({
  show: function() {
    var template = Template.instance(),
        show = template.show.get();
    Meteor.defer(function() {
      if (show) template.$('.modal').trigger('shown.modal');
    });
    return show;
  }
});

