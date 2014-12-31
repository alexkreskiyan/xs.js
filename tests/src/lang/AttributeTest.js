/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.lang.Attribute', function () {

    'use strict';

    test('defined', function () {
        throws(function () {
            xs.Attribute.defined();
        });
        throws(function () {
            xs.Attribute.defined(null);
        });
        throws(function () {
            xs.Attribute.defined({}, null);
        });
        strictEqual(xs.Attribute.defined({}, 'a'), false);
    });

    test('define', function () {
        throws(function () {
            xs.Attribute.define();
        });
        throws(function () {
            xs.Attribute.define(null);
        });
        throws(function () {
            xs.Attribute.define({}, 'a');
        });
        throws(function () {
            xs.Attribute.define({}, 'a', null);
        });

        //init test object
        var obj = {};

        strictEqual(xs.Attribute.defined(obj, 'a'), false);

        xs.Attribute.define(obj, 'a', {value: {x: 1}});

        strictEqual(xs.Attribute.defined(obj, 'a'), true);
    });

    test('getDescriptor', function () {
        var me = this;
        //init test object
        me.obj = {};
        me.getter = function () {
            return 1;
        };
        me.setter = function (value) {
            this.value = value;
        };
        me.value = {x: 1};
    }, function () {
        var me = this;

        throws(function () {
            xs.Attribute.define();
        });
        throws(function () {
            xs.Attribute.define(null);
        });
        throws(function () {
            xs.Attribute.define({}, 'a');
        });

        //define assignable test property
        xs.Attribute.define(me.obj, 'a', {
            value: me.value,
            writable: true,
            configurable: true,
            enumerable: true
        });

        //get descriptor
        var descriptor = xs.Attribute.getDescriptor(me.obj, 'a');

        //check descriptor was applied correctly
        strictEqual(Object.keys(descriptor).length, 4);
        strictEqual(descriptor.value, me.value);
        strictEqual(descriptor.writable, true);
        strictEqual(descriptor.configurable, true);
        strictEqual(descriptor.enumerable, true);

        //define accessed test property
        xs.Attribute.define(me.obj, 'a', {
            get: me.getter,
            set: me.setter
        });

        //get descriptor
        descriptor = xs.Attribute.getDescriptor(me.obj, 'a');

        //check descriptor was applied correctly
        strictEqual(Object.keys(descriptor).length, 4);
        strictEqual(descriptor.get, me.getter);
        strictEqual(descriptor.set, me.setter);
        strictEqual(descriptor.configurable, true);
        strictEqual(descriptor.enumerable, true);
    });

    test('isAssigned', function () {
        var me = this;
        //init test object
        me.obj = {};
        me.getter = function () {
            return 1;
        };
        me.setter = function (value) {
            this.value = value;
        };
        me.value = {x: 1};

    }, function () {
        var me = this;

        throws(function () {
            xs.Attribute.define();
        });
        throws(function () {
            xs.Attribute.define(null);
        });
        throws(function () {
            xs.Attribute.define({}, 'a');
        });

        //define assigned property
        xs.Attribute.define(me.obj, 'a', {
            value: me.value,
            writable: true,
            configurable: true,
            enumerable: true
        });

        //test that it is assigned
        strictEqual(xs.Attribute.isAssigned(me.obj, 'a'), true);

        //define accessed property
        xs.Attribute.define(me.obj, 'a', {
            get: me.getter,
            set: me.setter
        });

        //test that it is not assigned
        strictEqual(xs.Attribute.isAssigned(me.obj, 'a'), false);
    });

    test('isAccessed', function () {
        var me = this;
        //init test object
        me.obj = {};
        me.getter = function () {
            return 1;
        };
        me.setter = function (value) {
            this.value = value;
        };
        me.value = {x: 1};

    }, function () {
        var me = this;

        throws(function () {
            xs.Attribute.define();
        });
        throws(function () {
            xs.Attribute.define(null);
        });
        throws(function () {
            xs.Attribute.define({}, 'a');
        });

        //define assigned property
        xs.Attribute.define(me.obj, 'a', {
            value: me.value,
            writable: true,
            configurable: true,
            enumerable: true
        });

        //test that it is not accessed
        strictEqual(xs.Attribute.isAccessed(me.obj, 'a'), false);

        //define accessed property
        xs.Attribute.define(me.obj, 'a', {
            get: me.getter,
            set: me.setter
        });

        //test that is accessed
        strictEqual(xs.Attribute.isAccessed(me.obj, 'a'), true);
    });

    test('isWritable', function () {
        var me = this;
        //init test object
        me.obj = {};
        me.getter = function () {
            return 1;
        };
        me.setter = function (value) {
            this.value = value;
        };
        me.value = {x: 1};

    }, function () {
        var me = this;

        throws(function () {
            xs.Attribute.define();
        });
        throws(function () {
            xs.Attribute.define(null);
        });
        throws(function () {
            xs.Attribute.define({}, 'a');
        });

        //define writable property
        xs.Attribute.define(me.obj, 'a', {
            value: me.value,
            writable: true,
            configurable: true,
            enumerable: true
        });

        //test that it is writable
        strictEqual(xs.Attribute.isWritable(me.obj, 'a'), true);

        //define non-writable property
        xs.Attribute.define(me.obj, 'a', {
            value: me.value,
            writable: false
        });

        //test that it is not writable
        strictEqual(xs.Attribute.isWritable(me.obj, 'a'), false);

        //define accessed property
        xs.Attribute.define(me.obj, 'a', {
            get: me.getter,
            set: me.setter
        });

        //test that it is not writable
        strictEqual(xs.Attribute.isWritable(me.obj, 'a'), false);
    });

    test('isConfigurable', function () {
        var me = this;
        //init test objects
        me.obj = {};
        me.value = {x: 1};

    }, function () {
        var me = this;

        throws(function () {
            xs.Attribute.define();
        });
        throws(function () {
            xs.Attribute.define(null);
        });
        throws(function () {
            xs.Attribute.define({}, 'a');
        });

        //define configurable property
        xs.Attribute.define(me.obj, 'a', {
            value: me.value,
            writable: true,
            configurable: true,
            enumerable: true
        });

        //test that it is configurable
        strictEqual(xs.Attribute.isConfigurable(me.obj, 'a'), true);

        //define non-configurable property
        xs.Attribute.define(me.obj, 'a', {
            configurable: false
        });

        //test that it is not configurable
        strictEqual(xs.Attribute.isConfigurable(me.obj, 'a'), false);
    });

    test('isEnumerable', function () {
        var me = this;
        //init test objects
        me.obj = {};
        me.value = {x: 1};

    }, function () {
        var me = this;

        throws(function () {
            xs.Attribute.define();
        });
        throws(function () {
            xs.Attribute.define(null);
        });
        throws(function () {
            xs.Attribute.define({}, 'a');
        });

        //define enumerable property
        xs.Attribute.define(me.obj, 'a', {
            value: me.value,
            writable: true,
            configurable: true,
            enumerable: true
        });

        //test that it is enumerable
        strictEqual(xs.Attribute.isEnumerable(me.obj, 'a'), true);

        //define non-enumerable property
        xs.Attribute.define(me.obj, 'a', {
            enumerable: false
        });

        //test that it is not enumerable
        strictEqual(xs.Attribute.isEnumerable(me.obj, 'a'), false);
    });

    test('isDescriptor', function () {
        //not-object desc
        strictEqual(xs.Attribute.isDescriptor(null), false, 'null has type object, but fails');
        strictEqual(xs.Attribute.isDescriptor([]), false);

        //object desc without any properties
        strictEqual(xs.Attribute.isDescriptor({a: 1}), false);

        //object desc with any property
        strictEqual(xs.Attribute.isDescriptor({
            a: 1,
            value: true
        }), true);
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
        var me = this;
        //init test objects
        me.obj = {};
        me.value = {x: 1};

    }, function () {
        var me = this;

        throws(function () {
            xs.Attribute.constant({});
        });

        //define and test constant
        xs.Attribute.constant(me.obj, 'a', me.value);
        strictEqual(me.obj.a, me.value);

        //constant is defined
        strictEqual('a' in me.obj, true);

        //constant is immutable for change
        throws(function () {
            me.obj.a = 1;
        });
        strictEqual(me.obj.a, me.value);
    });

    test('property.prepare', function () {

        throws(function () {
            xs.Attribute.property.prepare(null);
        });

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
        var me = this;
        //init test objects
        me.obj = {};
        me.getter = function () {
            return 1;
        };
        me.setter = function (value) {
            this.value = value;
        };
        me.value = {x: 1};

    }, function () {
        var me = this;

        throws(function () {
            xs.Attribute.property.define({}, null);
        });

        throws(function () {
            xs.Attribute.property.define({}, 'a');
        });

        throws(function () {
            xs.Attribute.property.define({}, 'a', null);
        });

        //try to define incorrect descriptor
        throws(function () {
            xs.Attribute.property.define(me.obj, 'a', me.value);
        });

        strictEqual(me.obj.a, undefined);

        //define assigned property correctly
        xs.Attribute.property.define(me.obj, 'b', {
            value: me.value,
            configurable: true,
            enumerable: false,
            writable: false,
            default: 5,
            someProperty: null
        });
        strictEqual(xs.Attribute.isAssigned(me.obj, 'b'), true);
        strictEqual(xs.Attribute.isConfigurable(me.obj, 'b'), false);
        strictEqual(xs.Attribute.isWritable(me.obj, 'b'), true);
        strictEqual(xs.Attribute.isEnumerable(me.obj, 'b'), true);
        strictEqual(me.obj.b, me.value);

        //define accessed property correctly
        xs.Attribute.property.define(me.obj, 'c', {
            get: me.getter,
            set: me.setter
        });
        strictEqual(xs.Attribute.isAccessed(me.obj, 'c'), true);
        strictEqual(xs.Attribute.isConfigurable(me.obj, 'c'), false);
        strictEqual(xs.Attribute.isEnumerable(me.obj, 'c'), true);
    });

    test('method.prepare', function () {

        throws(function () {
            xs.Attribute.method.prepare(null);
        });

        //check for descriptor given incorrectly
        throws(function () {
            xs.Attribute.method.prepare('a', null);
        });

        //check for descriptor given incorrectly
        throws(function () {
            xs.Attribute.method.prepare('a', {});
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

        throws(function () {
            xs.Attribute.method.define(null);
        });

        throws(function () {
            xs.Attribute.method.define('a', {});
        });

        throws(function () {
            xs.Attribute.method.define('a', {value: null});
        });

        //init test objects
        var obj = {};
        var value = function (x) {
            return x;
        };

        //rights assignments are not writable, enumerable and not configurable
        xs.Attribute.method.define(obj, 'simple', {value: value});
        strictEqual(xs.Attribute.isWritable(obj, 'simple'), false);
        strictEqual(xs.Attribute.isConfigurable(obj, 'simple'), false);
        strictEqual(xs.Attribute.isEnumerable(obj, 'simple'), true);
    });
});