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
var xsStart = Date.now();
xs.createClass('simple');
xs.createClass('a');
xs.a.constructor(function (x) {
    this.x = x;
}, [0]);
//private properties variations
xs.a.privateStaticProperty('aprispvv', 2, 3, 4);
xs.a.privateStaticProperty('aprispvf', 2, 3, setter('aprispvf'));
xs.a.privateStaticProperty('aprispfv', 2, getter('aprispfv'), 4);
xs.a.privateStaticProperty('aprispff', 2, getter('aprispff'), setter('aprispff'));
//protected properties variations
xs.a.protectedStaticProperty('aprospvv', 2, 3, 4);
xs.a.protectedStaticProperty('aprospvf', 2, 3, setter('aprospvf'));
xs.a.protectedStaticProperty('aprospfv', 2, getter('aprospfv'), 4);
xs.a.protectedStaticProperty('aprospff', 2, getter('aprospff'), setter('aprospff'));
//public properties variations
xs.a.publicStaticProperty('apubspvv', 2, 3, 4);
xs.a.publicStaticProperty('apubspvf', 2, 3, setter('apubspvf'));
xs.a.publicStaticProperty('apubspfv', 2, getter('apubspfv'), 4);
xs.a.publicStaticProperty('apubspff', 2, getter('apubspff'), setter('apubspff'));
//private static getters/setters for private properties
xs.a.privateStaticMethod('aprismGETaprispvv', getMethod('aprispvv'));
xs.a.privateStaticMethod('aprismSETaprispvv', setMethod('aprispvv'));
xs.a.privateStaticMethod('aprismGETaprispvf', getMethod('aprispvf'));
xs.a.privateStaticMethod('aprismSETaprispvf', setMethod('aprispvf'));
xs.a.privateStaticMethod('aprismGETaprispfv', getMethod('aprispfv'));
xs.a.privateStaticMethod('aprismSETaprispfv', setMethod('aprispfv'));
xs.a.privateStaticMethod('aprismGETaprispff', getMethod('aprispff'));
xs.a.privateStaticMethod('aprismSETaprispff', setMethod('aprispff'));
//protected static getters/setters for protected properties
xs.a.protectedStaticMethod('aprosmGETaprospvv', getMethod('aprospvv'));
xs.a.protectedStaticMethod('aprosmSETaprospvv', setMethod('aprospvv'));
xs.a.protectedStaticMethod('aprosmGETaprospvf', getMethod('aprospvf'));
xs.a.protectedStaticMethod('aprosmSETaprospvf', setMethod('aprospvf'));
xs.a.protectedStaticMethod('aprosmGETaprospfv', getMethod('aprospfv'));
xs.a.protectedStaticMethod('aprosmSETaprospfv', setMethod('aprospfv'));
xs.a.protectedStaticMethod('aprosmGETaprospff', getMethod('aprospff'));
xs.a.protectedStaticMethod('aprosmSETaprospff', setMethod('aprospff'));
//public static getters/setters for private properties
xs.a.publicStaticMethod('apubsmGETaprispvv', getMethod('aprispvv'));
xs.a.publicStaticMethod('apubsmSETaprispvv', setMethod('aprispvv'));
xs.a.publicStaticMethod('apubsmGETaprispvf', getMethod('aprispvf'));
xs.a.publicStaticMethod('apubsmSETaprispvf', setMethod('aprispvf'));
xs.a.publicStaticMethod('apubsmGETaprispfv', getMethod('aprispfv'));
xs.a.publicStaticMethod('apubsmSETaprispfv', setMethod('aprispfv'));
xs.a.publicStaticMethod('apubsmGETaprispff', getMethod('aprispff'));
xs.a.publicStaticMethod('apubsmSETaprispff', setMethod('aprispff'));
//public static getters/setters for protected properties
xs.a.publicStaticMethod('apubsmGETaprospvv', getMethod('aprospvv'));
xs.a.publicStaticMethod('apubsmSETaprospvv', setMethod('aprospvv'));
xs.a.publicStaticMethod('apubsmGETaprospvf', getMethod('aprospvf'));
xs.a.publicStaticMethod('apubsmSETaprospvf', setMethod('aprospvf'));
xs.a.publicStaticMethod('apubsmGETaprospfv', getMethod('aprospfv'));
xs.a.publicStaticMethod('apubsmSETaprospfv', setMethod('aprospfv'));
xs.a.publicStaticMethod('apubsmGETaprospff', getMethod('aprospff'));
xs.a.publicStaticMethod('apubsmSETaprospff', setMethod('aprospff'));
//public static getters/setters for public properties
xs.a.publicStaticMethod('apubsmGETapubspvv', getMethod('apubspvv'));
xs.a.publicStaticMethod('apubsmSETapubspvv', setMethod('apubspvv'));
xs.a.publicStaticMethod('apubsmGETapubspvf', getMethod('apubspvf'));
xs.a.publicStaticMethod('apubsmSETapubspvf', setMethod('apubspvf'));
xs.a.publicStaticMethod('apubsmGETapubspfv', getMethod('apubspfv'));
xs.a.publicStaticMethod('apubsmSETapubspfv', setMethod('apubspfv'));
xs.a.publicStaticMethod('apubsmGETapubspff', getMethod('apubspff'));
xs.a.publicStaticMethod('apubsmSETapubspff', setMethod('apubspff'));
xs.createClass('b');
xs.b.constructor(function (x, y) {
    this.parent().constructor.call(this, x);
    this.y = y;
}, [0, 0]);
xs.createClass('c');
xs.b.constructor(function (x, y, z) {
    this.parent().constructor.call(this, x, y);
    this.z = z;
}, [0, 0, 0]);
xs.b.extend(xs.a);
xs.c.extend(xs.b);
a1 = new xs.a();
a2 = new xs.a(4);
b1 = new xs.b(3);
b2 = new xs.b(6, 9);
c1 = new xs.c(1, 2);
c2 = new xs.c(5, 1, -7);
var xsFinish = Date.now();
var storage = xs.a.storage();
var privates = xs.a.privates();
console.log('xs prepared in ' + (xsFinish - xsStart) + 'ms');
module('Namespaces');
test('Create namespace', function () {
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
module('Classes', {});
test('Create class', function () {
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
module('Functionality');
test('Object creation basics', function () {
    var s1 = new xs.simple;
    //instanceof check
    ok(s1 instanceof xs.simple, 'check object instance');
});
test('Inheritance tests', function () {
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
test('private static properties tests', function () {
    throws(getProperty(xs.a, 'aprispvv'), /^Attempt to get private property "a::aprispvv"$/, 'access to private static property with value=value,getter=value,setter=value is restricted');
    throws(getProperty(xs.a, 'aprispvf'), /^Attempt to get private property "a::aprispvf"$/, 'access to private static property with value=value,getter=value,setter=function is restricted');
    throws(getProperty(xs.a, 'aprispfv'), /^Attempt to get private property "a::aprispfv"$/, 'access to private static property with value=value,getter=function,setter=value is restricted');
    throws(getProperty(xs.a, 'aprispff'), /^Attempt to get private property "a::aprispff"$/, 'access to private static property with value=value,getter=function,setter=function is restricted');
    throws(setProperty(xs.a, 'aprispvv', 5), /^Attempt to set private property "a::aprispvv"$/, 'access to private static property with value=value,getter=value,setter=value is restricted');
    throws(setProperty(xs.a, 'aprispvf', 5), /^Attempt to set private property "a::aprispvf"$/, 'access to private static property with value=value,getter=value,setter=function is restricted');
    throws(setProperty(xs.a, 'aprispfv', 5), /^Attempt to set private property "a::aprispfv"$/, 'access to private static property with value=value,getter=function,setter=value is restricted');
    throws(setProperty(xs.a, 'aprispff', 5), /^Attempt to set private property "a::aprispff"$/, 'access to private static property with value=value,getter=function,setter=function is restricted');
});
test('protected static properties tests', function () {
    throws(getProperty(xs.a, 'aprospvv'), /^Attempt to get protected property "a::aprospvv"$/, 'access to protected static property with value=value,getter=value,setter=value is restricted');
    throws(getProperty(xs.a, 'aprospvf'), /^Attempt to get protected property "a::aprospvf"$/, 'access to protected static property with value=value,getter=value,setter=function is restricted');
    throws(getProperty(xs.a, 'aprospfv'), /^Attempt to get protected property "a::aprospfv"$/, 'access to protected static property with value=value,getter=function,setter=value is restricted');
    throws(getProperty(xs.a, 'aprospff'), /^Attempt to get protected property "a::aprospff"$/, 'access to protected static property with value=value,getter=function,setter=function is restricted');
    throws(setProperty(xs.a, 'aprospvv', 5), /^Attempt to set protected property "a::aprospvv"$/, 'access to protected static property with value=value,getter=value,setter=value is restricted');
    throws(setProperty(xs.a, 'aprospvf', 5), /^Attempt to set protected property "a::aprospvf"$/, 'access to protected static property with value=value,getter=value,setter=function is restricted');
    throws(setProperty(xs.a, 'aprospfv', 5), /^Attempt to set protected property "a::aprospfv"$/, 'access to protected static property with value=value,getter=function,setter=value is restricted');
    throws(setProperty(xs.a, 'aprospff', 5), /^Attempt to set protected property "a::aprospff"$/, 'access to protected static property with value=value,getter=function,setter=function is restricted');
});
test('public static properties tests', function () {
    equal(xs.a.apubspvv, 2, 'check default value assigned for public static property with value=value,getter=value,setter=value');
    equal(xs.a.apubspvf, '2!', 'check default value assigned for public static property with value=value,getter=value,setter=function');
    equal(xs.a.apubspfv, '?2', 'check default value assigned for public static property with value=value,getter=function,setter=value');
    equal(xs.a.apubspff, '?2!', 'check default value assigned for public static property with value=value,getter=function,setter=function');
    //check assignment goes ok
    xs.a.apubspvv = 7;
    xs.a.apubspvf = 7;
    xs.a.apubspfv = 7;
    xs.a.apubspff = 7;
    equal(xs.a.apubspvv, 7, 'check new value assigned for public static property with value=value,getter=value,setter=value');
    equal(xs.a.apubspvf, '7!', 'check new value assigned for public static property with value=value,getter=value,setter=function');
    equal(xs.a.apubspfv, '?7', 'check new value assigned for public static property with value=value,getter=function,setter=value');
    equal(xs.a.apubspff, '?7!', 'check new value assigned for public static property with value=value,getter=function,setter=function');
    xs.a.apubspvv = 2;
    xs.a.apubspvf = 2;
    xs.a.apubspfv = 2;
    xs.a.apubspff = 2;
});
test('private static methods tests', function () {
    throws(getMethodCall(xs.a.aprismGETaprispvv), /^Attempt to call private method "a::aprismGETaprispvv"$/, 'call private static getter method for property with value=value,getter=value,setter=value is restricted');
    throws(setMethodCall(xs.a.aprismSETaprispvv, 9), /^Attempt to call private method "a::aprismSETaprispvv"$/, 'call private static setter method for property with value=value,getter=value,setter=value is restricted');
    throws(getMethodCall(xs.a.aprismGETaprispvf), /^Attempt to call private method "a::aprismGETaprispvf"$/, 'call private static getter method for property with value=value,getter=value,setter=function is restricted');
    throws(setMethodCall(xs.a.aprismSETaprispvf, 9), /^Attempt to call private method "a::aprismSETaprispvf"$/, 'call private static setter method for property with value=value,getter=value,setter=function is restricted');
    throws(getMethodCall(xs.a.aprismGETaprispfv), /^Attempt to call private method "a::aprismGETaprispfv"$/, 'call private static getter method for property with value=value,getter=function,setter=value is restricted');
    throws(setMethodCall(xs.a.aprismSETaprispfv, 9), /^Attempt to call private method "a::aprismSETaprispfv"$/, 'call private static setter method for property with value=value,getter=function,setter=value is restricted');
    throws(getMethodCall(xs.a.aprismGETaprispff), /^Attempt to call private method "a::aprismGETaprispff"$/, 'call private static getter method for property with value=value,getter=function,setter=function is restricted');
    throws(setMethodCall(xs.a.aprismSETaprispff, 9), /^Attempt to call private method "a::aprismSETaprispff"$/, 'call private static setter method for property with value=value,getter=function,setter=function is restricted');
});
test('protected static methods tests', function () {
    throws(getMethodCall(xs.a.aprosmGETaprospvv), /^Attempt to call protected method "a::aprosmGETaprospvv"$/, 'call private static getter method for property with value=value,getter=value,setter=value is restricted');
    throws(setMethodCall(xs.a.aprosmSETaprospvv, 9), /^Attempt to call protected method "a::aprosmSETaprospvv"$/, 'call private static setter method for property with value=value,getter=value,setter=value is restricted');
    throws(getMethodCall(xs.a.aprosmGETaprospvf), /^Attempt to call protected method "a::aprosmGETaprospvf"$/, 'call private static getter method for property with value=value,getter=value,setter=function is restricted');
    throws(setMethodCall(xs.a.aprosmSETaprospvf, 9), /^Attempt to call protected method "a::aprosmSETaprospvf"$/, 'call private static setter method for property with value=value,getter=value,setter=function is restricted');
    throws(getMethodCall(xs.a.aprosmGETaprospfv), /^Attempt to call protected method "a::aprosmGETaprospfv"$/, 'call private static getter method for property with value=value,getter=function,setter=value is restricted');
    throws(setMethodCall(xs.a.aprosmSETaprospfv, 9), /^Attempt to call protected method "a::aprosmSETaprospfv"$/, 'call private static setter method for property with value=value,getter=function,setter=value is restricted');
    throws(getMethodCall(xs.a.aprosmGETaprospff), /^Attempt to call protected method "a::aprosmGETaprospff"$/, 'call private static getter method for property with value=value,getter=function,setter=function is restricted');
    throws(setMethodCall(xs.a.aprosmSETaprospff, 9), /^Attempt to call protected method "a::aprosmSETaprospff"$/, 'call private static setter method for property with value=value,getter=function,setter=function is restricted');
});
test('public static methods tests', function () {
    //get private variables values
    equal(xs.a.apubsmGETaprispvv(), 2, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprispvf(), '2!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprispfv(), '?2', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprispff(), '?2!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get protected variables values
    equal(xs.a.apubsmGETaprospvv(), 2, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETaprospvf(), '2!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETaprospfv(), '?2', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETaprospff(), '?2!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
    //get public variables values
    equal(xs.a.apubsmGETapubspvv(), 2, 'check value fetched by public method from private static property with value=value,getter=value,setter=value');
    equal(xs.a.apubsmGETapubspvf(), '2!', 'check value fetched by public method from private static property with value=value,getter=value,setter=function');
    equal(xs.a.apubsmGETapubspfv(), '?2', 'check value fetched by public method from private static property with value=value,getter=function,setter=value');
    equal(xs.a.apubsmGETapubspff(), '?2!', 'check value fetched by public method from private static property with value=value,getter=function,setter=function');
});



































