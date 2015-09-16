[![Build Status](https://travis-ci.org/JiriChara/hookies.svg)](https://travis-ci.org/JiriChara/hookies)
[![Code Climate](https://codeclimate.com/github/JiriChara/hookies/badges/gpa.svg)](https://codeclimate.com/github/JiriChara/hookies)
[![Test Coverage](https://codeclimate.com/github/JiriChara/hookies/badges/coverage.svg)](https://codeclimate.com/github/JiriChara/hookies/coverage)
[![Dependency Status](https://gemnasium.com/JiriChara/hookies.svg)](https://gemnasium.com/JiriChara/hookies)

# hookies v1.0.5

Hookies is a very simple object specific publish/subscribe library. Hookies allows you to create "as many as you need" independent objects that will enjoy it's own `on`|`off` and `trigger` methods. Let me give you an example:

```javascript
var Cat = function (name) {
    this.name = name;

    // add hookies to the cat
    Hookies.mixin(this);
};

var Mouse = function (name) {
    this.name = name;

    // mouse will have hookiess to
    Hookies.mixin(this);
}

var tom = new Cat('Tom');
var jerry = new Mouse('Jerry');

// tom subscribes to `detect-mouse` event.
tom.hookies.on('detect-mouse', function (mouse) {
    console.log(this.name + ' has detected ' + mouse.name);

    mouse.hookies.trigger('detected-by-cat', this);
});

jerry.hookies.on('detected-by-cat', function (cat) {
    console.log(this.name + ' runs away, because ' + cat.name + ' is chasing him.');
});

tom.hookies.trigger('detect-mouse', jerry);

// This will produce following output:
//
// Tom has detected Jerry
// Jerry runs away, because Tom is chasing him.
```

## Installation

As simple as:

Bower `bower install hookies`

Node.js `npm install hookies`

Please use version `1.0.5` which is the latest stable one

## Usage

You have already seen, that `Hookies` can be mixed into your object, but you can also inherit from `Hookie.Hooks()` to achive the similar effect:

```javascript
var Cat = function (name) {
    this.name = name;

    // Set the `hookiesBase` in order to execute callback function in context
    // of Cat instance. This means that `this` inside callback functions will
    // be an instance of a Cat (you can always change the context within `on`
    // or even `trigger` method.
    // If you don't set `hookiesBase`, then callback will be executed in
    // context of empty object `{}` by default
    this.hookiesBase = this;

    this.on('drink', function () {
        console.log(this.name + ' is drinking milk.');
    });
};

Cat.prototype = new Hookies.Hooks();

var tom = new Cat('Tom');

tom.trigger('drink');
// Tom is drinking milk
```

You can also use `Hookies.Hooks` as a standalone object:

```javascript
var myHookie = new Hookies.Hooks();

// Second argument can be optionally and object which will represent `this`
// inside a callback
myHookie.on('foo', { name: 'John' }, function () {
    console.log(this.name, arguments);
});

myHookie.trigger('foo', 1, 2, 3);
// John [1, 2, 3]
```

Callback functions are executed asynchronously, but you can force them to run synchronously too:

```javascript
var myHookie = new Hookies.Hooks();

myHookie.on('foo', { name: 'John' }, function () {
    console.log(this.name, arguments);
});

myHookie.trigger({
    name: 'foo',
    sync: true, // run synchronously
    // you can overwrite `this` inside callback function whenever you need to
    context: { name: 'Bob' }
}, 1, 2, 3);

console.log('I am sync');

myHookie.trigger('foo', 1, 2, 3);

console.log('I am async');

// Bob [1, 2, 3]
// I am sync
// I am async
// John [1, 2, 3]
```

## License
The MIT License (MIT) - See file 'LICENSE' in this project

## Copyright
Copyright © 2014 Jiri Chara. All Rights Reserved.
