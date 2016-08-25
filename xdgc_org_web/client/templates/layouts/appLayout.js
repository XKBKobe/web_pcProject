var initEndless;

Template.appLayout.helpers({
  username: function () {
    return Session.get('username') || null;
  },

  routerName: function(){
    return Router.current().route.getName();
  }

});

Template.appLayout.events({});

Template.appLayout.onCreated(function () {
});

Template.appLayout.onRendered(function () {
  initEndless();

  //Logout Confirmation
  $('#logoutConfirm').popup({
    pagecontainer: '.container',
    transition: 'all 0.3s'
  });

  //scroll to top of the page
  $("#scroll-to-top").click(function () {
    $("html, body").animate({scrollTop: 0}, 600);
    return false;
  });

  bootbox.setLocale("zh_CN");

});


initEndless = function () {

  // Dropdown
  $('body .dropdown-toggle').dropdown();

  $('.datepicker').datepicker({language: 'zh-CN'});
  $('.timepicker').timepicker();
  $('[data-trigger = spinner]').spinner();

  // Popover
  $("[data-toggle=popover]").popover();

  //Stop preloading animation
  Pace.stop();

  // Fade out the overlay div
  $('#overlay').fadeOut(800);

  $('body').removeAttr('class');

  //Enable animation
  $('#wrapper').removeClass('preload');

  //Collapsible Active Menu
  if (!$('#wrapper').hasClass('sidebar-mini')) {
    $('aside').find('.active.openable').children('.submenu').slideDown();
  }

  //show/hide menu
  $('#menuToggle').click(function()	{
    $('#wrapper').toggleClass('sidebar-hide');
    $('.main-menu').find('.openable').removeClass('open');
    $('.main-menu').find('.submenu').removeAttr('style');
  });

  //Toggle Menu
  $('#sidebarToggle').click(function()	{
    $('#wrapper').toggleClass('sidebar-display');
    $('.main-menu').find('.openable').removeClass('open');
    $('.main-menu').find('.submenu').removeAttr('style');
  });

  $(window).scroll(function () {

    var position = $(window).scrollTop();

    //Display a scroll to top button
    if (position >= 200) {
      $('#scroll-to-top').attr('style', 'bottom:8px;');
    }
    else {
      $('#scroll-to-top').removeAttr('style');
    }
  });

  //upload file
  $('.upload-demo').change(function () {
    var filename = $(this).val().split('\\').pop();
    $(this).parent().find('span').attr('data-title', filename);
    $(this).parent().find('label').attr('data-title', 'Change file');
    $(this).parent().find('label').addClass('selected');
  });

  $('.remove-file').click(function () {
    $(this).parent().find('span').attr('data-title', 'No file...');
    $(this).parent().find('label').attr('data-title', 'Select file');
    $(this).parent().find('label').removeClass('selected');

    return false;
  });

  //所有文本框粘贴内容过滤前后空格
  $("body").on("paste", "input", function (e) {
    e.preventDefault();
    var text = (e.originalEvent || e).clipboardData.getData('text/plain');
    //window.document.execCommand('insertText', false, text);
    this.value = text.trim();
  });
};
