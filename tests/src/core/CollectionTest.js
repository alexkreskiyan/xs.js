/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.core.Collection', function () {

    test('constructor', function () {
        //init test variables
        var x, collection;

        //check incorrect source
        throws(function () {
            new xs.core.Collection(true);
        });

        //check array list
        x = [
            1,
            3
        ];
        collection = new xs.core.Collection(x);
        strictEqual(collection.items[0].value, x[0]);
        strictEqual(collection.items[1].value, x[1]);

        //check object list
        x = {
            a: 1,
            b: 3
        };
        collection = new xs.core.Collection(x);
        strictEqual(collection.items[0].value, x.a);
        strictEqual(collection.items[1].value, x.b);
    });

    test('length', function () {
        //init test variables
        var collection;

        //check empty array list
        collection = new xs.core.Collection([]);
        strictEqual(collection.length, 0);

        //check array list
        collection = new xs.core.Collection([
            1,
            3
        ]);
        strictEqual(collection.length, 2);

        //check empty object list
        collection = new xs.core.Collection({});
        strictEqual(collection.length, 0);

        //check object list
        collection = new xs.core.Collection({
            a: 1,
            b: 3
        });
        strictEqual(collection.length, 2);
    });

    test('keys', function () {
        //init test variables
        var collection;

        //check simple array list
        collection = new xs.core.Collection([
            1,
            3
        ]);
        strictEqual(JSON.stringify(collection.keys()), '[0,1]');

        //check empty array list
        collection = new xs.core.Collection([]);
        strictEqual(JSON.stringify(collection.keys()), '[]');

        //check simple object list
        collection = new xs.core.Collection({
            x: 1,
            b: 2
        });
        strictEqual(JSON.stringify(collection.keys()), '["x","b"]');

        //check empty object list
        collection = new xs.core.Collection({});
        strictEqual(JSON.stringify(collection.keys()), '[]');
    });

    test('values', function () {
        //init test variables
        var collection;
        //check simple array list
        collection = new xs.core.Collection([
            1,
            3
        ]);
        strictEqual(JSON.stringify(collection.values()), '[1,3]');

        //check empty object list
        collection = new xs.core.Collection([]);
        strictEqual(JSON.stringify(collection.values()), '[]');

        //check simple object list
        collection = new xs.core.Collection({
            x: 1,
            b: '2'
        });
        strictEqual(JSON.stringify(collection.values()), '[1,"2"]');

        //check empty object list
        collection = new xs.core.Collection({});
        strictEqual(JSON.stringify(collection.values()), '[]');
    });

    test('clone', function () {
        //init test variables
        var item = { x: 1 }, collection, clone;

        //test array list
        collection = new xs.core.Collection([
            1,
            2,
            item
        ]);
        clone = collection.clone();
        //keys are equal
        strictEqual(JSON.stringify(clone.keys()), JSON.stringify(collection.keys()));
        //values are equal
        strictEqual(JSON.stringify(clone.values()), JSON.stringify(collection.values()));
        //links are saved
        strictEqual(collection.items[2].value === clone.items[2].value, true);

        //test object list
        collection = new xs.core.Collection({
            a: 1,
            c: 2,
            b: item
        });
        clone = collection.clone();
        //keys are equal
        strictEqual(JSON.stringify(clone.keys()), JSON.stringify(collection.keys()));
        //values are equal
        strictEqual(JSON.stringify(clone.values()), JSON.stringify(collection.values()));
        //links are saved
        strictEqual(collection.items[2].value === clone.items[2].value, true);
    });

    test('hasKey', function () {
        //init test variables
        var collection;

        //check key processing
        collection = new xs.core.Collection([
            1,
            3
        ]);
        throws(function () {
            collection.hasKey([]);
        });

        //check simple array list
        collection = new xs.core.Collection([
            1,
            3
        ]);
        strictEqual(collection.hasKey(0), true);
        strictEqual(collection.hasKey(1), true);
        strictEqual(collection.hasKey(2), false);

        //check empty array list
        collection = new xs.core.Collection([]);
        strictEqual(collection.hasKey(0), false);
        strictEqual(collection.hasKey(1), false);
        strictEqual(collection.hasKey(2), false);

        //check simple object list
        collection = new xs.core.Collection({
            x: 1,
            b: 2
        });
        strictEqual(collection.hasKey('x'), true);
        strictEqual(collection.hasKey('y'), false);

        //check empty object list
        collection = new xs.core.Collection({});
        strictEqual(collection.hasKey('x'), false);
        strictEqual(collection.hasKey('y'), false);
    });

    test('has', function () {
        //init test variables
        var collection;
        var item = { a: 1 };

        //test array list
        collection = new xs.core.Collection([
            1,
            3,
            item
        ]);
        strictEqual(collection.has(1), true);
        strictEqual(collection.has(item), true);
        strictEqual(collection.has('A'), false);

        //test empty array list
        collection = new xs.core.Collection([]);
        strictEqual(collection.has(1), false);
        strictEqual(collection.has('A'), false);

        //test object list
        collection = new xs.core.Collection({
            x: 1,
            b: 2,
            a: item
        });
        strictEqual(collection.has(1), true);
        strictEqual(collection.has(item), true);
        strictEqual(collection.has('1'), false);

        //test empty object list
        collection = new xs.core.Collection({});
        strictEqual(collection.has(1), false);
        strictEqual(collection.has('1'), false);

    });

    test('keyOf', function () {
        //init test variables
        var collection;
        var item = { a: 1 };

        //test array list
        collection = new xs.core.Collection([
            1,
            1,
            3,
            3,
            item,
            item
        ]);

        strictEqual(collection.keyOf(3), 2);
        strictEqual(collection.keyOf(item), 4);
        strictEqual(collection.keyOf(item, xs.core.Collection.REVERSE), 5);
        strictEqual(collection.keyOf('1'), undefined);

        //test empty array list
        collection = new xs.core.Collection([]);
        strictEqual(collection.keyOf(0), undefined);
        strictEqual(collection.keyOf('0'), undefined);

        //test object list
        collection = new xs.core.Collection({
            x: 1,
            y: 1,
            c: 2,
            d: 2,
            a: item,
            b: item
        });
        strictEqual(collection.keyOf(1), 'x');
        strictEqual(collection.keyOf(item), 'a');
        strictEqual(collection.keyOf(item, xs.core.Collection.REVERSE), 'b');
        strictEqual(collection.keyOf('1'), undefined);

        //test empty object list
        collection = new xs.core.Collection({});
        strictEqual(collection.keyOf(1), undefined);
        strictEqual(collection.keyOf('1'), undefined);
    });

    test('at', function () {
        //init test variables
        var collection;

        //check key processing
        collection = new xs.core.Collection([
            1,
            3
        ]);
        throws(function () {
            collection.at([]);
        });
        throws(function () {
            collection.at(3);
        });

        //check simple array list
        collection = new xs.core.Collection([
            1,
            3
        ]);
        strictEqual(collection.at(0), 1);
        strictEqual(collection.at(1), 3);

        //check simple object list
        collection = new xs.core.Collection({
            x: 1,
            b: 2
        });
        strictEqual(collection.at('x'), 1);
        strictEqual(collection.at('b'), 2);
    });

    test('first', function () {
        //init test variables
        var collection;

        //check collection filled
        collection = new xs.core.Collection([]);
        throws(function () {
            collection.first();
        });

        //test array list
        collection = new xs.core.Collection([
            {
                x: 1,
                y: 2
            },
            {
                x: 2,
                y: 2
            },
            {
                x: 2,
                y: 1
            },
            {
                x: 1,
                y: 1
            }
        ]);

        strictEqual(collection.first(), collection.at(0));

        //test object list
        collection = new xs.core.Collection({
            a: {
                x: 1,
                y: 2
            },
            b: {
                x: 2,
                y: 2
            },
            c: {
                x: 2,
                y: 1
            },
            d: {
                x: 1,
                y: 1
            }
        });
        strictEqual(collection.first(), collection.at('a'));
    });

    test('last', function () {
        //init test variables
        var collection;

        //check collection filled
        collection = new xs.core.Collection([]);
        throws(function () {
            collection.last();
        });

        //test array list
        collection = new xs.core.Collection([
            {
                x: 1,
                y: 2
            },
            {
                x: 2,
                y: 2
            },
            {
                x: 2,
                y: 1
            },
            {
                x: 1,
                y: 1
            }
        ]);

        strictEqual(collection.last(), collection.at(3));

        //test object list
        collection = new xs.core.Collection({
            a: {
                x: 1,
                y: 2
            },
            b: {
                x: 2,
                y: 2
            },
            c: {
                x: 2,
                y: 1
            },
            d: {
                x: 1,
                y: 1
            }
        });
        strictEqual(collection.last(), collection.at('d'));
    });

    test('add', function () {
        //init test variables
        var collection, x = {
            x: 1,
            y: 2
        };

        //check object collection error handling
        collection = new xs.core.Collection({});
        //throws if no arguments
        throws(function () {
            collection.add();
        });
        //throws if adding with existent key
        throws(function () {
            collection.add('1', 1);
            collection.add('1', '1');
        });

        //complex test
        collection = new xs.core.Collection();
        collection.add(x);
        strictEqual(collection.last(), x);
        strictEqual(collection.at(0), x);
        collection.add('a', 3);
        strictEqual(collection.last(), 3);
        strictEqual(collection.at('a'), 3);
    });

    test('insert', function () {
        //init test variables
        var collection, x = {
            x: 1
        };

        //check object collection error handling
        collection = new xs.core.Collection();
        //throws if no arguments
        throws(function () {
            collection.insert();
        });
        //throws if no value
        throws(function () {
            collection.insert(0);
        });
        //throws if adding with same key
        collection = new xs.core.Collection({a: 1});
        throws(function () {
            collection.insert(0, 'a', 1);
        });

        //complex test
        collection = new xs.core.Collection();
        collection.insert(0, x);
        strictEqual(collection.last(), x);
        strictEqual(collection.at(0), x);
        collection.insert(0, 'a', 2);
        strictEqual(collection.first(), 2);
        strictEqual(collection.at('a'), 2);
        collection.insert(-1, 'b', 3);
        strictEqual(collection.keys().toString(), 'a,b,2');
        strictEqual(collection.at('b'), 3);
    });

    test('set', function () {
        //init test variables
        var collection, x = {
            x: 1
        };

        //check object collection error handling
        collection = new xs.core.Collection();
        //throws if no arguments
        throws(function () {
            collection.set();
        });
        //throws if no value given
        throws(function () {
            collection.set(0);
        });
        //throws if key is missing
        //array
        collection = new xs.core.Collection([1]);
        throws(function () {
            collection.set(1, 1);
        });
        //object
        collection = new xs.core.Collection({a: 1});
        throws(function () {
            collection.set('b', 1);
        });

        //complex test
        collection = new xs.core.Collection();
        collection.add('a', x);
        strictEqual(collection.at(0), x);
        collection.set(0, 2);
        strictEqual(collection.first(), 2);
        strictEqual(collection.keyOf(2), 'a');
        collection.set('a', 5);
        strictEqual(collection.at('a'), 5);
    });

    test('deleteAt', function () {
        //init test variables
        var collection;

        //test array
        collection = new xs.core.Collection([
            1,
            3,
            2
        ]);

        collection.deleteAt(1);
        strictEqual(collection.values().toString(), '1,2');

        //test object
        collection = new xs.core.Collection({
            a: 1,
            b: 2,
            c: 3
        });

        collection.deleteAt('b');
        strictEqual(collection.keys().toString(), 'a,c');
        strictEqual(collection.values().toString(), '1,3');
        collection.deleteAt(-1);
        strictEqual(collection.keys().toString(), 'a');
        strictEqual(collection.values().toString(), '1');
    });

    test('delete', function () {
        //init test variables
        var item = { x: 1 };
        var itemString = JSON.stringify(item);
        var collection;

        //test array
        collection = new xs.core.Collection([
            3,
            item,
            3,
            item,
            2,
            item,
            2,
            item
        ]);

        collection.delete(item);
        strictEqual(JSON.stringify(collection.keys()), '[0,1,2,3,4,5,6]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,' + itemString + ',2,' + itemString + ',2,' + itemString + ']');

        collection.delete(item, xs.core.Collection.REVERSE);
        strictEqual(JSON.stringify(collection.keys()), '[0,1,2,3,4,5]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,' + itemString + ',2,' + itemString + ',2]');

        collection.delete(item, xs.core.Collection.ALL);
        strictEqual(JSON.stringify(collection.keys()), '[0,1,2,3]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,2,2]');

        collection = new xs.core.Collection({
            a: 3,
            b: item,
            c: 3,
            d: item,
            e: 2,
            f: item,
            g: 2,
            h: item
        });

        collection.delete(item);
        strictEqual(JSON.stringify(collection.keys()), '["a","c","d","e","f","g","h"]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,' + itemString + ',2,' + itemString + ',2,' + itemString + ']');

        collection.delete(item, xs.core.Collection.REVERSE);
        strictEqual(JSON.stringify(collection.keys()), '["a","c","d","e","f","g"]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,' + itemString + ',2,' + itemString + ',2]');

        collection.delete(item, xs.core.Collection.ALL);
        strictEqual(JSON.stringify(collection.keys()), '["a","c","e","g"]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,2,2]');
    });

    test('deleteBy', function () {
        //init test variables
        var item = { x: 1 };
        var itemString = JSON.stringify(item);
        var collection;

        //test array
        collection = new xs.core.Collection([
            3,
            item,
            3,
            item,
            2,
            item,
            2,
            item
        ]);

        collection.deleteBy(function (value) {
            return value === item;
        });
        strictEqual(JSON.stringify(collection.keys()), '[0,1,2,3,4,5,6]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,' + itemString + ',2,' + itemString + ',2,' + itemString + ']');

        collection.deleteBy(function (value) {
            return value === item;
        }, xs.core.Collection.REVERSE);
        strictEqual(JSON.stringify(collection.keys()), '[0,1,2,3,4,5]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,' + itemString + ',2,' + itemString + ',2]');

        collection.deleteBy(function (value) {
            return value === item;
        }, xs.core.Collection.ALL);
        strictEqual(JSON.stringify(collection.keys()), '[0,1,2,3]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,2,2]');

        collection = new xs.core.Collection({
            a: 3,
            b: item,
            c: 3,
            d: item,
            e: 2,
            f: item,
            g: 2,
            h: item
        });

        collection.deleteBy(function (value) {
            return value === item;
        });
        strictEqual(JSON.stringify(collection.keys()), '["a","c","d","e","f","g","h"]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,' + itemString + ',2,' + itemString + ',2,' + itemString + ']');

        collection.deleteBy(function (value) {
            return value === item;
        }, xs.core.Collection.REVERSE);
        strictEqual(JSON.stringify(collection.keys()), '["a","c","d","e","f","g"]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,' + itemString + ',2,' + itemString + ',2]');

        collection.deleteBy(function (value) {
            return value === item;
        }, xs.core.Collection.ALL);
        strictEqual(JSON.stringify(collection.keys()), '["a","c","e","g"]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,2,2]');
    });

    test('shift', function () {
        //init test variables
        var collection, shifted;

        //test array list
        collection = new xs.core.Collection([
            {
                x: 1,
                y: 2
            },
            {
                x: 2,
                y: 2
            },
            {
                x: 2,
                y: 1
            },
            {
                x: 1,
                y: 1
            }
        ]);
        shifted = collection.at(0);
        strictEqual(collection.shift(), shifted);
        strictEqual(JSON.stringify(collection.keys()), '[0,1,2]');

        //test object list
        collection = new xs.core.Collection({
            a: {
                x: 1,
                y: 2
            },
            b: {
                x: 2,
                y: 2
            },
            c: {
                x: 2,
                y: 1
            },
            d: {
                x: 1,
                y: 1
            }
        });
        shifted = collection.at('a');
        strictEqual(collection.shift(), shifted);
        strictEqual(JSON.stringify(collection.keys()), '["b","c","d"]');
    });

    test('pop', function () {
        //init test variables
        var collection, popped;

        //test array list
        collection = new xs.core.Collection([
            {
                x: 1,
                y: 2
            },
            {
                x: 2,
                y: 2
            },
            {
                x: 2,
                y: 1
            },
            {
                x: 1,
                y: 1
            }
        ]);
        popped = collection.at(3);
        strictEqual(collection.pop(), popped);
        strictEqual(JSON.stringify(collection.keys()), '[0,1,2]');

        //test object list
        collection = new xs.core.Collection({
            a: {
                x: 1,
                y: 2
            },
            b: {
                x: 2,
                y: 2
            },
            c: {
                x: 2,
                y: 1
            },
            d: {
                x: 1,
                y: 1
            }
        });
        popped = collection.at('d');
        strictEqual(collection.pop(), popped);
        strictEqual(JSON.stringify(collection.keys()), '["a","b","c"]');
    });

    test('each', function () {
        //init test variables
        var collection, sum;

        //test array
        collection = new xs.core.Collection([
            1,
            2
        ]);
        //direct
        sum = '';
        collection.each(function (value) {
            sum += value;
        });
        strictEqual(sum, '12');
        //reverse
        sum = '';
        collection.each(function (value) {
            sum += value;
        }, null, xs.core.Collection.REVERSE);
        strictEqual(sum, '21');

        //test empty array
        collection = new xs.core.Collection([]);
        //direct
        sum = '';
        collection.each(function (value) {
            sum += value;
        });
        strictEqual(sum, '');
        //reverse
        sum = '';
        collection.each(function (value) {
            sum += value;
        }, null, xs.core.Collection.REVERSE);
        strictEqual(sum, '');

        //test object
        collection = new xs.core.Collection({
            x: 1,
            b: 2
        });
        //direct
        sum = '';
        collection.each(function (value) {
            sum += value;
        });
        strictEqual(sum, '12');
        //reverse
        sum = '';
        collection.each(function (value) {
            sum += value;
        }, null, xs.core.Collection.REVERSE);
        strictEqual(sum, '21');

        //test empty object
        collection = new xs.core.Collection({});
        //direct
        sum = '';
        collection.each(function (value) {
            sum += value;
        });
        strictEqual(sum, '');
        //reverse
        sum = '';
        collection.each(function (value) {
            sum += value;
        }, null, xs.core.Collection.REVERSE);
        strictEqual(sum, '');
    });

    //test('eachReverse', function () {
    //    //init test variables
    //    var x, sum;

    //    //test array list
    //    x = [
    //        1,
    //        2
    //    ];
    //    sum = '';
    //    xs.eachReverse(x, function (value) {
    //        sum += value;
    //    });
    //    strictEqual(sum, '21');

    //    //test empty array list
    //    x = [];
    //    sum = '';
    //    xs.eachReverse(x, function (value) {
    //        sum += value;
    //    });
    //    strictEqual(sum, '');

    //    //test object list
    //    x = {
    //        x: 1,
    //        b: 2
    //    };
    //    sum = '';
    //    xs.eachReverse(x, function (value) {
    //        sum += value;
    //    });
    //    strictEqual(sum, '21');

    //    //test empty object list
    //    x = {};
    //    sum = '';
    //    xs.eachReverse(x, function (value) {
    //        sum += value;
    //    });
    //    strictEqual(sum, '');
    //});

    //test('map', function () {
    //    //init test variables
    //    var x;

    //    //test array list
    //    x = [
    //        4,
    //        3
    //    ];
    //    x = xs.map(x, function (value, name) {
    //        return value * 2 + name;
    //    });
    //    strictEqual(JSON.stringify(x), '[8,7]');

    //    //test empty array list
    //    x = [];
    //    x = xs.map(x, function (value, name) {
    //        return value * 2 + name;
    //    });
    //    strictEqual(JSON.stringify(x), '[]');

    //    //test object list
    //    x = {
    //        x: 1,
    //        b: 2
    //    };
    //    x = xs.map(x, function (value, name) {
    //        return value * 2 + name;
    //    });
    //    strictEqual(JSON.stringify(x), '{"x":"2x","b":"4b"}');

    //    //test empty object list
    //    x = {};
    //    x = xs.map(x, function (value, name) {
    //        return value * 2 + name;
    //    });
    //    strictEqual(JSON.stringify(x), '{}');
    //});

    //test('reduce', function () {
    //    //init test variables
    //    var x;

    //    //test array list
    //    x = [
    //        6,
    //        5,
    //        4
    //    ];
    //    strictEqual(xs.reduce(x, function (memo, value, name) {
    //        return memo + 2 * value + name;
    //    }), 27);
    //    strictEqual(xs.reduce(x, function (memo, value, name) {
    //        return memo + 2 * value + name;
    //    }, -3), 30);

    //    //test empty array list
    //    x = [];
    //    strictEqual(xs.reduce(x, function (memo, value, name) {
    //        return memo + 2 * value + name;
    //    }, -3), -3);

    //    //test object list
    //    x = {
    //        x: 1,
    //        b: 2,
    //        a: 3
    //    };
    //    strictEqual(xs.reduce(x, function (memo, value, name) {
    //        return memo + 2 * value + name;
    //    }), '5b6a');
    //    strictEqual(xs.reduce(x, function (memo, value, name) {
    //        return memo + 2 * value + name;
    //    }, -3), '-1x4b6a');

    //    //test empty object list
    //    x = {};
    //    strictEqual(xs.reduce(x, function (memo, value, name) {
    //        return memo + 2 * value + name;
    //    }), undefined);
    //    strictEqual(xs.reduce(x, function (memo, value, name) {
    //        return memo + 2 * value + name;
    //    }, -3), -3);
    //});

    //test('reduceRight', function () {
    //    //init test variables
    //    var x;

    //    //test array list
    //    x = [
    //        6,
    //        5,
    //        4
    //    ];
    //    strictEqual(xs.reduceRight(x, function (memo, value, name) {
    //        return memo + 2 * value + name;
    //    }), 27);
    //    strictEqual(xs.reduceRight(x, function (memo, value, name) {
    //        return memo + 2 * value + name;
    //    }, -3), 30);

    //    //test empty array list
    //    x = [];
    //    strictEqual(xs.reduce(x, function (memo, value, name) {
    //        return memo + 2 * value + name;
    //    }, -3), -3);

    //    //test object list
    //    x = {
    //        x: 1,
    //        b: 2,
    //        a: 3
    //    };
    //    strictEqual(xs.reduceRight(x, function (memo, value, name) {
    //        return memo + 2 * value + name;
    //    }), '7b2x');
    //    strictEqual(xs.reduceRight(x, function (memo, value, name) {
    //        return memo + 2 * value + name;
    //    }, -3), '3a4b2x');

    //    //test empty object list
    //    x = {};
    //    strictEqual(xs.reduce(x, function (memo, value, name) {
    //        return memo + 2 * value + name;
    //    }), undefined);
    //    strictEqual(xs.reduce(x, function (memo, value, name) {
    //        return memo + 2 * value + name;
    //    }, -3), -3);
    //});

    //test('find', function () {
    //    //init test variables
    //    var x;

    //    //test array list
    //    x = [
    //        {
    //            x: 1,
    //            y: 2
    //        },
    //        {
    //            x: 2,
    //            y: 2
    //        },
    //        {
    //            x: 2,
    //            y: 1
    //        },
    //        {
    //            x: 1,
    //            y: 1
    //        }
    //    ];

    //    strictEqual(xs.find(x, function (value) {
    //        return value.y == 1;
    //    }), x[2]);

    //    strictEqual(xs.find(x, function (value) {
    //        return value.y == 3;
    //    }), undefined);

    //    //test empty array list
    //    x = [];
    //    strictEqual(xs.find(x, function (value) {
    //        return value.y == 1;
    //    }), undefined);

    //    //test object list
    //    x = {
    //        a: {
    //            x: 1,
    //            y: 2
    //        },
    //        b: {
    //            x: 2,
    //            y: 2
    //        },
    //        c: {
    //            x: 2,
    //            y: 1
    //        },
    //        d: {
    //            x: 1,
    //            y: 1
    //        }
    //    };
    //    strictEqual(xs.find(x, function (value) {
    //        return value.y == 1;
    //    }), x.c);

    //    strictEqual(xs.find(x, function (value) {
    //        return value.y == 3;
    //    }), undefined);

    //    //test empty object list
    //    x = {};
    //    strictEqual(xs.find(x, function (value) {
    //        return value.y == 1;
    //    }), undefined);

    //});

    //test('findLast', function () {
    //    //init test variables
    //    var x;

    //    //test array list
    //    x = [
    //        {
    //            x: 1,
    //            y: 2
    //        },
    //        {
    //            x: 2,
    //            y: 2
    //        },
    //        {
    //            x: 2,
    //            y: 1
    //        },
    //        {
    //            x: 1,
    //            y: 1
    //        }
    //    ];
    //    strictEqual(xs.findLast(x, function (value) {
    //        return value.y == 1;
    //    }), x[3]);
    //    strictEqual(xs.findLast(x, function (value) {
    //        return value.y == 3;
    //    }), undefined);

    //    //test empty array list
    //    x = [];
    //    strictEqual(xs.findLast(x, function (value) {
    //        return value.y == 3;
    //    }), undefined);

    //    //test object list
    //    x = {
    //        a: {
    //            x: 1,
    //            y: 2
    //        },
    //        b: {
    //            x: 2,
    //            y: 2
    //        },
    //        c: {
    //            x: 2,
    //            y: 1
    //        },
    //        d: {
    //            x: 1,
    //            y: 1
    //        }
    //    };
    //    strictEqual(xs.findLast(x, function (value) {
    //        return value.y == 1;
    //    }), x.d);

    //    strictEqual(xs.findLast(x, function (value) {
    //        return value.y == 3;
    //    }), undefined);

    //    //test empty object list
    //    x = {};
    //    strictEqual(xs.findLast(x, function (value) {
    //        return value.y == 3;
    //    }), undefined);
    //});

    //test('findAll', function () {
    //    //init test variables
    //    var x;
    //    var results;

    //    //test array list
    //    x = [
    //        {
    //            x: 1,
    //            y: 2
    //        },
    //        {
    //            x: 2,
    //            y: 2
    //        },
    //        {
    //            x: 2,
    //            y: 1
    //        },
    //        {
    //            x: 1,
    //            y: 1
    //        }
    //    ];
    //    results = xs.findAll(x, function (value) {
    //        return value.y == 1;
    //    });
    //    strictEqual(JSON.stringify(results), JSON.stringify([
    //        x[2],
    //        x[3]
    //    ]));

    //    results = xs.findAll(x, function (value) {
    //        return value.y == 3;
    //    });
    //    strictEqual(JSON.stringify(results), JSON.stringify([]));

    //    //test empty array list
    //    x = [];
    //    results = xs.findAll(x, function (value) {
    //        return value.a = 'aa';
    //    });
    //    strictEqual(JSON.stringify(results), JSON.stringify([]));

    //    //test object list
    //    x = {
    //        a: {
    //            x: 1,
    //            y: 2
    //        },
    //        b: {
    //            x: 2,
    //            y: 2
    //        },
    //        c: {
    //            x: 2,
    //            y: 1
    //        },
    //        d: {
    //            x: 1,
    //            y: 1
    //        }
    //    };

    //    results = xs.findAll(x, function (value) {
    //        return value.y == 1;
    //    });
    //    strictEqual(JSON.stringify(results), JSON.stringify({
    //        c: x.c,
    //        d: x.d
    //    }));

    //    results = xs.findAll(x, function (value) {
    //        return value.y == 3;
    //    });
    //    strictEqual(JSON.stringify(results), JSON.stringify({}));

    //    //test empty object list
    //    x = {};
    //    results = xs.findAll(x, function (value) {
    //        return value.y == 3;
    //    });
    //    strictEqual(JSON.stringify(results), JSON.stringify({}));
    //});

    //test('filter', function () {
    //    //init test variables
    //    var x;
    //    var results;

    //    //test array list
    //    x = [
    //        {
    //            x: 1,
    //            y: 2
    //        },
    //        {
    //            x: 2,
    //            y: 2
    //        },
    //        {
    //            x: 2,
    //            y: 1
    //        },
    //        {
    //            x: 1,
    //            y: 1
    //        }
    //    ];

    //    results = xs.filter(x, {
    //        x: 1
    //    });
    //    strictEqual(results, x[0]);

    //    results = xs.filter(x, {
    //        x: 3
    //    });
    //    strictEqual(results, undefined);

    //    //test empty array list
    //    x = [];
    //    results = xs.filter(x, {
    //        x: 'A'
    //    });
    //    strictEqual(results, undefined);

    //    //test object list
    //    x = {
    //        a: {
    //            x: 1,
    //            y: 2
    //        },
    //        b: {
    //            x: 2,
    //            y: 2
    //        },
    //        c: {
    //            x: 2,
    //            y: 1
    //        },
    //        d: {
    //            x: 1,
    //            y: 1
    //        }
    //    };

    //    results = xs.filter(x, {
    //        x: 1
    //    });
    //    strictEqual(results, x.a);

    //    results = xs.filter(x, {
    //        x: 3
    //    });
    //    strictEqual(results, undefined);

    //    //test empty object list
    //    x = {};
    //    results = xs.filter(x, {
    //        x: 3
    //    });
    //    strictEqual(results, undefined);
    //});

    //test('filterLast', function () {
    //    //init test variables
    //    var x;
    //    var results;

    //    //test array list
    //    x = [
    //        {
    //            x: 1,
    //            y: 2
    //        },
    //        {
    //            x: 2,
    //            y: 2
    //        },
    //        {
    //            x: 2,
    //            y: 1
    //        },
    //        {
    //            x: 1,
    //            y: 1
    //        }
    //    ];

    //    results = xs.filterLast(x, {
    //        x: 1
    //    });
    //    strictEqual(results, x[3]);

    //    results = xs.filterLast(x, {
    //        x: 3
    //    });
    //    strictEqual(results, undefined);

    //    //test empty array list
    //    x = [];
    //    results = xs.filterLast(x, {
    //        x: 'A'
    //    });
    //    strictEqual(results, undefined);

    //    //test object list
    //    x = {
    //        a: {
    //            x: 1,
    //            y: 2
    //        },
    //        b: {
    //            x: 2,
    //            y: 2
    //        },
    //        c: {
    //            x: 2,
    //            y: 1
    //        },
    //        d: {
    //            x: 1,
    //            y: 1
    //        }
    //    };

    //    results = xs.filterLast(x, {
    //        x: 1
    //    });
    //    strictEqual(results, x.d);

    //    results = xs.filterLast(x, {
    //        x: 3
    //    });
    //    strictEqual(results, undefined);

    //    //test empty object list
    //    x = {};
    //    results = xs.filterLast(x, {
    //        x: 3
    //    });
    //    strictEqual(results, undefined);
    //});

    //test('filterAll', function () {
    //    //init test variables
    //    var x;
    //    var results;

    //    //test array list
    //    x = [
    //        {
    //            x: 1,
    //            y: 2
    //        },
    //        {
    //            x: 2,
    //            y: 2
    //        },
    //        {
    //            x: 2,
    //            y: 1
    //        },
    //        {
    //            x: 1,
    //            y: 1
    //        }
    //    ];

    //    results = xs.filterAll(x, {
    //        x: 1
    //    });
    //    strictEqual(results.length, 2);
    //    strictEqual(results[0], x[0]);
    //    strictEqual(results[1], x[3]);

    //    results = xs.filterAll(x, {
    //        x: 3
    //    });
    //    strictEqual(results.length, 0);

    //    //test empty array list
    //    x = [];
    //    results = xs.filterAll(x, {
    //        x: 'A'
    //    });
    //    strictEqual(results.length, 0);

    //    //test object list
    //    x = {
    //        a: {
    //            x: 1,
    //            y: 2
    //        },
    //        b: {
    //            x: 2,
    //            y: 2
    //        },
    //        c: {
    //            x: 2,
    //            y: 1
    //        },
    //        d: {
    //            x: 1,
    //            y: 1
    //        }
    //    };

    //    results = xs.filterAll(x, {
    //        x: 1
    //    });
    //    strictEqual(xs.size(results), 2);
    //    strictEqual(results.a, x.a);
    //    strictEqual(results.d, x.d);

    //    results = xs.filterAll(x, {
    //        x: 3
    //    });
    //    strictEqual(xs.size(results), 0);

    //    //test empty object list
    //    x = {};
    //    results = xs.filterAll(x, {
    //        x: 3
    //    });
    //    strictEqual(xs.size(results), 0);
    //});

    //test('every', function () {
    //    //init test variables
    //    var x;

    //    //test array list
    //    x = [
    //        {
    //            x: 1,
    //            y: 2
    //        },
    //        {
    //            x: 2,
    //            y: 2
    //        },
    //        {
    //            x: 2,
    //            y: 1
    //        },
    //        {
    //            x: 1,
    //            y: 1
    //        }
    //    ];

    //    strictEqual(xs.every(x, function (value) {
    //        return value.hasOwnProperty('y');
    //    }), true);

    //    strictEqual(xs.every(x, function (value) {
    //        return value.x === 1;
    //    }), false);

    //    //test empty array list
    //    x = [];
    //    strictEqual(xs.every(x, function (value) {
    //        return !value.hasOwnProperty('y');
    //    }), true);

    //    //test object list
    //    x = {
    //        a: {
    //            x: 1,
    //            y: 2
    //        },
    //        b: {
    //            x: 2,
    //            y: 2
    //        },
    //        c: {
    //            x: 2,
    //            y: 1
    //        },
    //        d: {
    //            x: 1,
    //            y: 1
    //        }
    //    };

    //    strictEqual(xs.every(x, function (value) {
    //        return xs.hasKey(value, 'y');
    //    }), true);

    //    strictEqual(xs.every(x, function (value) {
    //        return value.x === 1;
    //    }), false);

    //    //test empty object list
    //    x = {};
    //    strictEqual(xs.every(x, function (value) {
    //        return value.x === 1;
    //    }), true);
    //});

    //test('some', function () {
    //    //init test variables
    //    var x;

    //    //test array list
    //    x = [
    //        {
    //            x: 1,
    //            y: 2
    //        },
    //        {
    //            x: 2,
    //            y: 2
    //        },
    //        {
    //            x: 2,
    //            y: 1
    //        },
    //        {
    //            x: 1,
    //            y: 1
    //        }
    //    ];

    //    strictEqual(xs.some(x, function (value) {
    //        return value.x == 1 && value.y == 1;
    //    }, -1), true, 'some method runs ok when result succeeds with given count less than 0');

    //    strictEqual(xs.some(x, function (value) {
    //        return value.x == 1 && value.y == 1;
    //    }, 0), true, 'some method runs ok when result succeeds with given count equal to 0');

    //    strictEqual(xs.some(x, function (value) {
    //        return value.x == 1 && value.y == 1;
    //    }), true);

    //    strictEqual(xs.some(x, function (value) {
    //        return value.x == 1 && value.y == 1;
    //    }, 2), false, 'some method runs ok when result succeeds with given count greater then 0');

    //    strictEqual(xs.some(x, function (value) {
    //        return value.x == 1 && value.y == 3;
    //    }), false);

    //    //test empty array list
    //    x = [];
    //    strictEqual(xs.some(x, function (value) {
    //        return value.x == 1 && value.y == 1;
    //    }), false);

    //    //test object list
    //    x = {
    //        a: {
    //            x: 1,
    //            y: 2
    //        },
    //        b: {
    //            x: 2,
    //            y: 2
    //        },
    //        c: {
    //            x: 2,
    //            y: 1
    //        },
    //        d: {
    //            x: 1,
    //            y: 1
    //        }
    //    };

    //    strictEqual(xs.some(x, function (value) {
    //        return value.x == 1 && value.y == 1;
    //    }, -1), true, 'some method runs ok when result succeeds with given count less than 0');

    //    strictEqual(xs.some(x, function (value) {
    //        return value.x == 1 && value.y == 1;
    //    }, 0), true, 'some method runs ok when result succeeds with given count equal to 0');

    //    strictEqual(xs.some(x, function (value) {
    //        return value.x == 1 && value.y == 1;
    //    }), true);

    //    strictEqual(xs.some(x, function (value) {
    //        return value.x == 1 && value.y == 1;
    //    }, 2), false, 'some method runs ok when result succeeds with given count greater then 0');

    //    strictEqual(xs.some(x, function (value) {
    //        return value.x == 1 && value.y == 3;
    //    }), false);

    //    //test empty object list
    //    x = {};
    //    strictEqual(xs.some(x, function (value) {
    //        return value.x == 1 && value.y == 1;
    //    }), false);
    //});

    //test('none', function () {
    //    //init test variables
    //    var x;

    //    //test array list
    //    x = [
    //        {
    //            x: 1,
    //            y: 2
    //        },
    //        {
    //            x: 2,
    //            y: 2
    //        },
    //        {
    //            x: 2,
    //            y: 1
    //        },
    //        {
    //            x: 1,
    //            y: 1
    //        }
    //    ];

    //    strictEqual(xs.none(x, function (value) {
    //        return value.hasOwnProperty('y');
    //    }), false);

    //    strictEqual(xs.none(x, function (value) {
    //        return value.x === 3;
    //    }), true);

    //    //test empty array list
    //    x = [];
    //    strictEqual(xs.none(x, function (value) {
    //        return !value.hasOwnProperty('y');
    //    }), true);

    //    //test object list
    //    x = {
    //        a: {
    //            x: 1,
    //            y: 2
    //        },
    //        b: {
    //            x: 2,
    //            y: 2
    //        },
    //        c: {
    //            x: 2,
    //            y: 1
    //        },
    //        d: {
    //            x: 1,
    //            y: 1
    //        }
    //    };

    //    strictEqual(xs.none(x, function (value) {
    //        return xs.hasKey(value, 'y');
    //    }), false);

    //    strictEqual(xs.none(x, function (value) {
    //        return value.x === 3;
    //    }), true);

    //    //test empty object list
    //    x = {};
    //    strictEqual(xs.none(x, function (value) {
    //        return value.x === 1;
    //    }), true);
    //});

    //test('defaults', function () {
    //    //init test variables
    //    var x, clone, correct;

    //    //test array list
    //    x = [
    //        {
    //            x: 1,
    //            y: 2
    //        },
    //        {
    //            x: 2,
    //            y: 2
    //        },
    //        {
    //            x: 2,
    //            y: 1
    //        },
    //        {
    //            x: 1,
    //            y: 1
    //        }
    //    ];

    //    clone = xs.clone([]);
    //    xs.defaults(clone, 1, 2, 3);
    //    strictEqual(JSON.stringify(clone), '[1,2,3]');

    //    clone = xs.clone(x);
    //    xs.defaults(clone, 1, 2, 3);
    //    strictEqual(JSON.stringify(clone), '[{"x":1,"y":2},{"x":2,"y":2},{"x":2,"y":1},{"x":1,"y":1}]');

    //    clone = xs.clone(x);
    //    xs.defaults(clone, 1, 2, 3, 4, 5);
    //    strictEqual(JSON.stringify(clone), '[{"x":1,"y":2},{"x":2,"y":2},{"x":2,"y":1},{"x":1,"y":1},5]');

    //    clone = xs.clone(x);
    //    xs.defaults(clone);
    //    strictEqual(JSON.stringify(clone), '[{"x":1,"y":2},{"x":2,"y":2},{"x":2,"y":1},{"x":1,"y":1}]');

    //    //test object list
    //    x = {
    //        a: {
    //            x: 1,
    //            y: 2
    //        },
    //        b: {
    //            x: 2,
    //            y: 2
    //        },
    //        c: {
    //            x: 2,
    //            y: 1
    //        },
    //        d: {
    //            x: 1,
    //            y: 1
    //        }
    //    };

    //    correct = '{"a":{"x":1,"y":2},"b":{"x":2,"y":2},"c":{"x":2,"y":1},"d":{"x":1,"y":1},"e":1,"f":1}';

    //    clone = xs.clone({});
    //    xs.defaults(clone, {
    //        e: 1
    //    }, {
    //        f: 1
    //    });
    //    strictEqual(JSON.stringify(clone), '{"e":1,"f":1}');

    //    clone = xs.clone(x);
    //    xs.defaults(clone, {
    //        e: 1
    //    }, {
    //        f: 1
    //    });
    //    strictEqual(JSON.stringify(clone), correct);

    //    clone = xs.clone(x);
    //    xs.defaults(clone, {
    //        a: 1
    //    });
    //    strictEqual(JSON.stringify(clone), JSON.stringify(x));

    //    clone = xs.clone(x);
    //    xs.defaults(clone);
    //    strictEqual(JSON.stringify(clone), JSON.stringify(x));
    //});

    //test('compact', function () {
    //    //init test variables
    //    var x;

    //    //test array list
    //    x = [
    //        0,
    //        1,
    //        2,
    //        undefined,
    //        false,
    //        null,
    //        true,
    //        {},
    //        [],
    //        '',
    //        '0',
    //        '1'
    //    ];

    //    strictEqual(JSON.stringify(xs.compact(x)), '[1,2,true,{},[],"0","1"]');

    //    //test empty array list
    //    x = [];
    //    strictEqual(JSON.stringify(xs.compact(x)), '[]');

    //    //test object list
    //    x = {
    //        a: 0,
    //        b: 1,
    //        c: 2,
    //        d: undefined,
    //        e: false,
    //        f: null,
    //        g: true,
    //        h: {},
    //        i: [],
    //        j: '',
    //        k: '0',
    //        l: '1'
    //    };

    //    strictEqual(JSON.stringify(xs.compact(x)), '{"b":1,"c":2,"g":true,"h":{},"i":[],"k":"0","l":"1"}');

    //    //test empty object list
    //    x = {};
    //    strictEqual(JSON.stringify(xs.compact(x)), '{}');
    //});

    //test('unique', function () {
    //    //init test variables
    //    var arr = [];
    //    var obj = {};
    //    var x, unique;

    //    //test array list
    //    x = [
    //        1,
    //        1,
    //        2,
    //        2,
    //        obj,
    //        null,
    //        true,
    //        false,
    //        '',
    //        obj,
    //        arr
    //    ];
    //    unique = xs.unique(x);
    //    strictEqual(JSON.stringify(unique), '[1,2,{},null,true,false,"",[]]');
    //    strictEqual(xs.has(unique, arr), true);
    //    strictEqual(xs.has(unique, obj), true);

    //    //test empty array list
    //    x = [];
    //    unique = xs.unique(x);
    //    strictEqual(JSON.stringify(unique), '[]');

    //    //test object list
    //    x = {
    //        a: 1,
    //        b: 1,
    //        c: true,
    //        d: arr,
    //        e: arr,
    //        f: obj,
    //        g: obj
    //    };
    //    unique = xs.unique(x);
    //    strictEqual(JSON.stringify(unique), '{"a":1,"c":true,"d":[],"f":{}}');
    //    strictEqual(xs.has(unique, arr), true);
    //    strictEqual(xs.has(unique, obj), true);

    //    //test empty object list
    //    x = {};
    //    unique = xs.unique(x);
    //    strictEqual(JSON.stringify(unique), '{}');
    //});

    //test('union', function () {
    //    //init test variables
    //    var x;

    //    //test array list
    //    x = [
    //        null,
    //        undefined,
    //        1,
    //        2,
    //        [3],
    //        [
    //            4,
    //            5
    //        ]
    //    ];
    //    strictEqual(JSON.stringify(xs.union.apply(xs, x)), '[null,null,1,2,3,4,5]');

    //    strictEqual(JSON.stringify(xs.union([], [], [])), '[]');

    //    strictEqual(JSON.stringify(xs.union([])), '[]');

    //    //test object list
    //    x = [
    //        { a: 1 },
    //        { b: 2 },
    //        [
    //            { c: 3 }
    //        ],
    //        [
    //            { d: 4 }
    //        ],
    //        [
    //            { e: 5 },
    //            { f: 6 }
    //        ]
    //    ];
    //    strictEqual(JSON.stringify(xs.union.apply(xs, x)), '{"a":1,"b":2,"c":3,"d":4,"e":5,"f":6}');

    //    strictEqual(JSON.stringify(xs.union({}, {}, [
    //        {},
    //        {}
    //    ])), '{}');

    //    strictEqual(JSON.stringify(xs.union({})), '{}');
    //});

    //test('intersection', function () {
    //    //init test variables
    //    var arr = [];
    //    var obj = {};
    //    var x;
    //    var intersection;

    //    //test array list
    //    x = [
    //        [
    //            1,
    //            2,
    //            3,
    //            4,
    //            5,
    //            null,
    //            true,
    //            false,
    //            '',
    //            obj,
    //            arr
    //        ],
    //        [
    //            2,
    //            3,
    //            4,
    //            5,
    //            null,
    //            false,
    //            '',
    //            obj,
    //            arr
    //        ],
    //        [
    //            1,
    //            7,
    //            3,
    //            4,
    //            null,
    //            5,
    //            false,
    //            obj,
    //            arr
    //        ],
    //        [
    //            7,
    //            2,
    //            3,
    //            4,
    //            5,
    //            false,
    //            true,
    //            obj,
    //            arr,
    //            null
    //        ]
    //    ];
    //    intersection = xs.intersection(x[0], x[1], x[2], x[3]);
    //    strictEqual(JSON.stringify(intersection), '[3,4,5,null,false,{},[]]');
    //    strictEqual(xs.has(intersection, arr), true);
    //    strictEqual(xs.has(intersection, obj), true);

    //    intersection = xs.intersection([], obj, arr);
    //    strictEqual(JSON.stringify(intersection), '{}');

    //    intersection = xs.intersection([arr], [
    //        obj,
    //        arr
    //    ]);
    //    strictEqual(xs.has(intersection, arr), true);

    //    intersection = xs.intersection();
    //    strictEqual(JSON.stringify(intersection), '{}');

    //    //test object list
    //    var a = { a: 1 };
    //    var b = { b: 2 };
    //    var c = [
    //        { c: 3 }
    //    ];
    //    var d = [
    //        { d: 4 }
    //    ];
    //    var e = [
    //        { e: 5 },
    //        { f: 6 }
    //    ];

    //    x = [
    //        { a: a, b: b, c: c, d: d, e: e, f: null, g: true, h: false, i: '', j: obj, k: arr },
    //        { b: b, c: c, d: d, e: e, f: null, g: false, h: obj, i: arr },
    //        { a: a, c: c, d: d, e: e, f: null, g: true, h: false, i: '', j: obj, k: arr }
    //    ];
    //    intersection = xs.intersection(x[0], x[1], x[2]);
    //    var correct = '{"c":[{"c":3}],"d":[{"d":4}],"e":[{"e":5},{"f":6}],"f":null,"h":false,"j":{},"k":[]}';
    //    strictEqual(JSON.stringify(intersection), correct);
    //    strictEqual(xs.has(intersection, arr), true);
    //    strictEqual(xs.has(intersection, obj), true);
    //    strictEqual(xs.has(intersection, c), true);
    //    strictEqual(xs.has(intersection, d), true);
    //    strictEqual(xs.has(intersection, e), true);

    //    intersection = xs.intersection({ a: a }, { a: a });
    //    strictEqual(JSON.stringify(intersection), '{"a":{"a":1}}');

    //    intersection = xs.intersection();
    //    strictEqual(JSON.stringify(intersection), '{}');
    //});

    //test('difference', function () {
    //    //init test variables
    //    var arr = [];
    //    var obj = {};
    //    var x;

    //    //test array list
    //    x = [
    //        [
    //            1,
    //            2,
    //            3,
    //            4,
    //            5,
    //            8,
    //            null,
    //            true,
    //            false,
    //            '',
    //            obj,
    //            arr
    //        ],
    //        [
    //            2,
    //            3,
    //            4,
    //            5,
    //            null,
    //            false,
    //            '',
    //            obj,
    //            arr
    //        ],
    //        [
    //            1,
    //            7,
    //            3,
    //            4,
    //            null,
    //            5,
    //            false,
    //            obj,
    //            arr
    //        ],
    //        [
    //            7,
    //            2,
    //            3,
    //            4,
    //            5,
    //            false,
    //            true,
    //            obj,
    //            arr,
    //            null
    //        ]
    //    ];

    //    var diff = xs.difference(x[0], x[1], x[2], x[3]);
    //    strictEqual(JSON.stringify(diff), '[8]');

    //    diff = xs.difference(x[0], []);
    //    strictEqual(JSON.stringify(diff), JSON.stringify(x[0]));

    //    diff = xs.difference([], x[0]);
    //    strictEqual(JSON.stringify(diff), JSON.stringify([]));

    //    diff = xs.difference([]);
    //    strictEqual(JSON.stringify(diff), JSON.stringify([]));

    //    //test object list
    //    var a = { a: 1 };
    //    var b = { b: 2 };
    //    var c = [
    //        { c: 3 }
    //    ];
    //    var d = [
    //        { d: 4 }
    //    ];
    //    var e = [
    //        { e: 5 },
    //        { f: 6 }
    //    ];

    //    x = [
    //        { a: a, b: b, c: c, d: d, e: e, f: null, g: true, h: false, i: '', j: obj, k: arr },
    //        { b: b, c: c, d: d, f: null, g: true, j: obj, k: arr },
    //        { c: c, d: d, f: null, g: true }
    //    ];

    //    diff = xs.difference(x[0], x[1], x[2]);
    //    strictEqual(JSON.stringify(diff), '{"a":{"a":1},"e":[{"e":5},{"f":6}],"h":false,"i":""}');

    //    diff = xs.difference(x[0], {});
    //    strictEqual(JSON.stringify(diff), JSON.stringify(x[0]));

    //    diff = xs.difference({}, x[0]);
    //    strictEqual(JSON.stringify(diff), JSON.stringify({}));

    //    diff = xs.difference({});
    //    strictEqual(JSON.stringify(diff), JSON.stringify({}));
    //});

    //test('pick', function () {
    //    //init test variables
    //    var x;

    //    //test array list
    //    x = [
    //        {
    //            x: 1,
    //            y: 2
    //        },
    //        {
    //            x: 2,
    //            y: 2
    //        },
    //        {
    //            x: 2,
    //            y: 1
    //        },
    //        {
    //            x: 1,
    //            y: 1
    //        }
    //    ];
    //    var correct = '[{"x":1,"y":2},{"x":2,"y":2}]';
    //    var correctKeys = '[0,1]';

    //    var clone = xs.pick(x, 0, 1);
    //    strictEqual(JSON.stringify(xs.keys(clone)), correctKeys);
    //    strictEqual(JSON.stringify(clone), correct);

    //    clone = xs.pick(x, [0], [1]);
    //    strictEqual(JSON.stringify(xs.keys(clone)), correctKeys);
    //    strictEqual(JSON.stringify(clone), correct);

    //    clone = xs.pick(x, [
    //        0,
    //        1
    //    ]);
    //    strictEqual(JSON.stringify(xs.keys(clone)), correctKeys);
    //    strictEqual(JSON.stringify(clone), correct);

    //    clone = xs.pick(x);
    //    strictEqual(JSON.stringify(clone), '[]');

    //    clone = xs.pick(x, 'a');
    //    strictEqual(JSON.stringify(clone), '[]');

    //    clone = xs.pick([], 'a');
    //    strictEqual(JSON.stringify(clone), '[]');

    //    //test object list
    //    x = {
    //        a: {
    //            x: 1,
    //            y: 2
    //        },
    //        b: {
    //            x: 2,
    //            y: 2
    //        },
    //        c: {
    //            x: 2,
    //            y: 1
    //        },
    //        d: {
    //            x: 1,
    //            y: 1
    //        }
    //    };
    //    correct = '{"a":{"x":1,"y":2},"b":{"x":2,"y":2}}';
    //    correctKeys = '["a","b"]';

    //    clone = xs.pick(x, 'a', 'b', 'e');
    //    strictEqual(JSON.stringify(xs.keys(clone)), correctKeys);
    //    strictEqual(JSON.stringify(clone), correct);

    //    clone = xs.pick(x, ['a'], ['b']);
    //    strictEqual(JSON.stringify(xs.keys(clone)), correctKeys);
    //    strictEqual(JSON.stringify(clone), correct);

    //    clone = xs.pick(x, [
    //        'a',
    //        'b'
    //    ]);
    //    strictEqual(JSON.stringify(xs.keys(clone)), correctKeys);
    //    strictEqual(JSON.stringify(clone), correct);

    //    clone = xs.pick(x);
    //    strictEqual(JSON.stringify(clone), '{}');

    //    clone = xs.pick(x, 'n');
    //    strictEqual(JSON.stringify(clone), '{}');

    //    clone = xs.pick({}, 'n');
    //    strictEqual(JSON.stringify(clone), '{}');
    //});

    //test('omit', function () {
    //    //init test variables
    //    var x;

    //    //test array list
    //    x = [
    //        {
    //            x: 1,
    //            y: 2
    //        },
    //        {
    //            x: 2,
    //            y: 2
    //        },
    //        {
    //            x: 2,
    //            y: 1
    //        },
    //        {
    //            x: 1,
    //            y: 1
    //        }
    //    ];
    //    var correct = '[{"x":1,"y":2},{"x":2,"y":2}]';
    //    var correctKeys = '[0,1]';

    //    var clone = xs.omit(x, 2, 3);
    //    strictEqual(JSON.stringify(xs.keys(clone)), correctKeys);
    //    strictEqual(JSON.stringify(clone), correct);

    //    clone = xs.omit(x, [2], [3]);
    //    strictEqual(JSON.stringify(xs.keys(clone)), correctKeys);
    //    strictEqual(JSON.stringify(clone), correct);

    //    clone = xs.omit(x, [
    //        2,
    //        3
    //    ]);
    //    strictEqual(JSON.stringify(xs.keys(clone)), correctKeys);
    //    strictEqual(JSON.stringify(clone), correct);

    //    clone = xs.omit(x);
    //    strictEqual(JSON.stringify(clone), JSON.stringify(x));

    //    clone = xs.omit(x, 'a');
    //    strictEqual(JSON.stringify(clone), JSON.stringify(x));

    //    clone = xs.omit([], 'a');
    //    strictEqual(JSON.stringify(clone), '[]');

    //    //test object list
    //    x = {
    //        a: {
    //            x: 1,
    //            y: 2
    //        },
    //        b: {
    //            x: 2,
    //            y: 2
    //        },
    //        c: {
    //            x: 2,
    //            y: 1
    //        },
    //        d: {
    //            x: 1,
    //            y: 1
    //        }
    //    };
    //    correct = '{"a":{"x":1,"y":2},"b":{"x":2,"y":2}}';
    //    correctKeys = '["a","b"]';

    //    clone = xs.omit(x, 'c', 'd', 'e');
    //    strictEqual(JSON.stringify(xs.keys(clone)), correctKeys);
    //    strictEqual(JSON.stringify(clone), correct);

    //    clone = xs.omit(x, ['c'], ['d']);
    //    strictEqual(JSON.stringify(xs.keys(clone)), correctKeys);
    //    strictEqual(JSON.stringify(clone), correct);

    //    clone = xs.omit(x, [
    //        'c',
    //        'd'
    //    ]);
    //    strictEqual(JSON.stringify(xs.keys(clone)), correctKeys);
    //    strictEqual(JSON.stringify(clone), correct);

    //    clone = xs.omit(x);
    //    strictEqual(JSON.stringify(clone), JSON.stringify(x));

    //    clone = xs.omit(x, 'n');
    //    strictEqual(JSON.stringify(clone), JSON.stringify(x));

    //    clone = xs.omit({}, 'n');
    //    strictEqual(JSON.stringify(clone), '{}');
    //});
});