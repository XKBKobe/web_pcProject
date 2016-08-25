
FlashNotificationCollection = function(options) {
    Mongo.Collection.call(this, null);
    this.options = _.extend({}, options, {
        trackConnectionStatus: !0
    });
    this.options.trackConnectionStatus && this._trackConnectionStatus();
};

FlashNotificationCollection.prototype = new Mongo.Collection(null);

FlashNotificationCollection.prototype.add = function(notification) {
    var self = this;
    notification.pinned  = !!notification.pinned;
    notification.timeout = notification.timeout || 3E3;
    check(notification, {
        title: String,
        description: String,
        feeling: String,
        icon: String,
        pinned: Boolean,
        timeout: Number,
        actionLink: Match.Optional({
            classes: String,
            href: Match.Optional(String),
            onclick: Match.Optional(Function),
            text: String
        })
    });
    var updated = this.upsert(notification, notification);
    notification.pinned || Meteor.setTimeout(function() {
        self.remove(updated.insertedId);
    }, notification.timeout);
}

FlashNotificationCollection.prototype._trackConnectionStatus = function() {
    var self = this, notification = {
        title: "连接服务器",
        description: "正在尝试与服务器连接",
        pinned: !0,
        feeling: "neutral",
        icon: "sync"
    };
    Deps.autorun(function() {
        Meteor.status().connected ? self.remove(notification) : self.add(notification)
    });
}

FlashNotifications = new FlashNotificationCollection  

Template.flashNotifications.helpers({
    items: function() {
        return lookup("FlashNotifications", this).find()
    }
})

Template._flashNotificationsItem.events({
    click: function(evt, tmpl) {
        this.pinned || lookup("FlashNotifications", tmpl.data).remove({_id: this._id});
    },
    "click [data-action]": function() {
        this.onclick && this.onclick(this);
    }
})

Template.flashNotifications.tests = {
    _collection: new FlashNotificationCollection,
    basic: function() {
        var self = this, items = [{
            title: "Blocked",
            description: "George Halpert",
            pinned: !0,
            feeling: "negative",
            icon: "flag",
            actionLink: {
                classes: "undo inverse",
                onclick: function() {
                    alert("clicked")
                },
                text: "Undo"
            }
        }, {
            title: "Invited",
            description: "20 students were invited",
            pinned: !0,
            feeling: "positive",
            icon: "email"
        }, {
            title: "Connecting",
            description: "Test: Trying to connect to server",
            pinned: !0,
            feeling: "neutral",
            icon: "sync"
        }];
        return _.each(items, function(item) {
            self._collection.add(item)
        }), {
            FlashNotifications: self._collection
        }
    }
}
