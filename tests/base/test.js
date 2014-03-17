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
function xsStart(suffix) {
    xs.define('demo.Base' + suffix, {
        constructor: function (a, b) {
            this.propA = a;
            this.propB = b;
        },
        default: [1, 2],
        const: {
            a: function () {
                return 'a!';
            }
        },
        static: {
            properties: {
                propA: {
                    get: function () {
                        return this.__get('propA') + '!';
                    },
                    set: function (value) {
                        return this.__set('propA', '?' + value);
                    },
                    default: 1
                },
                propB: 11
            },
            methods: {
                metA: function (a, b) {
                    return a + b + 'base.static.a';
                },
                metB: {
                    fn: function (a, b) {
                        return a + b + 'base.static.b';
                    },
                    default: [1, 2]
                }
            }
        },
        properties: {
            propA: {
                get: function () {
                    return this.__get('propA') + '!!';
                },
                set: function (value) {
                    return this.__set('propA', '??' + value);
                },
                default: 12
            },
            propB: 15
        },
        methods: {
            metA: function (a, b) {
                return a + b + 'base.a';
            },
            metB: {
                fn: function (a, b) {
                    return a + b + 'base.b';
                },
                default: [2, 3]
            }
        }
    });
    xs.define('demo.Parent' + suffix, {
        extend: 'demo.Base',
        constructor: function (a, b, c) {
            this.parent(arguments).constructor.call(this, a, b);
            this.propC = c;
        },
        default: [2, 4],
        const: {
            b: function () {
                return 'bb!!';
            }
        },
        static: {
            properties: {
                propB: 111,
                propC: {
                    set: function (value) {
                        return this.__set('propC', '-' + value);
                    },
                    default: 1
                }
            },
            methods: {
                metB: {
                    fn: function (a, b) {
                        return a + b + 'parent.static.b';
                    },
                    default: [1, 2]
                },
                metC: {
                    fn: function (a, b) {
                        return this.parent(arguments).metB.call(this, a - 1, b + 1);
                    },
                    default: [1, 2]
                }
            }
        },
        properties: {
            propB: 155,
            propC: {
                set: function (value) {
                    return this.__set('propC', '--' + value);
                }
            }
        },
        methods: {
            metB: {
                fn: function (a, b) {
                    return a + b + 'parent.a';
                },
                default: [1, 2]
            },
            metC: {
                fn: function (a, b) {
                    return this.parent(arguments).metB.call(this, a - 1, b + 1);
                },
                default: [1, 2]
            }
        }
    });
    xs.define('demo.Child' + suffix, {
        extend: 'demo.Parent',
        constructor: function (a, b, c, d) {
            this.parent(arguments).constructor.call(this, a, b);
            this.propD = d;
        },
        default: [4, 8, 12],
        const: {
            c: function () {
                return 'ccc!!!';
            }
        },
        static: {
            properties: {
                propC: {
                    set: function (value) {
                        return this.__set('propC', '-+' + value);
                    },
                    default: 5
                },
                propD: {
                    get: function () {
                        return this.__get('propD') + '-+';
                    },
                    default: 6
                }
            },
            methods: {
                metA: function (a, b) {
                    return a + b + 'child.static.a';
                },
                metC: {
                    fn: function (a, b) {
                        return this.parent(arguments).metС.call(this, a - 1, b + 1);
                    },
                    default: [1, 2]
                }
            }
        },
        properties: {
            propB: 155,
            propC: {
                set: function (value) {
                    return this.__set('propC', '--++' + value);
                },
                default: 7
            },
            propD: {
                get: function () {
                    return this.__get('propD') + '--++';
                },
                default: 8
            }

        },
        methods: {
            metA: function (a, b) {
                return a + b + 'child.a';
            },
            metС: function (a, b) {
                return this.parent(arguments).metС.call(this, a - 1, b + 1);
            },
            metD: {
                fn: function (a, b) {
                    return a + b + 'child.d';
                },
                default: [1, 2]
            }
        }
    });
}

