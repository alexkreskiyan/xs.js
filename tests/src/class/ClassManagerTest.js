function speed(fn, n) {
    var start = Date.now();
    for (var i = 0; i < n; i++) {
        fn();
    }
    var duration = Date.now() - start;
    console.log('duration: ', duration, 'ms for ', n, 'operations');
    console.log('median: ', duration / n, 'ms per operation');
    console.log('mark: about', n / duration, 'operation per ms');
}
'use strict';
module('xs.ClassManager');
/**
 * 1. Class definition
 * - simple
 * - defined test (both by name and ref)
 * - undefine test (both by name and ref)
 * 2. Getting class from storage
 * 3. Get class name from full name
 * 4. Get namespace from full name
 * 5. Create demo
 * - create with 1 argument
 * - create with multiple args
 * - create by class name
 * - create by class ref
 * 6. is testing
 * - instance is class (by name)
 * - instance is class (by ref)
 * - strict equals
 * - not strict equals
 */
test('1. Class definition', function () {
    xs.define('xs.class.ClassManager.demo.Defined', function (self) {
        return {
            const: {
                a: 1
            }
        };
    });
    var Class = xs.class.ClassManager.demo.Defined;
    strictEqual(JSON.stringify(Class.descriptor), '{"const":{"a":1},"static":{"properties":{},"methods":{"isChild":{},"isParent":{}}},"properties":{},"methods":{},"mixins":{}}', 'descriptor is given, class was defined');
    xs.define('xs.class.ClassManager.demo.Defined', function (self) {
        return {
            const: {
                b: 1
            }
        };
    });
    var Class2 = xs.class.ClassManager.demo.Defined;
    //class is not redefined
    strictEqual(Class, Class2, 'class is not redefined');
});
test('2. Getting class from storage', function () {
    strictEqual(xs.ClassManager.get('xs.class.ClassManager.demo.Stored'), undefined, 'class is not previously defined');
    xs.define('xs.class.ClassManager.demo.Stored', function (self) {
        return {};
    });
    strictEqual(xs.ClassManager.get('xs.class.ClassManager.demo.Stored'), xs.class.ClassManager.demo.Stored, 'defined class is accessible from storage');
});
test('3. Get names', function () {
    xs.define('xs.class.ClassManager.demo.Named', function (self) {
        return {};
    });
    strictEqual(xs.ClassManager.getClassName(xs.ClassManager.getName(xs.class.ClassManager.demo.Named)), 'Named', 'class name achieved correctly');
    strictEqual(xs.ClassManager.getNamespaceName(xs.ClassManager.getName(xs.class.ClassManager.demo.Named)), 'xs.class.ClassManager.demo', 'class namespace achieved correctly');
});
test('5. Create demo', function () {
    xs.define('xs.class.ClassManager.demo.Created', function (self) {
        return {
            constructor: function (config) {
                var me = this;
                me.a = config.a;
                me.b = arguments[1];
            },
            properties: {
                a: undefined,
                b: undefined
            }
        };
    });
    var demo = xs.create('xs.class.ClassManager.demo.Created', {a: 1}, 2);
    strictEqual(demo.a, 1, 'first argument is passed as-is');
    strictEqual(demo.b, undefined, 'second argument missing');

    var demo2 = xs.create(xs.class.ClassManager.demo.Created, {a: 2});
    strictEqual(demo2.a, 2, 'first argument is passed as-is');
    strictEqual(demo2.b, undefined, 'second argument missing');
});
test('6. is testing', function () {
    xs.define('xs.class.ClassManager.demo.Is', function (self) {
        return {};
    });
    //equals
    strictEqual(xs.is(xs.class.ClassManager.demo.Is, xs.ClassManager.get('xs.class.ClassManager.demo.Is')), true, 'equals ok');
    strictEqual(xs.is(1, 1), true, 'equals ok');
    strictEqual(xs.is(1, '1'), false, 'not strict fails');
    strictEqual(xs.is(xs.create(xs.class.ClassManager.demo.Is), xs.class.ClassManager.demo.Is), true, 'instance works ok');
    strictEqual(xs.is(xs.create(xs.class.ClassManager.demo.Is), 'xs.class.ClassManager.demo.Is'), true, 'instance by string works ok');
});