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
module('xs.lang.Property');
test('defined', function () {
    var obj = {};
    var name = 'a';
    var getter = function () {
        return 1;
    };
    var setter = function (value) {
        value = 2;
    };
    var value = {x: 1};
    var writable = true;
    var configurable = true;
    var enumerable = true;

    strictEqual(xs.Property.defined(obj, name), false, 'defined works ok when nothing is defined');
});
test('define', function () {
    var obj = {};
    var name = 'a';
    var getter = function () {
        return 1;
    };
    var setter = function (value) {
        value = 2;
    };
    var value = {x: 1};
    var writable = true;
    var configurable = true;
    var enumerable = true;

    strictEqual(xs.Property.defined(obj, name), false, 'property is not defined before define');
    strictEqual(xs.Property.define(obj, name, {value: value}), obj, 'define returns object');
    strictEqual(xs.Property.defined(obj, name), true, 'property is defined after define');
});
test('getDescriptor', function () {
    var obj = {};
    var name = 'a';
    var getter = function () {
        return 1;
    };
    var setter = function (value) {
        value = 2;
    };
    var value = {x: 1};
    var writable = true;
    var configurable = true;
    var enumerable = true;

    xs.Property.define(obj, name, {
        value: value,
        writable: writable,
        configurable: configurable,
        enumerable: enumerable
    });
    var descriptor = xs.Property.getDescriptor(obj, name);
    strictEqual(Object.keys(descriptor).length, 4, 'descriptor contains given keys');
    strictEqual(descriptor.value, value, 'descriptor set ok');
    strictEqual(descriptor.writable, writable, 'descriptor set ok');
    strictEqual(descriptor.configurable, configurable, 'descriptor set ok');
    strictEqual(descriptor.enumerable, enumerable, 'descriptor set ok');

    xs.Property.define(obj, name, {
        get: getter,
        set: setter
    });
    var descriptor = xs.Property.getDescriptor(obj, name);
    strictEqual(Object.keys(descriptor).length, 4, 'descriptor contains given keys');
    strictEqual(descriptor.get, getter, 'descriptor set ok');
    strictEqual(descriptor.set, setter, 'descriptor set ok');
    strictEqual(descriptor.configurable, configurable, 'descriptor configurable is saved');
    strictEqual(descriptor.enumerable, enumerable, 'descriptor enumerable is saved');
});
test('isAssigned', function () {
    var obj = {};
    var name = 'a';
    var getter = function () {
        return 1;
    };
    var setter = function (value) {
        value = 2;
    };
    var value = {x: 1};
    var writable = true;
    var configurable = true;
    var enumerable = true;

    xs.Property.define(obj, name, {
        value: value,
        writable: writable,
        configurable: configurable,
        enumerable: enumerable
    });
    var descriptor = xs.Property.getDescriptor(obj, name);
    strictEqual(xs.Property.isAssigned(obj, name), true, 'isAssigned works ok');


    xs.Property.define(obj, name, {
        get: getter,
        set: setter
    });
    strictEqual(xs.Property.isAssigned(obj, name), false, 'isAssigned works ok');
});
test('isAccessed', function () {
    var obj = {};
    var name = 'a';
    var getter = function () {
        return 1;
    };
    var setter = function (value) {
        value = 2;
    };
    var value = {x: 1};
    var writable = true;
    var configurable = true;
    var enumerable = true;

    xs.Property.define(obj, name, {
        value: value,
        writable: writable,
        configurable: configurable,
        enumerable: enumerable
    });
    strictEqual(xs.Property.isAccessed(obj, name), false, 'isAccessed works ok');


    xs.Property.define(obj, name, {
        get: getter,
        set: setter
    });
    strictEqual(xs.Property.isAccessed(obj, name), true, 'isAccessed works ok');
});
test('isWritable', function () {
    var obj = {};
    var name = 'a';
    var getter = function () {
        return 1;
    };
    var setter = function (value) {
        value = 2;
    };
    var value = {x: 1};
    var writable = true;
    var configurable = true;
    var enumerable = true;

    xs.Property.define(obj, name, {
        value: value,
        writable: writable,
        configurable: configurable,
        enumerable: enumerable
    });
    strictEqual(xs.Property.isWritable(obj, name), true, 'isWritable works ok');

    xs.Property.define(obj, name, {
        value: value,
        writable: false
    });
    strictEqual(xs.Property.isWritable(obj, name), false, 'isWritable works ok');


    xs.Property.define(obj, name, {
        get: getter,
        set: setter
    });
    strictEqual(xs.Property.isWritable(obj, name), false, 'isWritable works ok');
});
test('isConfigurable', function () {
    var obj = {};
    var name = 'a';
    var getter = function () {
        return 1;
    };
    var setter = function (value) {
        value = 2;
    };
    var value = {x: 1};
    var writable = true;
    var configurable = true;
    var enumerable = true;

    xs.Property.define(obj, name, {
        value: value,
        writable: writable,
        configurable: configurable,
        enumerable: enumerable
    });
    strictEqual(xs.Property.isConfigurable(obj, name), true, 'isConfigurable works ok');

    xs.Property.define(obj, name, {
        configurable: false
    });
    strictEqual(xs.Property.isConfigurable(obj, name), false, 'isConfigurable works ok');
});
test('isEnumerable', function () {
    var obj = {};
    var name = 'a';
    var getter = function () {
        return 1;
    };
    var setter = function (value) {
        value = 2;
    };
    var value = {x: 1};
    var writable = true;
    var configurable = true;
    var enumerable = true;

    xs.Property.define(obj, name, {
        value: value,
        writable: writable,
        configurable: configurable,
        enumerable: enumerable
    });
    strictEqual(xs.Property.isEnumerable(obj, name), true, 'isEnumerable works ok');

    xs.Property.define(obj, name, {
        enumerable: false
    });
    strictEqual(xs.Property.isEnumerable(obj, name), false, 'isEnumerable works ok');
});
test('const', function () {
    var obj = {};
    var name = 'a';
    var value = {x: 1};

    strictEqual(xs.Property.const(obj, name, value), true, 'const is set ');
    strictEqual(xs.Property.const(obj, name, value), false, 'const is not resetable');

    strictEqual(name in obj, true, 'const is enumerable');

    delete obj[name];
    strictEqual(obj[name], value, 'const delete fails');

    obj[name] = null;
    strictEqual(obj[name], value, 'const set fails');

    throws(function () {
        xs.Property.define(obj, name, {
            value: null
        })
    }, 'const reconfigure fails');
    strictEqual(obj[name], value, 'const still has given value');
});
test('property', function () {
    var obj = {};
    var name = 'a';
    var getter = function () {
        return 1;
    };
    var setter = function (value) {
        value = 2;
    };
    var value = {x: 1};

    strictEqual(xs.Property.property(obj, name, value), false, 'property is not defined with incorrect descriptor');
    strictEqual(obj[name], undefined, 'property value is assumed to be undefined');

    strictEqual(xs.Property.property(obj, name, {
        value: value,
        configurable: true,
        someProperty: null
    }), true, 'property is assigned with correct descriptor');
    strictEqual(xs.Property.isAssigned(obj, name), true, 'property value is assigned');
    strictEqual(obj[name], value, 'property value is assigned normally');


    name = 'b';
    throws(function () {
        xs.Property.property(obj, name, {
            value: value,
            get: getter,
            set: setter,
            configurable: true
        });
    }, 'accessors and value both cause error');
    strictEqual(xs.Property.property(obj, name, {
        get: getter,
        set: setter
    }), true, 'property is assigned with correct descriptor');
    strictEqual(xs.Property.isAccessed(obj, name), true, 'property value is accessed');
    strictEqual(xs.Property.isConfigurable(obj, name), false, 'property value is configurable');
    strictEqual(xs.Property.isEnumerable(obj, name), true, 'property value is enumerable');
});
test('method', function () {
    var obj = {};
    var value = function (a, b) {
        return xs.reduce(xs.clone(arguments), function (memo, value) {
            return memo + value;
        }, '');
    };

    xs.Property.const(obj, 'const', null);
    //test when false for created && !configurable property
    strictEqual(xs.Property.method(obj, 'const', {value: value}), false, 'false for created && !configurable property');
    //test false for descriptor without value
    strictEqual(xs.Property.method(obj, 'simple', {}), false, 'false for descriptor without value');
    //rights assignments are not writable, enumerable and not configurable
    strictEqual(xs.Property.method(obj, 'simple', {value: value}), true, 'simple method definition');
    strictEqual(xs.Property.isWritable(obj, 'simple'), false, 'method is not writable');
    strictEqual(xs.Property.isConfigurable(obj, 'simple'), false, 'method is not configurable');
    strictEqual(xs.Property.isEnumerable(obj, 'simple'), true, 'method is enumerable');

    //method without defaults
    strictEqual(xs.Property.method(obj, 'defaultsNo', {
        value: value,
        default: []
    }), true, 'created method with no defaults');
    //defaults test without arguments
    strictEqual(obj.defaultsNo(), '', 'defaultsNo method runs ok without arguments');
    //defaults test with not enough arguments
    strictEqual(obj.defaultsNo(3), '3', 'defaultsNo method runs ok with not enough arguments');
    //defaults test with enough arguments
    strictEqual(obj.defaultsNo(3, 5), '35', 'defaultsNo method runs ok with enough arguments');

    //method with some defaults
    strictEqual(xs.Property.method(obj, 'defaultsSome', {
        value: value,
        default: [4]
    }), true, 'created method with some defaults');
    //defaults test without arguments
    strictEqual(obj.defaultsSome(), '4', 'defaultsSome method runs ok without arguments');
    //defaults test with not enough arguments
    strictEqual(obj.defaultsSome(3), '3', 'defaultsSome method runs ok with not enough arguments');
    //defaults test with enough arguments
    strictEqual(obj.defaultsSome(3, 5), '35', 'defaultsSome method runs ok with enough arguments');

    //method with defaults
    strictEqual(xs.Property.method(obj, 'defaultsAll', {
        value: value,
        default: [4, 7]
    }), true, 'created method with all defaults');
    //defaults test without arguments
    strictEqual(obj.defaultsAll(), '47', 'defaultsAll method runs ok without arguments');
    //defaults test with not enough arguments
    strictEqual(obj.defaultsAll(3), '37', 'defaultsAll method runs ok with not enough arguments');
    //defaults test with enough arguments
    strictEqual(obj.defaultsAll(3, 5), '35', 'defaultsAll method runs ok with enough arguments');


    //wrapped
    //method without defaults
    strictEqual(xs.Property.method(obj, 'wrappedNo', {
        value: value,
        parent: 12,
        downcall: true
    }), true, 'created wrapped method with no defaults');
    //defaults test without arguments
    strictEqual(obj.wrappedNo(), 'undefinedundefined12', 'wrappedNo method runs ok without arguments');
    //defaults test with not enough arguments
    strictEqual(obj.wrappedNo(3), '3undefined12', 'wrappedNo method runs ok with not enough arguments');
    //defaults test with enough arguments
    strictEqual(obj.wrappedNo(3, 5), '3512', 'wrappedNo method runs ok with enough arguments');

    //method with some defaults
    strictEqual(xs.Property.method(obj, 'wrappedSome', {
        value: value,
        default: [4],
        parent: 12,
        downcall: true
    }), true, 'created wrapped method with some defaults');
    //defaults test without arguments
    strictEqual(obj.wrappedSome(), '4undefined12', 'wrappedSome method runs ok without arguments');
    //defaults test with not enough arguments
    strictEqual(obj.wrappedSome(3), '3undefined12', 'wrappedSome method runs ok with not enough arguments');
    //defaults test with enough arguments
    strictEqual(obj.wrappedSome(3, 5), '3512', 'wrappedSome method runs ok with enough arguments');

    //method with defaults
    strictEqual(xs.Property.method(obj, 'wrappedAll', {
        value: value,
        default: [4, 7],
        parent: 12,
        downcall: true
    }), true, 'created wrapped method with all defaults');
    //defaults test without arguments
    strictEqual(obj.wrappedAll(), '4712', 'wrappedAll method runs ok without arguments');
    //defaults test with not enough arguments
    strictEqual(obj.wrappedAll(3), '3712', 'wrappedAll method runs ok with not enough arguments');
    //defaults test with enough arguments
    strictEqual(obj.wrappedAll(3, 5), '3512', 'wrappedAll method runs ok with enough arguments');

    //call with more arguments, than expected
    strictEqual(obj.wrappedNo(3, 5, 4, 8), '354812', 'wrappedAll method runs ok with enough arguments');
    strictEqual(obj.wrappedSome(3, 5, 4, 8), '354812', 'wrappedAll method runs ok with enough arguments');
    strictEqual(obj.wrappedAll(3, 5, 4, 8), '354812', 'wrappedAll method runs ok with enough arguments');

});
























