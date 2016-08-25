routerHelpers = {
  route: function (context, name, options) {
    var defaultOptions = {
      data: function () {
        return {
          /* use query string for each pages. */
          'query': this.params.query,
          'params': this.params
        };
      },
      onAfterAction: function () {
        // 每当页面刷新，自动滚动到头部
        $('body').animate({scrollTop: 0}, 600);
        // Trigger cityselector for router when reloading..
        Meteor.defer(function() {
          $('[data-toggle="cityselector"]').each(function () {
            var $el = $(this);
            $el.cityselector.call($el, $el.data());
          });
          cityselector('init');

          //菜单状态变化
          $('aside li').removeClass('active');
          $('aside li#'+ name).addClass('active');
          if($('aside li#home').hasClass('active')){
            $('aside li').find('.submenu').slideUp();
          }
          var $subLabel = $("aside li").find("#" + options.parent).find(".submenu-label");
          $subLabel.addClass("white");
          $subLabel.parents(".openable").addClass("active");
          if(options.parent != "home"){
            $("aside li#" + options.parent).addClass("active");
          }
          $("aside li").find("#" + name).parents(".submenu").slideDown();
          $("aside li").find("#" + name).find(".submenu-label").addClass("white");
          $("aside li").find("#" + name).parents(".openable").addClass("active");
        });
      }
    }; // defaultOptions
    var opts = _.extend(defaultOptions, options);
    return context.route.call(context, name, opts);
  }
};

