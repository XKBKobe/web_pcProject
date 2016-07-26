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
        console.log('11')
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
            'color': '#444',
            'border': '1px solid #ccc',
            'background-color': '#ccc',
        })
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
                    'border': '1px solid #E3464B',
                    'background': '#C5282F'
                })
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

// JavaScript Document
/**
=========================================================================

=============================================================================
**/
(function($){
	$.fn.toTop = function(options){
		var defaults = {
			obj			:'#topBut',
			speed		: 1000,
		}
		var options = $.extend(defaults,options)
		$(options.obj).click(function(){
			$('body,html').animate({scrollTop:0},options.speed)
		})
	}
})(jQuery)

/*提示信息关闭事件*/
$(".cloe_Message").click(function(){
	$(this).parent(".login-msg").hide();
})
/**验证手机号码函数**/
checkphoneNum = function (phonenumber,messageId) {
    if (!!phonenumber) {
        var reg = /^[1][34578]\d{9}$/;
        if (!reg.test(phonenumber)) {
        	$(messageId).show().find('.error').html("手机号码输入有误")
            return false;
        }
    } else {
        $(messageId).show().find('.error').html("手机号码不能为空")
        return false;
    }
    return true;
}
/***验证密码***/
checkPass = function (password,messageId) {
    if (!!password) {
        if (password.length < 6 || password.length > 12) {
            $(messageId).show().find('.error').html("密码应该为6-12位字符")
            return false;
        }
    } else {
    	$(messageId).show().find('.error').html("密码不能为空")
        return false;
    }
    return true;
}

/***验证验证码CODE***/
checkCode = function (sendCode,messageId) {
    if (!!sendCode) {
        var reg = /^\d{6}$/;
        if (!reg.test(sendCode)) {
            $(messageId).show().find('.error').html("请正确输入6位数验证码")
            return false;
        }
    } else {
        $(messageId).show().find('.error').html("验证码不能为空")
        return false;
    }
    return true;
}

/*右侧悬浮框*/
$('.web-edge li a').mouseover(function(){
	$('.web-edge-hover').hide()
	$(this).next('.web-edge-hover').show()
})
$('.web-edge li a').mouseout(function(){
	$('.web-edge-hover').hide()
})

/*返回顶部*/
$(function(){//调用
	$(window).toTop({
		obj			:'#topBut',
		speed		: 1000,
	})
})
/*注册关闭时候清除定时器*/
$('.closeClearInterval').click(function(){
   $("#sendVerifyCodyBtn").val("发送验证码");
   $("#sendVerifyCodyBtn").sendvftCode({"count": 0, "eachstypetime": 10});
})

/**首页banner切换**/
//幻灯显示
var timeId;
var liLen = $('#statusitem li').length;
var items = $('#statusitem li');
var showLiIndex = 0;
items.click(function(){
	window.clearInterval(timeId);	
	var _index = $(this).index();
	showLiIndex = 0;
	$(this).addClass('banner-current').siblings().removeClass('banner-current');
	$("#flashpicture .banner-list-item").eq(_index).fadeIn().siblings().fadeOut();	
	timeId = setInterval(ptop_banner,1000);
})
function ptop_banner(){
	showLiIndex++;
	console.log(showLiIndex)
	if(showLiIndex === 3){
		showLiIndex = 0
		$('#statusitem li').eq(showLiIndex).addClass('banner-current').siblings().removeClass('banner-current');
		$("#flashpicture .banner-list-item").eq(showLiIndex).fadeIn().siblings().fadeOut();	
	}else{
		$('#statusitem li').eq(showLiIndex).addClass('banner-current').siblings().removeClass('banner-current');
		$("#flashpicture .banner-list-item").eq(showLiIndex).fadeIn().siblings().fadeOut();	
	}
}
timeId = setInterval(ptop_banner,1000);

/*省级联动jQuery插件*/
(function($){
	$.fn.proCity = function(options){
		var defaults = {
			infoPro		:'#infoPro',
			infoCity    :'#infoCity',
			infoArea	:'#infoArea',
			provinceAndCityData	:provinceAndCityData
		}
		var options = $.extend(defaults,options)
		var _province = '';
		var _city = '';
		var _area = ''
		var provinceAndCityData = options.provinceAndCityData;
		var infoPro = options.infoPro;
		var infoCity = options.infoCity;
		var infoArea = options.infoArea;
		$.each(provinceAndCityData,function(index,data){
			if(index==0){
				_province = '<option selected="selected" value='+data.name+'>'+data.name+'</option>';	
			}else{
				_province = '<option value='+data.name+'>'+data.name+'</option>';
			}
			$(infoPro).append(_province);
			city()
		})
		
		$(infoPro).change(function(){
			city()
		})
		$(infoCity).change(function(){
			area()
		});
		function city(){
			var pro = $(infoPro+" option:selected").text();//获取第一个select的值
			$(infoCity).html('');//重置
				for(var z=0; z < provinceAndCityData.length ; z++){
					var proValue = provinceAndCityData[z].name;
					if(pro==proValue){
						var city = provinceAndCityData[z].city
						$.each(city,function(index,data){
							if(index==0){
								_city = '<option selected="selected" value='+data.name+'>'+data.name+'</option>';	
							}else{
								_city = '<option value='+data.name+'>'+data.name+'</option>';
							}
							$(infoCity).append(_city);
						})
					}
				}
			area();	
		}
		function area(){
			var pro_area = $(infoPro+"  option:selected").text();
			$(infoArea).html('');//重置我操
			for(var i=0 ; i< provinceAndCityData.length ; i++){
				if(pro_area==provinceAndCityData[i].name){
					var city2 = provinceAndCityData[i].city;
					var _s2 = $(infoCity+"  option:selected").text()
					for(var j=0 ; j<city2.length ; j++){
						if(_s2==city2[j].name){
							var area = city2[j].area;
							$.each(area,function(index,data_area){
								if(index==0){
									_area = '<option selected="selected" value='+data_area.name+'>'+data_area.name+'</option>';	
								}else{
									_area = '<option value='+data_area.name+'>'+data_area.name+'</option>';
								}
								
								$(infoArea).append(_area);
								
							})
							
						}
					}
				}
			}
		}

	}
})(jQuery)

/**注册成功**/
var setInterId
var setInter = function(){
	var second = $("#second").html();
	setInterId = setInterval(function(){
		second -- 
		$("#second").html(second)
		if(second == 0){
			window.clearInterval(setInterId);
			$("#second").html(5)
			$("#myModal-reg-success").modal("hide")
		}
	},1000)
}
$(".closeModalResSuc").click(function(){
	$("#second").html(5)
	window.clearInterval(setInterId);
})











