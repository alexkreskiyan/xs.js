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

function value() {
    return '*' + value + '*';
}
function getter(name) {
    return function () {
        return '?' + this.__get(name);
    };
}
function setter(name) {
    return function (value) {
        return this.__set(name, value + '!');
    };
}
function getProperty(object, name) {
    return function () {
        return object[name];
    };
}
function setProperty(object, name, value) {
    return function () {
        return object[name] = value;
    }
}
function caller(name, args) {
    return function () {
        return this[name].apply(this, args);
    };
}
function getMethod(name) {
    return function () {
        return this[name];
    };
}
function getMethodCall(method) {
    return function () {
        method();
    };
}
function setMethod(name) {
    return function (value) {
        return this[name] = value;
    };
}
function setMethodCall(method, value) {
    return function () {
        method(value);
    };
}
function xsStart(suffix) {
    xs.createClass('simple');
    xs.createClass('a' + suffix);
    xs['a' + suffix].constructor(function (x) {
        this.x = x;
    }, [0]);
    //private static properties variations
    xs['a' + suffix].privateStaticProperty('aprispvv', 1, 2, 3);
    xs['a' + suffix].privateStaticProperty('aprispvf', 4, 5, setter('aprispvf'));
    xs['a' + suffix].privateStaticProperty('aprispfv', 6, getter('aprispfv'), 7);
    xs['a' + suffix].privateStaticProperty('aprispff', 8, getter('aprispff'), setter('aprispff'));
    //protected static properties variations
    xs['a' + suffix].protectedStaticProperty('aprospvv', 11, 12, 13);
    xs['a' + suffix].protectedStaticProperty('aprospvf', 14, 15, setter('aprospvf'));
    xs['a' + suffix].protectedStaticProperty('aprospfv', 16, getter('aprospfv'), 17);
    xs['a' + suffix].protectedStaticProperty('aprospff', 18, getter('aprospff'), setter('aprospff'));
    //public static properties variations
    xs['a' + suffix].publicStaticProperty('apubspvv', 21, 22, 23);
    xs['a' + suffix].publicStaticProperty('apubspvf', 24, 25, setter('apubspvf'));
    xs['a' + suffix].publicStaticProperty('apubspfv', 26, getter('apubspfv'), 27);
    xs['a' + suffix].publicStaticProperty('apubspff', 28, getter('apubspff'), setter('apubspff'));
    //private static getters/setters for private static properties
    xs['a' + suffix].privateStaticMethod('aprismGETaprispvv', getMethod('aprispvv'));
    xs['a' + suffix].privateStaticMethod('aprismSETaprispvv', setMethod('aprispvv'));
    xs['a' + suffix].privateStaticMethod('aprismGETaprispvf', getMethod('aprispvf'));
    xs['a' + suffix].privateStaticMethod('aprismSETaprispvf', setMethod('aprispvf'));
    xs['a' + suffix].privateStaticMethod('aprismGETaprispfv', getMethod('aprispfv'));
    xs['a' + suffix].privateStaticMethod('aprismSETaprispfv', setMethod('aprispfv'));
    xs['a' + suffix].privateStaticMethod('aprismGETaprispff', getMethod('aprispff'));
    xs['a' + suffix].privateStaticMethod('aprismSETaprispff', setMethod('aprispff'));
    //protected static getters/setters for protected static properties
    xs['a' + suffix].protectedStaticMethod('aprosmGETaprospvv', getMethod('aprospvv'));
    xs['a' + suffix].protectedStaticMethod('aprosmSETaprospvv', setMethod('aprospvv'));
    xs['a' + suffix].protectedStaticMethod('aprosmGETaprospvf', getMethod('aprospvf'));
    xs['a' + suffix].protectedStaticMethod('aprosmSETaprospvf', setMethod('aprospvf'));
    xs['a' + suffix].protectedStaticMethod('aprosmGETaprospfv', getMethod('aprospfv'));
    xs['a' + suffix].protectedStaticMethod('aprosmSETaprospfv', setMethod('aprospfv'));
    xs['a' + suffix].protectedStaticMethod('aprosmGETaprospff', getMethod('aprospff'));
    xs['a' + suffix].protectedStaticMethod('aprosmSETaprospff', setMethod('aprospff'));
    //public static getters/setters for private static properties
    xs['a' + suffix].publicStaticMethod('apubsmGETaprispvv', getMethod('aprispvv'));
    xs['a' + suffix].publicStaticMethod('apubsmSETaprispvv', setMethod('aprispvv'));
    xs['a' + suffix].publicStaticMethod('apubsmGETaprispvf', getMethod('aprispvf'));
    xs['a' + suffix].publicStaticMethod('apubsmSETaprispvf', setMethod('aprispvf'));
    xs['a' + suffix].publicStaticMethod('apubsmGETaprispfv', getMethod('aprispfv'));
    xs['a' + suffix].publicStaticMethod('apubsmSETaprispfv', setMethod('aprispfv'));
    xs['a' + suffix].publicStaticMethod('apubsmGETaprispff', getMethod('aprispff'));
    xs['a' + suffix].publicStaticMethod('apubsmSETaprispff', setMethod('aprispff'));
    //public static getters/setters for protected static properties
    xs['a' + suffix].publicStaticMethod('apubsmGETaprospvv', getMethod('aprospvv'));
    xs['a' + suffix].publicStaticMethod('apubsmSETaprospvv', setMethod('aprospvv'));
    xs['a' + suffix].publicStaticMethod('apubsmGETaprospvf', getMethod('aprospvf'));
    xs['a' + suffix].publicStaticMethod('apubsmSETaprospvf', setMethod('aprospvf'));
    xs['a' + suffix].publicStaticMethod('apubsmGETaprospfv', getMethod('aprospfv'));
    xs['a' + suffix].publicStaticMethod('apubsmSETaprospfv', setMethod('aprospfv'));
    xs['a' + suffix].publicStaticMethod('apubsmGETaprospff', getMethod('aprospff'));
    xs['a' + suffix].publicStaticMethod('apubsmSETaprospff', setMethod('aprospff'));
    //public static getters/setters for public static properties
    xs['a' + suffix].publicStaticMethod('apubsmGETapubspvv', getMethod('apubspvv'));
    xs['a' + suffix].publicStaticMethod('apubsmSETapubspvv', setMethod('apubspvv'));
    xs['a' + suffix].publicStaticMethod('apubsmGETapubspvf', getMethod('apubspvf'));
    xs['a' + suffix].publicStaticMethod('apubsmSETapubspvf', setMethod('apubspvf'));
    xs['a' + suffix].publicStaticMethod('apubsmGETapubspfv', getMethod('apubspfv'));
    xs['a' + suffix].publicStaticMethod('apubsmSETapubspfv', setMethod('apubspfv'));
    xs['a' + suffix].publicStaticMethod('apubsmGETapubspff', getMethod('apubspff'));
    xs['a' + suffix].publicStaticMethod('apubsmSETapubspff', setMethod('apubspff'));
    //private properties variations
    xs['a' + suffix].privateProperty('apridpvv', 1, 2, 3);
    xs['a' + suffix].privateProperty('apridpvf', 4, 5, setter('apridpvf'));
    xs['a' + suffix].privateProperty('apridpfv', 6, getter('apridpfv'), 7);
    xs['a' + suffix].privateProperty('apridpff', 8, getter('apridpff'), setter('apridpff'));
    //protected properties variations
    xs['a' + suffix].protectedProperty('aprodpvv', 11, 12, 13);
    xs['a' + suffix].protectedProperty('aprodpvf', 14, 15, setter('aprodpvf'));
    xs['a' + suffix].protectedProperty('aprodpfv', 16, getter('aprodpfv'), 17);
    xs['a' + suffix].protectedProperty('aprodpff', 18, getter('aprodpff'), setter('aprodpff'));
    //public properties variations
    xs['a' + suffix].publicProperty('apubdpvv', 21, 22, 23);
    xs['a' + suffix].publicProperty('apubdpvf', 24, 25, setter('apubdpvf'));
    xs['a' + suffix].publicProperty('apubdpfv', 26, getter('apubdpfv'), 27);
    xs['a' + suffix].publicProperty('apubdpff', 28, getter('apubdpff'), setter('apubdpff'));
    //private getters/setters for private properties
    xs['a' + suffix].privateMethod('apridmGETapridpvv', getMethod('apridpvv'));
    xs['a' + suffix].privateMethod('apridmSETapridpvv', setMethod('apridpvv'));
    xs['a' + suffix].privateMethod('apridmGETapridpvf', getMethod('apridpvf'));
    xs['a' + suffix].privateMethod('apridmSETapridpvf', setMethod('apridpvf'));
    xs['a' + suffix].privateMethod('apridmGETapridpfv', getMethod('apridpfv'));
    xs['a' + suffix].privateMethod('apridmSETapridpfv', setMethod('apridpfv'));
    xs['a' + suffix].privateMethod('apridmGETapridpff', getMethod('apridpff'));
    xs['a' + suffix].privateMethod('apridmSETapridpff', setMethod('apridpff'));
    //protected getters/setters for protected properties
    xs['a' + suffix].protectedMethod('aprodmGETaprodpvv', getMethod('aprodpvv'));
    xs['a' + suffix].protectedMethod('aprodmSETaprodpvv', setMethod('aprodpvv'));
    xs['a' + suffix].protectedMethod('aprodmGETaprodpvf', getMethod('aprodpvf'));
    xs['a' + suffix].protectedMethod('aprodmSETaprodpvf', setMethod('aprodpvf'));
    xs['a' + suffix].protectedMethod('aprodmGETaprodpfv', getMethod('aprodpfv'));
    xs['a' + suffix].protectedMethod('aprodmSETaprodpfv', setMethod('aprodpfv'));
    xs['a' + suffix].protectedMethod('aprodmGETaprodpff', getMethod('aprodpff'));
    xs['a' + suffix].protectedMethod('aprodmSETaprodpff', setMethod('aprodpff'));
    //public getters/setters for private properties
    xs['a' + suffix].publicMethod('apubdmGETapridpvv', getMethod('apridpvv'));
    xs['a' + suffix].publicMethod('apubdmSETapridpvv', setMethod('apridpvv'));
    xs['a' + suffix].publicMethod('apubdmGETapridpvf', getMethod('apridpvf'));
    xs['a' + suffix].publicMethod('apubdmSETapridpvf', setMethod('apridpvf'));
    xs['a' + suffix].publicMethod('apubdmGETapridpfv', getMethod('apridpfv'));
    xs['a' + suffix].publicMethod('apubdmSETapridpfv', setMethod('apridpfv'));
    xs['a' + suffix].publicMethod('apubdmGETapridpff', getMethod('apridpff'));
    xs['a' + suffix].publicMethod('apubdmSETapridpff', setMethod('apridpff'));
    //public getters/setters for protected properties
    xs['a' + suffix].publicMethod('apubdmGETaprodpvv', getMethod('aprodpvv'));
    xs['a' + suffix].publicMethod('apubdmSETaprodpvv', setMethod('aprodpvv'));
    xs['a' + suffix].publicMethod('apubdmGETaprodpvf', getMethod('aprodpvf'));
    xs['a' + suffix].publicMethod('apubdmSETaprodpvf', setMethod('aprodpvf'));
    xs['a' + suffix].publicMethod('apubdmGETaprodpfv', getMethod('aprodpfv'));
    xs['a' + suffix].publicMethod('apubdmSETaprodpfv', setMethod('aprodpfv'));
    xs['a' + suffix].publicMethod('apubdmGETaprodpff', getMethod('aprodpff'));
    xs['a' + suffix].publicMethod('apubdmSETaprodpff', setMethod('aprodpff'));
    //public getters/setters for public properties
    xs['a' + suffix].publicMethod('apubdmGETapubdpvv', getMethod('apubdpvv'));
    xs['a' + suffix].publicMethod('apubdmSETapubdpvv', setMethod('apubdpvv'));
    xs['a' + suffix].publicMethod('apubdmGETapubdpvf', getMethod('apubdpvf'));
    xs['a' + suffix].publicMethod('apubdmSETapubdpvf', setMethod('apubdpvf'));
    xs['a' + suffix].publicMethod('apubdmGETapubdpfv', getMethod('apubdpfv'));
    xs['a' + suffix].publicMethod('apubdmSETapubdpfv', setMethod('apubdpfv'));
    xs['a' + suffix].publicMethod('apubdmGETapubdpff', getMethod('apubdpff'));
    xs['a' + suffix].publicMethod('apubdmSETapubdpff', setMethod('apubdpff'));
    xs.createClass('b' + suffix);
    xs['b' + suffix].constructor(function (x, y) {
        this.parent().constructor.call(this, x);
        this.y = y;
    }, [0, 0]);
    xs.createClass('c' + suffix);
    xs['b' + suffix].constructor(function (x, y, z) {
        this.parent().constructor.call(this, x, y);
        this.z = z;
    }, [0, 0, 0]);
    xs['b' + suffix].extend(xs['a' + suffix]);
    xs['c' + suffix].extend(xs['b' + suffix]);
    a1 = new xs['a' + suffix]();
    a2 = new xs['a' + suffix](4);
    b1 = new xs['b' + suffix](3);
    b2 = new xs['b' + suffix](6, 9);
    c1 = new xs['c' + suffix](1, 2);
    c2 = new xs['c' + suffix](5, 1, -7);
}
speed(function () {
    xsStart('')
}, 1);
var astorage = xs.a.storage();
var aprivates = xs.a.privates();
var bstorage = xs.b.storage();
var bprivates = xs.b.privates();
var cstorage = xs.c.storage();
var cprivates = xs.c.privates();
var a1privates = a1.privates();
var a2privates = a2.privates();
var b1privates = b1.privates();
var b2privates = b2.privates();
var c1privates = c1.privates();
var c2privates = c2.privates();
module('Creation');
test('create namespace', function () {
    //check create, references and recreation prevention
    equal(xs.createNamespace('test'), xs.getNamespace('test'), 'check that namespace was created');
    equal(xs.createNamespace('test'), xs.test, 'check namespace recreate prevention and direct access');
    //check namespace name is const
    ok(xs.test._name = 'test', 'check namespace name');
    //check hasNameSpace function
    ok(xs.hasNamespace('test'), 'check hasNamespace function');
    //check hasNameSpace function
    xs.test = null;
    ok(xs.hasNamespace('test'), 'check namespace cannot be modified');
    delete xs.test;
    ok(xs.hasNamespace('test'), 'check namespace cannot be deleted');
});
test('create class', function () {
    //check create, references and recreation prevention
    equal(xs.createClass('a'), xs.getClass('a'), 'check that class was created');
    equal(xs.createClass('a'), xs.a, 'check class recreate prevention and direct access');
    //check class name is const
    ok(xs.a._name = 'a', 'check class name');
    //check hasClass function
    ok(xs.hasClass('a'), 'check hasClass function');
    //check hasClass function
    xs.a = null;
    ok(xs.hasClass('a'), 'check class cannot be modified');
    delete xs.a;
    ok(xs.hasClass('a'), 'check class cannot be deleted');
});
test('Object creation basics', function () {
    var s1 = new xs.simple;
    //instanceof check
    ok(s1 instanceof xs.simple, 'check object instance');
});
module('static properties');
test('private static properties tests', function () {
    throws(getProperty(xs.a, 'aprispvv'), /^Attempt to get private property "a::aprispvv"$/, 'access to private static property with value=value,getter=value,setter=value is restricted');
    throws(getProperty(xs.a, 'aprispvf'), /^Attempt to get private property "a::aprispvf"$/, 'access to private static property with value=value,getter=value,setter=function is restricted');
    throws(getProperty(xs.a, 'aprispfv'), /^Attempt to get private property "a::aprispfv"$/, 'access to private static property with value=value,getter=function,setter=value is restricted');
    throws(getProperty(xs.a, 'aprispff'), /^Attempt to get private property "a::aprispff"$/, 'access to private static property with value=value,getter=function,setter=function is restricted');
    throws(setProperty(xs.a, 'aprispvv', 101), /^Attempt to set private property "a::aprispvv"$/, 'access to private static property with value=value,getter=value,setter=value is restricted');
    throws(setProperty(xs.a, 'aprispvf', 104), /^Attempt to set private property "a::aprispvf"$/, 'access to private static property with value=value,getter=value,setter=function is restricted');
    throws(setProperty(xs.a, 'aprispfv', 106), /^Attempt to set private property "a::aprispfv"$/, 'access to private static property with value=value,getter=function,setter=value is restricted');
    throws(setProperty(xs.a, 'aprispff', 108), /^Attempt to set private property "a::aprispff"$/, 'access to private static property with value=value,getter=function,setter=function is restricted');
});
test('protected static properties tests', function () {
    throws(getProperty(xs.a, 'aprospvv'), /^Attempt to get protected property "a::aprospvv"$/, 'access to protected static property with value=value,getter=value,setter=value is restricted');
    throws(getProperty(xs.a, 'aprospvf'), /^Attempt to get protected property "a::aprospvf"$/, 'access to protected static property with value=value,getter=value,setter=function is restricted');
    throws(getProperty(xs.a, 'aprospfv'), /^Attempt to get protected property "a::aprospfv"$/, 'access to protected static property with value=value,getter=function,setter=value is restricted');
    throws(getProperty(xs.a, 'aprospff'), /^Attempt to get protected property "a::aprospff"$/, 'access to protected static property with value=value,getter=function,setter=function is restricted');
    throws(setProperty(xs.a, 'aprospvv', 101), /^Attempt to set protected property "a::aprospvv"$/, 'access to protected static property with value=value,getter=value,setter=value is restricted');
    throws(setProperty(xs.a, 'aprospvf', 104), /^Attempt to set protected property "a::aprospvf"$/, 'access to protected static property with value=value,getter=value,setter=function is restricted');
    throws(setProperty(xs.a, 'aprospfv', 106), /^Attempt to set protected property "a::aprospfv"$/, 'access to protected static property with value=value,getter=function,setter=value is restricted');
    throws(setProperty(xs.a, 'aprospff', 108), /^Attempt to set protected property "a::aprospff"$/, 'access to protected static property with value=value,getter=function,setter=function is restricted');
});
test('public static properties tests', function () {
    equal(xs.a.apubspvv, 21, 'check default value assigned for public static property with value=value,getter=value,setter=value');
    equal(xs.a.apubspvf, '24!', 'check default value assigned for public static property with value=value,getter=value,setter=function');
    equal(xs.a.apubspfv, '?26', 'check default value assigned for public static property with value=value,getter=function,setter=value');
    equal(xs.a.apubspff, '?28!', 'check default value assigned for public static property with value=value,getter=function,setter=function');
    //check assignment goes ok
    xs.a.apubspvv = 101;
    xs.a.apubspvf = 104;
    xs.a.apubspfv = 106;
    xs.a.apubspff = 108;
    equal(xs.a.apubspvv, 101, 'check new value assigned for public static property with value=value,getter=value,setter=value');
    equal(xs.a.apubspvf, '104!', 'check new value assigned for public static property with value=value,getter=value,setter=function');
    equal(xs.a.apubspfv, '?106', 'check new value assigned for public static property with value=value,getter=function,setter=value');
    equal(xs.a.apubspff, '?108!', 'check new value assigned for public static property with value=value,getter=function,setter=function');
    xs.a.apubspvv = 21;
    xs.a.apubspvf = 24;
    xs.a.apubspfv = 26;
    xs.a.apubspff = 28;
    equal(xs.a.apubspvv, 21, 'check default value assigned for public static property with value=value,getter=value,setter=value');
    equal(xs.a.apubspvf, '24!', 'check default value assigned for public static property with value=value,getter=value,setter=function');
    equal(xs.a.apubspfv, '?26', 'check default value assigned for public static property with value=value,getter=function,setter=value');
    equal(xs.a.apubspff, '?28!', 'check default value assigned for public static property with value=value,getter=function,setter=function');
});
module('static methods');
test('private static methods tests', function () {
    throws(getMethodCall(xs.a.aprismGETaprispvv), /^Attempt to call private method "a::aprismGETaprispvv"$/, 'call private static getter method for property with value=value,getter=value,setter=value is restricted');
    throws(setMethodCall(xs.a.aprismSETaprispvv, 101), /^Attempt to call private method "a::aprismSETaprispvv"$/, 'call private static setter method for property with value=value,getter=value,setter=value is restricted');
    throws(getMethodCall(xs.a.aprismGETaprispvf), /^Attempt to call private method "a::aprismGETaprispvf"$/, 'call private static getter method for property with value=value,getter=value,setter=function is restricted');
    throws(setMethodCall(xs.a.aprismSETaprispvf, 104), /^Attempt to call private method "a::aprismSETaprispvf"$/, 'call private static setter method for property with value=value,getter=value,setter=function is restricted');
    throws(getMethodCall(xs.a.aprismGETaprispfv), /^Attempt to call private method "a::aprismGETaprispfv"$/, 'call private static getter method for property with value=value,getter=function,setter=value is restricted');
    throws(setMethodCall(xs.a.aprismSETaprispfv, 106), /^Attempt to call private method "a::aprismSETaprispfv"$/, 'call private static setter method for property with value=value,getter=function,setter=value is restricted');
    throws(getMethodCall(xs.a.aprismGETaprispff), /^Attempt to call private method "a::aprismGETaprispff"$/, 'call private static getter method for property with value=value,getter=function,setter=function is restricted');
    throws(setMethodCall(xs.a.aprismSETaprispff, 108), /^Attempt to call private method "a::aprismSETaprispff"$/, 'call private static setter method for property with value=value,getter=function,setter=function is restricted');
});
test('protected static methods tests', function () {
    throws(getMethodCall(xs.a.aprosmGETaprospvv), /^Attempt to call protected method "a::aprosmGETaprospvv"$/, 'call private static getter method for property with value=value,getter=value,setter=value is restricted');
    throws(setMethodCall(xs.a.aprosmSETaprospvv, 101), /^Attempt to call protected method "a::aprosmSETaprospvv"$/, 'call private static setter method for property with value=value,getter=value,setter=value is restricted');
    throws(getMethodCall(xs.a.aprosmGETaprospvf), /^Attempt to call protected method "a::aprosmGETaprospvf"$/, 'call private static getter method for property with value=value,getter=value,setter=function is restricted');
    throws(setMethodCall(xs.a.aprosmSETaprospvf, 104), /^Attempt to call protected method "a::aprosmSETaprospvf"$/, 'call private static setter method for property with value=value,getter=value,setter=function is restricted');
    throws(getMethodCall(xs.a.aprosmGETaprospfv), /^Attempt to call protected method "a::aprosmGETaprospfv"$/, 'call private static getter method for property with value=value,getter=function,setter=value is restricted');
    throws(setMethodCall(xs.a.aprosmSETaprospfv, 106), /^Attempt to call protected method "a::aprosmSETaprospfv"$/, 'call private static setter method for property with value=value,getter=function,setter=value is restricted');
    throws(getMethodCall(xs.a.aprosmGETaprospff), /^Attempt to call protected method "a::aprosmGETaprospff"$/, 'call private static getter method for property with value=value,getter=function,setter=function is restricted');
    throws(setMethodCall(xs.a.aprosmSETaprospff, 108), /^Attempt to call protected method "a::aprosmSETaprospff"$/, 'call private static setter method for property with value=value,getter=function,setter=function is restricted');
});
test('public static methods tests', function () {
    //get private variables values
    equal(xs.a.apubsmGETaprispvv(), 1, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprispvf(), '4!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprispfv(), '?6', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprispff(), '?8!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.a.apubsmGETaprospvv(), 11, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprospvf(), '14!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprospfv(), '?16', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprospff(), '?18!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.a.apubsmGETapubspvv(), 21, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETapubspvf(), '24!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETapubspfv(), '?26', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETapubspff(), '?28!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //assignments
    //private variables
    xs.a.apubsmSETaprispvv(101);
    xs.a.apubsmSETaprispvf(104);
    xs.a.apubsmSETaprispfv(106);
    xs.a.apubsmSETaprispff(108);
    //protected variables
    xs.a.apubsmSETaprospvv(111);
    xs.a.apubsmSETaprospvf(114);
    xs.a.apubsmSETaprospfv(116);
    xs.a.apubsmSETaprospff(118);
    //public variables
    xs.a.apubsmSETapubspvv(121);
    xs.a.apubsmSETapubspvf(124);
    xs.a.apubsmSETapubspfv(126);
    xs.a.apubsmSETapubspff(128);
    //get private variables values
    equal(xs.a.apubsmGETaprispvv(), 101, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprispvf(), '104!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprispfv(), '?106', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprispff(), '?108!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.a.apubsmGETaprospvv(), 111, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprospvf(), '114!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprospfv(), '?116', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprospff(), '?118!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.a.apubsmGETapubspvv(), 121, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETapubspvf(), '124!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETapubspfv(), '?126', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETapubspff(), '?128!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //assign back
    //private variables
    xs.a.apubsmSETaprispvv(1);
    xs.a.apubsmSETaprispvf(4);
    xs.a.apubsmSETaprispfv(6);
    xs.a.apubsmSETaprispff(8);
    //protected variables
    xs.a.apubsmSETaprospvv(11);
    xs.a.apubsmSETaprospvf(14);
    xs.a.apubsmSETaprospfv(16);
    xs.a.apubsmSETaprospff(18);
    //public variables
    xs.a.apubsmSETapubspvv(21);
    xs.a.apubsmSETapubspvf(24);
    xs.a.apubsmSETapubspfv(26);
    xs.a.apubsmSETapubspff(28);
    //get private variables values
    equal(xs.a.apubsmGETaprispvv(), 1, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprispvf(), '4!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprispfv(), '?6', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprispff(), '?8!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.a.apubsmGETaprospvv(), 11, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprospvf(), '14!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprospfv(), '?16', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprospff(), '?18!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.a.apubsmGETapubspvv(), 21, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETapubspvf(), '24!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETapubspfv(), '?26', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETapubspff(), '?28!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
});
module('staticInheritance');
test('inheritance basics', function () {
    //root class check
    equal(xs.a.parent(), xs.a, 'root class check: parent() refers class itself');
    equal(a1.parent(), xs.a, 'root class instance check: parent() refers class itself');
    equal(a1.self(), xs.a, 'root class instance check: self() refers class itself');
    //child level 1 check
    equal(xs.b.parent(), xs.a, 'child level 1 class check: parent() refers root class');
    equal(b1.parent(), xs.a, 'child level 1 class instance check: parent() refers root class');
    equal(b1.self(), xs.b, 'child level 1 instance check: self() refers class itself');
    //child level 2 check
    equal(xs.c.parent(), xs.b, 'child level 2 class check: parent() refers child level 1');
    equal(c1.parent(), xs.b, 'child level 2 class instance check: parent() refers child level 1');
    equal(c1.self(), xs.c, 'child level 2 instance check: self() refers class itself');
    //child level 2 check deep
    equal(xs.c.parent().parent(), xs.a, 'child level 2 class check: parent().parent() refers root class');
    equal(c1.parent().parent(), xs.a, 'child level 2 class instance check: parent().parent() refers root class');
});
test('static properties independency', function () {
    //Class a
    //get private variables values
    equal(xs.a.apubsmGETaprispvv(), 1, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprispvf(), '4!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprispfv(), '?6', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprispff(), '?8!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.a.apubsmGETaprospvv(), 11, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprospvf(), '14!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprospfv(), '?16', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprospff(), '?18!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.a.apubsmGETapubspvv(), 21, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETapubspvf(), '24!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETapubspfv(), '?26', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETapubspff(), '?28!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //Class b
    //get private variables values
    equal(xs.b.apubsmGETaprispvv(), 1, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(xs.b.apubsmGETaprispvf(), '4!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(xs.b.apubsmGETaprispfv(), '?6', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(xs.b.apubsmGETaprispff(), '?8!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.b.apubsmGETaprospvv(), 11, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(xs.b.apubsmGETaprospvf(), '14!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(xs.b.apubsmGETaprospfv(), '?16', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(xs.b.apubsmGETaprospff(), '?18!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.b.apubsmGETapubspvv(), 21, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(xs.b.apubsmGETapubspvf(), '24!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(xs.b.apubsmGETapubspfv(), '?26', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(xs.b.apubsmGETapubspff(), '?28!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //Class c
    //get private variables values
    equal(xs.c.apubsmGETaprispvv(), 1, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(xs.c.apubsmGETaprispvf(), '4!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(xs.c.apubsmGETaprispfv(), '?6', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(xs.c.apubsmGETaprispff(), '?8!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.c.apubsmGETaprospvv(), 11, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(xs.c.apubsmGETaprospvf(), '14!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(xs.c.apubsmGETaprospfv(), '?16', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(xs.c.apubsmGETaprospff(), '?18!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.c.apubsmGETapubspvv(), 21, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(xs.c.apubsmGETapubspvf(), '24!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(xs.c.apubsmGETapubspfv(), '?26', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(xs.c.apubsmGETapubspff(), '?28!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');

    //assignments
    //Class a
    //private variables
    xs.a.apubsmSETaprispvv(101);
    xs.a.apubsmSETaprispvf(104);
    xs.a.apubsmSETaprispfv(106);
    xs.a.apubsmSETaprispff(108);
    //protected variables
    xs.a.apubsmSETaprospvv(111);
    xs.a.apubsmSETaprospvf(114);
    xs.a.apubsmSETaprospfv(116);
    xs.a.apubsmSETaprospff(118);
    //public variables
    xs.a.apubsmSETapubspvv(121);
    xs.a.apubsmSETapubspvf(124);
    xs.a.apubsmSETapubspfv(126);
    xs.a.apubsmSETapubspff(128);
    //Class b
    //private variables
    xs.b.apubsmSETaprispvv(201);
    xs.b.apubsmSETaprispvf(204);
    xs.b.apubsmSETaprispfv(206);
    xs.b.apubsmSETaprispff(208);
    //protected variables
    xs.b.apubsmSETaprospvv(211);
    xs.b.apubsmSETaprospvf(214);
    xs.b.apubsmSETaprospfv(216);
    xs.b.apubsmSETaprospff(218);
    //public variables
    xs.b.apubsmSETapubspvv(221);
    xs.b.apubsmSETapubspvf(224);
    xs.b.apubsmSETapubspfv(226);
    xs.b.apubsmSETapubspff(228);
    //Class c
    //private variables
    xs.c.apubsmSETaprispvv(301);
    xs.c.apubsmSETaprispvf(304);
    xs.c.apubsmSETaprispfv(306);
    xs.c.apubsmSETaprispff(308);
    //protected variables
    xs.c.apubsmSETaprospvv(311);
    xs.c.apubsmSETaprospvf(314);
    xs.c.apubsmSETaprospfv(316);
    xs.c.apubsmSETaprospff(318);
    //public variables
    xs.c.apubsmSETapubspvv(321);
    xs.c.apubsmSETapubspvf(324);
    xs.c.apubsmSETapubspfv(326);
    xs.c.apubsmSETapubspff(328);
    //Checks
    //Class a
    //get private variables values
    equal(xs.a.apubsmGETaprispvv(), 101, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprispvf(), '104!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprispfv(), '?106', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprispff(), '?108!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.a.apubsmGETaprospvv(), 111, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprospvf(), '114!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprospfv(), '?116', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprospff(), '?118!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.a.apubsmGETapubspvv(), 121, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETapubspvf(), '124!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETapubspfv(), '?126', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETapubspff(), '?128!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //Class b
    //get private variables values
    equal(xs.b.apubsmGETaprispvv(), 201, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(xs.b.apubsmGETaprispvf(), '204!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(xs.b.apubsmGETaprispfv(), '?206', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(xs.b.apubsmGETaprispff(), '?208!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.b.apubsmGETaprospvv(), 211, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(xs.b.apubsmGETaprospvf(), '214!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(xs.b.apubsmGETaprospfv(), '?216', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(xs.b.apubsmGETaprospff(), '?218!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.b.apubsmGETapubspvv(), 221, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(xs.b.apubsmGETapubspvf(), '224!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(xs.b.apubsmGETapubspfv(), '?226', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(xs.b.apubsmGETapubspff(), '?228!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //Class c
    //get private variables values
    equal(xs.c.apubsmGETaprispvv(), 301, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(xs.c.apubsmGETaprispvf(), '304!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(xs.c.apubsmGETaprispfv(), '?306', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(xs.c.apubsmGETaprispff(), '?308!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.c.apubsmGETaprospvv(), 311, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(xs.c.apubsmGETaprospvf(), '314!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(xs.c.apubsmGETaprospfv(), '?316', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(xs.c.apubsmGETaprospff(), '?318!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.c.apubsmGETapubspvv(), 321, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(xs.c.apubsmGETapubspvf(), '324!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(xs.c.apubsmGETapubspfv(), '?326', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(xs.c.apubsmGETapubspff(), '?328!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    //assign back
    //Class a
    //private variables
    xs.a.apubsmSETaprispvv(1);
    xs.a.apubsmSETaprispvf(4);
    xs.a.apubsmSETaprispfv(6);
    xs.a.apubsmSETaprispff(8);
    //protected variables
    xs.a.apubsmSETaprospvv(11);
    xs.a.apubsmSETaprospvf(14);
    xs.a.apubsmSETaprospfv(16);
    xs.a.apubsmSETaprospff(18);
    //public variables
    xs.a.apubsmSETapubspvv(21);
    xs.a.apubsmSETapubspvf(24);
    xs.a.apubsmSETapubspfv(26);
    xs.a.apubsmSETapubspff(28);
    //Class b
    //private variables
    xs.b.apubsmSETaprispvv(1);
    xs.b.apubsmSETaprispvf(4);
    xs.b.apubsmSETaprispfv(6);
    xs.b.apubsmSETaprispff(8);
    //protected variables
    xs.b.apubsmSETaprospvv(11);
    xs.b.apubsmSETaprospvf(14);
    xs.b.apubsmSETaprospfv(16);
    xs.b.apubsmSETaprospff(18);
    //public variables
    xs.b.apubsmSETapubspvv(21);
    xs.b.apubsmSETapubspvf(24);
    xs.b.apubsmSETapubspfv(26);
    xs.b.apubsmSETapubspff(28);
    //Class c
    //private variables
    xs.c.apubsmSETaprispvv(1);
    xs.c.apubsmSETaprispvf(4);
    xs.c.apubsmSETaprispfv(6);
    xs.c.apubsmSETaprispff(8);
    //protected variables
    xs.c.apubsmSETaprospvv(11);
    xs.c.apubsmSETaprospvf(14);
    xs.c.apubsmSETaprospfv(16);
    xs.c.apubsmSETaprospff(18);
    //public variables
    xs.c.apubsmSETapubspvv(21);
    xs.c.apubsmSETapubspvf(24);
    xs.c.apubsmSETapubspfv(26);
    xs.c.apubsmSETapubspff(28);
    //Class a
    //get private variables values
    equal(xs.a.apubsmGETaprispvv(), 1, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprispvf(), '4!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprispfv(), '?6', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprispff(), '?8!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.a.apubsmGETaprospvv(), 11, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprospvf(), '14!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprospfv(), '?16', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprospff(), '?18!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.a.apubsmGETapubspvv(), 21, 'check value fetched by public method from private static property A with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETapubspvf(), '24!', 'check value fetched by public method from private static property A with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETapubspfv(), '?26', 'check value fetched by public method from private static property A with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETapubspff(), '?28!', 'check value fetched by public method from private static property A with value=value,getter=function,setter=function');
    //Class b
    //get private variables values
    equal(xs.b.apubsmGETaprispvv(), 1, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(xs.b.apubsmGETaprispvf(), '4!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(xs.b.apubsmGETaprispfv(), '?6', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(xs.b.apubsmGETaprispff(), '?8!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.b.apubsmGETaprospvv(), 11, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(xs.b.apubsmGETaprospvf(), '14!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(xs.b.apubsmGETaprospfv(), '?16', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(xs.b.apubsmGETaprospff(), '?18!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.b.apubsmGETapubspvv(), 21, 'check value fetched by public method from private static property B with value=value,getter=value,setter=value');
    equal(xs.b.apubsmGETapubspvf(), '24!', 'check value fetched by public method from private static property B with value=value,getter=value,setter=function');
    equal(xs.b.apubsmGETapubspfv(), '?26', 'check value fetched by public method from private static property B with value=value,getter=function,setter=value');
    equal(xs.b.apubsmGETapubspff(), '?28!', 'check value fetched by public method from private static property B with value=value,getter=function,setter=function');
    //Class c
    //get private variables values
    equal(xs.c.apubsmGETaprispvv(), 1, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(xs.c.apubsmGETaprispvf(), '4!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(xs.c.apubsmGETaprispfv(), '?6', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(xs.c.apubsmGETaprispff(), '?8!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.c.apubsmGETaprospvv(), 11, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(xs.c.apubsmGETaprospvf(), '14!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(xs.c.apubsmGETaprospfv(), '?16', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(xs.c.apubsmGETaprospff(), '?18!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.c.apubsmGETapubspvv(), 21, 'check value fetched by public method from private static property C with value=value,getter=value,setter=value');
    equal(xs.c.apubsmGETapubspvf(), '24!', 'check value fetched by public method from private static property C with value=value,getter=value,setter=function');
    equal(xs.c.apubsmGETapubspfv(), '?26', 'check value fetched by public method from private static property C with value=value,getter=function,setter=value');
    equal(xs.c.apubsmGETapubspff(), '?28!', 'check value fetched by public method from private static property C with value=value,getter=function,setter=function');
});
test('public static methods downcalls', function () {
    //get private variables values
    equal(xs.a.apubsmGETaprispvv(), 1, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprispvf(), '4!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprispfv(), '?6', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprispff(), '?8!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.a.apubsmGETaprospvv(), 11, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprospvf(), '14!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprospfv(), '?16', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprospff(), '?18!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.a.apubsmGETapubspvv(), 21, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETapubspvf(), '24!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETapubspfv(), '?26', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETapubspff(), '?28!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //assignments
    //private variables
    xs.a.apubsmSETaprispvv(101);
    xs.a.apubsmSETaprispvf(104);
    xs.a.apubsmSETaprispfv(106);
    xs.a.apubsmSETaprispff(108);
    //protected variables
    xs.b.parent().apubsmSETaprospvv(111);
    xs.b.parent().apubsmSETaprospvf(114);
    xs.b.parent().apubsmSETaprospfv(116);
    xs.b.parent().apubsmSETaprospff(118);
    //public variables
    xs.c.parent().parent().apubsmSETapubspvv(121);
    xs.c.parent().parent().apubsmSETapubspvf(124);
    xs.c.parent().parent().apubsmSETapubspfv(126);
    xs.c.parent().parent().apubsmSETapubspff(128);
    //get private variables values
    equal(xs.c.parent().parent().apubsmGETaprispvv(), 101, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.c.parent().parent().apubsmGETaprispvf(), '104!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.c.parent().parent().apubsmGETaprispfv(), '?106', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.c.parent().parent().apubsmGETaprispff(), '?108!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.a.apubsmGETaprospvv(), 111, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprospvf(), '114!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprospfv(), '?116', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprospff(), '?118!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.b.parent().apubsmGETapubspvv(), 121, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.b.parent().apubsmGETapubspvf(), '124!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.b.parent().apubsmGETapubspfv(), '?126', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.b.parent().apubsmGETapubspff(), '?128!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //assign back
    //private variables
    xs.b.parent().apubsmSETaprispvv(1);
    xs.b.parent().apubsmSETaprispvf(4);
    xs.b.parent().apubsmSETaprispfv(6);
    xs.b.parent().apubsmSETaprispff(8);
    //protected variables
    xs.c.parent().parent().apubsmSETaprospvv(11);
    xs.c.parent().parent().apubsmSETaprospvf(14);
    xs.c.parent().parent().apubsmSETaprospfv(16);
    xs.c.parent().parent().apubsmSETaprospff(18);
    //public variables
    xs.a.apubsmSETapubspvv(21);
    xs.a.apubsmSETapubspvf(24);
    xs.a.apubsmSETapubspfv(26);
    xs.a.apubsmSETapubspff(28);
    //get private variables values
    equal(xs.a.apubsmGETaprispvv(), 1, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprispvf(), '4!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprispfv(), '?6', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprispff(), '?8!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.a.apubsmGETaprospvv(), 11, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprospvf(), '14!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprospfv(), '?16', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprospff(), '?18!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.a.apubsmGETapubspvv(), 21, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETapubspvf(), '24!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETapubspfv(), '?26', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETapubspff(), '?28!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
});
module('dynamic properties');
test('private dynamic properties tests', function () {
    throws(getProperty(b1, 'apridpvv'), /^Attempt to get private property "b::apridpvv"$/, 'access to private property with value=value,getter=value,setter=value is restricted');
    throws(getProperty(b1, 'apridpvf'), /^Attempt to get private property "b::apridpvf"$/, 'access to private property with value=value,getter=value,setter=function is restricted');
    throws(getProperty(b1, 'apridpfv'), /^Attempt to get private property "b::apridpfv"$/, 'access to private property with value=value,getter=function,setter=value is restricted');
    throws(getProperty(b1, 'apridpff'), /^Attempt to get private property "b::apridpff"$/, 'access to private property with value=value,getter=function,setter=function is restricted');
    throws(setProperty(b1, 'apridpvv', 101), /^Attempt to set private property "b::apridpvv"$/, 'access to private property with value=value,getter=value,setter=value is restricted');
    throws(setProperty(b1, 'apridpvf', 104), /^Attempt to set private property "b::apridpvf"$/, 'access to private property with value=value,getter=value,setter=function is restricted');
    throws(setProperty(b1, 'apridpfv', 106), /^Attempt to set private property "b::apridpfv"$/, 'access to private property with value=value,getter=function,setter=value is restricted');
    throws(setProperty(b1, 'apridpff', 108), /^Attempt to set private property "b::apridpff"$/, 'access to private property with value=value,getter=function,setter=function is restricted');
});

































