/**
 * Created by Administrator on 2015/11/30.
 */

var currentDomain = XDGC.getDomain();

var Resources = [
  { "domain": currentDomain.bpbank,
    "orgCode": "400000",
    "orgName": "元宝铺",
    "skinStyle": "bpbank",
    "pushInfo":
    {
      "title": "FideBoilerplate",
      "text": "当前贷款有新的状态",
      "logoUrl": "http://7xl5o6.com2.z0.glb.qiniucdn.com/icon-96.png",
      "appId": "1P6VRV5QnV5V30DNlU6k5A",
      "appKey": "djV7c0DNe48F3A3ZREUj47",
      "master": "8Zv6MOla889da2Zv1dGLD6"
    },
    "msgCode":
    {
      "template": "【FIDE】",
      "invoker": "bpbank"
    }
  },
  { "domain": currentDomain.fdbank,
    "orgCode": "401000",
    "orgName": "富滇银行",
    "skinStyle": "fdbank",
    "pushInfo":
    {
      "title": "富业e融",
      "text": "当前贷款有新的状态",
      "logoUrl": "",
      "appId": "",
      "appKey": "",
      "master": ""
    },
    "msgCode":
    {
      "template": "【富业e融】",
      "invoker": "fdbank"
    }
  },
  { "domain": currentDomain.fdbank2,
    "orgCode": "401000",
    "orgName": "富滇银行",
    "skinStyle": "fdbank",
    "pushInfo":
    {
      "text": "当前贷款有新的状态",
      "title": "当前贷款有新的状态",
      "logoUrl": "",
      "appId": "",
      "appKey": "",
      "master": ""
    },
    "msgCode":
    {
      "template": "【富业e融】",
      "invoker": "fdbank"
    }
  },
  { "domain": currentDomain.zlbank,
    "orgCode": "402000",
    "orgName": "佐力小贷",
    "skinStyle": "zlbank",
    "pushInfo":
    {
      "title": "佐力小贷",
      "text": "当前贷款有新的状态",
      "logoUrl": "http://7xl5o6.com2.z0.glb.qiniucdn.com/zl.png",
      "appId": "K00z9xXbfB9hbHJ4hwBv0A",
      "appKey": "ge0mdQwRtl7J8mFmdgoXU3",
      "master": "hgsVoIOAkd6AuIPvwAwkUA"
    },
    "msgCode":
    {
      "template": "【佐力小贷】",
      "invoker": "zlbank"
    }
  },
  { "domain": currentDomain.dqbank,
    "orgCode": "403000",
    "orgName": "德清农商行",
    "skinStyle": "dqbank",
    "pushInfo":
    {
      "title": "德清e贷",
      "text": "当前贷款有新的状态",
      "logoUrl": "",
      "appId": "",
      "appKey": "",
      "master": ""
    },
    "msgCode":
    {
      "template": "【FIDE】",
      "invoker": "dqbank"
    }
  }
];

Meteor.methods({
  getResources: function(domain){
    var reData = {};
    for(var i in Resources){
      var data = Resources[i];
      if(domain == data.domain){
        reData = data;
        break;
      }
    }
    return reData;
  }
});

