import isString from 'lodash.isstring';
import isObject from 'lodash.isobject';
import isFunction from 'lodash.isfunction';
import isArray from 'lodash.isarray';
import isUndefined from 'lodash.isundefined';
import forEach from 'lodash.foreach';
import filter from 'lodash.filter';
import isEmpty from 'lodash.isempty';
import forOwn from 'lodash.forown';

import exec from './exec';
import validateEvent from './validateEvent';

export default class Hooks {
  constructor({ customAsyncMethod = setTimeout, hookiesBase = null } = {}) {
    // Storage for registered hooks
    this.hooks = {};

    this.customAsyncMethod = customAsyncMethod;
    this.hookiesBase = hookiesBase;
  }

  on(event, ...args) {
    let base;

    validateEvent(event);

    if (args.length === 0 || args.length > 2) {
      throw new Error('Wrong number of arguments.');
    }

    if (args.length === 2) {
      if (!isObject(args[0])) {
        throw new Error('Second argument must be an object.');
      }

      base = args[0];

      args.shift();
    }

    if (!isFunction(args[0])) {
      throw new Error(
        `${base ? 'Third' : 'Second'} argument must be a function.')`
      );
    }

    const cb = {
      context: base || null,
      fn: args[0]
    };

    if (!isArray(this.hooks[event])) {
      this.hooks[event] = [];
    }

    return this.hooks[event].push(cb);
  }

  trigger(event, ...args) {
    let base;
    let sync;
    let eventName;

    if (isObject(event)) {
      if (isString(event.name)) {
        base = event.context;
        sync = event.sync;
        eventName = event.name;
      } else {
        throw new Error('Event object must contain name.');
      }
    }

    eventName = eventName || event;

    validateEvent(eventName);

    forEach(this.hooks[eventName] || [], (cb) => {
      exec(
        cb.fn,
        base || cb.context || this.hookiesBase,
        !!sync,
        this.customAsyncMethod,
        args
      );
    });
  }

  off(event, callback) {
    const eventHooks = this.hooks[event] || [];
    const eventHooksCount = eventHooks.length;

    validateEvent(event);

    if (!isFunction(callback) && !isUndefined(callback)) {
      throw new Error('Callback must be a function.');
    }

    if (isFunction(callback)) {
      this.hooks[event] = filter(eventHooks, hook => hook.fn !== callback);

      if (isEmpty(this.hooks[event])) {
        delete this.hooks[event];
      }
    } else {
      delete this.hooks[event];
    }

    return eventHooksCount - (this.hooks[event] || []).length;
  }

  offAll() {
    let count = 0;

    forOwn(this.hooks, (h) => {
      count += h.length;
    });

    this.hooks = {};

    return count;
  }
}