speed(function () {
    xsStart('');
}, 1);
/**
 * Tests:
 * 1. Define basics
 *  - define completes
 *  - createdFn called
 * 2. Define in namespace
 *  - define completes
 * 3. Define tree
 *  - check all classes defined
 *  - check parental/child linkage
 * 4. Creation simple
 *  - Object is instance
 * 5. Constants
 *  - sample
 *  - inheritance
 * 6. Static properties
 *  - sample
 *  - inheritance
 * 7. Static methods
 *  - sample
 *  - inheritance
 * 8. Properties
 *  - sample
 *  - inheritance
 * 9.Methods
 *  - sample
 *  - inheritance
 * 10. Creation with attributes
 * 11.Requires
 * 12.Mixins
 * 13.Singleton
 *  -
 */
module('1. Define basics');
test('sample', function () {
    //check create, references and recreation prevention
    var cls = xs.define('demo.Basic');
    strictEqual(cls, demo.Basic, 'check that class was created');
    strictEqual(xs.define('demo.Basic'), cls, 'check class recreate prevented');
    //check basic parameters assigned
    strictEqual(demo.Basic.$name, 'demo.Basic', 'check class name');
    strictEqual(demo.Basic.$namespace, null, 'check class namespace');
});
module('2. Define in namespace');
test('sample', function () {
    //check create, references and recreation prevention
    var cls = xs.define('ns.Basic', {namespace: 'demo.module'});
    strictEqual(cls, demo.module.Basic, 'check that class was created in specified namespace');
    strictEqual(xs.define('demo.module.Basic'), cls, 'check class recreate prevented');
    //check basic parameters assigned
    strictEqual(demo.module.Basic.$name, 'demo.module.Basic', 'check class name');
    strictEqual(demo.module.Basic.$namespace, 'demo.module', 'check class namespace');
});
module('3. Define tree');
test('sample', function () {
    //get class shortcuts
    var base = demo.Base;
    var parent = demo.Parent;
    var child = demo.Child;
    //check names
    strictEqual(base.$name, 'demo.Base', 'check base is class');
    strictEqual(parent.$name, 'demo.Parent', 'check parent is class');
    strictEqual(child.$name, 'demo.Child', 'check child is class');
    //check $parent
    strictEqual(parent.$parent, base, 'check that demo.Parent is child of demo.Base with $parent property');
    strictEqual(child.$parent, parent, 'check that child is demo.Child of demo.Parent with $parent property');
});
test('isChild', function () {
    //get class shortcuts
    var base = demo.Base;
    var parent = demo.Parent;
    var child = demo.Child;
    //true values
    strictEqual(parent.isChild(base), true, 'check that demo.Parent is child of demo.Base with isChild call');
    strictEqual(child.isChild(parent), true, 'check that demo.Child is child of demo.Parent with isChild call');
    //false values
    strictEqual(base.isChild(parent), false, 'check that demo.Base is not child of demo.Parent with isChild call');
    strictEqual(base.isChild(base), false, 'check that demo.Base is not child of demo.Base with isChild call');
    strictEqual(base.isChild([]), false, 'check that demo.Base is not child of empty [] (incorrect value example) with isChild call');
    strictEqual(parent.isChild(child), false, 'check that demo.Parent is not child of demo.Child with isChild call');
});
test('isParent', function () {
    //get class shortcuts
    var base = demo.Base;
    var parent = demo.Parent;
    var child = demo.Child;
    //true values
    strictEqual(base.isParent(parent), true, 'check that demo.Base is parent of demo.Parent with isParent call');
    strictEqual(parent.isParent(child), true, 'check that demo.Parent is parent of demo.Child with isParent call');
    //false values
    strictEqual(parent.isParent(base), false, 'check that demo.Parent is not parent of demo.Base with isParent call');
    strictEqual(base.isParent(base), false, 'check that demo.Base is not parent of demo.Base with isParent call');
    strictEqual(base.isParent([]), false, 'check that demo.Base is not parent of empty [] (incorrect value example) with isParent call');
    strictEqual(child.isParent(parent), false, 'check that demo.Child is not parent of demo.Parent with isParent call');
});
module('4. Creation simple');
test('sample', function () {
    var instBase = xs.create('demo.Base');
    var instParent = xs.create('demo.Parent');
    var instChild = xs.create('demo.Child');
    //check instances
    ok(instBase instanceof demo.Base, 'check instance of demo.Base is correct referred');
    ok(instParent instanceof demo.Parent, 'check instance of demo.Parent is correct referred');
    ok(instChild instanceof demo.Child, 'check instance of demo.Child is correct referred');
});
module('5. Constants');
test('base', function () {
    //get class shortcut
    var base = demo.Base;
    //check class constant
    ok(base.hasOwnProperty('a'), 'class demo.Base has constant "a"');
    strictEqual(base.a(), 'a!', 'class demo.Base constant "a" value is valid');
    strictEqual(Object.getOwnPropertyDescriptor(base, 'a').writable, false, 'class demo.Base constant "a" is not writable');
    strictEqual(Object.getOwnPropertyDescriptor(base, 'a').enumerable, true, 'class demo.Base constant "a" is enumerable');
    strictEqual(Object.getOwnPropertyDescriptor(base, 'a').configurable, false, 'class demo.Base constant "a" is not configurable');
    //check inherited constant
    ok(base.hasOwnProperty('$isClass'), 'class demo.Base has constant "$isClass", inherited from core class');
    strictEqual(base.$isClass, true, 'class demo.Base constant "$isClass" value is valid');
    strictEqual(Object.getOwnPropertyDescriptor(base, '$isClass').writable, false, 'class demo.Base constant "$isClass" is not writable');
    strictEqual(Object.getOwnPropertyDescriptor(base, '$isClass').enumerable, true, 'class demo.Base constant "$isClass" is enumerable');
    strictEqual(Object.getOwnPropertyDescriptor(base, '$isClass').configurable, false, 'class demo.Base constant "$isClass" is not configurable');
});
test('parent', function () {
    //get class shortcut
    var parent = demo.Parent;
    //check class constant
    ok(parent.hasOwnProperty('b'), 'class demo.Parent has constant "b"');
    strictEqual(parent.b(), 'bb!!', 'class demo.Parent constant "b" value is valid');
    strictEqual(Object.getOwnPropertyDescriptor(parent, 'b').writable, false, 'class demo.Parent constant "b" is not writable');
    strictEqual(Object.getOwnPropertyDescriptor(parent, 'b').enumerable, true, 'class demo.Parent constant "b" is enumerable');
    strictEqual(Object.getOwnPropertyDescriptor(parent, 'b').configurable, false, 'class demo.Parent constant "b" is not configurable');
    //check inherited constant
    ok(parent.hasOwnProperty('a'), 'class demo.Parent has constant "a", inherited from core class');
    strictEqual(parent.a(), 'a!', 'class demo.Parent constant "a" value is valid');
    strictEqual(Object.getOwnPropertyDescriptor(parent, 'a').writable, false, 'class demo.Parent constant "a" is not writable');
    strictEqual(Object.getOwnPropertyDescriptor(parent, 'a').enumerable, true, 'class demo.Parent constant "a" is enumerable');
    strictEqual(Object.getOwnPropertyDescriptor(parent, 'a').configurable, false, 'class demo.Parent constant "a" is not configurable');
});
test('child', function () {
    //get class shortcut
    var child = demo.Child;
    //check class constant
    ok(child.hasOwnProperty('c'), 'class demo.Child has constant "c"');
    strictEqual(child.c(), 'ccc!!!', 'class demo.Child constant "c" value is valid');
    strictEqual(Object.getOwnPropertyDescriptor(child, 'c').writable, false, 'class demo.Child constant "c" is not writable');
    strictEqual(Object.getOwnPropertyDescriptor(child, 'c').enumerable, true, 'class demo.Child constant "c" is enumerable');
    strictEqual(Object.getOwnPropertyDescriptor(child, 'c').configurable, false, 'class demo.Child constant "c" is not configurable');
    //check inherited constant
    ok(child.hasOwnProperty('b'), 'class demo.Child has constant "b", inherited from core class');
    strictEqual(child.b(), 'bb!!', 'class demo.Child constant "b" value is valid');
    strictEqual(Object.getOwnPropertyDescriptor(child, 'b').writable, false, 'class demo.Child constant "b" is not writable');
    strictEqual(Object.getOwnPropertyDescriptor(child, 'b').enumerable, true, 'class demo.Child constant "b" is enumerable');
    strictEqual(Object.getOwnPropertyDescriptor(child, 'b').configurable, false, 'class demo.Child constant "b" is not configurable');
});
module('6. Static properties');
test('base', function () {
    //get class shortcut
    var base = demo.Base;
    //check class properties
    ok(base.hasOwnProperty('propA'), 'class demo.Base has property "propA"');
    strictEqual(Object.getOwnPropertyDescriptor(base, 'a').enumerable, true, 'class demo.Base property "propA" is enumerable');
    strictEqual(Object.getOwnPropertyDescriptor(base, 'a').configurable, false, 'class demo.Base property "propA" is not configurable');
    //get/set check
    //accessored property
    strictEqual(base.propA, '?1!', 'class demo.Base property "propA" default value is valid');
    base.propA = 5;
    strictEqual(base.propA, '?5!', 'class demo.Base property "propA" assigned value is valid');
    base.propA = 1;
    //simple property
    strictEqual(base.propB, 11, 'class demo.Base property "propB" default value is valid');
    base.propB = 5;
    strictEqual(base.propB, 5, 'class demo.Base property "propB" assigned value is valid');
    base.propB = 11;
});
test('parent', function () {
    //get class shortcut
    var parent = demo.Parent;
    //check class properties
    ok(parent.hasOwnProperty('propB'), 'class demo.Parent has property "propB"');
    strictEqual(Object.getOwnPropertyDescriptor(parent, 'propB').writable, true, 'class demo.Parent property "propB" is writable');
    strictEqual(Object.getOwnPropertyDescriptor(parent, 'propB').enumerable, true, 'class demo.Parent property "propB" is enumerable');
    strictEqual(Object.getOwnPropertyDescriptor(parent, 'propB').configurable, false, 'class demo.Parent property "propB" is not configurable');
    //get/set check
    //accessored property
    strictEqual(parent.propC, '-1', 'class demo.Parent property "propC" default value is valid');
    parent.propC = 5;
    strictEqual(parent.propC, '-5', 'class demo.Parent property "propC" assigned value is valid');
    parent.propC = -1;
    //simple property
    strictEqual(parent.propB, 111, 'class demo.Parent property "propB" default value is valid');
    parent.propB = 5;
    strictEqual(parent.propB, 5, 'class demo.Parent property "propB" assigned value is valid');
    parent.propB = 111;
    //inherited property
    strictEqual(parent.propA, '?1!', 'class demo.Parent property "propA" default value is valid');
    parent.propA = 5;
    strictEqual(parent.propA, '?5!', 'class demo.Parent property "propA" assigned value is valid');
    parent.propA = 1;
});
test('child', function () {
    //get class shortcut
    var child = demo.Child;
    //check class properties
    ok(child.hasOwnProperty('propD'), 'class demo.Child has property "propD"');
    strictEqual(Object.getOwnPropertyDescriptor(child, 'propD').enumerable, true, 'class demo.Child property "propD" is enumerable');
    strictEqual(Object.getOwnPropertyDescriptor(child, 'propD').configurable, false, 'class demo.Child property "propD" is not configurable');
    //get/set check
    //accessored property
    strictEqual(child.propC, '-+5', 'class demo.Child property "propC" default value is valid');
    child.propC = 50;
    strictEqual(child.propC, '-+50', 'class demo.Child property "propC" assigned value is valid');
    child.propC = 5;
    //another accessored property
    strictEqual(child.propD, '6-+', 'class demo.Child property "propD" default value is valid');
    child.propD = 5;
    strictEqual(child.propD, '5-+', 'class demo.Child property "propD" assigned value is valid');
    child.propD = 6;
    //inherited property
    strictEqual(child.propB, 111, 'class demo.Child property "propB" default value is valid');
    child.propB = 5;
    strictEqual(child.propB, 5, 'class demo.Child property "propB" assigned value is valid');
    child.propB = 111;
});

































