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
xs.define('xs.class.Base.demo.Base', function (self) {
    return {
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
    };
});
xs.define('xs.class.Base.demo.Parent', function (self) {
    return {
        extend:      'xs.class.Base.demo.Base',
        constructor: function (config) {
            self.parent.call(this, config);
            this.propThree = config.c;
        },
        properties:  {
            propTwo:   155,
            propThree: {
                set: function (value) {
                    return this.__set('propThree', '--' + value);
                }
            }
        }
    };
});
xs.define('demo.Child', function (self) {
    return {
        extend:      'xs.class.Base.demo.Parent',
        constructor: function (config) {
            self.parent.call(this, config);
            this.propFour = config.d;
        },
        properties:  {
            propTwo:   {
                set: function (value) {
                    return this.__set('propTwo', '--++' + value);
                }
            },
            propThree: 155,
            propFour:  {
                get: function () {
                    return this.__get('propFour') + '--++';
                }
            }
        }
    };
});

'use strict';
module('xs.Base');
/**
 * Tests:
 * 1. Test static base methods
 * 2. Test member base methods
 *  -
 */
test('1. Static base methods: isChild', function () {
    //get class shortcuts
    var base = xs.class.Base.demo.Base;
    var parent = xs.class.Base.demo.Parent;
    var child = demo.Child;
    //true values
    strictEqual(parent.isChild(base), true, 'check that xs.class.Base.demo.Parent is child of xs.class.Base.demo.Base with isChild call');
    strictEqual(child.isChild(parent), true, 'check that demo.Child is child of xs.class.Base.demo.Parent with isChild call');
    //false values
    strictEqual(base.isChild(parent), false, 'check that xs.class.Base.demo.Base is not child of xs.class.Base.demo.Parent with isChild call');
    strictEqual(base.isChild(base), false, 'check that xs.class.Base.demo.Base is not child of xs.class.Base.demo.Base with isChild call');
    strictEqual(base.isChild([]), false, 'check that xs.class.Base.demo.Base is not child of empty [] (incorrect value example) with isChild call');
    strictEqual(parent.isChild(child), false, 'check that xs.class.Base.demo.Parent is not child of demo.Child with isChild call');
});
test('1. Static base methods: isParent', function () {
    //get class shortcuts
    var base = xs.class.Base.demo.Base;
    var parent = xs.class.Base.demo.Parent;
    var child = demo.Child;
    //true values
    strictEqual(base.isParent(parent), true, 'check that xs.class.Base.demo.Base is parent of xs.class.Base.demo.Parent with isParent call');
    strictEqual(parent.isParent(child), true, 'check that xs.class.Base.demo.Parent is parent of demo.Child with isParent call');
    //false values
    strictEqual(parent.isParent(base), false, 'check that xs.class.Base.demo.Parent is not parent of xs.class.Base.demo.Base with isParent call');
    strictEqual(base.isParent(base), false, 'check that xs.class.Base.demo.Base is not parent of xs.class.Base.demo.Base with isParent call');
    strictEqual(base.isParent([]), false, 'check that xs.class.Base.demo.Base is not parent of empty [] (incorrect value example) with isParent call');
    strictEqual(child.isParent(parent), false, 'check that demo.Child is not parent of xs.class.Base.demo.Parent with isParent call');
});
test('2. Member base methods: clone', function () {
    //get instances
    var base = xs.create('xs.class.Base.demo.Base');
    var parent = xs.create('xs.class.Base.demo.Parent');
    var child = xs.create('demo.Child');
    //is instance
    strictEqual(base.clone() instanceof xs.class.Base.demo.Base, true, 'check that xs.class.Base.demo.Base instance clone is xs.class.Base.demo.Base instance');
    strictEqual(parent.clone() instanceof xs.class.Base.demo.Parent, true, 'check that xs.class.Base.demo.Parent instance clone is xs.class.Base.demo.Parent instance');
    strictEqual(child.clone() instanceof demo.Child, true, 'check that demo.Child instance clone is demo.Child instance');
    //keeps all values, defined in descriptor
    var baseClone = base.clone();
    xs.Object.each(xs.class.Base.demo.Base.descriptor.properties, function (descriptor, name) {
        strictEqual(baseClone[name], base[name], 'check that xs.class.Base.demo.Base clone[' + name + ']=' + baseClone[name] + ' is equal to original');
    });
    var parentClone = parent.clone();
    xs.Object.each(xs.class.Base.demo.Parent.descriptor.properties, function (descriptor, name) {
        strictEqual(parentClone[name], parent[name], 'check that Parent.Base clone[' + name + ']=' + parentClone[name] + ' is equal to original');
    });
    var childClone = child.clone();
    xs.Object.each(demo.Child.descriptor.properties, function (descriptor, name) {
        strictEqual(childClone[name], child[name], 'check that demo.Child clone[' + name + ']=' + childClone[name] + ' is equal to original');
    });
});
test('2. Member base methods: toJSON', function () {
    //get instances
    var base = xs.create('xs.class.Base.demo.Base');
    var parent = xs.create('xs.class.Base.demo.Parent');
    var child = xs.create('demo.Child');
    //check JSON representation
    strictEqual(JSON.stringify(base.toJSON()), '{"propOne":"undefined!!","propTwo":15}', 'check that xs.class.Base.demo.Base instance JSON representation is correct');
    strictEqual(JSON.stringify(parent.toJSON()), '{"propTwo":155,"propThree":"--undefined","propOne":"undefined!!"}', 'check that xs.class.Base.demo.Parent instance JSON representation is correct');
    strictEqual(JSON.stringify(child.toJSON()), '{"propFour":"undefined--++","propOne":"undefined!!"}', 'check that demo.Child instance JSON representation is correct');
});































