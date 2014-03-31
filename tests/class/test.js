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
'use strict';
module('xs.Base');

var module = function(arg) {
    var pivateFunc = function(arg) {
        return arg+'~test'
    };

    
    return {
        publicFunc: function(){
            privateFunc(arg) + '~test~';
        }
    };
};


// function xsStart(suffix) {
//     xs.define('demo.Base' + suffix, {
//         constructor: {
//             fn: function(a, b) {
//                 this.propOne = a;
//                 this.propTwo = b;
//             },
//             default: [1, 2]
//         },
//         const: {
//             a: function() {
//                 return 'a!';
//             }
//         },
//         static: {
//             properties: {
//                 propOne: {
//                     get: function() {
//                         return this.__get('propOne') + '!';
//                     },
//                     set: function(value) {
//                         return this.__set('propOne', '?' + value);
//                     },
//                     default: 1
//                 },
//                 propTwo: 11
//             },
//             methods: {
//                 metOne: function(a, b) {
//                     return a + b + 'base.static.a';
//                 },
//                 metTwo: {
//                     fn: function(a, b) {
//                         return a + b + 'base.static.b';
//                     },
//                     default: [1, 2]
//                 }
//             }
//         },
//         properties: {
//             propOne: {
//                 get: function() {
//                     return this.__get('propOne') + '!!';
//                 },
//                 set: function(value) {
//                     return this.__set('propOne', '??' + value);
//                 },
//                 default: 12
//             },
//             propTwo: 15
//         },
//         methods: {
//             metOne: function(a, b) {
//                 return a + b + 'base.a';
//             },
//             metTwo: {
//                 fn: function(a, b) {
//                     return a + b + 'base.b';
//                 },
//                 default: [2, 3]
//             }
//         }
//     });
//     xs.define('demo.Parent' + suffix, {
//         extend: 'demo.Base',
//         constructor: {
//             fn: function(a, b, c) {
//                 var parent = demo.Parent.parent;
//                 parent.call(this, a, b);
//                 this.propThree = c;
//             },
//             default: [2, 4]
//         },
//         const: {
//             b: function() {
//                 return 'bb!!';
//             }
//         },
//         static: {
//             properties: {
//                 propTwo: 111,
//                 propThree: {
//                     set: function(value) {
//                         return this.__set('propThree', '-' + value);
//                     },
//                     default: 1
//                 }
//             },
//             methods: {
//                 metTwo: {
//                     fn: function(a, b) {
//                         return a + b + 'parent.static.b';
//                     },
//                     default: [1, 2]
//                 },
//                 metThree: {
//                     fn: function(a, b) {
//                         var parent = demo.Parent.parent;
//                         return parent.metTwo.call(this, a - 1, b + 1);
//                     },
//                     wrap: true,
//                     default: [3, 4]
//                 }
//             }
//         },
//         properties: {
//             propTwo: 155,
//             propThree: {
//                 set: function(value) {
//                     return this.__set('propThree', '--' + value);
//                 }
//             }
//         },
//         methods: {
//             metTwo: {
//                 fn: function(a, b) {
//                     return a + b + 'parent.b';
//                 },
//                 default: [3, 4]
//             },
//             metThree: {
//                 fn: function(a, b) {
//                     var parent = demo.Parent.parent.prototype;
//                     return parent.metTwo.call(this, a - 10, b + 1);
//                 },
//                 wrap: true,
//                 default: [5, 6]
//             }
//         }
//     });
//     xs.define('demo.Child' + suffix, {
//         extend: 'demo.Parent',
//         constructor: {
//             fn: function(a, b, c, d) {
//                 var parent = demo.Child.parent;
//                 parent.call(this, a, b, c);
//                 this.propFour = d;
//             },
//             default: [4, 8, 12]
//         },
//         const: {
//             c: function() {
//                 return 'ccc!!!';
//             }
//         },
//         static: {
//             properties: {
//                 propThree: {
//                     set: function(value) {
//                         return this.__set('propThree', '-+' + value);
//                     },
//                     default: 5
//                 },
//                 propFour: {
//                     get: function() {
//                         return this.__get('propFour') + '-+';
//                     },
//                     default: 6
//                 }
//             },
//             methods: {
//                 metOne: function(a, b) {
//                     return a + b + 'child.static.a';
//                 },
//                 metThree: {
//                     fn: function(a, b) {
//                         var parent = demo.Child.parent;
//                         return parent.metThree.call(this, a + 3, b + 1);
//                     },
//                     wrap: true,
//                     default: [3, 4]
//                 }
//             }
//         },
//         properties: {
//             propTwo: {
//                 set: function(value) {
//                     return this.__set('propTwo', '--++' + value);
//                 },
//                 default: 7
//             },
//             propThree: 155,
//             propFour: {
//                 get: function() {
//                     return this.__get('propFour') + '--++';
//                 },
//                 default: 8
//             }

