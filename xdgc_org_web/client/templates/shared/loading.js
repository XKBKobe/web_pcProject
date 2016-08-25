/**
 * @author:   wangxq
 * @date:     Aug 21, 2015
 */
loading = {
  initialized: false,
  defaults: {
    timeout: 0 /* timeout after 15 seconds. */
  },
  init: function (options) {
    this.options = _.extend({}, this.defaults, options);
    this.clear();
    this.initialized = true;
  },
  clear: function () {
    Session.set('loading.waits', 0);
  },
  setTimeout: function (timeout) {
    var self = this;
    if (self.timeoutHandler) {
      Meteor.clearTimeout(self.timeoutHandler);
      self.timeoutHandler = null;
    }
    if (self.options.timeout > 0) {
      self.timeoutHandler = Meteor.setTimeout(function () {
        if (self.isShown()) {
          console.warn('Warning: loading overlay has been hiden by ' +
            (self.options.timeout / 1000) + ' seconds timeout.');
          self.clear();
        }
      }, timeout);
    }
  },
  isShown: function () {
    var waits = Session.get('loading.waits');
    return waits > 0;
  },
  pleaseWait: function () {
    var waits = Session.get('loading.waits');
    Session.set('loading.waits', waits + 1);
    this.setTimeout(this.options.timeout);
  },
  done: function () {
    var waits = Session.get('loading.waits');
    waits = waits - 1;
    Session.set('loading.waits', waits < 0 ? 0 : waits);
  }
};

Template.loading.onCreated(function () {
  loading.init({});
});

Template.loading.helpers({
  pleaseWait: function () {
    return Session.get('loading.waits') > 0;
  }
});
