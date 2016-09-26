/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';
import sinon from 'sinon';

import Hooks from '../src/Hooks';

test.beforeEach((t) => {
  t.context.hooksInstance = new Hooks();

  t.context.eventName01 = 'foo';
  t.context.eventName02 = 'bar';
  t.context.cb01 = sinon.spy();
  t.context.cb02 = sinon.spy();
  t.context.cb03 = sinon.spy();
  t.context.cb04 = sinon.spy();

  t.context.hooksInstance.on(t.context.eventName01, t.context.cb01);
  t.context.hooksInstance.on(t.context.eventName01, t.context.cb02);
  t.context.hooksInstance.on(t.context.eventName02, t.context.cb03);
  t.context.hooksInstance.on(t.context.eventName02, t.context.cb04);
});

test('removes all hooks', (t) => {
  t.context.hooksInstance.offAll();

  t.deepEqual(t.context.hooksInstance.hooks, {});
});

test('returns count of removed events', (t) => {
  t.is(t.context.hooksInstance.offAll(), 4);
});

test('returns 0 if no more events', (t) => {
  t.context.hooksInstance.offAll();

  t.is(t.context.hooksInstance.offAll(), 0);
});