Router.map(function () {

  /**
   * 登陆
   */
  routerHelpers.route(this, 'login', {
    path: '/',
    layoutTemplate: 'blankLayout'
  });

  /**
   * 退出
   */
  routerHelpers.route(this, 'logout', {
    path: '/logout',
    action: function () {
      Meteor.logout();
    }
  });

  /**
   * 首页数据中心
   */
  routerHelpers.route(this, 'home', {
    title: '数据中心'
  });

  /**
   * 客户管理
   */
  routerHelpers.route(this, 'orgCustomerList', {
    title: '客户管理',
    parent: 'home'
  });

  /**
   * 机构审批
   */
  routerHelpers.route(this, 'orgApproval', {
    title: '机构审批',
    parent: 'home'
  });

  /**
   * 审批详情页面
   */
  routerHelpers.route(this, 'approvalDetail', {
    path: '/approvalDetail/loan/:loanAppUuid/:accountFlag',
    template: 'approvalDetail',
    data: function () {
      return {'query': this.params};
    },
    title: "贷款审批",
    parent: "orgApproval"
  });

  /**
   * 本行申请资料
   */
  routerHelpers.route(this, 'applyInformation', {
    path: '/approvalDetail/loan/:loanAppUuid',
    template: 'approvalDetail',
    data: function () {
      return {'query': this.params};
    },
    title: "申请资料",
    parent: "orgBank"
  });

  /**
   * 本行
   */
  routerHelpers.route(this, 'orgBank', {
    title: '本行',
    parent: 'home'
  });

  /**
   * 下属银行
   */
  routerHelpers.route(this, 'orgSubBank', {
    title: '下属银行管理',
    parent: 'home'
  });

  /**
   * 下属银行管理详情
   */
  routerHelpers.route(this, 'orgSubDetail', {
    path: '/orgSubDetail/:innerCode',
    data: function () {
        return {'query': this.params};
    },
    title: '详情',
    parent: 'orgSubBank'
  });

  /**
   * 本行职位配置
   */
  routerHelpers.route(this, 'orgPosition', {
    title: '本行职位配置',
    parent: 'home'
  });

  /**
   * 贷款产品管理
   */
  routerHelpers.route(this, 'loanProduct', {
    title: '贷款产品管理',
    parent: 'home'
  });

  /**
   * 贷款产品新增
   */
  routerHelpers.route(this, 'addProductDetail', {
    template: 'productDetail',
    title: '新增',
    parent: 'loanProduct'
  });

  /**
   * 贷款产品编辑
   */
  routerHelpers.route(this, 'editProductDetail', {
    template: 'productDetail',
    path: '/productDetail/:productCustUuid',
    data: function () {
      return {'query': this.params};
    },
    title: '编辑',
    parent: 'loanProduct'
  });

  /**
   * 概况总览
   */
  routerHelpers.route(this, 'orgProfile', {
    title: '概况总览',
    parent: 'home'
  });

  /**
   * 客户经理管理
   */
  routerHelpers.route(this, 'orgAgent', {
    title: '本行人员管理',
    parent: 'home'
  });

  /**
   * 个人中心
   */
  routerHelpers.route(this, 'orgPersonalCenter', {
    title: '个人中心',
    parent: 'home'
  });



  /**权限管理**/
  routerHelpers.route(this, 'menusManagement', {
    title: "资源管理",
    parent: "home"
  });

  routerHelpers.route(this, 'usersManagement', {
    title: "用户管理",
    parent: "home"
  });

  routerHelpers.route(this, 'rolesManagement', {
    title: "角色管理",
    parent: "home"
  });

  routerHelpers.route(this, 'rolesConnectedMenus', {
    title: "角色菜单管理",
    parent: "home"
  });

  routerHelpers.route(this, 'usersAssignedRoles', {
    title: "用户角色管理",
    parent: "home"
  });

  /**
   * 个人基本信息下载：
   */
  this.route('/approve/dlc', { where: 'server' })
    .get(function(req, res) {
      var query = req.query;
      var beBaseUrl = XDGC.getBeBaseUrl().replace(/\/+$/g, '');
      var formData = {
        token: query.token,
        loanAppUuid: query.loanAppUuid
      };
      var result = {};
      try {
        result = request.postSync(beBaseUrl + '/approve/dlc', {
          encoding: null,
          formData: formData
        });

        var headers = {
          'Content-Disposition': result.response.headers['content-disposition'],
          'Content-Type': result.response.headers['content-type'],
          'Connection': 'keep-alive',
          'Accept-Ranges': 'bytes'
        };

        var buffer = result.body;
        res.writeHead(result.response.statusCode, headers);
        if (buffer.length) {
            res.write(buffer, function () {
              res.end();
            });
        } else {
            res.end();
        }
      } catch (e) {
        logger.error(e);
      }
    });

  /**
   * 证件信息下载：
   */
  this.route('/approve/dlpm', { where: 'server' })
    .get(function(req, res) {
      var query = req.query;
      var beBaseUrl = XDGC.getBeBaseUrl().replace(/\/+$/g, '');
      var formData = {
        token: query.token,
        loanAppUuid: query.loanAppUuid
      };
      var result = {};
      try {
        result = request.postSync(beBaseUrl + '/approve/dlpm', {
          encoding: null,
          formData: formData
        });

        var headers = {
          'Content-Disposition': result.response.headers['content-disposition'],
          'Content-Type': result.response.headers['content-type'],
          'Connection': 'keep-alive',
          'Accept-Ranges': 'bytes'
        };

        var buffer = result.body;
        res.writeHead(result.response.statusCode, headers);
        if (buffer.length) {
            res.write(buffer, function () {
              res.end();
            });
        } else {
            res.end();
        }
      } catch (e) {
        logger.error(e);
      }
    });

    /**
     * 数据源下载：
     */
    this.route('/property/download', { where: 'server' })
      .get(function(req, res) {
        var query = req.query;
        var beBaseUrl = XDGC.getBeBaseUrl().replace(/\/+$/g, '');
        var result = {};
        try {
          result = request.postSync(beBaseUrl + query.url, {
            encoding: null,
            formData: query
          });

          var headers = {
            'Content-Disposition': result.response.headers['content-disposition'],
            'Content-Type': result.response.headers['content-type'],
            'Connection': 'keep-alive',
            'Accept-Ranges': 'bytes'
          };

          var buffer = result.body;
          res.writeHead(result.response.statusCode, headers);
          if (buffer.length) {
              res.write(buffer, function () {
                res.end();
              });
          } else {
              res.end();
          }
        } catch (e) {
          logger.error(e);
        }
      });

});

if (Meteor.isClient) {
  Router.onBeforeAction(function () {
    /* make sure user logged in. */
    if (!Meteor.userId() && this.url !== '/') {
      window.location = '/';
    }
    this.next();
  });
}
