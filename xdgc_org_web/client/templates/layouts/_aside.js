Template._aside.helpers({
  username: function () {
      var users = Meteor.users.findOne();
      if (users) {
          return users.username;
      } else {
          return "";
      }
  },

  allMenus: function () {
    var menus;
    var flag = Session.get("accountFlag");

    if(flag == 1){
        menus = PMENUS;
    }else if(flag == 2){
        menus = MENUS;
    }
    return getAllMenus(menus);
  },

  myMenus: function () {
   /* var menus = Session.get("myMenus");
    menus.push("permissonMenu","usersManage","rolesManage","menusManage");*/
    return Session.get("myMenus");
  }
});
Template._aside.onRendered(function () {
  var template = Template.instance();

  Meteor.defer(function () {
    template.$('aside li').hover(
      function () {
        $(this).addClass('open');
      },
      function () {
        $(this).removeClass('open');
      }
    );
    registerHandlersToMenues(template);
  });

  //scrollable sidebar
  $('.scrollable-sidebar').slimScroll({
    height: '100%',
    size: '0px'
  });

  var current = Router.current().route.getName();
  // 根据 [data-route] 选择当前路由对应的菜单项
  /*(function(current, selector, fnToggle) {
   template.$(selector).on('click', fnToggle);
   template.$(selector).each(function(index) {
   if (_($(this).data('route').split(',')).contains(current)) {
   fnToggle.call(template.$(this));
   }
   });
   })(current, '[data-route]', function() {
   $(this).siblings().removeClass('active');
   $(this).addClass('active');
   });*/

});