//         },
//         methods: {
//             metOne: function(a, b) {
//                 return a + b + 'child.a';
//             },
//             metThree: {
//                 fn: function(a, b) {
//                     var parent = demo.Child.parent.prototype;
//                     return parent.metThree.call(this, a + 3, b + 1);
//                 },
//                 wrap: true
//             }
//         }
//     });
// }

// speed(function() {
//     xsStart('');
// }, 1);
// /**
//  * Tests:
//  * 1. Define basics
//  *  - define completes
//  *  - createdFn called
//  * 2. Define in namespace
//  *  - define completes
//  * 3. Define tree
//  *  - check all classes defined
//  *  - check parental/child linkage
//  * 4. Creation simple
//  *  - Object is instance
//  * 5. Constants
//  *  - sample
//  *  - inheritance
//  * 6. Static properties
//  *  - sample
//  *  - inheritance
//  * 7. Static methods
//  *  - sample
//  *  - inheritance
//  * 8. Properties
//  *  - sample
//  *  - inheritance
//  * 9.Methods
//  *  - sample
//  *  - inheritance
//  * 10.Creation with attributes
//  * 11.Singleton
//  * 12.Requires
//  * 13.Mixins
//  *  -
//  */
// module('1. Define basics');
// asyncTest('sample', function() {
//     //check create, references and recreation prevention
//     xs.define('demo.Basic', {}, function() {
//         start();
//         strictEqual(xs.ClassManager.get('demo.Basic'), demo.Basic, 'check that class was created');
//         var cls = demo.Basic;
//         xs.define('demo.Basic');
//         strictEqual(cls, demo.Basic, 'check class recreate prevented');
//         //check basic parameters assigned
//         strictEqual(demo.Basic.label, 'demo.Basic', 'check class name');
//     });
// });
// //module('2. Define in namespace');
// //test('sample', function() {
// //check create, references and recreation prevention
// //var cls = xs.define('ns.Basic');
// /*strictEqual(cls, demo.module.Basic, 'check that class was created in specified namespace');
//  strictEqual(xs.define('demo.module.Basic'), cls, 'check class recreate prevented');
//  //check basic parameters assigned
//  strictEqual(demo.module.Basic.$name, 'demo.module.Basic', 'check class name');
//  strictEqual(demo.module.Basic.$namespace, 'demo.module', 'check class namespace');*/
// //});
// module('3. Define tree');
// test('sample', function() {
//     //get class shortcuts
//     var base = demo.Base;
//     var parent = demo.Parent;
//     var child = demo.Child;
//     //check names
//     strictEqual(base.label, 'demo.Base', 'check base is class');
//     strictEqual(parent.label, 'demo.Parent', 'check parent is class');
//     strictEqual(child.label, 'demo.Child', 'check child is class');
//     //check $parent
//     strictEqual(parent.parent, base, 'check that demo.Parent is child of demo.Base with $parent property');
//     strictEqual(child.parent, parent, 'check that child is demo.Child of demo.Parent with $parent property');
// });
// test('isChild', function() {
//     //get class shortcuts
//     var base = demo.Base;
//     var parent = demo.Parent;
//     var child = demo.Child;
//     //true values
//     strictEqual(parent.isChild(base), true, 'check that demo.Parent is child of demo.Base with isChild call');
//     strictEqual(child.isChild(parent), true, 'check that demo.Child is child of demo.Parent with isChild call');
//     //false values
//     strictEqual(base.isChild(parent), false, 'check that demo.Base is not child of demo.Parent with isChild call');
//     strictEqual(base.isChild(base), false, 'check that demo.Base is not child of demo.Base with isChild call');
//     strictEqual(base.isChild([]), false, 'check that demo.Base is not child of empty [] (incorrect value example) with isChild call');
//     strictEqual(parent.isChild(child), false, 'check that demo.Parent is not child of demo.Child with isChild call');
// });
// test('isParent', function() {
//     //get class shortcuts
//     var base = demo.Base;
//     var parent = demo.Parent;
//     var child = demo.Child;
//     //true values
//     strictEqual(base.isParent(parent), true, 'check that demo.Base is parent of demo.Parent with isParent call');
//     strictEqual(parent.isParent(child), true, 'check that demo.Parent is parent of demo.Child with isParent call');
//     //false values
//     strictEqual(parent.isParent(base), false, 'check that demo.Parent is not parent of demo.Base with isParent call');
//     strictEqual(base.isParent(base), false, 'check that demo.Base is not parent of demo.Base with isParent call');
//     strictEqual(base.isParent([]), false, 'check that demo.Base is not parent of empty [] (incorrect value example) with isParent call');
//     strictEqual(child.isParent(parent), false, 'check that demo.Child is not parent of demo.Parent with isParent call');
// });
// module('4. Creation simple');
// test('sample', function() {
//     var instBase = xs.create('demo.Base');
//     var instParent = xs.create('demo.Parent');
//     var instChild = xs.create('demo.Child');
//     //check instances
//     ok(instBase instanceof demo.Base, 'check instance of demo.Base is correct referred');
//     ok(instParent instanceof demo.Parent, 'check instance of demo.Parent is correct referred');
//     ok(instChild instanceof demo.Child, 'check instance of demo.Child is correct referred');
// });
// module('5. Constants');
// test('base', function() {
//     //get class shortcut
//     var base = demo.Base;
//     //check class constant
//     ok(base.hasOwnProperty('a'), 'class demo.Base has constant "a"');
//     strictEqual(base.a(), 'a!', 'class demo.Base constant "a" value is valid');
//     strictEqual(Object.getOwnPropertyDescriptor(base, 'a').writable, false, 'class demo.Base constant "a" is not writable');
//     strictEqual(Object.getOwnPropertyDescriptor(base, 'a').enumerable, true, 'class demo.Base constant "a" is enumerable');
//     strictEqual(Object.getOwnPropertyDescriptor(base, 'a').configurable, false, 'class demo.Base constant "a" is not configurable');
// });
// test('parent', function() {
//     //get class shortcut
//     var parent = demo.Parent;
//     //check class constant
//     ok(parent.hasOwnProperty('b'), 'class demo.Parent has constant "b"');
//     strictEqual(parent.b(), 'bb!!', 'class demo.Parent constant "b" value is valid');
//     strictEqual(Object.getOwnPropertyDescriptor(parent, 'b').writable, false, 'class demo.Parent constant "b" is not writable');
//     strictEqual(Object.getOwnPropertyDescriptor(parent, 'b').enumerable, true, 'class demo.Parent constant "b" is enumerable');
//     strictEqual(Object.getOwnPropertyDescriptor(parent, 'b').configurable, false, 'class demo.Parent constant "b" is not configurable');
//     //check inherited constant
//     ok(parent.hasOwnProperty('a'), 'class demo.Parent has constant "a", inherited from core class');
//     strictEqual(parent.a(), 'a!', 'class demo.Parent constant "a" value is valid');
//     strictEqual(Object.getOwnPropertyDescriptor(parent, 'a').writable, false, 'class demo.Parent constant "a" is not writable');
//     strictEqual(Object.getOwnPropertyDescriptor(parent, 'a').enumerable, true, 'class demo.Parent constant "a" is enumerable');
//     strictEqual(Object.getOwnPropertyDescriptor(parent, 'a').configurable, false, 'class demo.Parent constant "a" is not configurable');
// });
// test('child', function() {
//     //get class shortcut
//     var child = demo.Child;
//     //check class constant
//     ok(child.hasOwnProperty('c'), 'class demo.Child has constant "c"');
//     strictEqual(child.c(), 'ccc!!!', 'class demo.Child constant "c" value is valid');
//     strictEqual(Object.getOwnPropertyDescriptor(child, 'c').writable, false, 'class demo.Child constant "c" is not writable');
//     strictEqual(Object.getOwnPropertyDescriptor(child, 'c').enumerable, true, 'class demo.Child constant "c" is enumerable');
//     strictEqual(Object.getOwnPropertyDescriptor(child, 'c').configurable, false, 'class demo.Child constant "c" is not configurable');
//     //check inherited constant
//     ok(child.hasOwnProperty('b'), 'class demo.Child has constant "b", inherited from core class');
//     strictEqual(child.b(), 'bb!!', 'class demo.Child constant "b" value is valid');
//     strictEqual(Object.getOwnPropertyDescriptor(child, 'b').writable, false, 'class demo.Child constant "b" is not writable');
//     strictEqual(Object.getOwnPropertyDescriptor(child, 'b').enumerable, true, 'class demo.Child constant "b" is enumerable');
//     strictEqual(Object.getOwnPropertyDescriptor(child, 'b').configurable, false, 'class demo.Child constant "b" is not configurable');
// });
// module('6. Static properties');
// test('base', function() {
//     //get class shortcut
//     var base = demo.Base;
//     //check class properties
//     ok(base.hasOwnProperty('propOne'), 'class demo.Base has property "propOne"');
//     strictEqual(Object.getOwnPropertyDescriptor(base, 'a').enumerable, true, 'class demo.Base property "propOne" is enumerable');
//     strictEqual(Object.getOwnPropertyDescriptor(base, 'a').configurable, false, 'class demo.Base property "propOne" is not configurable');
//     //get/set check
//     //accessored property
//     strictEqual(base.propOne, '?1!', 'class demo.Base property "propOne" default value is valid');
//     base.propOne = 5;
//     strictEqual(base.propOne, '?5!', 'class demo.Base property "propOne" assigned value is valid');
//     base.propOne = 1;
//     //simple property
//     strictEqual(base.propTwo, 11, 'class demo.Base property "propTwo" default value is valid');
//     base.propTwo = 5;
//     strictEqual(base.propTwo, 5, 'class demo.Base property "propTwo" assigned value is valid');
//     base.propTwo = 11;
// });
// test('parent', function() {
//     //get class shortcut
//     var parent = demo.Parent;
//     //check class properties
//     ok(parent.hasOwnProperty('propTwo'), 'class demo.Parent has property "propTwo"');
//     strictEqual(Object.getOwnPropertyDescriptor(parent, 'propTwo').writable, true, 'class demo.Parent property "propTwo" is writable');
//     strictEqual(Object.getOwnPropertyDescriptor(parent, 'propTwo').enumerable, true, 'class demo.Parent property "propTwo" is enumerable');
//     strictEqual(Object.getOwnPropertyDescriptor(parent, 'propTwo').configurable, false, 'class demo.Parent property "propTwo" is not configurable');
//     //get/set check
//     //accessored property
//     strictEqual(parent.propThree, '-1', 'class demo.Parent property "propThree" default value is valid');
//     parent.propThree = 5;
//     strictEqual(parent.propThree, '-5', 'class demo.Parent property "propThree" assigned value is valid');
//     parent.propThree = -1;
//     //simple property
//     strictEqual(parent.propTwo, 111, 'class demo.Parent property "propTwo" default value is valid');
//     parent.propTwo = 5;
//     strictEqual(parent.propTwo, 5, 'class demo.Parent property "propTwo" assigned value is valid');
//     parent.propTwo = 111;
//     //inherited property
//     strictEqual(parent.propOne, '?1!', 'class demo.Parent property "propOne" default value is valid');
//     parent.propOne = 5;
//     strictEqual(parent.propOne, '?5!', 'class demo.Parent property "propOne" assigned value is valid');
//     parent.propOne = 1;
// });
// test('child', function() {
//     //get class shortcut
//     var child = demo.Child;
//     //check class properties
//     ok(child.hasOwnProperty('propFour'), 'class demo.Child has property "propFour"');
//     strictEqual(Object.getOwnPropertyDescriptor(child, 'propFour').enumerable, true, 'class demo.Child property "propFour" is enumerable');
//     strictEqual(Object.getOwnPropertyDescriptor(child, 'propFour').configurable, false, 'class demo.Child property "propFour" is not configurable');
//     //get/set check
//     //accessored property
//     strictEqual(child.propThree, '-+5', 'class demo.Child property "propThree" default value is valid');
//     child.propThree = 50;
//     strictEqual(child.propThree, '-+50', 'class demo.Child property "propThree" assigned value is valid');
//     child.propThree = 5;
//     //another accessored property
//     strictEqual(child.propFour, '6-+', 'class demo.Child property "propFour" default value is valid');
//     child.propFour = 5;
//     strictEqual(child.propFour, '5-+', 'class demo.Child property "propFour" assigned value is valid');
//     child.propFour = 6;
//     //inherited property
//     strictEqual(child.propTwo, 111, 'class demo.Child property "propTwo" default value is valid');
//     child.propTwo = 5;
//     strictEqual(child.propTwo, 5, 'class demo.Child property "propTwo" assigned value is valid');
//     child.propTwo = 111;
// });
// module('7. Static methods');
// test('base', function() {
//     //get class shortcut
//     var base = demo.Base;
//     //check class methods
//     //method without default
//     strictEqual(base.metOne(), 'NaNbase.static.a', 'class demo.Base method "metOne" return correct value with no params');
//     strictEqual(base.metOne(3), 'NaNbase.static.a', 'class demo.Base method "metOne" return correct value with some params');
//     strictEqual(base.metOne(3, 4), '7base.static.a', 'class demo.Base method "metOne" return correct value with all params');
//     //method with default
//     strictEqual(base.metTwo(), '3base.static.b', 'class demo.Base method "metTwo" return correct value with no params');
//     strictEqual(base.metTwo(3), '5base.static.b', 'class demo.Base method "metTwo" return correct value with some params');
//     strictEqual(base.metTwo(3, 4), '7base.static.b', 'class demo.Base method "metTwo" return correct value with all params');
// });
// test('parent', function() {
//     //get class shortcut
//     var parent = demo.Parent;
//     //check class methods
//     //inherited method
//     strictEqual(parent.metOne(), 'NaNbase.static.a', 'class demo.Parent method "metOne" return correct value with no params');
//     strictEqual(parent.metOne(3), 'NaNbase.static.a', 'class demo.Parent method "metOne" return correct value with some params');
//     strictEqual(parent.metOne(3, 4), '7base.static.a', 'class demo.Parent method "metOne" return correct value with all params');
//     //overriden method
//     strictEqual(parent.metTwo(), '3parent.static.b', 'class demo.Parent method "metTwo" return correct value with no params');
//     strictEqual(parent.metTwo(3), '5parent.static.b', 'class demo.Parent method "metTwo" return correct value with some params');
//     strictEqual(parent.metTwo(3, 4), '7parent.static.b', 'class demo.Parent method "metTwo" return correct value with all params');
//     //downcalling method
//     strictEqual(parent.metThree(), '7base.static.b', 'class demo.Parent method "metThree" return correct value with no params');
//     strictEqual(parent.metThree(5), '9base.static.b', 'class demo.Parent method "metThree" return correct value with some params');
//     strictEqual(parent.metThree(5, 6), '11base.static.b', 'class demo.Parent method "metThree" return correct value with all params');
// });
// test('child', function() {
//     //get class shortcut
//     var child = demo.Child;
//     //check class methods
//     //inherited method
//     strictEqual(child.metTwo(), '3parent.static.b', 'class demo.Child method "metTwo" return correct value with no params');
//     strictEqual(child.metTwo(3), '5parent.static.b', 'class demo.Child method "metTwo" return correct value with some params');
//     strictEqual(child.metTwo(3, 4), '7parent.static.b', 'class demo.Child method "metTwo" return correct value with all params');
//     //overriden method
//     strictEqual(child.metOne(), 'NaNchild.static.a', 'class demo.Child method "metOne" return correct value with no params');
//     strictEqual(child.metOne(3), 'NaNchild.static.a', 'class demo.Child method "metOne" return correct value with some params');
//     strictEqual(child.metOne(3, 4), '7child.static.a', 'class demo.Child method "metOne" return correct value with all params');
//     //downcalling method
//     strictEqual(child.metThree(), '11base.static.b', 'class demo.Child method "metThree" return correct value with no params');
//     strictEqual(child.metThree(5), '13base.static.b', 'class demo.Child method "metThree" return correct value with some params');
//     strictEqual(child.metThree(5, 6), '15base.static.b', 'class demo.Child method "metThree" return correct value with all params');
// });
// module('8. Properties');
// test('base', function() {
//     //get class shortcut
//     var inst1 = xs.create('demo.Base');
//     var inst2 = xs.create('demo.Base');

