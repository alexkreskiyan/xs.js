require([
    'xs.lang.Type',
    'xs.lang.List',
    'xs.lang.Object',
    'xs.lang.Attribute'
], function () {
    module('xs.lang.Attribute');

    test('defined', function () {
        strictEqual(xs.Attribute.defined({}, 'a'), false);
    });

    test('define', function () {
        var obj = {};

        strictEqual(xs.Attribute.defined(obj, 'a'), false);
        xs.Attribute.define(obj, 'a', {value: {x: 1}});
        strictEqual(xs.Attribute.defined(obj, 'a'), true);
    });

    test('getDescriptor', function () {
        var obj = {};
        var getter = function () {
            return 1;
        };
        var setter = function (value) {
            this.value = value;
        };
        var value = {x: 1};

        xs.Attribute.define(obj, 'a', {
            value:        value,
            writable:     true,
            configurable: true,
            enumerable:   true
        });
        var descriptor = xs.Attribute.getDescriptor(obj, 'a');
        strictEqual(Object.keys(descriptor).length, 4);
        strictEqual(descriptor.value, value);
        strictEqual(descriptor.writable, true);
        strictEqual(descriptor.configurable, true);
        strictEqual(descriptor.enumerable, true);

        xs.Attribute.define(obj, 'a', {
            get: getter,
            set: setter
        });
        descriptor = xs.Attribute.getDescriptor(obj, 'a');
        strictEqual(Object.keys(descriptor).length, 4);
        strictEqual(descriptor.get, getter);
        strictEqual(descriptor.set, setter);
        strictEqual(descriptor.configurable, true);
        strictEqual(descriptor.enumerable, true);
    });

    test('isAssigned', function () {
        var obj = {};
        var getter = function () {
            return 1;
        };
        var setter = function (value) {
            this.value = value;
        };
        var value = {x: 1};

        xs.Attribute.define(obj, 'a', {
            value:        value,
            writable:     true,
            configurable: true,
            enumerable:   true
        });
        strictEqual(xs.Attribute.isAssigned(obj, 'a'), true);

        xs.Attribute.define(obj, 'a', {
            get: getter,
            set: setter
        });
        strictEqual(xs.Attribute.isAssigned(obj, 'a'), false);
    });

    test('isAccessed', function () {
        var obj = {};
        var getter = function () {
            return 1;
        };
        var setter = function (value) {
            this.value = value;
        };
        var value = {x: 1};

        xs.Attribute.define(obj, 'a', {
            value:        value,
            writable:     true,
            configurable: true,
            enumerable:   true
        });
        strictEqual(xs.Attribute.isAccessed(obj, 'a'), false);

        xs.Attribute.define(obj, 'a', {
            get: getter,
            set: setter
        });
        strictEqual(xs.Attribute.isAccessed(obj, 'a'), true);
    });

    test('isWritable', function () {
        var obj = {};
        var getter = function () {
            return 1;
        };
        var setter = function (value) {
            this.value = value;
        };
        var value = {x: 1};

        xs.Attribute.define(obj, 'a', {
            value:        value,
            writable:     true,
            configurable: true,
            enumerable:   true
        });
        strictEqual(xs.Attribute.isWritable(obj, 'a'), true);

        xs.Attribute.define(obj, 'a', {
            value:    value,
            writable: false
        });
        strictEqual(xs.Attribute.isWritable(obj, 'a'), false);

        xs.Attribute.define(obj, 'a', {
            get: getter,
            set: setter
        });
        strictEqual(xs.Attribute.isWritable(obj, 'a'), false);
    });

    test('isConfigurable', function () {
        var obj = {};
        var value = {x: 1};

        xs.Attribute.define(obj, 'a', {
            value:        value,
            writable:     true,
            configurable: true,
            enumerable:   true
        });
        strictEqual(xs.Attribute.isConfigurable(obj, 'a'), true);

        xs.Attribute.define(obj, 'a', {
            configurable: false
        });
        strictEqual(xs.Attribute.isConfigurable(obj, 'a'), false);
    });

    test('isEnumerable', function () {
        var obj = {};
        var value = {x: 1};

        xs.Attribute.define(obj, 'a', {
            value:        value,
            writable:     true,
            configurable: true,
            enumerable:   true
        });
        strictEqual(xs.Attribute.isEnumerable(obj, 'a'), true);

        xs.Attribute.define(obj, 'a', {
            enumerable: false
        });
        strictEqual(xs.Attribute.isEnumerable(obj, 'a'), false);
    });

    test('isDescriptor', function () {
        //not-object desc
        strictEqual(xs.Attribute.isDescriptor(null), false, 'null has type object, but fails');
        strictEqual(xs.Attribute.isDescriptor([]), false);
        //object desc without any properties
        strictEqual(xs.Attribute.isDescriptor({a: 1}), false);
        //object desc with any property
        strictEqual(xs.Attribute.isDescriptor({a: 1, value: true}), true);
    });

    test('prepareDescriptor', function () {
        //get|set to value priority
        var source = {
            value:    null,
            writable: null,
            get:      function () {
            },
            set:      function () {
            }
        };
        var desc = xs.Attribute.prepareDescriptor(source);
        strictEqual(Object.keys(desc).toString(), 'get,set');
        strictEqual(desc.get, source.get);
        strictEqual(desc.set, source.set);

        //non-function get|set removed
        source = {
            value:        function () {
            },
            writable:     null,
            configurable: 1,
            enumerable:   [],
            get:          5,
            set:          null
        };
        desc = xs.Attribute.prepareDescriptor(source);
        strictEqual(Object.keys(desc).toString(), 'value,writable,configurable,enumerable');
        strictEqual(desc.value, source.value);
        strictEqual(desc.writable, false);
        strictEqual(desc.configurable, true);
        strictEqual(desc.enumerable, true);
    });

    test('const', function () {
        var obj = {};
        var value = {x: 1};

        xs.Attribute.const(obj, 'a', value);
        strictEqual(obj.a, value);

        //const redefined throws error
        throws(function () {
            xs.Attribute.const(obj, 'a', value);
        });

        strictEqual('a' in obj, true);

        delete obj['a'];
        strictEqual(obj['a'], value);

        obj['a'] = null;
        strictEqual(obj['a'], value);
    });

    test('property.prepare', function () {
        //checks for not descriptor given
        var desc = {
            x: 1
        };
        var result = xs.Attribute.property.prepare('x', desc);
        strictEqual(Object.keys(result).toString(), 'value,writable,enumerable,configurable');
        strictEqual(result.value, desc);
        strictEqual(result.writable, true);
        strictEqual(result.enumerable, true);
        strictEqual(result.configurable, false);

        //check for get|set descriptor
        desc = {
            get:          function () {

            },
            value:        5,
            default:      6,
            writable:     7,
            configurable: 0,
            enumerable:   false
        };
        var getter = desc.get;
        result = xs.Attribute.property.prepare('x', desc);

        strictEqual(Object.keys(result).sort().toString(), 'configurable,default,enumerable,get,set');
        strictEqual(result.get, getter);
        strictEqual(result.set.toString(), 'function (value) { \'use strict\'; this.privates.x = value;}');
        strictEqual(result.default, 6);
        strictEqual(result.configurable, false);
        strictEqual(result.enumerable, true);

        //check for assigned descriptor
        desc = {
            value:   5,
            default: 6
        };
        result = xs.Attribute.property.prepare('x', desc);

        strictEqual(Object.keys(result).sort().toString(), 'configurable,default,enumerable,value,writable');
        strictEqual(result.value, desc.value);
        strictEqual(result.default, desc.default);
    });

    test('property.define', function () {
        //check for defined and not configurable property
        //check defaults mechanism

        var obj = {};
        var getter = function () {
            return 1;
        };
        var setter = function (value) {
            this.value = value;
        };
        var value = {x: 1};

        xs.Attribute.property.define(obj, 'a', value);

        //redefine throws error
        throws(function () {
            xs.Attribute.property.define(obj, 'a', value);
        });
        strictEqual(obj.a, undefined);

        xs.Attribute.property.define(obj, 'b', {
            value:        value,
            configurable: true,
            enumerable:   false,
            writable:     false,
            default:      5,
            someProperty: null
        });
        strictEqual(xs.Attribute.isAssigned(obj, 'b'), true);
        strictEqual(xs.Attribute.isConfigurable(obj, 'b'), false);
        strictEqual(xs.Attribute.isWritable(obj, 'b'), true);
        strictEqual(xs.Attribute.isEnumerable(obj, 'b'), true);
        strictEqual(obj.b, value);

        xs.Attribute.property.define(obj, 'c', {
            get: getter,
            set: setter
        });
        strictEqual(xs.Attribute.isAccessed(obj, 'c'), true);
        strictEqual(xs.Attribute.isConfigurable(obj, 'c'), false);
        strictEqual(xs.Attribute.isEnumerable(obj, 'c'), true);
    });

    test('method.prepare', function () {
        //check for descriptor given incorrectly
        throws(function () {
            xs.Attribute.method.prepare('a', null);
        });

        //check for descriptor given as function
        var desc = function () {
        };
        var result = xs.Attribute.method.prepare('a', desc);
        strictEqual(Object.keys(result).sort().toString(), 'configurable,enumerable,value,writable');
        strictEqual(result.value, desc);

        var value = function () {
        };
        desc = {
            value: value
        };

        //object with descriptor as function
        result = xs.Attribute.method.prepare('a', value);
        strictEqual(Object.keys(result).sort().toString(), 'configurable,enumerable,value,writable');
        strictEqual(result.value, value);

        //object with descriptor, keeping function in value
        result = xs.Attribute.method.prepare('a', desc);
        strictEqual(Object.keys(result).sort().toString(), 'configurable,enumerable,value,writable');
        strictEqual(result.value, value);

        //otherwise - error
        throws(function () {
            xs.Attribute.method.prepare('a', {});
        });
    });

    test('method.define', function () {
        var obj = {};
        var value = function (x) {
            return x;
        };

        xs.Attribute.const(obj, 'const', null);

        //test when error for created && !configurable property
        throws(function () {
            xs.Attribute.method.define(obj, 'const', {value: value});
        });

        //rights assignments are not writable, enumerable and not configurable
        xs.Attribute.method.define(obj, 'simple', {value: value});
        strictEqual(xs.Attribute.isWritable(obj, 'simple'), false);
        strictEqual(xs.Attribute.isConfigurable(obj, 'simple'), false);
        strictEqual(xs.Attribute.isEnumerable(obj, 'simple'), true);
    });
});