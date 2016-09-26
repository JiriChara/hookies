/* eslint import/no-extraneous-dependencies:0 */
/* eslint no-param-reassign:0 */
import test from 'ava';

import Hooks from '../src/Hooks';

test.beforeEach((t) => {
  t.context.hooksInstance = new Hooks();
});

test('initializes hooks', (t) => {
  t.deepEqual(t.context.hooksInstance.hooks, {});
});

test('initializes customAsyncMethod', (t) => {
  t.is(t.context.hooksInstance.customAsyncMethod, setTimeout);
});

test('sets customAsyncMethod', (t) => {
  const myCustomAsyncMethod = () => {};

  const hooksInstance = new Hooks({
    customAsyncMethod: myCustomAsyncMethod
  });

  t.is(hooksInstance.customAsyncMethod, myCustomAsyncMethod);
});

test('initializes hookiesBase', (t) => {
  t.is(t.context.hooksInstance.hookiesBase, t.context.hooksInstance);
});

test('sets hookiesBase', (t) => {
  const myHookiesBase = () => {};

  const hooksInstance = new Hooks({
    hookiesBase: myHookiesBase
  });

  t.is(hooksInstance.hookiesBase, myHookiesBase);
});

test('return new instance', (t) => {
  t.truthy(t.context.hooksInstance instanceof Hooks);
});