//     //check getter/setter property
//     //check access
//     strictEqual(inst1.propOne, '??1!!', 'property "propOne" of demo.Base instance has correct default value');
//     inst1.propOne = 1;
//     strictEqual(inst1.propOne, '??1!!', 'property "propOne" of demo.Base instance has correct changed value');
//     inst1.propOne = 12;
//     //check instance difference
//     inst1.propOne = 5;
//     inst2.propOne = 6;
//     strictEqual(inst1.propOne, '??5!!', 'property "propOne" of demo.Base one instance has own value');
//     strictEqual(inst2.propOne, '??6!!', 'property "propOne" of demo.Base another instance has own value');
//     inst1.propOne = 12;
//     inst2.propOne = 12;

//     //check simple property
//     //check access
//     strictEqual(inst1.propTwo, 2, 'property "propTwo" of demo.Base instance has correct default value');
//     inst1.propTwo = 1;
//     strictEqual(inst1.propTwo, 1, 'property "propTwo" of demo.Base instance has correct changed value');
//     inst1.propTwo = 15;
//     //check instance difference
//     inst1.propTwo = 5;
//     inst2.propTwo = 6;
//     strictEqual(inst1.propTwo, 5, 'property "propTwo" of demo.Base one instance has own value');
//     strictEqual(inst2.propTwo, 6, 'property "propTwo" of demo.Base another instance has own value');
//     inst1.propTwo = 15;
//     inst2.propTwo = 15;
// });
// test('parent', function() {
//     //get class shortcut
//     var inst1 = xs.create('demo.Parent');
//     var inst2 = xs.create('demo.Parent');

