Template.progressBar.helpers({
  percentage: function (val, per) {
    try {
      return val / per * 100;
    } catch (e) {
      return 0;
    }
  }
});
