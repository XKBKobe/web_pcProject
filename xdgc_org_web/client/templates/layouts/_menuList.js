/**
 * Created by Administrator on 2015/9/24.
 */
MENUS = [
  {name: "数据中心 ", code: "home", url: "/home", type: "menu", icon: "fa fa-database fa-lg"},

  /*一级导航*/
  {name: "客户管理 ", code: "orgCustomerList", url: "/orgCustomerList", type: "menu", icon: "fa fa-group fa-lg"},

  /*组织审批管理*/
  {
    name: "审批管理", code: "approvalManage", url: "#", type: "menu", icon: "fa fa-gavel fa-lg",
    children: [
      {name: "本行", code: "orgBank", url: "orgBank", type: "menu", icon: ""}
    ]
  },

  /*权限管理*/
  {
    name: "权限管理", code: "permissionMenu", url: "#", type: "menu", icon: "fa fa-key fa-lg",
    children: [
      {name: "下属银行管理", code: "orgSubBank", url: "orgSubBank", type: "menu", icon: ""},
      {name: "本行人员管理", code: "orgAgent", url: "orgAgent", type: "menu", icon: ""}
      //{name: "本行职位配置", code: "orgPosition", url: "orgPosition", type: "menu", icon: ""}
    ]
  },

  /*个人中心*/
  {name: "个人中心 ", code: "orgPersonalCenter", url: "/orgPersonalCenter", type: "menu", icon: "fa fa-user fa-lg"}
];

PMENUS = [
  /*贷款产品管理*/
  /*{
    name: "贷款产品管理", code: "loanProduct", url: "/loanProduct", type: "menu", icon: "fa fa-cubes fa-lg",
    children: [
      {name: "新增编辑贷款产品", code: "addEditPro", type: "button"},
      {name: "审核上下架贷款产品", code: "upDownPro", type: "button"}
    ]
  },*/

  /*组织审批管理*/
  {name: "审批管理", code: "orgApproval", url: "/orgApproval", type: "menu", icon: "fa fa-gavel fa-lg"},

  /*个人中心*/
  {name: "个人中心", code: "orgPersonalCenter", url: "/orgPersonalCenter", type: "menu", icon: "fa fa-user fa-lg"}
];
