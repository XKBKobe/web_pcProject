# wxqee:namespace for meteorjs

## Namespace

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