//     //check inherited property
//     //check access
//     strictEqual(inst1.propOne, '??2!!', 'property "propOne" of demo.Parent instance has correct default value');
//     inst1.propOne = 1;
//     strictEqual(inst1.propOne, '??1!!', 'property "propOne" of demo.Parent instance has correct changed value');
//     inst1.propOne = 2;
//     //check instance difference
//     inst1.propOne = 5;
//     inst2.propOne = 6;
//     strictEqual(inst1.propOne, '??5!!', 'property "propOne" of demo.Parent one instance has own value');
//     strictEqual(inst2.propOne, '??6!!', 'property "propOne" of demo.Parent another instance has own value');
//     inst1.propOne = 2;
//     inst2.propOne = 2;

//     //check simple property
//     //check access
//     strictEqual(inst1.propTwo, 4, 'property "propTwo" of demo.Parent instance has correct default value');
//     inst1.propTwo = 1;
//     strictEqual(inst1.propTwo, 1, 'property "propTwo" of demo.Parent instance has correct changed value');
//     inst1.propTwo = 4;
//     //check instance difference
//     inst1.propTwo = 5;
//     inst2.propTwo = 6;
//     strictEqual(inst1.propTwo, 5, 'property "propTwo" of demo.Parent one instance has own value');
//     strictEqual(inst2.propTwo, 6, 'property "propTwo" of demo.Parent another instance has own value');
//     inst1.propTwo = 4;
//     inst2.propTwo = 4;

