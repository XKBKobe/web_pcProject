$(document).ready(function () {
  $(function() {
    var timeId;
    var liLen = $('#statusitem span').length;
    var items = $('#statusitem span');
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

      function scrollToChangeNav() {
        var scrollHeight = $(window).scrollTop();

        if (windowWidth > 1200) {
          changeNav(538);
        } else if (windowWidth >= 1007 && windowWidth <= 1200) {
          changeNav(420);
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

  }); //banner卷动效果、nav滚动变化

  $(function () {
    function DropDown(el) {
      this.product = el;
      this.initEvents();
    }
    DropDown.prototype = {
      initEvents: function () {
        var obj = this;

        obj.product.on('click', function (event) {
          $(this).addClass("blue-border");
          $(this).find(".dropdown").slideToggle(200);
        });
      }
    };

    $(function () {
      var product = new DropDown($('#product-list'));

      $(".product-menus").mouseleave(function () {
        $(this).find(".dropdown").slideUp();
        setTimeout(function () {
          $(".product-menus").removeClass("blue-border");
        }, 400);
      });

      var user = new DropDown($('#user-list'));

      $(".user-menus").mouseleave(function () {
        $(this).find(".dropdown").slideUp();
        setTimeout(function () {
          $(".user-menus").removeClass("blue-border");
        }, 400);
      });

    });
  }); // 关于元宝铺下拉框

  $(function () {
    $(".cases").find("li").click(function () {
      var id = $(this).index();
      $(".details-overlay").find(".info").hide();
      $(".white-overlay").show();
      $(".details-overlay").find(".info").eq(id).show();
      $(".details-overlay").show().addClass("open");
    });

    $(".overlay-close").click(function () {
      $(".details-overlay").removeClass("open").hide();
      $(".white-overlay").hide();
    });
  }); //手机人物展示

  $(function () {
    $(".feedback").on('click',function () {
      var layWidth  =$(window).width();
      var layHeight =$(document).height();
      var contHeight =$(window).height();
      var contWidth  =$(window).width();
      var scrollTop = $(document).scrollTop();
      var scrollLeft = $(document).scrollLeft();
      var top=(contHeight-$(".feedback-form").height())/2;
      var left=(contWidth-$(".feedback-form").width())/2;
      $(".feedback-overlay").css({"height":layHeight}).show();

      $(".feedback-form").fadeIn();
      $("#close").click(function(){
        $(".feedback-overlay").hide();
        $(".feedback-form").fadeOut();
      });
    });
  }); //信息反馈弹出层

  $(function(){
    if(!placeholderSupport()){   // 判断浏览器是否支持 placeholder
      $('[placeholder]').focus(function() {
        var input = $(this);
        if (input.val() == input.attr('placeholder')) {
          input.val('');
          input.removeClass('placeholder');
        }
      }).blur(function() {
        var input = $(this);
        if (input.val() == '' || input.val() == input.attr('placeholder')) {
          input.addClass('placeholder');
          input.val(input.attr('placeholder'));
        }
      }).blur();
    }
  });
  function placeholderSupport() {
    return 'placeholder' in document.createElement('input');
  }
});
