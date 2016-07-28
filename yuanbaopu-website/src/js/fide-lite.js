$(document).ready(function () {
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

  $(function () {
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

      function scrollToChangeNav() {
        var scrollHeight = $(window).scrollTop();

        if (windowWidth >= 1007) {
          changeNav(348);
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
      $(function () {
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

  }); //banner卷动效果、nav滚动变化

});