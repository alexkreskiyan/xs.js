/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
require([
    'xs.lang.Type',
    'xs.lang.List',
    'xs.lang.Object',
    'xs.lang.Attribute'
], function () {

    'use strict';

    module('xs.lang.Attribute');

    test('defined', function () {
        strictEqual(xs.Attribute.defined({}, 'a'), false);
    });

    test('define', function () {
        //init test object
        var obj = {};

        strictEqual(xs.Attribute.defined(obj, 'a'), false);

        xs.Attribute.define(obj, 'a', {value: {x: 1}});

        strictEqual(xs.Attribute.defined(obj, 'a'), true);
    });

    test('getDescriptor', function () {
        //init test object
        var obj = {};
        var getter = function () {
            return 1;
        };
        var setter = function ( value ) {
            this.value = value;
        };
        var value = {x: 1};

        //define assignable test property
        xs.Attribute.define(obj, 'a', {
            value: value,
            writable: true,
            configurable: true,
            enumerable: true
        });

        //get descriptor
        var descriptor = xs.Attribute.getDescriptor(obj, 'a');

        //check descriptor was applied correctly
        strictEqual(Object.keys(descriptor).length, 4);
        strictEqual(descriptor.value, value);
        strictEqual(descriptor.writable, true);
        strictEqual(descriptor.configurable, true);
        strictEqual(descriptor.enumerable, true);

        //define accessed test property
        xs.Attribute.define(obj, 'a', {
            get: getter,
            set: setter
        });

        //get descriptor
        descriptor = xs.Attribute.getDescriptor(obj, 'a');

        //check descriptor was applied correctly
        strictEqual(Object.keys(descriptor).length, 4);
        strictEqual(descriptor.get, getter);
        strictEqual(descriptor.set, setter);
        strictEqual(descriptor.configurable, true);
        strictEqual(descriptor.enumerable, true);
    });

    test('isAssigned', function () {
        //init test object
        var obj = {};
        var getter = function () {
            return 1;
        };
        var setter = function ( value ) {
            this.value = value;
        };
        var value = {x: 1};

        //define assigned property
        xs.Attribute.define(obj, 'a', {
            value: value,
            writable: true,
            configurable: true,
            enumerable: true
        });

        //test that it is assigned
        strictEqual(xs.Attribute.isAssigned(obj, 'a'), true);

        //define accessed property
        xs.Attribute.define(obj, 'a', {
            get: getter,
            set: setter
        });

        //test that it is not assigned
        strictEqual(xs.Attribute.isAssigned(obj, 'a'), false);
    });

    test('isAccessed', function () {
        //init test object
        var obj = {};
        var getter = function () {
            return 1;
        };
        var setter = function ( value ) {
            this.value = value;
        };
        var value = {x: 1};

        //define assigned property
        xs.Attribute.define(obj, 'a', {
            value: value,
            writable: true,
            configurable: true,
            enumerable: true
        });

        //test that it is not accessed
        strictEqual(xs.Attribute.isAccessed(obj, 'a'), false);

        //define accessed property
        xs.Attribute.define(obj, 'a', {
            get: getter,
            set: setter
        });

        //test that is accessed
        strictEqual(xs.Attribute.isAccessed(obj, 'a'), true);
    });

    test('isWritable', function () {
        //init test object
        var obj = {};
        var getter = function () {
            return 1;
        };
        var setter = function ( value ) {
            this.value = value;
        };
        var value = {x: 1};

        //define writable property
        xs.Attribute.define(obj, 'a', {
            value: value,
            writable: true,
            configurable: true,
            enumerable: true
        });

        //test that it is writable
        strictEqual(xs.Attribute.isWritable(obj, 'a'), true);

        //define non-writable property
        xs.Attribute.define(obj, 'a', {
            value: value,
            writable: false
        });

        //test that it is not writable
        strictEqual(xs.Attribute.isWritable(obj, 'a'), false);

        //define accessed property
        xs.Attribute.define(obj, 'a', {
            get: getter,
            set: setter
        });

        //test that it is not writable
        strictEqual(xs.Attribute.isWritable(obj, 'a'), false);
    });

    test('isConfigurable', function () {
        //init test objects
        var obj = {};
        var value = {x: 1};

        //define configurable property
        xs.Attribute.define(obj, 'a', {
            value: value,
            writable: true,
            configurable: true,
            enumerable: true
        });

        //test that it is configurable
        strictEqual(xs.Attribute.isConfigurable(obj, 'a'), true);

        //define non-configurable property
        xs.Attribute.define(obj, 'a', {
            configurable: false
        });

        //test that it is not configurable
        strictEqual(xs.Attribute.isConfigurable(obj, 'a'), false);
    });

    test('isEnumerable', function () {
        //init test objects
        var obj = {};
        var value = {x: 1};

        //define enumerable property
        xs.Attribute.define(obj, 'a', {
            value: value,
            writable: true,
            configurable: true,
            enumerable: true
        });

        //test that it is enumerable
        strictEqual(xs.Attribute.isEnumerable(obj, 'a'), true);

        //define non-enumerable property
        xs.Attribute.define(obj, 'a', {
            enumerable: false
        });

        //test that it is not enumerable
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
            value: null,
            writable: null,
            get: function () {
            },
            set: function () {
            }
        };

        //get descriptor
        var desc = xs.Attribute.prepareDescriptor(source);
        strictEqual(Object.keys(desc).toString(), 'get,set');
        strictEqual(desc.get, source.get);
        strictEqual(desc.set, source.set);

        //non-function get|set removed
        source = {
            value: function () {
            },
            writable: null,
            configurable: 1,
            enumerable: [],
            get: 5,
            set: null
        };

        //get descriptor
        desc = xs.Attribute.prepareDescriptor(source);
        strictEqual(Object.keys(desc).toString(), 'value,writable,configurable,enumerable');
        strictEqual(desc.value, source.value);
        strictEqual(desc.writable, false);
        strictEqual(desc.configurable, true);
        strictEqual(desc.enumerable, true);
    });

    test('constant', function () {
        //init test objects
        var obj = {};
        var value = {x: 1};

        //define and test constant
        xs.Attribute.constant(obj, 'a', value);
        strictEqual(obj.a, value);

        //constant is defined
        strictEqual('a' in obj, true);

        //constant is immutable for change
        throws(function () {
            obj.a = 1;
        });
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
            get: function () {

            },
            value: 5,
            default: 6,
            writable: 7,
            configurable: 0,
            enumerable: false
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
            value: 5,
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

        //init test objects
        var obj = {};
        var getter = function () {
            return 1;
        };
        var setter = function ( value ) {
            this.value = value;
        };
        var value = {x: 1};

        //try to define incorrect descriptor
        xs.Attribute.property.define(obj, 'a', value);

        strictEqual(obj.a, undefined);

        //define assigned property correctly
        xs.Attribute.property.define(obj, 'b', {
            value: value,
            configurable: true,
            enumerable: false,
            writable: false,
            default: 5,
            someProperty: null
        });
        strictEqual(xs.Attribute.isAssigned(obj, 'b'), true);
        strictEqual(xs.Attribute.isConfigurable(obj, 'b'), false);
        strictEqual(xs.Attribute.isWritable(obj, 'b'), true);
        strictEqual(xs.Attribute.isEnumerable(obj, 'b'), true);
        strictEqual(obj.b, value);

        //define accessed property correctly
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
        //init test objects
        var obj = {};
        var value = function ( x ) {
            return x;
        };

        //rights assignments are not writable, enumerable and not configurable
        xs.Attribute.method.define(obj, 'simple', {value: value});
        strictEqual(xs.Attribute.isWritable(obj, 'simple'), false);
        strictEqual(xs.Attribute.isConfigurable(obj, 'simple'), false);
        strictEqual(xs.Attribute.isEnumerable(obj, 'simple'), true);
    });
});