//     //check getter/setter property
//     //check access
//     strictEqual(inst1.propThree, '--undefined', 'property "propThree" of demo.Parent instance has correct default value');
//     inst1.propThree = 1;
//     strictEqual(inst1.propThree, '--1', 'property "propThree" of demo.Parent instance has correct changed value');
//     inst1.propThree = undefined;
//     //check instance difference
//     inst1.propThree = 5;
//     inst2.propThree = 6;
//     strictEqual(inst1.propThree, '--5', 'property "propThree" of demo.Parent one instance has own value');
//     strictEqual(inst2.propThree, '--6', 'property "propThree" of demo.Parent another instance has own value');
//     inst1.propThree = undefined;
//     inst2.propThree = undefined;
// });
// test('child', function() {
//     //get class shortcut
//     var inst1 = xs.create('demo.Child');
//     var inst2 = xs.create('demo.Child');

//     //check inherited property
//     //check access
//     strictEqual(inst1.propOne, '??4!!', 'property "propOne" of demo.Child instance has correct default value');
//     inst1.propOne = 1;
//     strictEqual(inst1.propOne, '??1!!', 'property "propOne" of demo.Child instance has correct changed value');
//     inst1.propOne = 2;
//     //check instance difference
//     inst1.propOne = 5;
//     inst2.propOne = 6;
//     strictEqual(inst1.propOne, '??5!!', 'property "propOne" of demo.Child one instance has own value');
//     strictEqual(inst2.propOne, '??6!!', 'property "propOne" of demo.Child another instance has own value');
//     inst1.propOne = 4;
//     inst2.propOne = 4;

