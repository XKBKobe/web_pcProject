# XDGC web application for admin

## Configure

Once you get a copy to this app, you may need to generate a configure file for runtime needed. This can be done by copy `settings.example.json` to a new file `settings.json` and edit it.

Settings can be used by `Meteor.settings.foo` like codes within your codes for development. While public configure items can be used on client as well by `Meteor.settings.public.foo`.

See more at file *settings.example.json*.

## Namespace

files: `./packages/namespace/`

### Usage

Calling the Namespace function creates a global namespace and returns the namespace to be edited

```javascript
Namespace('my.app.namespace').test = 'hello world';
console.log(my.app.namespace.test); // Prints out 'hello world'
```

When passing in a function 'this' is bound to the specified namespace

```javascript
Namespace('my.app.namespace', function() {
  this.test2 = 'hello again!';
});
console.log(my.app.namespace.test2); // Prints out 'hello again!'
```

If passing in a object literal the key/value pairs will be added to the namespace

```javascript
Namespace('my.app.namespace', {
  test3: 'goodbye!'
});
console.log(my.app.namespace.test3); // Prints out 'goodbye!'
```

### Server only

Use `Namespace.server` instead of `Namespace`.

```javascript
Namespace.server('my.app.namespace', function() {
  this.serverVal = my.app.do.secret.thing();
});
```

### Client only

Use `Namespace.client` instead of `Namespace`.

```javascript
Namespace.server('my.app.namespace', function() {
  this.serverVal = my.app.do.secret.thing();
});
```


## Message

Use *s-alert* package as message display.

### Usage:

```javascript
sAlert.info('information to show');
sAlert.success('success to show');
sAlert.warning('warning to show');
sAlert.error('error to show');
```

## Alert, Confirm, Prompt, and Custom Dialog

We are using `bootboxjs` as alert, confirm, prompt and custom dialog.

### Alert usage

Default:

```javascript
bootbox.alert("Your message here…")
```

With callback:

```javascript
bootbox.alert("Your message here…", function(){ /* your callback code */ })
```

### Confirm usage

callback accepts an argument as return value from browser operation, and value is `ture` or `false`.

Default:

```javascript
bootbox.confirm("Your message here…", function(result){ /* your callback code */ })
```

options:
```javascript
bootbox.confirm({
    size: 'small',
    message: "Your message here…",
    callback: function(result){ /* your callback code */ }
})
```

### Prompt usage

Default:

```javascript
bootbox.prompt("Your message here…", function(result){ /* your callback code */ })
```

### Further usage

See document at http://bootboxjs.com/documentation.html

## Progress Bar

Handlebars template:

```handlebars
{{> progressBar total=100 current=60 average=80}}
{{> progressBar total=100 current=30 average=50}}
{{> progressBar total=100 current=10 average=0}}
```
