/**
* Created by Administrator on 2016/2/18.
*/

Template.home.helpers({

    color: function (index) {
        return Template.instance().color[index];
    },
    timeRange: function () {
        return Template.instance().timeRange.get();
    },
    average: function () {
        return Template.instance().average.get();
    },
    todayCount: function () {
        return Template.instance().todayCount.get();
    },
    yesterdayCount: function () {
        return Template.instance().yesterdayCount.get();
    },
    orgData: function () {
        return Template.instance().orgData.get();
    }

});

Template.home.onCreated(function () {

    this.color = ['#C90', '#2B333C', '#063'];
    this.timeRange = new ReactiveVar();
    this.average = new ReactiveVar();
    this.todayCount = new ReactiveVar();
    this.yesterdayCount = new ReactiveVar();
    this.orgData = new ReactiveVar();

});

Template.home.onRendered(function () {

    var tmp = Template.instance();
    var hostname = window.location.hostname;
    Meteor.call("getResources", hostname, function (respErr, result) {
        tmp.orgData.set(result);
    });

    // 初始化数据
    Meteor.call("doPost", "index/sta", {}, function (err, result) {
        var resGot = doProcess(err, result);
        if (resGot) {
            var data = resGot.data;
            tmp.timeRange.set({
                register: data.register.timeRange,
                orgApplyLoan: data.orgApplyLoan.timeRange,
                localApplyLoan: data.localApplyLoan.timeRange
            });
            tmp.average.set({
                register: data.register.average,
                orgApplyLoan: data.orgApplyLoan.average,
                localApplyLoan: data.localApplyLoan.average
            });
            tmp.todayCount.set({
                register: _.last(data.register.list).count,
                orgApplyLoan: _.last(data.orgApplyLoan.list).count,
                localApplyLoan: _.last(data.localApplyLoan.list).count
            });
            tmp.yesterdayCount.set({
                register: _.last(data.register.list, 2)[0].count,
                orgApplyLoan: _.last(data.orgApplyLoan.list, 2)[0].count,
                localApplyLoan: _.last(data.localApplyLoan.list, 2)[0].count
            });
            echarts.init(document.getElementById('indexCharts')).setOption({
                color: tmp.color,
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['注册数', '申请数（全系统）', '申请数（本行）']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: _.map(data.register.list, function (e) {
                            return e.time;
                        })
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '注册数',
                        type: 'line',
                        data: _.map(data.register.list, function (e) {
                            return e.count;
                        })
                    },{
                        name: '申请数（全系统）',
                        type: 'line',
                        data: _.map(data.orgApplyLoan.list, function (e) {
                            return e.count;
                        })
                    },{
                        name: '申请数（本行）',
                        type: 'line',
                        data: _.map(data.localApplyLoan.list, function (e) {
                            return e.count;
                        })
                    }
                ]
            });
        }
    });
});

Template.home.events({

    //单击筛选按钮：
    "click #searchCustomer": function (evt, tmp) {
        evt.preventDefault();
        orgCustomerList.getCustomersInfo(null, tmp);
    }
});
