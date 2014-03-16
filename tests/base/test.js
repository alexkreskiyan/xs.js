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
        defaults: [1, 2],
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
                    }
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
                    defaults: [1, 2]
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
                }
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
                defaults: [2, 3]
            }
        }
    });
    xs.define('demo.Parent' + suffix, {
        extend: 'demo.Base',
        constructor: function (a, b, c) {
            this.parent(arguments).constructor.call(this, a, b);
            this.propC = c;
        },
        defaults: [2, 4],
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
                    }
                }
            },
            methods: {
                metB: {
                    fn: function (a, b) {
                        return a + b + 'parent.static.b';
                    },
                    defaults: [1, 2]
                },
                metC: {
                    fn: function (a, b) {
                        return this.parent(arguments).metB.call(this, a - 1, b + 1);
                    },
                    defaults: [1, 2]
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
                defaults: [1, 2]
            },
            metC: {
                fn: function (a, b) {
                    return this.parent(arguments).metB.call(this, a - 1, b + 1);
                },
                defaults: [1, 2]
            }
        }
    });
    xs.define('demo.Child' + suffix, {
        extend: 'demo.Parent',
        constructor: function (a, b, c, d) {
            this.parent(arguments).constructor.call(this, a, b);
            this.propD = d;
        },
        defaults: [4, 8, 12],
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
                    }
                },
                propD: {
                    get: function () {
                        return this.__get('propD') + '-+';
                    }
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
                    defaults: [1, 2]
                }
            }
        },
        properties: {
            propB: 155,
            propC: {
                set: function (value) {
                    return this.__set('propC', '--' + value);
                }
            },
            propD: {
                get: function () {
                    return this.__get('propD') + '--++';
                }
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
                defaults: [1, 2]
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
    equal(cls, demo.Basic, 'check that class was created');
    equal(xs.define('demo.Basic'), cls, 'check class recreate prevented');
    //check basic parameters assigned
    equal(demo.Basic.$name, 'demo.Basic', 'check class name');
    equal(demo.Basic.$namespace, null, 'check class namespace');
});
module('2. Define in namespace');
test('sample', function () {
    //check create, references and recreation prevention
    var cls = xs.define('ns.Basic', {namespace: 'demo.module'});
    equal(cls, demo.module.Basic, 'check that class was created in specified namespace');
    equal(xs.define('demo.module.Basic'), cls, 'check class recreate prevented');
    //check basic parameters assigned
    equal(demo.module.Basic.$name, 'demo.module.Basic', 'check class name');
    equal(demo.module.Basic.$namespace, 'demo.module', 'check class namespace');
});
module('3. Define tree');
test('sample', function () {
    //get class shortcuts
    var base = demo.Base;
    var parent = demo.Parent;
    var child = demo.Child;
    //check names
    equal(base.$name, 'demo.Base', 'check base is class');
    equal(parent.$name, 'demo.Parent', 'check parent is class');
    equal(child.$name, 'demo.Child', 'check child is class');
    //check $parent
    equal(parent.$parent, base, 'check that demo.Parent is child of demo.Base with $parent property');
    equal(child.$parent, parent, 'check that child is demo.Child of demo.Parent with $parent property');
});
test('isChild', function () {
    //get class shortcuts
    var base = demo.Base;
    var parent = demo.Parent;
    var child = demo.Child;
    //true values
    equal(parent.isChild(base), true, 'check that demo.Parent is child of demo.Base with isChild call');
    equal(child.isChild(parent), true, 'check that demo.Child is child of demo.Parent with isChild call');
    //false values
    equal(base.isChild(parent), false, 'check that demo.Base is not child of demo.Parent with isChild call');
    equal(base.isChild(base), false, 'check that demo.Base is not child of demo.Base with isChild call');
    equal(base.isChild([]), false, 'check that demo.Base is not child of empty [] (incorrect value example) with isChild call');
    equal(parent.isChild(child), false, 'check that demo.Parent is not child of demo.Child with isChild call');
});
test('isParent', function () {
    //get class shortcuts
    var base = demo.Base;
    var parent = demo.Parent;
    var child = demo.Child;
    //true values
    equal(base.isParent(parent), true, 'check that demo.Base is parent of demo.Parent with isParent call');
    equal(parent.isParent(child), true, 'check that demo.Parent is parent of demo.Child with isParent call');
    //false values
    equal(parent.isParent(base), false, 'check that demo.Parent is not parent of demo.Base with isParent call');
    equal(base.isParent(base), false, 'check that demo.Base is not parent of demo.Base with isParent call');
    equal(base.isParent([]), false, 'check that demo.Base is not parent of empty [] (incorrect value example) with isParent call');
    equal(child.isParent(parent), false, 'check that demo.Child is not parent of demo.Parent with isParent call');
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
    equal(base.a(), 'a!', 'class demo.Base constant "a" value is valid');
    equal(Object.getOwnPropertyDescriptor(base, 'a').writable, false, 'class demo.Base constant "a" is not writable');
    equal(Object.getOwnPropertyDescriptor(base, 'a').enumerable, true, 'class demo.Base constant "a" is enumerable');
    equal(Object.getOwnPropertyDescriptor(base, 'a').configurable, false, 'class demo.Base constant "a" is not configurable');
    //check inherited constant
    ok(base.hasOwnProperty('$isClass'), 'class demo.Base has constant "$isClass", inherited from core class');
    equal(base.$isClass, true, 'class demo.Base constant "$isClass" value is valid');
    equal(Object.getOwnPropertyDescriptor(base, '$isClass').writable, false, 'class demo.Base constant "$isClass" is not writable');
    equal(Object.getOwnPropertyDescriptor(base, '$isClass').enumerable, true, 'class demo.Base constant "$isClass" is enumerable');
    equal(Object.getOwnPropertyDescriptor(base, '$isClass').configurable, false, 'class demo.Base constant "$isClass" is not configurable');
});
test('parent', function () {
    //get class shortcut
    var parent = demo.Parent;
    //check class constant
    ok(parent.hasOwnProperty('b'), 'class demo.Parent has constant "b"');
    equal(parent.b(), 'bb!!', 'class demo.Parent constant "b" value is valid');
    equal(Object.getOwnPropertyDescriptor(parent, 'b').writable, false, 'class demo.Parent constant "b" is not writable');
    equal(Object.getOwnPropertyDescriptor(parent, 'b').enumerable, true, 'class demo.Parent constant "b" is enumerable');
    equal(Object.getOwnPropertyDescriptor(parent, 'b').configurable, false, 'class demo.Parent constant "b" is not configurable');
    //check inherited constant
    ok(parent.hasOwnProperty('a'), 'class demo.Parent has constant "a", inherited from core class');
    equal(parent.a(), 'a!', 'class demo.Parent constant "a" value is valid');
    equal(Object.getOwnPropertyDescriptor(parent, 'a').writable, false, 'class demo.Parent constant "a" is not writable');
    equal(Object.getOwnPropertyDescriptor(parent, 'a').enumerable, true, 'class demo.Parent constant "a" is enumerable');
    equal(Object.getOwnPropertyDescriptor(parent, 'a').configurable, false, 'class demo.Parent constant "a" is not configurable');
});
test('child', function () {
    //get class shortcut
    var child = demo.Child;
    //check class constant
    ok(child.hasOwnProperty('c'), 'class demo.Child has constant "c"');
    equal(child.c(), 'ccc!!!', 'class demo.Child constant "c" value is valid');
    equal(Object.getOwnPropertyDescriptor(child, 'c').writable, false, 'class demo.Child constant "c" is not writable');
    equal(Object.getOwnPropertyDescriptor(child, 'c').enumerable, true, 'class demo.Child constant "c" is enumerable');
    equal(Object.getOwnPropertyDescriptor(child, 'c').configurable, false, 'class demo.Child constant "c" is not configurable');
    //check inherited constant
    ok(child.hasOwnProperty('b'), 'class demo.Child has constant "b", inherited from core class');
    equal(child.b(), 'bb!!', 'class demo.Child constant "b" value is valid');
    equal(Object.getOwnPropertyDescriptor(child, 'b').writable, false, 'class demo.Child constant "b" is not writable');
    equal(Object.getOwnPropertyDescriptor(child, 'b').enumerable, true, 'class demo.Child constant "b" is enumerable');
    equal(Object.getOwnPropertyDescriptor(child, 'b').configurable, false, 'class demo.Child constant "b" is not configurable');
});

































