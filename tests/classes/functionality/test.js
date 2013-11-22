xs.createClass('simple');
xs.createClass('a')
    .constructor(function (x) {
        this.x = x;
    }, [0]);
xs.createClass('b')
    .constructor(function (x, y) {
        this.parent().constructor.call(this, x);
        this.y = y;
    }, [0, 0]);
xs.createClass('c')
    .constructor(function (x, y, z) {
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




































