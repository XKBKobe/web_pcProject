$(document).ready(function () {
  $(function() {
    var timeId;
    var liLen = $('#statusitem li').length;
    var items = $('#statusitem li');
    items.click(function () {
      window.clearInterval(timeId);
      var _index = $(this).index();
      $(this).addClass('current').siblings().removeClass('current');
      $("#flash-picture .banner-list-item").eq(_index).fadeIn().siblings().fadeOut();
      timeId = setInterval(ptop_banner, 5000);
    });

    function ptop_banner() {
      var showLiIndex = $('.current').index() + 1;

      if (showLiIndex == liLen) {
        items.eq('0').click();
      } else {
        items.eq(showLiIndex).click();
      }
    }

    timeId = setInterval(ptop_banner, 5000);
  }); //图片轮播

  $(function() {
    $(".menus-list-icon").click(function () {
      $(this).toggleClass("menus-list-hide-click");
      $(".mobile-inner-menus").slideToggle(250);
    });
    $(".mobile-inner-menus a").each(function (index) {
      $(this).css({'animation-delay': (index / 10) + 's'});
    });
    $(".menu-up").click(function () {
      $(".mobile-inner-menus").slideUp(250);
      $(".menus-list-icon").removeClass("menus-list-hide-click");
    });
  }); //手机菜单

  $(function() {
    var windowWidth = $(window).width();

    function onWindowResize() {
      windowWidth = $(window).width();
      scrollToChangeNav();

      (function () {
        if (windowWidth < 1007) {
          $(".head-nav").hide();
        }
        window.onscroll = null;
      })();

      $(function() {
        var $this = $(".loan-pro-type").find("li");

        $this.unbind('mouseenter mouseleave'); // clear up

        if (windowWidth >= 1007) {
          $this.hover(function () {
            $(this).find(".pro-btn").show();
            $(this).find(".pro-des").hide();
          }).mouseleave(function () {
            $(this).find(".pro-btn").hide();
            $(this).find(".pro-des").show();
          });
        }
      }); //按钮响应变化

      function scrollToChangeNav() {
        var scrollHeight = $(window).scrollTop();

        if (windowWidth > 1200) {
          changeNav(538);
        } else if (windowWidth >= 1007 && windowWidth <= 1200) {
          changeNav(385);
        }

        function changeNav(pHeight) {
          showNav(pHeight);
        }

        function showNav(height) {
          if (scrollHeight > height) {
            $(".head-nav").removeClass("big-nav").addClass("small-nav");
          } else {
            $(".head-nav").removeClass("small-nav").addClass("big-nav");
          }
        }
      }

      //nav滚动变化
      $(function() {
        if (windowWidth >= 1007) {
          $(".head-nav").show();
          window.onscroll = scrollToChangeNav;
        }else{
          $(".head-nav").hide();
        }
      });
    }

    onWindowResize();

    window.onresize = onWindowResize;

  }); //banner卷动效果、nav滚动变化和按钮响应变化
});