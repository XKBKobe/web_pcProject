Template._modal.helpers({
  "id": function () {
    return this.id || Session.get("modal.id");
  },
  "title": function () {
    return this.title || Session.get("modal.title");
  },
  "body": function () {
    return this.body || Session.get("modal.body");
  },
  "footer": function () {
    return this.footer || Session.get("modal.footer");
  }
});
