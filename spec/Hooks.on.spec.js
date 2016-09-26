/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';
import sinon from 'sinon';
import contains from 'lodash.contains';
import map from 'lodash.map';

import Hooks from '../src/Hooks';

test.beforeEach((t) => {
  t.context.hooksInstance = new Hooks();
});

test('throws if event is not string', (t) => {
  t.throws(() => t.context.hooksInstance.on({}), /Event name must be a string./);
});

test('throws if 0 arguments', (t) => {
  t.throws(() => t.context.hooksInstance.on(), /Event name must be a string./);
});

test('throws if no callback', (t) => {
  t.throws(() => t.context.hooksInstance.on('foo'), /Wrong number of arguments./);
});

test('throws if too many arguments', (t) => {
  t.throws(() => t.context.hooksInstance.on('foo', 'bar', 'baz', 'lala'), /Wrong number of arguments./);
});

test('throws if callback is not function', (t) => {
  t.throws(() => t.context.hooksInstance.on('foo', 'bar'), /Second argument must be a function/);
  t.throws(() => t.context.hooksInstance.on('foo', {}, 'baz'), /Third argument must be a function/);
});

test('throws if event object is not an object', (t) => {
  t.throws(() => t.context.hooksInstance.on('foo', 'bar', 'baz'), /Second argument must be an object./);
});

test('creates new subscriber', (t) => {
  const cbFunction = sinon.spy();
  const eventName = 'foo';
  const hooksInstance = t.context.hooksInstance;

  hooksInstance.on(eventName, cbFunction);

  const eventHooks = hooksInstance.hooks[eventName];

  const callbacks = map(eventHooks, o => o.fn);

  t.true(contains(callbacks, cbFunction));

  t.deepEqual(eventHooks[0], {
    context: null,
    fn: cbFunction
  });
});

test('overrides context object', (t) => {
  const cbFunction = sinon.spy();
  const eventName = 'foo';
  const hooksInstance = t.context.hooksInstance;
  const contextValue = 'bar';
  const contextClass = {
    foo: contextValue
  };

  hooksInstance.on(eventName, contextClass, cbFunction);

  const eventHooks = hooksInstance.hooks[eventName];

  t.deepEqual(eventHooks[0], {
    context: contextClass,
    fn: cbFunction
  });
});
