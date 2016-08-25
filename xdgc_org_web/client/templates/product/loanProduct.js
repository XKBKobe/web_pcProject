var loanProduct = {
    getPageNumber: new ReactiveVar(),

    settings: {
        pageSize: 20
    },

    //获得贷款产品列表
    getLoanProducts:function (pageNum, params, tmp) {
        var self = this;
        var p = _.extend({}, self.settings, {
            pageNum: pageNum || 1
        });

        p = _.extend(p, params);

        Meteor.call('doPost', 'product/querypro', p, function (err, result) {
            var resGot = doProcess(err, result);
            if (resGot) {
                tmp.loanProList.set(resGot.data);
            }
        });
    }
};

Template.loanProduct.onCreated(function () {
    //存储过滤条件
    this.parameter = new ReactiveVar();

    //所有贷款产品
    this.loanProList = new ReactiveVar();

    //下架当前产品名
    this.currentPro = new ReactiveVar();

    //产品Uuid
    this.productCustUuid = new ReactiveVar();

    //发布或下架
    this.dealAction = new ReactiveVar();

    //历史记录
    this.historyRecord = new ReactiveVar();
});

Template.loanProduct.helpers({
    //获得本行列表数据
    getLoanProList: function () {
        return Template.instance().loanProList.get();
    },

    //发布或下架产品名
    getProName: function () {
        return Template.instance().currentPro.get();
    },

    //判断发布或下架
    getDealAction: function () {
        var action = Template.instance().dealAction.get();
        if(action === "release"){
            return "发布"
        }else if(action === "takeOff"){
            return "下架";
        }else if(action === "delete"){
            return "删除";
        }
    },

    //审批记录
    getHistoryRecord: function () {
        return Template.instance().historyRecord.get();
    }
});

Template.loanProduct.onRendered(function () {
    var tmp = Template.instance();
    Meteor.defer(function () {
        tmp.$('.datepicker').datepicker({language: 'zh-CN'});
    });

    loanProduct.getLoanProducts(null, {}, tmp);
});

Template.loanProduct.events({
    //单击检索
    "click #searchPro": function (evt, tmp, pageNum) {
        evt.preventDefault();

        var params = {};
        $('#formData :input[name]').each(function () {
            var name = $(this).attr("name");
            var value = $(this).val();
            if(value != null){
                var val = value.trim();
                if (val != "" && val != -1) {
                    params[name] = val;
                }
            }
        });

        tmp.parameter.set(params);
        loanProduct.getLoanProducts(pageNum, params, tmp);
    },

    //分页
    "click [data-role='pagination'] a": function (e, tmp) {
        var newPageNum = parseInt($(e.currentTarget).attr('data-page'));
        if (newPageNum > 0) {
            loanProduct.getPageNumber.set(newPageNum);
            loanProduct.getLoanProducts(newPageNum, tmp.parameter.get(), tmp);
        }
    },

    //单击新增
    "click #addPro": function (evt) {
        evt.preventDefault();

        Router.go("addProductDetail");
    },

    //单击编辑
    "click .editPro": function (evt) {
        evt.preventDefault();

        Router.go("editProductDetail", {
            productCustUuid: this.productCustUuid
        });
    },

    //单击发布或下架或删除
    "click .dealPro": function (evt, tmp) {
        evt.preventDefault();

        var action = $(evt.currentTarget).attr("name");
        tmp.dealAction.set(action);
        tmp.currentPro.set(this.name);
        tmp.productCustUuid.set(this.productCustUuid);

        if(action === "delete" && this.status == "2"){
            sAlert.error({sAlertIcon: 'warning', message: '请先下架产品！'});
            return;
        }

        var $form = tmp.$("#dealProForm");
        formErrorClear($form);
        tmp.$("#tConfirmBtn").prop("disabled", false);
        tmp.$("#dealProForm input").val("");
        tmp.$("#tCont1").show();
        tmp.$("#tCont2").hide();
        tmp.$('#dealProModal .panel-footer').show();
        tmp.$("#dealProModal").modal({'show': true, 'backdrop': "static"});
    },

    //确定发布或下架或删除
    "click #tConfirmBtn": function (evt, tmp) {
        evt.preventDefault();

        var $form = tmp.$("#dealProForm");
        $form.validator("validate");
        if (formHasError($form)) {
            return;
        }
        var username = Meteor.user().username;
        var rawPwd = tmp.$('[name=loginPwd]').val();
        var orgCode = Session.get("orgCode");
        var password = XDGC.md5For16(rawPwd);

        tmp.$("#tConfirmBtn").prop("disabled", true);
        Meteor.call("doSSOLogin", username, password, orgCode,
            function (respErr, result) {
                if (result.code === 200) {
                    Meteor.call('doPost', 'system/loginex', {orgCode: orgCode}, function (err, res) {
                         var resGot = doProcess(err, res);
                         if (resGot) {
                             var productCustUuid = tmp.productCustUuid.get();
                             var action = tmp.dealAction.get();
                             var url;
                             if(action === "release"){
                                 url = 'product/onsell';
                             }else if(action === "takeOff"){
                                 url = 'product/down';
                             }else{
                                 url = 'product/delete';
                             }

                             Meteor.call('doPost', url, {productCustUuid: productCustUuid}, function (err, result) {
                                 var resGot = doProcess(err, result);
                                 if (resGot) {
                                     tmp.$("#tCont1").hide();
                                     tmp.$("#tCont2").show();
                                     tmp.$('#dealProModal .panel-footer').hide();
                                     var pageNum = loanProduct.getPageNumber.get();
                                     tmp.$("#searchPro").trigger('click', pageNum);
                                     setTimeout(function() {
                                         tmp.$("#dealProModal").modal("hide");
                                     }, 1500);
                                 }
                             });
                         }
                     });
                }else{
                    tmp.$("#tConfirmBtn").prop("disabled", false);
                    sAlert.error({sAlertIcon: 'warning', message: '密码错误！'});
                }
            });
    },

    //单击历史记录
    "click .historyRecord": function (evt, tmp) {
        evt.preventDefault();

        Meteor.call('doPost', 'product/querylog', {productCustUuid: this.productCustUuid}, function (err, result) {
            var resGot = doProcess(err, result);
            if (resGot) {
                tmp.historyRecord.set(resGot.data);
                tmp.$("#historyRecordModal").modal({'show': true, 'backdrop': "static"});
            }
        });
    },

    //输入登录密码按回车键确认
    "keydown input[name=loginPwd]": function (evt, tmp) {
        if(evt.which == 13){
            evt.preventDefault();
            tmp.$("#tConfirmBtn").trigger("click");
        }
    }
});

