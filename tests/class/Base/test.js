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
xs.define('demo.Base', {
    properties: {
        propOne: {
            get: function () {
                return this.__get('propOne') + '!!';
            },
            set: function (value) {
                return this.__set('propOne', '??' + value);
            }
        },
        propTwo: 15
    }
});
xs.define('demo.Parent', {
    extend: 'demo.Base',
    constructor: function (config) {
        var parent = demo.Parent.parent;
        parent.call(this, config);
        this.propThree = config.c;
    },
    properties: {
        propTwo: 155,
        propThree: {
            set: function (value) {
                return this.__set('propThree', '--' + value);
            }
        }
    }
});
xs.define('demo.Child', {
    extend: 'demo.Parent',
    constructor: function (config) {
        var parent = demo.Child.parent;
        parent.call(this, config);
        this.propFour = config.d;
    },
    properties: {
        propTwo: {
            set: function (value) {
                return this.__set('propTwo', '--++' + value);
            }
        },
        propThree: 155,
        propFour: {
            get: function () {
                return this.__get('propFour') + '--++';
            }
        }
    }
});

'use strict';
module('xs.Base');
/**
 * Tests:
 * 1. Test static base methods
 * 2. Test member base methods
 *  -
 */
module('1. Static base methods');
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
module('2. Member base methods');
test('clone', function () {
    //get instances
    var base = xs.create('demo.Base');
    var parent = xs.create('demo.Parent');
    var child = xs.create('demo.Child');
    //is instance
    strictEqual(base.clone() instanceof demo.Base, true, 'check that demo.Base instance clone is demo.Base instance');
    strictEqual(parent.clone() instanceof demo.Parent, true, 'check that demo.Parent instance clone is demo.Parent instance');
    strictEqual(child.clone() instanceof demo.Child, true, 'check that demo.Child instance clone is demo.Child instance');
    //keeps all values, defined in descriptor
    var baseClone = base.clone();
    xs.Object.each(demo.Base.descriptor.properties, function (descriptor, name) {
        strictEqual(baseClone[name], base[name], 'check that demo.Base clone[' + name + ']=' + baseClone[name] + ' is equal to original');
    });
    var parentClone = parent.clone();
    xs.Object.each(demo.Parent.descriptor.properties, function (descriptor, name) {
        strictEqual(parentClone[name], parent[name], 'check that Parent.Base clone[' + name + ']=' + parentClone[name] + ' is equal to original');
    });
    var childClone = child.clone();
    xs.Object.each(demo.Child.descriptor.properties, function (descriptor, name) {
        strictEqual(childClone[name], child[name], 'check that demo.Child clone[' + name + ']=' + childClone[name] + ' is equal to original');
    });
});
test('toJSON', function () {
    //get instances
    var base = xs.create('demo.Base');
    var parent = xs.create('demo.Parent');
    var child = xs.create('demo.Child');
    //check JSON representation
    strictEqual(JSON.stringify(base.toJSON()), '{"propOne":"undefined!!","propTwo":15}', 'check that demo.Base instance JSON representation is correct');
    strictEqual(JSON.stringify(parent.toJSON()), '{"propTwo":155,"propThree":"--undefined","propOne":"undefined!!"}', 'check that demo.Parent instance JSON representation is correct');
    strictEqual(JSON.stringify(child.toJSON()), '{"propFour":"undefined--++","propOne":"undefined!!"}', 'check that demo.Child instance JSON representation is correct');
});































