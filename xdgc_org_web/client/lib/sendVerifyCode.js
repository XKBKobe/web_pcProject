/**发送验证码**/
var g_interval = null;
(function ($) {// 创建一个闭包
    // 插件的定义
    $.fn.sendvftCode = function (options) {
        if (g_interval != null) {
            window.clearInterval(g_interval);// 停止计时器
        }
        var self = { // 插件的内部变量
            "curCount": 0        // 当前剩余秒数
        };

        var defaults = {// 插件的defaults
            "count": 60, // 倒计时间
            "eachstypetime": 1000 //每次步进秒数
        };

        var options = $.extend({}, defaults, options);
        $this = $(this);

        var textcontent;
        var flagtag = $this.is("input");
        if (flagtag) {
            textcontent = $this.val();
        } else {
            textcontent = $this.html();
        }
        self["curCount"] = options["count"];
        $this.attr("disabled", "true").css({
            'color': '#000',
            'background-color': '#ccc'
        });
        if (flagtag) {
            $this.val(self["curCount"] + "秒后重新获取");
        } else {
            $this.html(self["curCount"] + "秒后重新获取");
        }
        g_interval = window.setInterval(function () {
            if (self["curCount"] == 0) {
                window.clearInterval(g_interval);// 停止计时器
                $this.removeAttr("disabled").css({
                    'color': '#fff',
                    'background': '#65cea7'
                });
                if (flagtag) {
                    $this.val(textcontent);
                } else {
                    $this.html(textcontent);
                }
            } else {
                self["curCount"]--;
                if (flagtag) {
                    $this.val(self["curCount"] + "秒后重新获取");
                } else {
                    $this.html(self["curCount"] + "秒后重新获取");
                }
            }
        }, options["eachstypetime"]); // 启动计时器，1秒执行一次
    };
    // 闭包结束
})(jQuery);