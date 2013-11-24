function value() {
    return '*' + value + '*';
}
function getter(name) {
    return function getter() {
        return '?' + this.__get(name);
    };
}
function setter(name) {
    return function (value) {
        return this.__set(name, value + '!');
    };
}
function getStaticProperty(xsclass, name) {
    return function () {
        return xsclass[name];
    };
}
function setStaticProperty(xsclass, name, value) {
    return function test() {
        return xsclass[name] = value;
    }
}
var xsStart = Date.now();
xs.createClass('simple');
xs.createClass('a');
xs.a.constructor(function (x) {
    this.x = x;
}, [0]);
xs.a.privateStaticProperty('prispvvv', 2, 3, 4);
xs.a.privateStaticProperty('prispvvf', 2, 3, setter('prispvvf'));
xs.a.privateStaticProperty('prispvfv', 2, getter('prispvfv'), 4);
xs.a.privateStaticProperty('prispvff', 2, getter('prispvff'), setter('prispvff'));
xs.a.privateStaticProperty('prispfvv', 2, 3, 4);
xs.a.privateStaticProperty('prispfvf', 2, 3, setter('prispfvf'));
xs.a.privateStaticProperty('prispffv', 2, getter('prispffv'), 4);
xs.a.privateStaticProperty('prispfff', 2, getter('prispfff'), setter('prispfff'));
xs.a.protectedStaticProperty('prospvvv', 2, 3, 4);
xs.a.protectedStaticProperty('prospvvf', 2, 3, setter('prospvvf'));
xs.a.protectedStaticProperty('prospvfv', 2, getter('prospvfv'), 4);
xs.a.protectedStaticProperty('prospvff', 2, getter('prospvff'), setter('prospvff'));
xs.a.protectedStaticProperty('prospfvv', 2, 3, 4);
xs.a.protectedStaticProperty('prospfvf', 2, 3, setter('prospfvf'));
xs.a.protectedStaticProperty('prospffv', 2, getter('prospffv'), 4);
xs.a.protectedStaticProperty('prospfff', 2, getter('prospfff'), setter('prospfff'));
xs.a.publicStaticProperty('pubspvvv', 2, 3, 4);
xs.a.publicStaticProperty('pubspvvf', 2, 3, setter('pubspvvf'));
xs.a.publicStaticProperty('pubspvfv', 2, getter('pubspvfv'), 4);
xs.a.publicStaticProperty('pubspvff', 2, getter('pubspvff'), setter('pubspvff'));
xs.a.publicStaticProperty('pubspfvv', 2, 3, 4);
xs.a.publicStaticProperty('pubspfvf', 2, 3, setter('pubspfvf'));
xs.a.publicStaticProperty('pubspffv', 2, getter('pubspffv'), 4);
xs.a.publicStaticProperty('pubspfff', 2, getter('pubspfff'), setter('pubspfff'));
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
    throws(getStaticProperty(xs.a, 'prispvvv'), /^Attempt to get private property "a::prispvvv"$/, 'access to private static property with value=value,getter=value,setter=value is restricted');
    throws(getStaticProperty(xs.a, 'prispvvf'), /^Attempt to get private property "a::prispvvf"$/, 'access to private static property with value=value,getter=value,setter=function is restricted');
    throws(getStaticProperty(xs.a, 'prispvfv'), /^Attempt to get private property "a::prispvfv"$/, 'access to private static property with value=value,getter=function,setter=value is restricted');
    throws(getStaticProperty(xs.a, 'prispvff'), /^Attempt to get private property "a::prispvff"$/, 'access to private static property with value=value,getter=function,setter=function is restricted');
    throws(getStaticProperty(xs.a, 'prispfvv'), /^Attempt to get private property "a::prispfvv"$/, 'access to private static property with value=function,getter=value,setter=value is restricted');
    throws(getStaticProperty(xs.a, 'prispfvf'), /^Attempt to get private property "a::prispfvf"$/, 'access to private static property with value=function,getter=value,setter=function is restricted');
    throws(getStaticProperty(xs.a, 'prispffv'), /^Attempt to get private property "a::prispffv"$/, 'access to private static property with value=function,getter=function,setter=value is restricted');
    throws(getStaticProperty(xs.a, 'prispfff'), /^Attempt to get private property "a::prispfff"$/, 'access to private static property with value=function,getter=function,setter=function is restricted');
    throws(setStaticProperty(xs.a, 'prispvvv', 5), /^Attempt to set private property "a::prispvvv"$/, 'access to private static property with value=value,getter=value,setter=value is restricted');
    throws(setStaticProperty(xs.a, 'prispvvf', 5), /^Attempt to set private property "a::prispvvf"$/, 'access to private static property with value=value,getter=value,setter=function is restricted');
    throws(setStaticProperty(xs.a, 'prispvfv', 5), /^Attempt to set private property "a::prispvfv"$/, 'access to private static property with value=value,getter=function,setter=value is restricted');
    throws(setStaticProperty(xs.a, 'prispvff', 5), /^Attempt to set private property "a::prispvff"$/, 'access to private static property with value=value,getter=function,setter=function is restricted');
    throws(setStaticProperty(xs.a, 'prispfvv', 5), /^Attempt to set private property "a::prispfvv"$/, 'access to private static property with value=function,getter=value,setter=value is restricted');
    throws(setStaticProperty(xs.a, 'prispfvf', 5), /^Attempt to set private property "a::prispfvf"$/, 'access to private static property with value=function,getter=value,setter=function is restricted');
    throws(setStaticProperty(xs.a, 'prispffv', 5), /^Attempt to set private property "a::prispffv"$/, 'access to private static property with value=function,getter=function,setter=value is restricted');
    throws(setStaticProperty(xs.a, 'prispfff', 5), /^Attempt to set private property "a::prispfff"$/, 'access to private static property with value=function,getter=function,setter=function is restricted');
});
test('protected static properties tests', function () {
    throws(getStaticProperty(xs.a, 'prospvvv'), /^Attempt to get protected property "a::prospvvv"$/, 'access to protected static property with value=value,getter=value,setter=value is restricted');
    throws(getStaticProperty(xs.a, 'prospvvf'), /^Attempt to get protected property "a::prospvvf"$/, 'access to protected static property with value=value,getter=value,setter=function is restricted');
    throws(getStaticProperty(xs.a, 'prospvfv'), /^Attempt to get protected property "a::prospvfv"$/, 'access to protected static property with value=value,getter=function,setter=value is restricted');
    throws(getStaticProperty(xs.a, 'prospvff'), /^Attempt to get protected property "a::prospvff"$/, 'access to protected static property with value=value,getter=function,setter=function is restricted');
    throws(getStaticProperty(xs.a, 'prospfvv'), /^Attempt to get protected property "a::prospfvv"$/, 'access to protected static property with value=function,getter=value,setter=value is restricted');
    throws(getStaticProperty(xs.a, 'prospfvf'), /^Attempt to get protected property "a::prospfvf"$/, 'access to protected static property with value=function,getter=value,setter=function is restricted');
    throws(getStaticProperty(xs.a, 'prospffv'), /^Attempt to get protected property "a::prospffv"$/, 'access to protected static property with value=function,getter=function,setter=value is restricted');
    throws(getStaticProperty(xs.a, 'prospfff'), /^Attempt to get protected property "a::prospfff"$/, 'access to protected static property with value=function,getter=function,setter=function is restricted');
    throws(setStaticProperty(xs.a, 'prospvvv', 5), /^Attempt to set protected property "a::prospvvv"$/, 'access to protected static property with value=value,getter=value,setter=value is restricted');
    throws(setStaticProperty(xs.a, 'prospvvf', 5), /^Attempt to set protected property "a::prospvvf"$/, 'access to protected static property with value=value,getter=value,setter=function is restricted');
    throws(setStaticProperty(xs.a, 'prospvfv', 5), /^Attempt to set protected property "a::prospvfv"$/, 'access to protected static property with value=value,getter=function,setter=value is restricted');
    throws(setStaticProperty(xs.a, 'prospvff', 5), /^Attempt to set protected property "a::prospvff"$/, 'access to protected static property with value=value,getter=function,setter=function is restricted');
    throws(setStaticProperty(xs.a, 'prospfvv', 5), /^Attempt to set protected property "a::prospfvv"$/, 'access to protected static property with value=function,getter=value,setter=value is restricted');
    throws(setStaticProperty(xs.a, 'prospfvf', 5), /^Attempt to set protected property "a::prospfvf"$/, 'access to protected static property with value=function,getter=value,setter=function is restricted');
    throws(setStaticProperty(xs.a, 'prospffv', 5), /^Attempt to set protected property "a::prospffv"$/, 'access to protected static property with value=function,getter=function,setter=value is restricted');
    throws(setStaticProperty(xs.a, 'prospfff', 5), /^Attempt to set protected property "a::prospfff"$/, 'access to protected static property with value=function,getter=function,setter=function is restricted');
});
test('public static properties tests', function () {
    equal(xs.a.pubspvvv, 2, 'check default value assigned for public static property with value=value,getter=value,setter=value');
    equal(xs.a.pubspvvf, 2, 'check default value assigned for public static property with value=value,getter=value,setter=function');
    equal(xs.a.pubspvfv, 2, 'check default value assigned for public static property with value=value,getter=function,setter=value');
    equal(xs.a.pubspvff, 2, 'check default value assigned for public static property with value=value,getter=function,setter=function');
    equal(xs.a.pubspfvv, undefined, 'check default value assigned for public static property with value=function,getter=value,setter=value');
    equal(xs.a.pubspfvf, undefined, 'check default value assigned for public static property with value=function,getter=value,setter=function');
    equal(xs.a.pubspffv, '?', 'check default value assigned for public static property with value=function,getter=function,setter=value');
    equal(xs.a.pubspfff, '?', 'check default value assigned for public static property with value=function,getter=function,setter=function');
    //check assignment goes ok
//    xs.a.pubspvvv = 7;
//    xs.a.pubspvvf = 7;
//    xs.a.pubspvfv = 7;
//    xs.a.pubspvff = 7;
//    xs.a.pubspfvv = 7;
//    xs.a.pubspfvf = 7;
//    xs.a.pubspffv = 7;
//    xs.a.pubspfff = 7;
//    equal(xs.a.pubspvvv, 7, 'check new value assigned for public static property with value=value,getter=value,setter=value');
//    equal(xs.a.pubspvvf, 7, 'check new value assigned for public static property with value=value,getter=value,setter=function');
//    equal(xs.a.pubspvfv, 7, 'check new value assigned for public static property with value=value,getter=function,setter=value');
//    equal(xs.a.pubspvff, 7, 'check new value assigned for public static property with value=value,getter=function,setter=function');
//    equal(xs.a.pubspfvv, 7, 'check new value assigned for public static property with value=function,getter=value,setter=value');
//    equal(xs.a.pubspfvf, 7, 'check new value assigned for public static property with value=function,getter=value,setter=function');
//    equal(xs.a.pubspffv, 7, 'check new value assigned for public static property with value=function,getter=function,setter=value');
//    equal(xs.a.pubspfff, 7, 'check new value assigned for public static property with value=function,getter=function,setter=function');
});




































