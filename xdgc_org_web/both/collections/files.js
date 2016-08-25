PDFs = new FS.Collection("pdfs", {
  stores: [new FS.Store.FileSystem("pdfs", {path: "/tmp/uploads"})]
});

PDFs.allow({
  download: function(userId, fileObj) {
    return true;
  },
  insert: function(userId, fileObj) {
    return true;
  },
  update: function(userId, fileObj) {
    return true;
  },
  remove: function(userId, fileObj) {
    return true;
  }
});

if(Meteor.isClient){
  Meteor.subscribe("upload.pdfs");
}
