describe('Hookies', function () {
    "use strict";

    var Hookies = window.Hookies;

    it('should set window Hookies', function () {
        expect(window.Hookies).toBeDefined();
    });

    it('should contain version number', function () {
        expect(Hookies.VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('noConflict should work properly', function () {
        expect(window.Hookies).toBeDefined();
        var noConflictHookies = Hookies.noConflict();
        expect(window.Hookies).toBeUndefined();
        window.Hookies = noConflictHookies;
        expect(window.Hookies).toEqual(noConflictHookies);
    });

    it('should respond to Hooks', function () {
        expect(Hookies.Hooks).toBeDefined();
    });

    describe('mixin method', function () {
        it('should accept object parameters', function () {
            expect(function () { Hookies.mixin(function () {}); }).not.toThrow();
            expect(function () { Hookies.mixin({}); }).not.toThrow();
            expect(function () { Hookies.mixin([]); }).not.toThrow();
        });

        it('should not accept non-object parameters', function () {
            expect(function () { Hookies.mixin("foo"); }).toThrow();
            expect(function () { Hookies.mixin(1); }).toThrow();
        });

        it('should set `hookies` of base object to new instance of Hooks', function () {
            var f = function () {};
            Hookies.mixin(f);

            expect(f.hookies instanceof Hookies.Hooks).toBeTruthy();
        });

        it('should save reference to base object', function () {
            var f = function () {};
            Hookies.mixin(f);

            expect(f.hookies.hookiesBase).toBe(f);
        });
    });
});
