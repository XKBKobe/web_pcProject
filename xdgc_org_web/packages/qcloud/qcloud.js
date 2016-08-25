// Write your package code here!

if(Meteor.isServer){
  var qcloud_cos = Npm.require("qcloud_cos");
  qcloudCos = function() {
  	return qcloud_cos;
  };
}
