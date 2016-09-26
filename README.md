[![Build Status](https://travis-ci.org/JiriChara/hookies.svg)](https://travis-ci.org/JiriChara/hookies)
[![Code Climate](https://codeclimate.com/github/JiriChara/hookies/badges/gpa.svg)](https://codeclimate.com/github/JiriChara/hookies)
[![Test Coverage](https://codeclimate.com/github/JiriChara/hookies/badges/coverage.svg)](https://codeclimate.com/github/JiriChara/hookies/coverage)
[![Dependency Status](https://gemnasium.com/JiriChara/hookies.svg)](https://gemnasium.com/JiriChara/hookies)

# hookies

Hookies is a very simple object specific publish/subscribe library. Hookies allows you to create "as many as you need" independent objects that will enjoy it's own `on`|`off` and `trigger` methods. Let me give you an example:

```javascript
import Hooks from 'hookies';

class Cat extends Hooks {
  constructor(name) {
    super();
    this.name = name;
  }
}

class Mouse extends Hooks {
  constructor(name) {
    super();
    this.name = name;
  }
}

const tom = new Cat('Tom');
const jerry = new Mouse('Jerry');

// tom subscribes to `detect-mouse` event.
tom.on('detect-mouse', function (mouse) {
  console.log(this.name + ' has detected ' + mouse.name);

  mouse.hookies.trigger('detected-by-cat', this);
});

jerry.on('detected-by-cat', function (cat) {
  console.log(this.name + ' runs away, because ' + cat.name + ' is chasing him.');
});

tom.trigger('detect-mouse', jerry);

// This will produce following output:
//
// Tom has detected Jerry
// Jerry runs away, because Tom is chasing him.
```

## Installation

As simple as:

`npm install hookies`

## Usage

```javascript
import Hooks from 'hookies';

const myHookie = new Hooks();

// Second argument can be optionally and object which will represent `this`
// inside a callback
myHookie.on('foo', { name: 'John' }, function () {
    console.log(this.name, arguments);
});

myHookie.trigger('foo', 1, 2, 3);
// John [1, 2, 3]
```

Callback functions are executed asynchronously by default, but you can force them to run synchronously too:

```javascript
const myHookie = new Hookies.Hooks();

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
Copyright © 2016 Jiri Chara. All Rights Reserved.
