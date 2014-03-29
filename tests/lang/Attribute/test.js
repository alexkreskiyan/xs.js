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
module('xs.lang.Attribute');
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

    strictEqual(xs.Attribute.defined(obj, name), false, 'defined works ok when nothing is defined');
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

    strictEqual(xs.Attribute.defined(obj, name), false, 'property is not defined before define');
    strictEqual(xs.Attribute.define(obj, name, {value: value}), obj, 'define returns object');
    strictEqual(xs.Attribute.defined(obj, name), true, 'property is defined after define');
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

    xs.Attribute.define(obj, name, {
        value: value,
        writable: writable,
        configurable: configurable,
        enumerable: enumerable
    });
    var descriptor = xs.Attribute.getDescriptor(obj, name);
    strictEqual(Object.keys(descriptor).length, 4, 'descriptor contains given keys');
    strictEqual(descriptor.value, value, 'descriptor set ok');
    strictEqual(descriptor.writable, writable, 'descriptor set ok');
    strictEqual(descriptor.configurable, configurable, 'descriptor set ok');
    strictEqual(descriptor.enumerable, enumerable, 'descriptor set ok');

    xs.Attribute.define(obj, name, {
        get: getter,
        set: setter
    });
    var descriptor = xs.Attribute.getDescriptor(obj, name);
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

    xs.Attribute.define(obj, name, {
        value: value,
        writable: writable,
        configurable: configurable,
        enumerable: enumerable
    });
    var descriptor = xs.Attribute.getDescriptor(obj, name);
    strictEqual(xs.Attribute.isAssigned(obj, name), true, 'isAssigned works ok');


    xs.Attribute.define(obj, name, {
        get: getter,
        set: setter
    });
    strictEqual(xs.Attribute.isAssigned(obj, name), false, 'isAssigned works ok');
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

    xs.Attribute.define(obj, name, {
        value: value,
        writable: writable,
        configurable: configurable,
        enumerable: enumerable
    });
    strictEqual(xs.Attribute.isAccessed(obj, name), false, 'isAccessed works ok');


    xs.Attribute.define(obj, name, {
        get: getter,
        set: setter
    });
    strictEqual(xs.Attribute.isAccessed(obj, name), true, 'isAccessed works ok');
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

    xs.Attribute.define(obj, name, {
        value: value,
        writable: writable,
        configurable: configurable,
        enumerable: enumerable
    });
    strictEqual(xs.Attribute.isWritable(obj, name), true, 'isWritable works ok');

    xs.Attribute.define(obj, name, {
        value: value,
        writable: false
    });
    strictEqual(xs.Attribute.isWritable(obj, name), false, 'isWritable works ok');


    xs.Attribute.define(obj, name, {
        get: getter,
        set: setter
    });
    strictEqual(xs.Attribute.isWritable(obj, name), false, 'isWritable works ok');
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

    xs.Attribute.define(obj, name, {
        value: value,
        writable: writable,
        configurable: configurable,
        enumerable: enumerable
    });
    strictEqual(xs.Attribute.isConfigurable(obj, name), true, 'isConfigurable works ok');

    xs.Attribute.define(obj, name, {
        configurable: false
    });
    strictEqual(xs.Attribute.isConfigurable(obj, name), false, 'isConfigurable works ok');
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

    xs.Attribute.define(obj, name, {
        value: value,
        writable: writable,
        configurable: configurable,
        enumerable: enumerable
    });
    strictEqual(xs.Attribute.isEnumerable(obj, name), true, 'isEnumerable works ok');

    xs.Attribute.define(obj, name, {
        enumerable: false
    });
    strictEqual(xs.Attribute.isEnumerable(obj, name), false, 'isEnumerable works ok');
});
test('isDescriptor', function () {
    //not-object desc
    strictEqual(xs.Attribute.isDescriptor(null), false, 'null has type object, but fails');
    strictEqual(xs.Attribute.isDescriptor([]), false, 'other non-object value fails');
    //object desc without any properties
    strictEqual(xs.Attribute.isDescriptor({a: 1}), false, 'object without any descriptor properties fails');
    //object desc with any property
    strictEqual(xs.Attribute.isDescriptor({a: 1, value: true}), true, 'object with any descriptor properties succeeds');
});
test('prepareDescriptor', function () {
    //accessors to value priority
    var source = {
        value: null,
        writable: null,
        get: function () {
        },
        set: function () {
        }
    };
    var desc = xs.Attribute.prepareDescriptor(source);
    strictEqual(Object.keys(desc).toString(), 'get,set', 'accessors have priority');
    strictEqual(desc.get, source.get, 'getter link saved');
    strictEqual(desc.set, source.set, 'setter link saved');

    //non-function accessors removed
    var source = {
        value: function () {
        },
        writable: null,
        configurable: 1,
        enumerable: [],
        get: 5,
        set: null
    };
    var desc = xs.Attribute.prepareDescriptor(source);
    strictEqual(Object.keys(desc).toString(), 'value,writable,configurable,enumerable', 'invalid accessors are removed');
    strictEqual(desc.value, source.value, 'value link saved');
    strictEqual(desc.writable, false, 'writable converted');
    strictEqual(desc.configurable, true, 'configurable converted');
    strictEqual(desc.enumerable, true, 'enumerable converted');
});
test('const', function () {
    var obj = {};
    var name = 'a';
    var value = {x: 1};

    strictEqual(xs.Attribute.const(obj, name, value), true, 'const is set ');
    strictEqual(xs.Attribute.const(obj, name, value), false, 'const is not resetable');

    strictEqual(name in obj, true, 'const is enumerable');

    delete obj[name];
    strictEqual(obj[name], value, 'const delete fails');

    obj[name] = null;
    strictEqual(obj[name], value, 'const set fails');

    throws(function () {
        xs.Attribute.define(obj, name, {
            value: null
        })
    }, 'const reconfigure fails');
    strictEqual(obj[name], value, 'const still has given value');
});
test('property.prepare', function () {
    //checks for not descriptor given
    var desc = function () {
    };
    var result = xs.Attribute.property.prepare('x', desc);
    strictEqual(Object.keys(result).toString(), 'value,default', 'not descriptor is converted to descriptor');
    strictEqual(result.value, desc, 'value is assigned as descriptor');
    strictEqual(result.default, desc, 'default is assigned from value');

    //check for accessored descriptor
    var desc = {
        get: function () {

        },
        value: 5,
        default: 6,
        writable: 7,
        configurable: 0,
        enumerable: false
    };
    var getter = desc.get;
    var result = xs.Attribute.property.prepare('x', desc);

    strictEqual(Object.keys(result).sort().toString(), 'configurable,default,enumerable,get,set', 'only valid fields left');
    strictEqual(result.get, getter, 'getter link is ok');
    strictEqual(result.set.toString(), 'function (value) {return this.__set(\'x\',value);}', 'setter created');
    strictEqual(result.default, 6), 'default ok';
    strictEqual(result.configurable, false, 'configurable converted correctly');
    strictEqual(result.enumerable, false, 'enumerable converted correctly');

    //check for assigned descriptor
    var desc = {
        value: 5
    };
    var result = xs.Attribute.property.prepare('x', desc);

    strictEqual(Object.keys(result).toString(), 'value,default');
    strictEqual(result.value, desc.value);
    strictEqual(result.default, desc.default);
});
test('property.define', function () {
    //check for defined and not configurable property
    //check defaults mechanism

    var obj = {};
    var name = 'a';
    var getter = function () {
        return 1;
    };
    var setter = function (value) {
        value = 2;
    };
    var value = {x: 1};

    strictEqual(xs.Attribute.property.define(obj, name, value), true, 'property is defined with descriptor is object');
    strictEqual(xs.Attribute.property.define(obj, name, value), false, 'property is not re-defined');
    strictEqual(obj[name], undefined, 'property value is assumed to be undefined');

    name = 'b';
    strictEqual(xs.Attribute.property.define(obj, name, {
        value: value,
        configurable: true,
        enumerable: false,
        writable: false,
        default: 5,
        someProperty: null
    }), true, 'property is assigned with correct descriptor');
    strictEqual(xs.Attribute.isAssigned(obj, name), true, 'property value is assigned');
    strictEqual(xs.Attribute.isConfigurable(obj, name), false, 'property value is assigned');
    strictEqual(xs.Attribute.isWritable(obj, name), true, 'property value is assigned');
    strictEqual(xs.Attribute.isEnumerable(obj, name), true, 'property value is assigned');
    strictEqual(obj[name], value, 'property value is assigned normally');


    name = 'c';
    strictEqual(xs.Attribute.property.define(obj, name, {
        get: getter,
        set: setter
    }), true, 'property is assigned with accessors priority');
    strictEqual(xs.Attribute.isAccessed(obj, name), true, 'property value is accessed');
    strictEqual(xs.Attribute.isConfigurable(obj, name), false, 'property value is configurable');
    strictEqual(xs.Attribute.isEnumerable(obj, name), true, 'property value is enumerable');
});
test('method.prepare', function () {
    //check for descriptor given incorrectly
    strictEqual(xs.Attribute.method.prepare('a', null), false, 'descriptor is incorrect');
    //check for descriptor given as function
    strictEqual(xs.Attribute.method.prepare('a', null), true, 'property value is accessed');

    //check for descriptor given as object
    //object with fn - function and not function
    //object with value - function and not function
    //default is set only if is given as array
    //downcall is converted to boolean if given
});
test('method.define', function () {
    //check for defined and not configurable property
    //check default mechanism
    //check default is assigned and used properly
    //check downcall is assigned and used properly

    var obj = {};
    var value = function (a, b) {
        return xs.reduce(xs.clone(arguments), function (memo, value) {
            return memo + value;
        }, '');
    };

    xs.Attribute.const(obj, 'const', null);
    //test when false for created && !configurable property
    strictEqual(xs.Attribute.method(obj, 'const', {value: value}), false, 'false for created && !configurable property');
    //test false for descriptor without value
    strictEqual(xs.Attribute.method(obj, 'simple', {}), false, 'false for descriptor without value');
    //rights assignments are not writable, enumerable and not configurable
    strictEqual(xs.Attribute.method(obj, 'simple', {value: value}), true, 'simple method definition');
    strictEqual(xs.Attribute.isWritable(obj, 'simple'), false, 'method is not writable');
    strictEqual(xs.Attribute.isConfigurable(obj, 'simple'), false, 'method is not configurable');
    strictEqual(xs.Attribute.isEnumerable(obj, 'simple'), true, 'method is enumerable');

    //method without defaults
    strictEqual(xs.Attribute.method(obj, 'defaultsNo', {
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
    strictEqual(xs.Attribute.method(obj, 'defaultsSome', {
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
    strictEqual(xs.Attribute.method(obj, 'defaultsAll', {
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
    strictEqual(xs.Attribute.method(obj, 'wrappedNo', {
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
    strictEqual(xs.Attribute.method(obj, 'wrappedSome', {
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
    strictEqual(xs.Attribute.method(obj, 'wrappedAll', {
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
























