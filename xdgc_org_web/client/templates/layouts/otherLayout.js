/**
 * Created by Administrator on 2015/11/27.
 */

Template.otherLayout.onRendered(function () {
  // Fade out the overlay div
  $('#overlay').fadeOut(800);

  /*//Logout Confirmation
  $('#logoutConfirm').popup({
    pagecontainer: '.container',
    transition: 'all 0.3s'
  });

  //scroll to top of the page
  $("#scroll-to-top").click(function () {
    $("html, body").animate({scrollTop: 0}, 600);
    return false;
  });*/

  bootbox.setLocale("zh_CN");

});