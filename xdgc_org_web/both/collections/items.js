Items = new Mongo.Collection('items');

Items.allow({
  insert: function (itemId, doc) {
    // the user must be logged in, and the document must be owned by the user
    return true;
  },
  update: function (itemId, doc, fields, modifier) {
    // can only change your own documents
    return true;
  },
  remove: function (itemId, doc) {
    // can only remove your own documents
    return true;
  }
});


Items.helpers({

});

Items.before.insert(function (userId, doc) {
  doc.createdAt = moment().toDate();
});

if (Meteor.isClient) {
  Meteor.subscribe("items");
}
