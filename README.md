[![Build Status](https://travis-ci.org/JiriChara/hookies.svg)](https://travis-ci.org/JiriChara/hookies)
[![Code Climate](https://codeclimate.com/github/JiriChara/hookies/badges/gpa.svg)](https://codeclimate.com/github/JiriChara/hookies)
[![Test Coverage](https://codeclimate.com/github/JiriChara/hookies/badges/coverage.svg)](https://codeclimate.com/github/JiriChara/hookies)
[![Dependency Status](https://gemnasium.com/JiriChara/hookies.svg)](https://gemnasium.com/JiriChara/hookies)

# hookies v1.0.0

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


## Instalation

Bower `bower install hookies`

Node.js `npm install hookies.js`

## License
The MIT License (MIT) - See file 'LICENSE' in this project

## Copyright
Copyright © 2014 Jiri Chara. All Rights Reserved.
