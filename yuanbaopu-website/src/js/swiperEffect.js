$(document).ready(function () {
  $(function() {
    var swiper = new Swiper('.swiper-container', {
      pagination: '.swiper-pagination',
      paginationClickable: true,
      autoplay: 5000,
      effect: 'fade',
      autoplayDisableOnInteraction: false
    });
  }); //手机轮播pagination
});