Namespace('XDGC.utils.subpage', function () {

  this.menus = {
    getCurrentMenu: function () {
      var submenu = {};
      if (Router.current().route) {
        submenu = Router.current().route.options.submenu;
        if (submenu) {
          return submenu.active;
        }
      }
      return null;
    },
    getAllMenu: function () {
      var submenu = {};
      if (Router.current().route) {
        submenu = Router.current().route.options.submenu;
        if (submenu) {
          return XDGC.utils.maps.submenu[submenu.code];
        }
      }
      return null;
    }

  };
});

Template._main.helpers({
  accountFlag: function () {
    return Session.get("accountFlag");
  }
});

Template.subpageMenu.helpers({

  currentMenu: function () {
    return XDGC.utils.subpage.menus.getCurrentMenu();
  },

  subMenus: function () {
    return XDGC.utils.subpage.menus.getAllMenu();
  },

  isActive: function () {
    return this.code === XDGC.utils.subpage.menus.getCurrentMenu() ? 'active' : '';
  },

  hasSubmenu: function () {
    return typeof this.submenu !== 'undefined' ? 'dropdown' : '';
  },

  genPath: function () {
    var params = Router.current().params;
    var path = this.path, prefix = "{", sufix = "}";
    for (var i in params) {
      if (i == "hash" || i == "query") {
        continue;
      }
      path = path.replace(prefix + i + sufix, params[i]);
    }
    return path;
  }

});