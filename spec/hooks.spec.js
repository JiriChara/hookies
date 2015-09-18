describe('Hookies.Hooks', function () {
    "use strict";

    var Hookies = window.Hookies,
        self;

    beforeEach(function () {
        this.mockObj = function () {};
        Hookies.mixin(this.mockObj);
        this.hookies = this.mockObj.hookies;
        self = this;
    });

    describe('constructor', function () {
        it('sets hooks to empty object', function () {
            expect(this.hookies.hooks).toEqual({});
        });

        it('sets base to empty object when not given', function () {
            var hooky = new Hookies.Hooks();

            expect(hooky.hookiesBase).toEqual({});
        });

        it('sets base to given object', function () {
            expect(this.hookies.hookiesBase).toEqual(this.mockObj);
        });

        it('defaults customAsyncMethod to null', function () {
            expect(this.hookies.customAsyncMethod).toEqual(null);
        });

        it('sets customAsyncMethod to given one', function () {
            var hooky = new Hookies.Hooks({}, {
                customAsyncMethod: this.mockObj
            });

            expect(hooky.customAsyncMethod).toEqual(this.mockObj);
        });
    });

    describe('on method', function () {
        it('sets hook event to empty array if not already on', function () {
            this.hookies.on('foo', function () {});
            expect(this.hookies.hooks.foo instanceof Array).toBeTruthy();
        });

        it('checks that event name is a string', function () {
            expect(function() { self.hookies.on({}, function () {}); }).toThrowError(
                'Event name must be a string. Got: [object Object].'
            );
        });

        it('should have more then one argument', function () {
            expect(function() { self.hookies.on('foo'); }).toThrowError(
                'Wrong number of arguments.'
            );
        });

        it('should not accept more than 3 arguments', function () {
            expect(function() { self.hookies.on('foo', {}, function() {}, '4th'); }).toThrowError(
                'Wrong number of arguments.'
            );
        });

        it('appends callback function and context object to hooks', function () {
            var contextObject = { foo: 'bar' },
                callback = function () { return 'foo'; };

            self.hookies.on('foo', contextObject, callback);
            expect(self.hookies.hooks.foo[0].fn).toBe(callback);
            expect(self.hookies.hooks.foo[0].context).toBe(contextObject);
        });

        it('defaultly sets context to null when not given', function () {
            self.hookies.on('foo', function () {});
            expect(self.hookies.hooks.foo[0].context).toBe(null);
        });

        it('only accepts function callbacks', function () {
            expect(function () { self.hookies.on('foo', 'lol'); }).toThrowError(
                'Second argument must be a function.'
            );

            expect(function () { self.hookies.on('foo', {}); }).toThrowError(
                'Second argument must be a function.'
            );

            expect(function () { self.hookies.on('foo', [], 'foo'); }).toThrowError(
                'Third argument must be a function.'
            );
        });
    });

    describe('trigger method', function () {
        beforeEach(function () {
            this.callback = function () {
                self.lastThis = this;
                self.lastArgs = Array.prototype.slice.call(arguments, 0);
            };

            spyOn(this, 'callback').and.callThrough();

            this.hookies.on('foo', this.callback);
            jasmine.clock().install();
        });

        afterEach(function () {
            this.hookies.offAll();
            jasmine.clock().uninstall();
        });

        it('checks that event name is a string', function () {
            expect(function () { self.hookies.trigger(0, 1, 2, 3); }).toThrowError(
                'Event name must be a string. Got: 0.'
            );
        });

        it('accepts only valid object events', function () {
            expect(function () { self.hookies.trigger({}, 1, 2, 3); }).toThrowError(
                'Event object must contain name.'
            );
        });

        it('accepts object events with name and context', function () {
            var myContext = function () { return 1; };

            this.hookies.trigger({
                name: 'foo',
                context: myContext
            });

            jasmine.clock().tick(1);

            expect(this.callback).toHaveBeenCalled();
        });

        it('execs callbacks async', function () {
            this.hookies.trigger('foo');

            expect(this.callback).not.toHaveBeenCalled();

            jasmine.clock().tick(1);

            expect(this.callback).toHaveBeenCalled();
        });

        it('calls the callback with customAsyncMethod', function () {
            var hooky = new Hookies.Hooks({}, {
                customAsyncMethod: function (cb) {
                    setTimeout(function () {
                        cb();
                    }, 1);
                }
            });

            hooky.on('foo', this.callback);

            hooky.trigger('foo');

            expect(this.callback).not.toHaveBeenCalled();

            jasmine.clock().tick(2);

            expect(this.callback).toHaveBeenCalled();
        });

        it('accepts sync execution', function () {
            this.hookies.trigger({
                name: 'foo',
                sync: true
            });

            expect(this.callback).toHaveBeenCalled();
        });

        it('calls callback method in context of it\'s base by default', function () {
            var myContext = function () { return 'foobar'; };

            this.hookies.hookiesBase = myContext;

            this.hookies.trigger('foo');

            jasmine.clock().tick(1);

            expect(this.lastThis).toBe(myContext);
        });

        it('calls callback function with aditional arguments', function () {
            this.hookies.trigger('foo', 1, 2, 3);

            jasmine.clock().tick(1);

            expect(this.lastArgs[0]).toBe(1);
            expect(this.lastArgs[1]).toBe(2);
            expect(this.lastArgs[2]).toBe(3);
            expect(this.lastArgs[3]).toBeUndefined();
        });

        it('calls callback function with aditional arguments when event is an object', function () {
            this.hookies.trigger({ name: 'foo', sync: true }, 1, 2, 3);

            expect(this.lastArgs[0]).toBe(1);
            expect(this.lastArgs[1]).toBe(2);
            expect(this.lastArgs[2]).toBe(3);
            expect(this.lastArgs[3]).toBeUndefined();
        });
    });

    describe('off method', function () {
        it('sets hooks for given event to [] if no cb is given', function () {
            this.hookies.on('foo', function () {});
            this.hookies.on('foo', function () {});

            expect(this.hookies.hooks.foo.length).toBe(2);

            var removed = this.hookies.off('foo');

            expect(this.hookies.hooks.foo.length).toBe(0);

            expect(removed).toEqual(2);
        });

        it('removes hooks for specific callback only', function () {
            var cb1 = function () {};
            var cb2 = function () {};

            this.hookies.on('foo', cb1);
            this.hookies.on('foo', cb2);

            expect(this.hookies.hooks.foo.length).toBe(2);

            var removed = this.hookies.off('foo', cb1);

            expect(this.hookies.hooks.foo.length).toBe(1);
            expect(this.hookies.hooks.foo[0].fn).toBe(cb2);
            expect(this.hookies.hooks.foo[0].fn).not.toBe(cb1);

            expect(removed).toEqual(1);

            removed = this.hookies.off('foo', cb2);

            expect(this.hookies.hooks.foo.length).toBe(0);

            expect(removed).toEqual(1);
        });

        it('does not clear non-existing hooks', function () {
            expect(this.hookies.hooks.foo).toBeUndefined();

            var removed = this.hookies.off('foo');

            expect(this.hookies.hooks.foo).toBeUndefined();

            expect(removed).toEqual(0);
        });

        it('throws an error if event is not a string', function () {
            var wrong = [1, {}, [], undefined],
                i,
                selfie = this;

            for (i = 0; i < wrong.length; i++) {
                expect(function () {
                    selfie.hookies.off(wrong[i]);
                }).toThrowError(
                    'Event must be a string'
                );
            }
        });

        it('throws an error if callback is no a function', function () {
            var wrong = [1, {}, [], null],
                i,
                selfie = this;

            for (i = 0; i < wrong.length; i++) {
                expect(function () {
                    selfie.hookies.off('foo', wrong[i]);
                }).toThrowError(
                    'Callback must be a function'
                );
            }
        });
    });

    describe('offAll method', function () {
        it('sets hooks to empty object', function () {
            this.hookies.on('foo', function () {});
            this.hookies.on('bar', function () {});
            expect(this.hookies.hooks.foo).toBeDefined();
            expect(this.hookies.hooks.bar).toBeDefined();
            this.hookies.offAll();
            expect(this.hookies.hooks).toEqual({});
        });
    });
});
