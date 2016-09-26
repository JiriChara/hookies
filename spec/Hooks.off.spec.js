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

test('removes all callbacks for given event', (t) => {
  t.is(t.context.hooksInstance.hooks[t.context.eventName].length, 2);
  t.context.hooksInstance.off(t.context.eventName);
  t.is(t.context.hooksInstance.hooks[t.context.eventName], undefined);
});

test('removes one specific callback', (t) => {
  t.context.hooksInstance.off(t.context.eventName, t.context.cb01);
  t.is(t.context.hooksInstance.hooks[t.context.eventName].length, 1);
  t.is(t.context.hooksInstance.hooks[t.context.eventName][0].fn, t.context.cb02);
  t.context.hooksInstance.off(t.context.eventName, t.context.cb02);
  t.is(t.context.hooksInstance.hooks[t.context.eventName], undefined);
});

test('throws if callback is not a function', (t) => {
  t.throws(
    () => t.context.hooksInstance.off(t.context.eventName, 'foo'),
    /Callback must be a function./
  );
});

test('throws if event name is not a function', (t) => {
  t.throws(
    () => t.context.hooksInstance.off(),
    /Event name must be a string./
  );
});

test('returns count of removed events when removed all', (t) => {
  t.is(t.context.hooksInstance.off(t.context.eventName), 2);
});
