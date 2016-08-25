Template.registerHelper('debug', function(optionalValue) {
  if (typeof console !== "undefined" || typeof console.log !== "undefined") {
    console.log("Current Context");
    console.log("====================");
    console.log(this);
    if (optionalValue) {
      console.log("Value");
      console.log("====================");
      console.log(optionalValue);
    }

    return '';
  }

  // For IE8
  alert(this);

  if (optionalValue) {
    alert(optionalValue);
  }

  return '';
});
/*
tempIns()用法:
在chrome开发工具里用选择器选中目标template内的任意元素,
然后执行tempIns($0),即可获得当前template对象
原理参考:http://stackoverflow.com/questions/30459983/can-i-grab-the-current-template-within-the-javascript-console

*/
tempIns = function(elem) {
  if (!elem) {
    console.log("!!!please select an element using inspect first!!!");

    return null;
  }
  var view = Blaze.getView(elem);
  while (!view.templateInstance) {
    view = view.parentView;
  }
  return view.templateInstance();
}