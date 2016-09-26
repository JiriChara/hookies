/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';
import isFunction from 'lodash.isfunction';

import Hooks from '../src/Hooks';

test.beforeEach((t) => {
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

  t.context.tom = new Cat('Tom');
  t.context.jerry = new Mouse('Jerry');
});


test('has on method', (t) => {
  t.true(isFunction(t.context.tom.on));
  t.true(isFunction(t.context.jerry.on));
});

test('has off method', (t) => {
  t.true(isFunction(t.context.tom.off));
  t.true(isFunction(t.context.jerry.off));
});

test('has offAll method', (t) => {
  t.true(isFunction(t.context.tom.offAll));
  t.true(isFunction(t.context.jerry.offAll));
});