//     //check overriden property
//     //check access
//     strictEqual(inst1.propTwo, '--++8', 'property "propTwo" of demo.Child instance has correct default value');
//     inst1.propTwo = 1;
//     strictEqual(inst1.propTwo, '--++1', 'property "propTwo" of demo.Child instance has correct changed value');
//     inst1.propTwo = 8;
//     //check instance difference
//     inst1.propTwo = 5;
//     inst2.propTwo = 6;
//     strictEqual(inst1.propTwo, '--++5', 'property "propTwo" of demo.Child one instance has own value');
//     strictEqual(inst2.propTwo, '--++6', 'property "propTwo" of demo.Child another instance has own value');
//     inst1.propTwo = 4;
//     inst2.propTwo = 4;

//     //check overriden property
//     //check access
//     strictEqual(inst1.propThree, 12, 'property "propThree" of demo.Child instance has correct default value');
//     inst1.propThree = 1;
//     strictEqual(inst1.propThree, 1, 'property "propThree" of demo.Child instance has correct changed value');
//     inst1.propThree = 12;
//     //check instance difference
//     inst1.propThree = 5;
//     inst2.propThree = 6;
//     strictEqual(inst1.propThree, 5, 'property "propThree" of demo.Child one instance has own value');
//     strictEqual(inst2.propThree, 6, 'property "propThree" of demo.Child another instance has own value');
//     inst1.propThree = 12;
//     inst2.propThree = 12;

