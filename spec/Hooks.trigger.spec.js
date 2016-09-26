/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';
import sinon from 'sinon';

import Hooks from '../src/Hooks';

test.beforeEach((t) => {
  t.context.hooksInstance = new Hooks();
  t.context.eventName = 'foo';
  t.context.cb01 = sinon.spy();
  t.context.cb02 = sinon.spy();

  t.context.hooksInstance.on(t.context.eventName, t.context.cb01);
  t.context.hooksInstance.on(t.context.eventName, t.context.cb02);
});

test('throws when event object has not name', (t) => {
  t.throws(() => t.context.hooksInstance.trigger({}), /Event object must contain name./);
  t.throws(() => t.context.hooksInstance.trigger([]), /Event object must contain name./);
  t.throws(() => t.context.hooksInstance.trigger(/foo/), /Event object must contain name./);
});

test('throws when event name is not a string', (t) => {
  t.throws(() => t.context.hooksInstance.trigger(null), /Event name must be a string./);
  t.throws(() => t.context.hooksInstance.trigger(), /Event name must be a string./);
});

test.cb('calls all callback methods asynchronously', (t) => {
  t.plan(4);
  t.context.hooksInstance.trigger(t.context.eventName);

  t.false(t.context.cb01.called);
  t.false(t.context.cb02.called);

  setTimeout(() => {
    t.true(t.context.cb01.called);
    t.true(t.context.cb02.called);
    t.end();
  }, 1);
});

test('can call callbacks synchronously', (t) => {
  t.context.hooksInstance.trigger({
    name: t.context.eventName,
    sync: true
  });

  t.true(t.context.cb01.called);
  t.true(t.context.cb02.called);
});

test('it can change context (sync)', (t) => {
  t.pass(1);

  const value = 'bar';
  const cb = function () {
    t.is(this.foo, value);
  };

  t.context.hooksInstance.on(t.context.eventName, cb);

  t.context.hooksInstance.trigger({
    name: t.context.eventName,
    context: {
      foo: value
    },
    sync: true
  });
});

test('it can change context (async)', (t) => {
  t.pass(1);

  const value = 'bar';
  const cb = function () {
    t.is(this.foo, value);
  };

  t.context.hooksInstance.on(t.context.eventName, cb);

  t.context.hooksInstance.trigger({
    name: t.context.eventName,
    context: {
      foo: value
    }
  });
});

test.cb('uses hookiesBase', (t) => {
  t.pass(1);
  const value = 'bar';

  const hookiesBase = {
    foo: value
  };
  const cb = function () {
    t.is(this.foo, value);
    t.end();
  };

  const hooksInstance = new Hooks({
    hookiesBase
  });
  hooksInstance.on(t.context.eventName, cb);

  hooksInstance.trigger({
    name: t.context.eventName,
    context: {
      foo: value
    }
  });
});

test.cb('passes arguments to callback method (async)', (t) => {
  t.pass(3);
  const val1 = 1;
  const val2 = 2;
  const val3 = 3;

  const cb = function (arg1, arg2, arg3) {
    t.is(arg1, val1);
    t.is(arg2, val2);
    t.is(arg3, val3);
    t.end();
  };

  t.context.hooksInstance.on(t.context.eventName, cb);

  t.context.hooksInstance.trigger(t.context.eventName, val1, val2, val3);
});

test('passes arguments to callback method (sync)', (t) => {
  t.pass(3);
  const val1 = 1;
  const val2 = 2;
  const val3 = 3;

  const cb = function (arg1, arg2, arg3) {
    t.is(arg1, val1);
    t.is(arg2, val2);
    t.is(arg3, val3);
  };

  t.context.hooksInstance.on(t.context.eventName, cb);

  t.context.hooksInstance.trigger({
    name: t.context.eventName,
    sync: true
  }, val1, val2, val3);
});

test.cb('uses context of the subscriber', (t) => {
  t.pass(1);

  const value = 'bar';

  const hookiesBase = {
    foo: value
  };

  const cb = function () {
    t.is(this.foo, value);
    t.end();
  };

  t.context.hooksInstance.on(t.context.eventName, hookiesBase, cb);

  t.context.hooksInstance.trigger(t.context.eventName);
});

test.cb('can use customAsyncMethod', (t) => {
  t.pass(1);
  const value = 'foo';
  const cb = (arg) => {
    t.is(arg, value);
    t.end();
  };

  const customAsyncMethod = () => {
    cb(value);
  };

  const hooksInstance = new Hooks({
    customAsyncMethod
  });

  hooksInstance.on(t.context.eventName, cb);
  hooksInstance.trigger(t.context.eventName);
});
