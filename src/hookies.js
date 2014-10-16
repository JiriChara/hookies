//  Hookies.JS v1.0.0
//  Jiri Chara <me@jirichara.com
//  Copyright (c) 2014 Jiri Chara. All Rights Reserved.
//  The MIT License (MIT) - See file 'LICENSE' in this project

(function (root, factory) {
    "use strict";
    // Set up Backbone appropriately for the environment.

    // AMD
    if (typeof define === 'function' && define.amd) {
        define(['exports'], function(exports) {
            root.Backbone = factory(root, exports);
        });
    } else if (typeof exports !== 'undefined') {
        factory(root, exports);
    // Regular browser
    } else {
        root.Hookies = factory(root, {});
    }
} (this, function(root, Hookies) {
    "use strict";

    // Save the previous value of the `Hookies` variable, so that it can be
    // restored later on, if `noConflict` is used.
    var previousHookies = root.Hookies;

    // Current version of the library.
    Hookies.VERSION = '1.0.0';

    // Runs Hookies.js in *noConflict* mode, returning the `Hookies` variable
    // to its previous owner. Returns a reference to this Hookies object.
    Hookies.noConflict = function () {
        root.Hookies = previousHookies;
        return this;
    };

    // Helper functions
    // ----------------

    // Is given variable an array?
    var isArray = Array.isArray || function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    // Is given variable an string?
    var isString = function (obj) {
        return Object.prototype.toString.call(obj) === '[object String]';
    };

    // Is given variable an function?
    var isFunction = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Function]';
    };

    // Optimize `isFunction` if appropriate. Work around an IE 11 bug.
    if (typeof /./ !== 'function') {
        isFunction = function (obj) {
            return typeof obj === 'function' || false;
        };
    }

    // Is a given variable an object?
    var isObject = function (obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    // Exec given callback
    var exec = function (callback, context, sync, args) {
        if (isFunction(callback)) {
            var deliver = function () {
                callback.apply(context, args);
            };

            if (sync === true) {
                deliver();
            } else {
                setTimeout(function () { deliver(); }, 0);
            }
        }
    };

    // Add hooks to the given object
    Hookies.mixin = function (base) {
        if (!isObject(base)) {
            throw new Error('Base object must be an object. Got: ' + base);
        }

        base.hookies = new Hookies.Hooks(base);

        return this;
    };

    // Hookies.Hooks class definition
    // -----------------------------

    // Definition of a Hookies.Hooks class
    Hookies.Hooks = function (base) {
        // Variable for hooks storage
        this.hooks = {};

        // Base object to add hooks to
        this.hookiesBase = base || {};
    };

    var validateEvent = function (event) {
        if (!isString(event)) {
            throw new Error('Event name must be a string. Got: ' + event + '.');
        }
    };

    // Subscribe to an event
    Hookies.Hooks.prototype.on = function (event) {
        var args = Array.prototype.slice.call(arguments, 0),
            cb,
            base;

        args.shift(); // get rid of event

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
            throw new Error((base ? 'Third' : 'Second') + ' argument must be a function.');
        }

        cb = {
            context: base || null,
            fn: args[0]
        };

        if (!isArray(this.hooks[event])) {
            this.hooks[event] = [];
        }

        this.hooks[event].push(cb);
    };

    // Trigger an event
    // First argument must be an event object or string
    // Rest of the arguments will be passed to callback function
    Hookies.Hooks.prototype.trigger = function (event) {
        // Convert arguments to an array
        var args = Array.prototype.slice.call(arguments, 0),
            base,
            i,
            cb,
            self = this,
            sync;

        args.shift(); // get rid of event

        if (isObject(event)) {
            if (isString(event.name)) {
                base = event.context;
                sync = event.sync;
                event = event.name;

                args.shift();
            } else {
                throw new Error('Event object must contain name.');
            }
        }

        validateEvent(event);

        for (i in (this.hooks[event] || [])) {
            if (this.hooks.hasOwnProperty(event)) {
                cb = this.hooks[event][i];
                if (isObject(cb)) {
                    exec(cb.fn, base || cb.context || self.hookiesBase, !!sync, args);
                }
            }
        }
    };

    // Unsubscribe to an event
    // Event must be a string
    Hookies.Hooks.prototype.off = function (event) {
        var eventHooks = this.hooks[event];

        if (isArray(eventHooks) && eventHooks.length > 0) {
            this.hooks[event] = [];
        }
    };

    // Clear all hooks (unsubscribe all)
    Hookies.Hooks.prototype.offAll = function () {
        this.hooks = {};
    };

    return Hookies;
}));
