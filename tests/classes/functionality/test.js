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
xs.a.privateStaticProperty('prispvv', 2, 3, 4);
xs.a.privateStaticProperty('prispvf', 2, 3, setter('prispvf'));
xs.a.privateStaticProperty('prispfv', 2, getter('prispfv'), 4);
xs.a.privateStaticProperty('prispff', 2, getter('prispff'), setter('prispff'));
xs.a.protectedStaticProperty('prospvv', 2, 3, 4);
xs.a.protectedStaticProperty('prospvf', 2, 3, setter('prospvf'));
xs.a.protectedStaticProperty('prospfv', 2, getter('prospfv'), 4);
xs.a.protectedStaticProperty('prospff', 2, getter('prospff'), setter('prospff'));
xs.a.publicStaticProperty('pubspvv', 2, 3, 4);
xs.a.publicStaticProperty('pubspvf', 2, 3, setter('pubspvf'));
xs.a.publicStaticProperty('pubspfv', 2, getter('pubspfv'), 4);
xs.a.publicStaticProperty('pubspff', 2, getter('pubspff'), setter('pubspff'));
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
    throws(getStaticProperty(xs.a, 'prispvv'), /^Attempt to get private property "a::prispvv"$/, 'access to private static property with value=value,getter=value,setter=value is restricted');
    throws(getStaticProperty(xs.a, 'prispvf'), /^Attempt to get private property "a::prispvf"$/, 'access to private static property with value=value,getter=value,setter=function is restricted');
    throws(getStaticProperty(xs.a, 'prispfv'), /^Attempt to get private property "a::prispfv"$/, 'access to private static property with value=value,getter=function,setter=value is restricted');
    throws(getStaticProperty(xs.a, 'prispff'), /^Attempt to get private property "a::prispff"$/, 'access to private static property with value=value,getter=function,setter=function is restricted');
    throws(setStaticProperty(xs.a, 'prispvv', 5), /^Attempt to set private property "a::prispvv"$/, 'access to private static property with value=value,getter=value,setter=value is restricted');
    throws(setStaticProperty(xs.a, 'prispvf', 5), /^Attempt to set private property "a::prispvf"$/, 'access to private static property with value=value,getter=value,setter=function is restricted');
    throws(setStaticProperty(xs.a, 'prispfv', 5), /^Attempt to set private property "a::prispfv"$/, 'access to private static property with value=value,getter=function,setter=value is restricted');
    throws(setStaticProperty(xs.a, 'prispff', 5), /^Attempt to set private property "a::prispff"$/, 'access to private static property with value=value,getter=function,setter=function is restricted');
});
test('protected static properties tests', function () {
    throws(getStaticProperty(xs.a, 'prospvv'), /^Attempt to get protected property "a::prospvv"$/, 'access to protected static property with value=value,getter=value,setter=value is restricted');
    throws(getStaticProperty(xs.a, 'prospvf'), /^Attempt to get protected property "a::prospvf"$/, 'access to protected static property with value=value,getter=value,setter=function is restricted');
    throws(getStaticProperty(xs.a, 'prospfv'), /^Attempt to get protected property "a::prospfv"$/, 'access to protected static property with value=value,getter=function,setter=value is restricted');
    throws(getStaticProperty(xs.a, 'prospff'), /^Attempt to get protected property "a::prospff"$/, 'access to protected static property with value=value,getter=function,setter=function is restricted');
    throws(setStaticProperty(xs.a, 'prospvv', 5), /^Attempt to set protected property "a::prospvv"$/, 'access to protected static property with value=value,getter=value,setter=value is restricted');
    throws(setStaticProperty(xs.a, 'prospvf', 5), /^Attempt to set protected property "a::prospvf"$/, 'access to protected static property with value=value,getter=value,setter=function is restricted');
    throws(setStaticProperty(xs.a, 'prospfv', 5), /^Attempt to set protected property "a::prospfv"$/, 'access to protected static property with value=value,getter=function,setter=value is restricted');
    throws(setStaticProperty(xs.a, 'prospff', 5), /^Attempt to set protected property "a::prospff"$/, 'access to protected static property with value=value,getter=function,setter=function is restricted');
});
test('public static properties tests', function () {
    equal(xs.a.pubspvv, 2, 'check default value assigned for public static property with value=value,getter=value,setter=value');
    equal(xs.a.pubspvf, 2, 'check default value assigned for public static property with value=value,getter=value,setter=function');
    equal(xs.a.pubspfv, 2, 'check default value assigned for public static property with value=value,getter=function,setter=value');
    equal(xs.a.pubspff, 2, 'check default value assigned for public static property with value=value,getter=function,setter=function');
    //check assignment goes ok
//    xs.a.pubspvv = 7;
//    xs.a.pubspvf = 7;
//    xs.a.pubspfv = 7;
//    xs.a.pubspff = 7;
//    xs.a.pubspfvv = 7;
//    xs.a.pubspfvf = 7;
//    xs.a.pubspffv = 7;
//    xs.a.pubspfff = 7;
//    equal(xs.a.pubspvv, 7, 'check new value assigned for public static property with value=value,getter=value,setter=value');
//    equal(xs.a.pubspvf, 7, 'check new value assigned for public static property with value=value,getter=value,setter=function');
//    equal(xs.a.pubspfv, 7, 'check new value assigned for public static property with value=value,getter=function,setter=value');
//    equal(xs.a.pubspff, 7, 'check new value assigned for public static property with value=value,getter=function,setter=function');
//    equal(xs.a.pubspfvv, 7, 'check new value assigned for public static property with value=function,getter=value,setter=value');
//    equal(xs.a.pubspfvf, 7, 'check new value assigned for public static property with value=function,getter=value,setter=function');
//    equal(xs.a.pubspffv, 7, 'check new value assigned for public static property with value=function,getter=function,setter=value');
//    equal(xs.a.pubspfff, 7, 'check new value assigned for public static property with value=function,getter=function,setter=function');
});




