//     //check getter/setter property
//     //check access
//     strictEqual(inst1.propFour, 'undefined--++', 'property "propFour" of demo.Child instance has correct default value');
//     inst1.propFour = 1;
//     strictEqual(inst1.propFour, '1--++', 'property "propFour" of demo.Child instance has correct changed value');
//     inst1.propFour = 8;
//     //check instance difference
//     inst1.propFour = 5;
//     inst2.propFour = 6;
//     strictEqual(inst1.propFour, '5--++', 'property "propFour" of demo.Child one instance has own value');
//     strictEqual(inst2.propFour, '6--++', 'property "propFour" of demo.Child another instance has own value');
//     inst1.propFour = 8;
//     inst2.propFour = 8;
// });
// module('9. Methods');
// test('base', function() {
//     //get class instance
//     var inst = xs.create('demo.Base');
//     //check class methods
//     //method without default
//     strictEqual(inst.metOne(), 'NaNbase.a', ' method "metOne" of demo.Base class instance returns correct value with no params');
//     strictEqual(inst.metOne(3), 'NaNbase.a', 'method "metOne" of demo.Base class instance returns correct value with some params');
//     strictEqual(inst.metOne(3, 4), '7base.a', 'method "metOne" of demo.Base class instance returns correct value with all params');
//     //method with default
//     strictEqual(inst.metTwo(), '5base.b', 'method "metTwo" of demo.Base class instance returns correct value with no params');
//     strictEqual(inst.metTwo(3), '6base.b', 'method "metTwo" of demo.Base class instance returns correct value with some params');
//     strictEqual(inst.metTwo(3, 4), '7base.b', 'method "metTwo" of demo.Base class instance returns correct value with all params');
// });
// test('parent', function() {
//     //get class instance
//     var inst = xs.create('demo.Parent');
//     //check class methods
//     //inherited method
//     strictEqual(inst.metOne(), 'NaNbase.a', ' method "metOne" of demo.Parent class instance returns correct value with no params');
//     strictEqual(inst.metOne(3), 'NaNbase.a', 'method "metOne" of demo.Parent class instance returns correct value with some params');
//     strictEqual(inst.metOne(3, 4), '7base.a', 'method "metOne" of demo.Parent class instance returns correct value with all params');
//     //overriden method
//     strictEqual(inst.metTwo(), '7parent.b', 'method "metTwo" of demo.Parent class instance returns correct value with no params');
//     strictEqual(inst.metTwo(5), '9parent.b', 'method "metTwo" of demo.Parent class instance returns correct value with some params');
//     strictEqual(inst.metTwo(5, 6), '11parent.b', 'method "metTwo" of demo.Parent class instance returns correct value with all params');
//     //downcalling method
//     strictEqual(inst.metThree(), '2base.b', 'method "metThree" of demo.Parent class instance returns correct value with no params');
//     strictEqual(inst.metThree(3), '0base.b', 'method "metThree" of demo.Parent class instance returns correct value with some params');
//     strictEqual(inst.metThree(3, 4), '-2base.b', 'method "metThree" of demo.Parent class instance returns correct value with all params');
// });
// test('child', function() {
//     //get class instance
//     var inst = xs.create('demo.Child');
//     //check class methods
//     //overriden method
//     strictEqual(inst.metOne(), 'NaNchild.a', ' method "metOne" of demo.Child class instance returns correct value with no params');
//     strictEqual(inst.metOne(3), 'NaNchild.a', 'method "metOne" of demo.Child class instance returns correct value with some params');
//     strictEqual(inst.metOne(3, 4), '7child.a', 'method "metOne" of demo.Child class instance returns correct value with all params');
//     //inherited method
//     strictEqual(inst.metTwo(), '7parent.b', 'method "metTwo" of demo.Child class instance returns correct value with no params');
//     strictEqual(inst.metTwo(5), '9parent.b', 'method "metTwo" of demo.Child class instance returns correct value with some params');
//     strictEqual(inst.metTwo(5, 6), '11parent.b', 'method "metTwo" of demo.Child class instance returns correct value with all params');
//     //downcalling method
//     strictEqual(inst.metThree(), 'NaNbase.b', 'method "metThree" of demo.Child class instance returns correct value with no params');
//     strictEqual(inst.metThree(3), 'NaNbase.b', 'method "metThree" of demo.Child class instance returns correct value with some params');
//     strictEqual(inst.metThree(3, 4), '2base.b', 'method "metThree" of demo.Child class instance returns correct value with all params');
// });
// module('10. Creation with attributes');
// test('base', function() {
//     //get class instance
//     var inst = xs.create('demo.Base', 1, 74);
//     //check instance properties
//     strictEqual(inst.propOne, '??1!!', 'property "propOne" of class demo.Base instance assigned correctly');
//     strictEqual(inst.propTwo, 74, 'property "propTwo" of class demo.Base instance assigned correctly');
// });
// test('parent', function() {
//     //get class instance
//     var inst = xs.create('demo.Parent', 2, 74, 89);
//     //check instance properties
//     strictEqual(inst.propOne, '??2!!', 'property "propOne" of class demo.Parent instance assigned correctly');
//     strictEqual(inst.propTwo, 74, 'property "propTwo" of class demo.Parent instance assigned correctly');
//     strictEqual(inst.propThree, '--89', 'property "propThree" of class demo.Parent instance assigned correctly');
// });
// test('child', function() {
//     //get class instance
//     var inst = xs.create('demo.Child', 4, 74, 89, 32);
//     //check instance properties
//     strictEqual(inst.propOne, '??4!!', 'property "propOne" of class demo.Child instance assigned correctly');
//     strictEqual(inst.propTwo, '--++74', 'property "propTwo" of class demo.Child instance assigned correctly');
//     strictEqual(inst.propThree, 89, 'property "propThree" of class demo.Child instance assigned correctly');
//     strictEqual(inst.propFour, '32--++', 'property "propFour" of class demo.Child instance assigned correctly');
// });
// module('11. Singleton');
// test('base', function() {
//     //get class instance
//     var single = xs.define('demo.Single', {
//         extend: 'demo.Base',
//         singleton: true,
//         const: {
//             a: 1
//         },
//         static: {
//             properties: {
//                 b: 2
//             },
//             methods: {
//                 c: {
//                     fn: function(value) {
//                         return value;
//                     },
//                     default: [3]
//                 }
//             }
//         },
//         properties: {
//             d: 4
//         },
//         methods: {
//             e: {
//                 fn: function(value) {
//                     return value;
//                 },
//                 default: [5]
//             }
//         }
//     });
//     //check basics
//     strictEqual(single.$isClass, true, 'is class');
//     strictEqual(single.$name, 'demo.Single', 'class name saved');
//     //check constants, methods and properties assigned
//     //const
//     strictEqual(single.a, 1, 'constant "a" saved');
//     //static.properties
//     strictEqual(single.b, 2, 'static property "b" still exists');
//     //static.methods
//     strictEqual(single.c(), 3, 'static method "c" still exists');
//     //properties
//     strictEqual(single.d, 4, 'property "d" saved ok');
//     //methods
//     strictEqual(single.e(), 5, 'method "e" saved ok');
// });