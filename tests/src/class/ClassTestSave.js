function speed ( fn, n ) {
    var start = Date.now();
    for ( var i = 0; i < n; i++ ) {
        fn();
    }
    var duration = Date.now() - start;
    console.log('duration: ', duration, 'ms for ', n, 'operations');
    console.log('median: ', duration / n, 'ms per operation');
    console.log('mark: about', n / duration, 'operation per ms');
}
'use strict';
module('xs.Class');
function xsStart ( suffix ) {
    xs.define('xs.class.Class.demo.Base' + suffix, function ( self ) {
        return {
            const: {
                a: function () {
                    return 'a!';
                }
            },
            static: {
                properties: {
                    propOne: {
                        get: function () {
                            return this.__get('propOne') + '!';
                        },
                        set: function ( value ) {
                            return this.__set('propOne', '?' + value);
                        }
                    },
                    propTwo: 11
                },
                methods: {
                    metOne: function ( a, b ) {
                        return a + b + 'base.static.a';
                    },
                    metTwo: function ( a, b ) {
                        return a + b + 'base.static.b';
                    }
                }
            },
            properties: {
                propOne: {
                    get: function () {
                        return this.__get('propOne') + '!!';
                    },
                    set: function ( value ) {
                        return this.__set('propOne', '??' + value);
                    }
                },
                propTwo: 15
            },
            methods: {
                metOne: function ( a, b ) {
                    return a + b + 'base.a';
                },
                metTwo: function ( a, b ) {
                    return a + b + 'base.b';
                }
            }
        };
    });
    xs.define('xs.class.Class.demo.Parent' + suffix, function ( self ) {
        return {
            extend: 'xs.class.Class.demo.Base',
            constructor: function ( config ) {
                var parent = xs.class.Class.demo.Parent.parent;
                parent.call(this, config);
                this.propThree = config.propThree;
            },
            const: {
                b: function () {
                    return 'bb!!';
                }
            },
            static: {
                properties: {
                    propTwo: 111,
                    propThree: {
                        set: function ( value ) {
                            return this.__set('propThree', '-' + value);
                        }
                    }
                },
                methods: {
                    metTwo: function ( a, b ) {
                        return a + b + 'parent.static.b';
                    },
                    metThree: function ( a, b ) {
                        var parent = xs.class.Class.demo.Parent.parent;
                        return parent.metTwo.call(this, a - 1, b + 1);
                    }
                }
            },
            properties: {
                propTwo: 155,
                propThree: {
                    set: function ( value ) {
                        return this.__set('propThree', '--' + value);
                    }
                }
            },
            methods: {
                metTwo: function ( a, b ) {
                    return a + b + 'parent.b';
                },
                metThree: function ( a, b ) {
                    var parent = xs.class.Class.demo.Parent.parent.prototype;
                    return parent.metTwo.call(this, a - 10, b + 1);
                }
            }
        };
    });
    xs.define('xs.class.Class.demo.Child' + suffix, function ( self ) {
        return {
            extend: 'xs.class.Class.demo.Parent',
            constructor: function ( config ) {
                var parent = xs.class.Class.demo.Child.parent;
                parent.call(this, config);
                this.propFour = config.propFour;
            },
            const: {
                c: function () {
                    return 'ccc!!!';
                }
            },
            static: {
                properties: {
                    propThree: {
                        set: function ( value ) {
                            return this.__set('propThree', '-+' + value);
                        },
                        default: 5
                    },
                    propFour: {
                        get: function () {
                            return this.__get('propFour') + '-+';
                        },
                        default: 6
                    }
                },
                methods: {
                    metOne: function ( a, b ) {
                        return a + b + 'child.static.a';
                    },
                    metThree: function ( a, b ) {
                        var parent = xs.class.Class.demo.Child.parent;
                        return parent.metThree.call(this, a + 3, b + 1);
                    }
                }
            },
            properties: {
                propTwo: {
                    set: function ( value ) {
                        return this.__set('propTwo', '--++' + value);
                    }
                },
                propThree: 155,
                propFour: {
                    get: function () {
                        return this.__get('propFour') + '--++';
                    }
                }

            },
            methods: {
                metOne: function ( a, b ) {
                    return a + b + 'child.a';
                },
                metThree: function ( a, b ) {
                    var parent = xs.class.Class.demo.Child.parent.prototype;
                    return parent.metThree.call(this, a + 3, b + 1);
                }
            }
        };
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
 * 2. Define tree
 *  - check all classes defined
 *  - check parental/child linkage
 * 3. Creation simple
 *  - Object is instance
 * 4. Constructor
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
 * 10.Creation with attributes
 * 11.Singleton
 * 12.Requires
 * 13.Mixins
 *  -
 */
asyncTest('1. Define basics: sample', function () {
    //check create, references and recreation prevention
    xs.define('xs.class.Class.demo.Basic', function ( self ) {
        return {};
    }, function () {
        start();
        strictEqual(xs.ClassManager.get('xs.class.Class.demo.Basic'), xs.class.Class.demo.Basic, 'check that class was created');
        var cls = xs.class.Class.demo.Basic;
        xs.define('xs.class.Class.demo.Basic');
        strictEqual(cls, xs.class.Class.demo.Basic, 'check class recreate prevented');
        //check basic parameters assigned
        strictEqual(xs.class.Class.demo.Basic.label, 'xs.class.Class.demo.Basic', 'check class name');
    });
});
test('2. Define tree: sample', function () {
    //get class shortcuts
    var base = xs.class.Class.demo.Base;
    var parent = xs.class.Class.demo.Parent;
    var child = xs.class.Class.demo.Child;
    //check names
    strictEqual(base.label, 'xs.class.Class.demo.Base', 'check base is class');
    strictEqual(parent.label, 'xs.class.Class.demo.Parent', 'check parent is class');
    strictEqual(child.label, 'xs.class.Class.demo.Child', 'check child is class');
    //check $parent
    strictEqual(parent.parent, base, 'check that xs.class.Class.demo.Parent is child of xs.class.Class.demo.Base with $parent property');
    strictEqual(child.parent, parent, 'check that child is xs.class.Class.demo.Child of xs.class.Class.demo.Parent with $parent property');
});
test('2. Define tree: isChild', function () {
    //get class shortcuts
    var base = xs.class.Class.demo.Base;
    var parent = xs.class.Class.demo.Parent;
    var child = xs.class.Class.demo.Child;
    //true values
    strictEqual(parent.isChild(base), true, 'check that xs.class.Class.demo.Parent is child of xs.class.Class.demo.Base with isChild call');
    strictEqual(child.isChild(parent), true, 'check that xs.class.Class.demo.Child is child of xs.class.Class.demo.Parent with isChild call');
    //false values
    strictEqual(base.isChild(parent), false, 'check that xs.class.Class.demo.Base is not child of xs.class.Class.demo.Parent with isChild call');
    strictEqual(base.isChild(base), false, 'check that xs.class.Class.demo.Base is not child of xs.class.Class.demo.Base with isChild call');
    strictEqual(base.isChild([]), false, 'check that xs.class.Class.demo.Base is not child of empty [] (incorrect value example) with isChild call');
    strictEqual(parent.isChild(child), false, 'check that xs.class.Class.demo.Parent is not child of xs.class.Class.demo.Child with isChild call');
});
test('2. Define tree: isParent', function () {
    //get class shortcuts
    var base = xs.class.Class.demo.Base;
    var parent = xs.class.Class.demo.Parent;
    var child = xs.class.Class.demo.Child;
    //true values
    strictEqual(base.isParent(parent), true, 'check that xs.class.Class.demo.Base is parent of xs.class.Class.demo.Parent with isParent call');
    strictEqual(parent.isParent(child), true, 'check that xs.class.Class.demo.Parent is parent of xs.class.Class.demo.Child with isParent call');
    //false values
    strictEqual(parent.isParent(base), false, 'check that xs.class.Class.demo.Parent is not parent of xs.class.Class.demo.Base with isParent call');
    strictEqual(base.isParent(base), false, 'check that xs.class.Class.demo.Base is not parent of xs.class.Class.demo.Base with isParent call');
    strictEqual(base.isParent([]), false, 'check that xs.class.Class.demo.Base is not parent of empty [] (incorrect value example) with isParent call');
    strictEqual(child.isParent(parent), false, 'check that xs.class.Class.demo.Child is not parent of xs.class.Class.demo.Parent with isParent call');
});
test('3. Creation simple: sample', function () {
    var instBase = xs.create('xs.class.Class.demo.Base');
    var instParent = xs.create('xs.class.Class.demo.Parent');
    var instChild = xs.create('xs.class.Class.demo.Child');
    //check instances
    ok(instBase instanceof
        xs.class.Class.demo.Base, 'check instance of xs.class.Class.demo.Base is correct referred');
    ok(instParent instanceof
        xs.class.Class.demo.Parent, 'check instance of xs.class.Class.demo.Parent is correct referred');
    ok(instChild instanceof
        xs.class.Class.demo.Child, 'check instance of xs.class.Class.demo.Child is correct referred');
});
test('4. Constructor: sample', function () {
    var instBase = xs.create('xs.class.Class.demo.Base');
    var instParent = xs.create('xs.class.Class.demo.Parent');
    var instChild = xs.create('xs.class.Class.demo.Child');
    //check instances
    ok(instBase instanceof
        xs.class.Class.demo.Base, 'check instance of xs.class.Class.demo.Base is correct referred');
    ok(instParent instanceof
        xs.class.Class.demo.Parent, 'check instance of xs.class.Class.demo.Parent is correct referred');
    ok(instChild instanceof
        xs.class.Class.demo.Child, 'check instance of xs.class.Class.demo.Child is correct referred');
});
test('4. Constructor: inheritance', function () {
    xs.define('inherited.Parent', function ( self ) {
        return {
            constructor: function ( config ) {
                this.a = config.a;
            },
            properties: {
                a: 1
            }
        };
    });
    xs.define('inherited.Child', function ( self ) {
        return {
            extend: 'inherited.Parent',
            properties: {
                b: 2
            }
        }
    });
    strictEqual(inherited.Child.descriptor.constructor ===
        inherited.Parent.descriptor.constructor, true, 'constructor is inherited correctly');
    var parent = xs.create('inherited.Parent', {
        a: 2,
        b: 3
    });
    var child = xs.create('inherited.Child', {
        a: 2,
        b: 3
    });
    strictEqual(parent.a, 2, 'constructor of inherited.Parent worked correctly');
    strictEqual(child.a, 2, 'constructor of inherited.Child worked correctly');
});
test('5. Constants: base', function () {
    //get class shortcut
    var base = xs.class.Class.demo.Base;
    //check class constant
    ok(base.hasOwnProperty('a'), 'class xs.class.Class.demo.Base has constant "a"');
    strictEqual(base.a(), 'a!', 'class xs.class.Class.demo.Base constant "a" value is valid');
    strictEqual(Object.getOwnPropertyDescriptor(base, 'a').writable, false, 'class xs.class.Class.demo.Base constant "a" is not writable');
    strictEqual(Object.getOwnPropertyDescriptor(base, 'a').enumerable, true, 'class xs.class.Class.demo.Base constant "a" is enumerable');
    strictEqual(Object.getOwnPropertyDescriptor(base, 'a').configurable, false, 'class xs.class.Class.demo.Base constant "a" is not configurable');
});
test('5. Constants: parent', function () {
    //get class shortcut
    var parent = xs.class.Class.demo.Parent;
    //check class constant
    ok(parent.hasOwnProperty('b'), 'class xs.class.Class.demo.Parent has constant "b"');
    strictEqual(parent.b(), 'bb!!', 'class xs.class.Class.demo.Parent constant "b" value is valid');
    strictEqual(Object.getOwnPropertyDescriptor(parent, 'b').writable, false, 'class xs.class.Class.demo.Parent constant "b" is not writable');
    strictEqual(Object.getOwnPropertyDescriptor(parent, 'b').enumerable, true, 'class xs.class.Class.demo.Parent constant "b" is enumerable');
    strictEqual(Object.getOwnPropertyDescriptor(parent, 'b').configurable, false, 'class xs.class.Class.demo.Parent constant "b" is not configurable');
    //check inherited constant
    ok(parent.hasOwnProperty('a'), 'class xs.class.Class.demo.Parent has constant "a", inherited from core class');
    strictEqual(parent.a(), 'a!', 'class xs.class.Class.demo.Parent constant "a" value is valid');
    strictEqual(Object.getOwnPropertyDescriptor(parent, 'a').writable, false, 'class xs.class.Class.demo.Parent constant "a" is not writable');
    strictEqual(Object.getOwnPropertyDescriptor(parent, 'a').enumerable, true, 'class xs.class.Class.demo.Parent constant "a" is enumerable');
    strictEqual(Object.getOwnPropertyDescriptor(parent, 'a').configurable, false, 'class xs.class.Class.demo.Parent constant "a" is not configurable');
});
test('5. Constants: child', function () {
    //get class shortcut
    var child = xs.class.Class.demo.Child;
    //check class constant
    ok(child.hasOwnProperty('c'), 'class xs.class.Class.demo.Child has constant "c"');
    strictEqual(child.c(), 'ccc!!!', 'class xs.class.Class.demo.Child constant "c" value is valid');
    strictEqual(Object.getOwnPropertyDescriptor(child, 'c').writable, false, 'class xs.class.Class.demo.Child constant "c" is not writable');
    strictEqual(Object.getOwnPropertyDescriptor(child, 'c').enumerable, true, 'class xs.class.Class.demo.Child constant "c" is enumerable');
    strictEqual(Object.getOwnPropertyDescriptor(child, 'c').configurable, false, 'class xs.class.Class.demo.Child constant "c" is not configurable');
    //check inherited constant
    ok(child.hasOwnProperty('b'), 'class xs.class.Class.demo.Child has constant "b", inherited from core class');
    strictEqual(child.b(), 'bb!!', 'class xs.class.Class.demo.Child constant "b" value is valid');
    strictEqual(Object.getOwnPropertyDescriptor(child, 'b').writable, false, 'class xs.class.Class.demo.Child constant "b" is not writable');
    strictEqual(Object.getOwnPropertyDescriptor(child, 'b').enumerable, true, 'class xs.class.Class.demo.Child constant "b" is enumerable');
    strictEqual(Object.getOwnPropertyDescriptor(child, 'b').configurable, false, 'class xs.class.Class.demo.Child constant "b" is not configurable');
});
test('6. Static properties: base', function () {
    //get class shortcut
    var base = xs.class.Class.demo.Base;
    //check class properties
    ok(base.hasOwnProperty('propOne'), 'class xs.class.Class.demo.Base has property "propOne"');
    strictEqual(Object.getOwnPropertyDescriptor(base, 'a').enumerable, true, 'class xs.class.Class.demo.Base property "propOne" is enumerable');
    strictEqual(Object.getOwnPropertyDescriptor(base, 'a').configurable, false, 'class xs.class.Class.demo.Base property "propOne" is not configurable');
    //get/set check
    //accessored property
    strictEqual(base.propOne, 'undefined!', 'class xs.class.Class.demo.Base property "propOne" default value is valid');
    base.propOne = 5;
    strictEqual(base.propOne, '?5!', 'class xs.class.Class.demo.Base property "propOne" assigned value is valid');
    base.propOne = 1;
    //simple property
    strictEqual(base.propTwo, 11, 'class xs.class.Class.demo.Base property "propTwo" default value is valid');
    base.propTwo = 5;
    strictEqual(base.propTwo, 5, 'class xs.class.Class.demo.Base property "propTwo" assigned value is valid');
    base.propTwo = 11;
});
test('6. Static properties: parent', function () {
    //get class shortcut
    var parent = xs.class.Class.demo.Parent;
    //check class properties
    ok(parent.hasOwnProperty('propTwo'), 'class xs.class.Class.demo.Parent has property "propTwo"');
    strictEqual(Object.getOwnPropertyDescriptor(parent, 'propTwo').writable, true, 'class xs.class.Class.demo.Parent property "propTwo" is writable');
    strictEqual(Object.getOwnPropertyDescriptor(parent, 'propTwo').enumerable, true, 'class xs.class.Class.demo.Parent property "propTwo" is enumerable');
    strictEqual(Object.getOwnPropertyDescriptor(parent, 'propTwo').configurable, false, 'class xs.class.Class.demo.Parent property "propTwo" is not configurable');
    //get/set check
    //accessored property
    strictEqual(parent.propThree, undefined, 'class xs.class.Class.demo.Parent property "propThree" default value is valid');
    parent.propThree = 5;
    strictEqual(parent.propThree, '-5', 'class xs.class.Class.demo.Parent property "propThree" assigned value is valid');
    parent.propThree = -1;
    //simple property
    strictEqual(parent.propTwo, 111, 'class xs.class.Class.demo.Parent property "propTwo" default value is valid');
    parent.propTwo = 5;
    strictEqual(parent.propTwo, 5, 'class xs.class.Class.demo.Parent property "propTwo" assigned value is valid');
    parent.propTwo = 111;
    //inherited property
    strictEqual(parent.propOne, 'undefined!', 'class xs.class.Class.demo.Parent property "propOne" default value is valid');
    parent.propOne = 5;
    strictEqual(parent.propOne, '?5!', 'class xs.class.Class.demo.Parent property "propOne" assigned value is valid');
    parent.propOne = 1;
});
test('6. Static properties: child', function () {
    //get class shortcut
    var child = xs.class.Class.demo.Child;
    //check class properties
    ok(child.hasOwnProperty('propFour'), 'class xs.class.Class.demo.Child has property "propFour"');
    strictEqual(Object.getOwnPropertyDescriptor(child, 'propFour').enumerable, true, 'class xs.class.Class.demo.Child property "propFour" is enumerable');
    strictEqual(Object.getOwnPropertyDescriptor(child, 'propFour').configurable, false, 'class xs.class.Class.demo.Child property "propFour" is not configurable');
    //get/set check
    //accessored property
    strictEqual(child.propThree, '-+5', 'class xs.class.Class.demo.Child property "propThree" default value is valid');
    child.propThree = 50;
    strictEqual(child.propThree, '-+50', 'class xs.class.Class.demo.Child property "propThree" assigned value is valid');
    child.propThree = 5;
    //another accessored property
    strictEqual(child.propFour, '6-+', 'class xs.class.Class.demo.Child property "propFour" default value is valid');
    child.propFour = 5;
    strictEqual(child.propFour, '5-+', 'class xs.class.Class.demo.Child property "propFour" assigned value is valid');
    child.propFour = 6;
    //inherited property
    strictEqual(child.propTwo, 111, 'class xs.class.Class.demo.Child property "propTwo" default value is valid');
    child.propTwo = 5;
    strictEqual(child.propTwo, 5, 'class xs.class.Class.demo.Child property "propTwo" assigned value is valid');
    child.propTwo = 111;
});
test('7. Static methods: base', function () {
    //get class shortcut
    var base = xs.class.Class.demo.Base;
    //check class methods
    //method without default
    strictEqual(base.metOne(), 'NaNbase.static.a', 'class xs.class.Class.demo.Base method "metOne" return correct value with no params');
    strictEqual(base.metOne(3), 'NaNbase.static.a', 'class xs.class.Class.demo.Base method "metOne" return correct value with some params');
    strictEqual(base.metOne(3, 4), '7base.static.a', 'class xs.class.Class.demo.Base method "metOne" return correct value with all params');
    //method with default
    strictEqual(base.metTwo(), 'NaNbase.static.b', 'class xs.class.Class.demo.Base method "metTwo" return correct value with no params');
    strictEqual(base.metTwo(3), 'NaNbase.static.b', 'class xs.class.Class.demo.Base method "metTwo" return correct value with some params');
    strictEqual(base.metTwo(3, 4), '7base.static.b', 'class xs.class.Class.demo.Base method "metTwo" return correct value with all params');
});
test('7. Static methods: parent', function () {
    //get class shortcut
    var parent = xs.class.Class.demo.Parent;
    //check class methods
    //inherited method
    strictEqual(parent.metOne(), 'NaNbase.static.a', 'class xs.class.Class.demo.Parent method "metOne" return correct value with no params');
    strictEqual(parent.metOne(3), 'NaNbase.static.a', 'class xs.class.Class.demo.Parent method "metOne" return correct value with some params');
    strictEqual(parent.metOne(3, 4), '7base.static.a', 'class xs.class.Class.demo.Parent method "metOne" return correct value with all params');
    //overriden method
    strictEqual(parent.metTwo(), 'NaNparent.static.b', 'class xs.class.Class.demo.Parent method "metTwo" return correct value with no params');
    strictEqual(parent.metTwo(3), 'NaNparent.static.b', 'class xs.class.Class.demo.Parent method "metTwo" return correct value with some params');
    strictEqual(parent.metTwo(3, 4), '7parent.static.b', 'class xs.class.Class.demo.Parent method "metTwo" return correct value with all params');
    //downcalling method
    strictEqual(parent.metThree(), 'NaNbase.static.b', 'class xs.class.Class.demo.Parent method "metThree" return correct value with no params');
    strictEqual(parent.metThree(5), 'NaNbase.static.b', 'class xs.class.Class.demo.Parent method "metThree" return correct value with some params');
    strictEqual(parent.metThree(5, 6), '11base.static.b', 'class xs.class.Class.demo.Parent method "metThree" return correct value with all params');
});
test('7. Static methods: child', function () {
    //get class shortcut
    var child = xs.class.Class.demo.Child;
    //check class methods
    //inherited method
    strictEqual(child.metTwo(), 'NaNparent.static.b', 'class xs.class.Class.demo.Child method "metTwo" return correct value with no params');
    strictEqual(child.metTwo(3), 'NaNparent.static.b', 'class xs.class.Class.demo.Child method "metTwo" return correct value with some params');
    strictEqual(child.metTwo(3, 4), '7parent.static.b', 'class xs.class.Class.demo.Child method "metTwo" return correct value with all params');
    //overriden method
    strictEqual(child.metOne(), 'NaNchild.static.a', 'class xs.class.Class.demo.Child method "metOne" return correct value with no params');
    strictEqual(child.metOne(3), 'NaNchild.static.a', 'class xs.class.Class.demo.Child method "metOne" return correct value with some params');
    strictEqual(child.metOne(3, 4), '7child.static.a', 'class xs.class.Class.demo.Child method "metOne" return correct value with all params');
    //downcalling method
    strictEqual(child.metThree(), 'NaNbase.static.b', 'class xs.class.Class.demo.Child method "metThree" return correct value with no params');
    strictEqual(child.metThree(5), 'NaNbase.static.b', 'class xs.class.Class.demo.Child method "metThree" return correct value with some params');
    strictEqual(child.metThree(5, 6), '15base.static.b', 'class xs.class.Class.demo.Child method "metThree" return correct value with all params');
});
test('8. Properties: base', function () {
    //get class shortcut
    var inst1 = xs.create('xs.class.Class.demo.Base');
    var inst2 = xs.create('xs.class.Class.demo.Base');

    //check getter/setter property
    //check access
    strictEqual(inst1.propOne, 'undefined!!', 'property "propOne" of xs.class.Class.demo.Base instance has correct default value');
    inst1.propOne = 1;
    strictEqual(inst1.propOne, '??1!!', 'property "propOne" of xs.class.Class.demo.Base instance has correct changed value');
    inst1.propOne = 12;
    //check instance difference
    inst1.propOne = 5;
    inst2.propOne = 6;
    strictEqual(inst1.propOne, '??5!!', 'property "propOne" of xs.class.Class.demo.Base one instance has own value');
    strictEqual(inst2.propOne, '??6!!', 'property "propOne" of xs.class.Class.demo.Base another instance has own value');
    inst1.propOne = 12;
    inst2.propOne = 12;

    //check simple property
    //check access
    strictEqual(inst1.propTwo, 15, 'property "propTwo" of xs.class.Class.demo.Base instance has correct default value');
    inst1.propTwo = 1;
    strictEqual(inst1.propTwo, 1, 'property "propTwo" of xs.class.Class.demo.Base instance has correct changed value');
    inst1.propTwo = 15;
    //check instance difference
    inst1.propTwo = 5;
    inst2.propTwo = 6;
    strictEqual(inst1.propTwo, 5, 'property "propTwo" of xs.class.Class.demo.Base one instance has own value');
    strictEqual(inst2.propTwo, 6, 'property "propTwo" of xs.class.Class.demo.Base another instance has own value');
    inst1.propTwo = 15;
    inst2.propTwo = 15;
});
test('8. Properties: parent', function () {
    //get class shortcut
    var inst1 = xs.create('xs.class.Class.demo.Parent');
    var inst2 = xs.create('xs.class.Class.demo.Parent');

    //check inherited property
    //check access
    strictEqual(inst1.propOne, 'undefined!!', 'property "propOne" of xs.class.Class.demo.Parent instance has correct default value');
    inst1.propOne = 1;
    strictEqual(inst1.propOne, '??1!!', 'property "propOne" of xs.class.Class.demo.Parent instance has correct changed value');
    inst1.propOne = 2;
    //check instance difference
    inst1.propOne = 5;
    inst2.propOne = 6;
    strictEqual(inst1.propOne, '??5!!', 'property "propOne" of xs.class.Class.demo.Parent one instance has own value');
    strictEqual(inst2.propOne, '??6!!', 'property "propOne" of xs.class.Class.demo.Parent another instance has own value');
    inst1.propOne = 2;
    inst2.propOne = 2;

    //check simple property
    //check access
    strictEqual(inst1.propTwo, 155, 'property "propTwo" of xs.class.Class.demo.Parent instance has correct default value');
    inst1.propTwo = 1;
    strictEqual(inst1.propTwo, 1, 'property "propTwo" of xs.class.Class.demo.Parent instance has correct changed value');
    inst1.propTwo = 4;
    //check instance difference
    inst1.propTwo = 5;
    inst2.propTwo = 6;
    strictEqual(inst1.propTwo, 5, 'property "propTwo" of xs.class.Class.demo.Parent one instance has own value');
    strictEqual(inst2.propTwo, 6, 'property "propTwo" of xs.class.Class.demo.Parent another instance has own value');
    inst1.propTwo = 4;
    inst2.propTwo = 4;

    //check getter/setter property
    //check access
    strictEqual(inst1.propThree, '--undefined', 'property "propThree" of xs.class.Class.demo.Parent instance has correct default value');
    inst1.propThree = 1;
    strictEqual(inst1.propThree, '--1', 'property "propThree" of xs.class.Class.demo.Parent instance has correct changed value');
    inst1.propThree = undefined;
    //check instance difference
    inst1.propThree = 5;
    inst2.propThree = 6;
    strictEqual(inst1.propThree, '--5', 'property "propThree" of xs.class.Class.demo.Parent one instance has own value');
    strictEqual(inst2.propThree, '--6', 'property "propThree" of xs.class.Class.demo.Parent another instance has own value');
    inst1.propThree = undefined;
    inst2.propThree = undefined;
});
test('8. Properties: child', function () {
    //get class shortcut
    var inst1 = xs.create('xs.class.Class.demo.Child');
    var inst2 = xs.create('xs.class.Class.demo.Child');

    //check inherited property
    //check access
    strictEqual(inst1.propOne, 'undefined!!', 'property "propOne" of xs.class.Class.demo.Child instance has correct default value');
    inst1.propOne = 1;
    strictEqual(inst1.propOne, '??1!!', 'property "propOne" of xs.class.Class.demo.Child instance has correct changed value');
    inst1.propOne = 2;
    //check instance difference
    inst1.propOne = 5;
    inst2.propOne = 6;
    strictEqual(inst1.propOne, '??5!!', 'property "propOne" of xs.class.Class.demo.Child one instance has own value');
    strictEqual(inst2.propOne, '??6!!', 'property "propOne" of xs.class.Class.demo.Child another instance has own value');
    inst1.propOne = 4;
    inst2.propOne = 4;

    //check overriden property
    //check access
    strictEqual(inst1.propTwo, undefined, 'property "propTwo" of xs.class.Class.demo.Child instance has correct default value');
    inst1.propTwo = 1;
    strictEqual(inst1.propTwo, '--++1', 'property "propTwo" of xs.class.Class.demo.Child instance has correct changed value');
    inst1.propTwo = 8;
    //check instance difference
    inst1.propTwo = 5;
    inst2.propTwo = 6;
    strictEqual(inst1.propTwo, '--++5', 'property "propTwo" of xs.class.Class.demo.Child one instance has own value');
    strictEqual(inst2.propTwo, '--++6', 'property "propTwo" of xs.class.Class.demo.Child another instance has own value');
    inst1.propTwo = 4;
    inst2.propTwo = 4;

    //check overriden property
    //check access
    strictEqual(inst1.propThree, undefined, 'property "propThree" of xs.class.Class.demo.Child instance has correct default value');
    inst1.propThree = 1;
    strictEqual(inst1.propThree, 1, 'property "propThree" of xs.class.Class.demo.Child instance has correct changed value');
    inst1.propThree = 12;
    //check instance difference
    inst1.propThree = 5;
    inst2.propThree = 6;
    strictEqual(inst1.propThree, 5, 'property "propThree" of xs.class.Class.demo.Child one instance has own value');
    strictEqual(inst2.propThree, 6, 'property "propThree" of xs.class.Class.demo.Child another instance has own value');
    inst1.propThree = 12;
    inst2.propThree = 12;

    //check getter/setter property
    //check access
    strictEqual(inst1.propFour, 'undefined--++', 'property "propFour" of xs.class.Class.demo.Child instance has correct default value');
    inst1.propFour = 1;
    strictEqual(inst1.propFour, '1--++', 'property "propFour" of xs.class.Class.demo.Child instance has correct changed value');
    inst1.propFour = 8;
    //check instance difference
    inst1.propFour = 5;
    inst2.propFour = 6;
    strictEqual(inst1.propFour, '5--++', 'property "propFour" of xs.class.Class.demo.Child one instance has own value');
    strictEqual(inst2.propFour, '6--++', 'property "propFour" of xs.class.Class.demo.Child another instance has own value');
    inst1.propFour = 8;
    inst2.propFour = 8;
});
test('9. Methods: base', function () {
    //get class instance
    var inst = xs.create('xs.class.Class.demo.Base');
    //check class methods
    //method without default
    strictEqual(inst.metOne(), 'NaNbase.a', ' method "metOne" of xs.class.Class.demo.Base class instance returns correct value with no params');
    strictEqual(inst.metOne(3), 'NaNbase.a', 'method "metOne" of xs.class.Class.demo.Base class instance returns correct value with some params');
    strictEqual(inst.metOne(3, 4), '7base.a', 'method "metOne" of xs.class.Class.demo.Base class instance returns correct value with all params');
    //method with default
    strictEqual(inst.metTwo(), 'NaNbase.b', 'method "metTwo" of xs.class.Class.demo.Base class instance returns correct value with no params');
    strictEqual(inst.metTwo(3), 'NaNbase.b', 'method "metTwo" of xs.class.Class.demo.Base class instance returns correct value with some params');
    strictEqual(inst.metTwo(3, 4), '7base.b', 'method "metTwo" of xs.class.Class.demo.Base class instance returns correct value with all params');
});
test('9. Methods: parent', function () {
    //get class instance
    var inst = xs.create('xs.class.Class.demo.Parent');
    //check class methods
    //inherited method
    strictEqual(inst.metOne(), 'NaNbase.a', ' method "metOne" of xs.class.Class.demo.Parent class instance returns correct value with no params');
    strictEqual(inst.metOne(3), 'NaNbase.a', 'method "metOne" of xs.class.Class.demo.Parent class instance returns correct value with some params');
    strictEqual(inst.metOne(3, 4), '7base.a', 'method "metOne" of xs.class.Class.demo.Parent class instance returns correct value with all params');
    //overriden method
    strictEqual(inst.metTwo(), 'NaNparent.b', 'method "metTwo" of xs.class.Class.demo.Parent class instance returns correct value with no params');
    strictEqual(inst.metTwo(5), 'NaNparent.b', 'method "metTwo" of xs.class.Class.demo.Parent class instance returns correct value with some params');
    strictEqual(inst.metTwo(5, 6), '11parent.b', 'method "metTwo" of xs.class.Class.demo.Parent class instance returns correct value with all params');
    //downcalling method
    strictEqual(inst.metThree(), 'NaNbase.b', 'method "metThree" of xs.class.Class.demo.Parent class instance returns correct value with no params');
    strictEqual(inst.metThree(3), 'NaNbase.b', 'method "metThree" of xs.class.Class.demo.Parent class instance returns correct value with some params');
    strictEqual(inst.metThree(3, 4), '-2base.b', 'method "metThree" of xs.class.Class.demo.Parent class instance returns correct value with all params');
});
test('9. Methods: child', function () {
    //get class instance
    var inst = xs.create('xs.class.Class.demo.Child');
    //check class methods
    //overriden method
    strictEqual(inst.metOne(), 'NaNchild.a', ' method "metOne" of xs.class.Class.demo.Child class instance returns correct value with no params');
    strictEqual(inst.metOne(3), 'NaNchild.a', 'method "metOne" of xs.class.Class.demo.Child class instance returns correct value with some params');
    strictEqual(inst.metOne(3, 4), '7child.a', 'method "metOne" of xs.class.Class.demo.Child class instance returns correct value with all params');
    //inherited method
    strictEqual(inst.metTwo(), 'NaNparent.b', 'method "metTwo" of xs.class.Class.demo.Child class instance returns correct value with no params');
    strictEqual(inst.metTwo(5), 'NaNparent.b', 'method "metTwo" of xs.class.Class.demo.Child class instance returns correct value with some params');
    strictEqual(inst.metTwo(5, 6), '11parent.b', 'method "metTwo" of xs.class.Class.demo.Child class instance returns correct value with all params');
    //downcalling method
    strictEqual(inst.metThree(), 'NaNbase.b', 'method "metThree" of xs.class.Class.demo.Child class instance returns correct value with no params');
    strictEqual(inst.metThree(3), 'NaNbase.b', 'method "metThree" of xs.class.Class.demo.Child class instance returns correct value with some params');
    strictEqual(inst.metThree(3, 4), '2base.b', 'method "metThree" of xs.class.Class.demo.Child class instance returns correct value with all params');
});
test('10. Creation with attributes: base', function () {
    //get class instance
    var inst = xs.create('xs.class.Class.demo.Base', {
        propOne: 1,
        propTwo: 74
    });
    //check instance properties
    strictEqual(inst.propOne, 'undefined!!', 'property "propOne" of class xs.class.Class.demo.Base instance assigned correctly');
    strictEqual(inst.propTwo, 15, 'property "propTwo" of class xs.class.Class.demo.Base instance assigned correctly');
});
test('10. Creation with attributes: parent', function () {
    //get class instance
    var inst = xs.create('xs.class.Class.demo.Parent', {
        propOne: 2,
        propTwo: 74,
        propThree: 89
    });
    //check instance properties
    strictEqual(inst.propOne, 'undefined!!', 'property "propOne" of class xs.class.Class.demo.Parent instance assigned correctly');
    strictEqual(inst.propTwo, 155, 'property "propTwo" of class xs.class.Class.demo.Parent instance assigned correctly');
    strictEqual(inst.propThree, '--89', 'property "propThree" of class xs.class.Class.demo.Parent instance assigned correctly');
});
test('10. Creation with attributes: child', function () {
    //get class instance
    var inst = xs.create('xs.class.Class.demo.Child', {
        propOne: 4,
        propTwo: 74,
        propThree: 89,
        propFour: 32
    });
    //check instance properties
    strictEqual(inst.propOne, 'undefined!!', 'property "propOne" of class xs.class.Class.demo.Child instance assigned correctly');
    strictEqual(inst.propTwo, undefined, 'property "propTwo" of class xs.class.Class.demo.Child instance assigned correctly');
    strictEqual(inst.propThree, 89, 'property "propThree" of class xs.class.Class.demo.Child instance assigned correctly');
    strictEqual(inst.propFour, '32--++', 'property "propFour" of class xs.class.Class.demo.Child instance assigned correctly');
});
test('11. Singleton: base', function () {
    //get class instance
    xs.define('xs.class.Class.demo.Single', function ( self ) {
        return {
            extend: 'xs.class.Class.demo.Base',
            singleton: true,
            const: {
                a: 1
            },
            static: {
                properties: {
                    b: 2
                },
                methods: {
                    c: {
                        fn: function ( value ) {
                            return value;
                        },
                        default: [3]
                    }
                }
            },
            properties: {
                d: 4
            },
            methods: {
                e: function ( value ) {
                    return value;
                }
            }
        };
    });
    var single = xs.class.Class.demo.Single;
    //check constants, methods and properties assigned
    //const
    strictEqual(single.a, undefined, 'constant "a" saved');
    //static.properties
    strictEqual(single.b, undefined, 'static property "b" still exists');
    //static.methods
    strictEqual(single.c, undefined, 'static method "c" still exists');
    //properties
    strictEqual(single.d, 4, 'property "d" saved ok');
    //methods
    strictEqual(single.e(), undefined, 'method "e" saved ok');
});
test('12. Requires: test', function () {
    ok(true, 'fictive assert');
});
test('13. Mixins: test', function () {
    ok(true, 'fictive assert');
});