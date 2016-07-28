(function ($) {
  $.fn.extend({
    yx_rotaion: function (options) {

      return this.each(function () {
        var o = options;
        var curr_index = 0;
        var $this = $(this);
        var $li = $this.find("li");
        var li_count = $li.length;
        var $current_section = $this.parents(".section");
        $this.css({
          position: 'relative',
          overflow: 'hidden',
          width: "100%",
          height: $li.find("img").height()
        });

        $this.find("li").css({
          position: 'absolute',
          top: 0
        }).hide();

        $li.first().show();

        $this.append('<div class="yx-rotaion-btn"><span class="left_btn"><\/span><span class="right_btn"></span><\/div>');
        if (!o.btn) $current_section.find(".yx-rotaion-btn").css({visibility: 'hidden'});

        var $btn = $current_section.find(".yx-rotaion-btn span"),
            $title = $current_section.find(".yx-rotation-t"),
            $focus = $current_section.find(".yx-rotation-focus"),
            $myBtn = $current_section.find(".lr-rotaion-btn span"),
            $myFocus = $current_section.find(".lr-rotation-focus");

        //如果自动播放，设置定时器
        if (o.auto) {
          var t = setInterval(function () {
            $btn.last().click()
          }, o.during);
        }

        $title.text($li.first().find("img").attr("alt"));
        $title.attr("href", $li.first().find("a").attr("href"));

        // 输出焦点按钮
        for (i = 1; i <= li_count; i++) {
          $focus.append('<span>' + i + '</span>');
        }

        //自定义焦点顺序		
        for (j = 0; j <= $myFocus.find("a").length; j++) {
          $($myFocus.find("a")[j]).attr("data-id", j);
        }

        // 兼容IE6透明图片
        //if($.browser.msie && $.browser.version == "6.0" ){
        // $btn.add($focus.children("span")).css({backgroundImage:'url(images/ico.gif)'});
        //}

        var $f = $focus.find("span");
        var $mf = $myFocus.find("a");
        var $siblings = $myFocus.siblings();
        $f.first().addClass("hover");

        // 鼠标覆盖左右按钮设置透明度
        $btn.hover(function () {
          $(this).addClass("hover");
        }, function () {
          $(this).removeClass("hover");
        });

        //鼠标覆盖元素，清除计时器
        //$btn.add($li).add($f).hover(function () {
        //  if (t) clearInterval(t);
        //}, function () {
        //  if (o.auto) t = setInterval(function () {
        //    $btn.last().click()
        //  }, o.during);
        //});

        //鼠标覆盖焦点按钮效果
        $f.bind("mouseover", function () {
          var i = $(this).index();
          $(this).addClass("hover");
          $focus.children("span").not($(this)).removeClass("hover");
          $li.eq(i).fadeIn(300);
          $li.not($li.eq(i)).fadeOut(300);
          $title.text($li.eq(i).find("img").attr("alt"));
          curr_index = i;
        });

        //鼠标点击左右按钮效果
        $btn.bind("click", function () {
          $(this).index() == 1 ? curr_index++ : curr_index--;
          if (curr_index >= li_count) curr_index = 0;
          if (curr_index < 0) curr_index = li_count - 1;
          $li.eq(curr_index).fadeIn(300);
          $li.not($li.eq(curr_index)).fadeOut(300);
          $f.eq(curr_index).addClass("hover");
          $f.not($f.eq(curr_index)).removeClass("hover");
          $title.text($li.eq(curr_index).find("img").attr("alt"));
          $title.attr("href", $li.eq(curr_index).find("a").attr("href"));
        });

        //自定义鼠标点击焦点按钮效果
        $mf.bind("click", function () {
          var i = $(this).attr("data-id");
          $(this).addClass("active");
          $myFocus.find("a").not($(this)).removeClass("active");
          $li.eq(i).fadeIn(300);
          $li.not($li.eq(i)).fadeOut(300);
          $siblings.not($siblings.eq(i)).hide();
          $siblings.eq(i).fadeIn(300);
          curr_index = i;
        });

        //自定义鼠标点击左右按钮效果
        $myBtn.bind("click", function () {
          $(this).attr("data-id") == 1 ? curr_index++ : curr_index--;
          if (curr_index >= li_count) curr_index = 0;
          if (curr_index < 0) curr_index = li_count - 1;
          console.log(curr_index);
          $li.eq(curr_index).fadeIn(300);
          $li.not($li.eq(curr_index)).fadeOut(300);
          $mf.eq(curr_index).addClass("active");
          $mf.not($mf.eq(curr_index)).removeClass("active");
          $siblings.not($siblings.eq(curr_index)).hide();
          $siblings.eq(curr_index).fadeIn(300);
        });
      });
    }
  });
})(jQuery);
