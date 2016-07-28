$(document).ready(function () {
  $(function () {
    $(".company-sum").mouseenter(function () {
      $(this).animate({width: "100px"});
    }).mouseleave(function () {
      $(this).animate({width: "41px"});
    })
  }); // 固定菜单隐藏菜单变化

  $(function () {
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

  $(function () {
    var windowWidth = $(window).width();

    function onWindowResize(){
      windowWidth = $(window).width();

      if (windowWidth >= 1007) {
        $('#aboutYBP').fullpage({
          verticalCentered: !1,
          navigation: 0, onLeave: function (index, nextIndex, direction) {
            if (index == 2 && direction == 'up') {
              $(".head-nav").removeClass("small-nav").addClass("big-nav");
            } else if (index == 1 && direction == 'down') {
              $(".head-nav").removeClass("big-nav").addClass("small-nav");
            }
          }
        });
      }
    }
    onWindowResize();

    window.onresize = onWindowResize;

  }); //导航条变化

  $(function () {
    $(".company-pic").yx_rotaion({
      auto: true,
      during: 5000,
      btn: false,
      focus: true,
      title: true
    });

    $(".ybp-manager").yx_rotaion({
      auto: false,
      btn: true
    });

    $(".ybp-office").yx_rotaion({
      auto: false,
      btn: true
    });
  }); //图片切换
});
