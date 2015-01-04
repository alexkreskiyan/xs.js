/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.core.Collection', function () {

    'use strict';

    test('constructor', function () {
        //init test variables
        var x, collection;

        //check incorrect source
        throws(function () {
            return new xs.core.Collection(true);
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
        var item = {x: 1}, collection, clone;

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
        var item = {a: 1};

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
        var item = {a: 1};

        //test array list
        collection = new xs.core.Collection([
            1,
            1,
            3,
            3,
            item,
            item
        ]);

        //incorrect flags throws
        throws(function () {
            collection.keyOf(5, null);
        });

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

        //check collection filled
        collection = new xs.core.Collection();
        throws(function () {
            collection.at(0);
        });

        //check key processing
        collection = new xs.core.Collection([
            1,
            3
        ]);

        //incorrect key
        throws(function () {
            collection.at([]);
        });

        //index out of bounds
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

        //key is missing
        throws(function () {
            collection.at('3');
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
        //throws if key is not atring
        throws(function () {
            collection.add(1, 1);
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
        //throws if not enough arguments
        throws(function () {
            collection.insert(1);
        });
        //throws if index not number
        throws(function () {
            collection.insert('1', 1);
        });
        //throws if index out of bounds
        throws(function () {
            collection.insert(2, 1);
        });

        //throws if adding with non-string key
        throws(function () {
            collection.insert(0, [], 1);
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
        //throws if not enough arguments
        throws(function () {
            collection.set(1);
        });
        //throws if key is incorrect
        throws(function () {
            collection.set([], 1);
        });

        //throws if key (index) not in bounds
        collection = new xs.core.Collection([1]);
        throws(function () {
            collection.set(1, 1);
        });

        //throws if key (key) is missing
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

    test('removeAt', function () {
        //init test variables
        var collection;

        //check object collection error handling
        collection = new xs.core.Collection();
        //throws if key is incorrect
        throws(function () {
            collection.removeAt([]);
        });

        //throws if key (index) not in bounds
        collection = new xs.core.Collection([1]);
        throws(function () {
            collection.removeAt(1);
        });

        //throws if key (key) is missing
        collection = new xs.core.Collection({a: 1});
        throws(function () {
            collection.removeAt('b');
        });

        //test array
        collection = new xs.core.Collection([
            1,
            3,
            2
        ]);

        collection.removeAt(1);
        strictEqual(collection.values().toString(), '1,2');

        //test object
        collection = new xs.core.Collection({
            a: 1,
            b: 2,
            c: 3
        });

        collection.removeAt('b');
        strictEqual(collection.keys().toString(), 'a,c');
        strictEqual(collection.values().toString(), '1,3');
        collection.removeAt(-1);
        strictEqual(collection.keys().toString(), 'a');
        strictEqual(collection.values().toString(), '1');
    });

    test('remove', function () {
        //init test variables
        var item = {x: 1};
        var itemString = JSON.stringify(item);
        var collection;

        //check object collection error handling
        collection = new xs.core.Collection();
        //throws if flags given and are incorrect
        throws(function () {
            collection.remove([], null);
        });

        //throws if value missing in array
        collection = new xs.core.Collection();
        throws(function () {
            collection.remove([]);
        });

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

        collection.remove(item);
        strictEqual(JSON.stringify(collection.keys()), '[0,1,2,3,4,5,6]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,' + itemString + ',2,' + itemString + ',2,' + itemString + ']');

        collection.remove(item, xs.core.Collection.REVERSE);
        strictEqual(JSON.stringify(collection.keys()), '[0,1,2,3,4,5]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,' + itemString + ',2,' + itemString + ',2]');

        collection.remove(item, xs.core.Collection.ALL);
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

        collection.remove(item);
        strictEqual(JSON.stringify(collection.keys()), '["a","c","d","e","f","g","h"]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,' + itemString + ',2,' + itemString + ',2,' + itemString + ']');

        collection.remove(item, xs.core.Collection.REVERSE);
        strictEqual(JSON.stringify(collection.keys()), '["a","c","d","e","f","g"]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,' + itemString + ',2,' + itemString + ',2]');

        collection.remove(item, xs.core.Collection.ALL);
        strictEqual(JSON.stringify(collection.keys()), '["a","c","e","g"]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,2,2]');
    });

    test('removeBy', function () {
        //init test variables
        var item = {x: 1};
        var itemString = JSON.stringify(item);
        var collection;

        //throws if finder is not array
        collection = new xs.core.Collection();
        throws(function () {
            collection.removeBy([]);
        });

        //throws if flags given and are incorrect
        throws(function () {
            collection.remove([], null);
        });

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

        collection.removeBy(function (value) {
            return value === item;
        });
        strictEqual(JSON.stringify(collection.keys()), '[0,1,2,3,4,5,6]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,' + itemString + ',2,' + itemString + ',2,' + itemString + ']');

        collection.removeBy(function (value) {
            return value === item;
        }, xs.core.Collection.REVERSE);
        strictEqual(JSON.stringify(collection.keys()), '[0,1,2,3,4,5]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,' + itemString + ',2,' + itemString + ',2]');

        collection.removeBy(function (value) {
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

        collection.removeBy(function (value) {
            return value === item;
        });
        strictEqual(JSON.stringify(collection.keys()), '["a","c","d","e","f","g","h"]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,' + itemString + ',2,' + itemString + ',2,' + itemString + ']');

        collection.removeBy(function (value) {
            return value === item;
        }, xs.core.Collection.REVERSE);
        strictEqual(JSON.stringify(collection.keys()), '["a","c","d","e","f","g"]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,' + itemString + ',2,' + itemString + ',2]');

        collection.removeBy(function (value) {
            return value === item;
        }, xs.core.Collection.ALL);
        strictEqual(JSON.stringify(collection.keys()), '["a","c","e","g"]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,2,2]');
    });

    test('shift', function () {
        //init test variables
        var collection, shifted;

        collection = new xs.core.Collection();
        throws(function () {
            collection.shift();
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

        collection = new xs.core.Collection();
        throws(function () {
            collection.pop();
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

        //throws if iterator is not a function
        collection = new xs.core.Collection();
        throws(function () {
            collection.each(null);
        });

        //throws if flags given and are incorrect
        throws(function () {
            collection.each(xs.emptyFn, null);
        });

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
        }, xs.core.Collection.REVERSE);
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
        }, xs.core.Collection.REVERSE);
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
        }, xs.core.Collection.REVERSE);
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
        }, xs.core.Collection.REVERSE);
        strictEqual(sum, '');
    });

    test('find', function () {
        //init test variables
        var collection, found;

        //throws if finder is not a function
        collection = new xs.core.Collection();
        throws(function () {
            collection.find(null);
        });

        //throws if flags given and are incorrect
        throws(function () {
            collection.find(xs.emptyFn, null);
        });

        var scope = {
            sum: function (x, y) {
                return x + y;
            },
            first: function (x) {
                return x[0];
            }
        };

        //for Array
        collection = new xs.core.Collection([
            {x: 2},
            {x: 2},
            {x: 0}
        ]);
        //direct
        found = collection.find(function (value, key) {
            return this.sum(key, value.x) === 2;
        }, 0, scope);
        strictEqual(found, collection.at(0));
        //reverse
        found = collection.find(function (value, key) {
            return this.sum(key, value.x) === 2;
        }, xs.core.Collection.REVERSE, scope);
        strictEqual(found, collection.at(2));
        //all
        found = collection.find(function (value, key) {
            return this.sum(key, value.x) >= 2;
        }, xs.core.Collection.ALL, scope);
        strictEqual(found.at(0), collection.at(0));
        strictEqual(found.at(1), collection.at(1));
        strictEqual(found.at(2), collection.at(2));

        //for Object
        collection = new xs.core.Collection({
            aa: {x: 1},
            c: {x: 2},
            ab: {x: 3}
        });
        //direct
        found = collection.find(function (value, key) {
            return this.first(key) === 'a';
        }, 0, scope);
        strictEqual(found, collection.at('aa'));
        //reverse
        found = collection.find(function (value, key) {
            return this.first(key) === 'a';
        }, xs.core.Collection.REVERSE, scope);
        strictEqual(found, collection.at('ab'));
        //all
        found = collection.find(function (value, key) {
            return this.first(key) === 'a';
        }, xs.core.Collection.ALL, scope);
        strictEqual(found.at('aa'), collection.at('aa'));
        strictEqual(found.at('ab'), collection.at('ab'));
    });

    test('map', function () {
        //init test variables
        var collection, scope = {
            twice: function (x) {
                return x * 2;
            }
        }, map;

        //throws if mapper is not a function
        collection = new xs.core.Collection();
        throws(function () {
            collection.map(null);
        });

        //for Array
        collection = new xs.core.Collection([
            1,
            2,
            4
        ]);
        map = collection.map(function (value, key) {
            return key + this.twice(value);
        }, scope);
        strictEqual(JSON.stringify(map.values()), '[2,5,10]');

        //for Object
        collection = new xs.core.Collection({
            a: 1,
            c: 2,
            b: 4
        });
        map = collection.map(function (value, key) {
            return key + this.twice(value);
        }, scope);
        strictEqual(JSON.stringify(map.values()), '["a2","c4","b8"]');
    });

    test('reduce', function () {
        //init test variables
        var collection;

        //throws if reducer is not a function
        collection = new xs.core.Collection();
        throws(function () {
            collection.reduce(null);
        });

        //throws if flags given and are incorrect
        throws(function () {
            collection.reduce(xs.emptyFn, null);
        });

        //test array list
        collection = new xs.core.Collection([
            6,
            5,
            4
        ]);
        //direct
        strictEqual(collection.reduce(function (memo, value, name) {
            return memo + 2 * value + name;
        }), 27);
        strictEqual(collection.reduce(function (memo, value, name) {
            return memo + 2 * value + name;
        }, 0, undefined, -3), 30);
        //reverse
        strictEqual(collection.reduce(function (memo, value, name) {
            return memo + 2 * value + name;
        }, xs.core.Collection.REVERSE), 27);
        strictEqual(collection.reduce(function (memo, value, name) {
            return memo + 2 * value + name;
        }, xs.core.Collection.REVERSE, undefined, -3), 30);

        //test object
        collection = new xs.core.Collection({
            x: 1,
            b: 2,
            a: 3
        });
        //direct
        strictEqual(collection.reduce(function (memo, value, name) {
            return memo + 2 * value + name;
        }), '5b6a');
        strictEqual(collection.reduce(function (memo, value, name) {
            return memo + 2 * value + name;
        }, 0, undefined, -3), '-1x4b6a');
        //reverse
        strictEqual(collection.reduce(function (memo, value, name) {
            return memo + 2 * value + name;
        }, xs.core.Collection.REVERSE), '7b2x');
        strictEqual(collection.reduce(function (memo, value, name) {
            return memo + 2 * value + name;
        }, xs.core.Collection.REVERSE, undefined, -3), '3a4b2x');
    });

    test('some', function () {
        //init test variables
        var collection;

        //throws if collection is empty
        collection = new xs.core.Collection();
        throws(function () {
            collection.some();
        });

        //throws if tester is not a function
        collection = new xs.core.Collection([1]);
        throws(function () {
            collection.some(null);
        });

        //throws if count is not a number
        collection = new xs.core.Collection([1]);
        throws(function () {
            collection.some(xs.emptyFn, 'a');
        });

        //throws if count is out of bounds
        collection = new xs.core.Collection([1]);
        throws(function () {
            collection.some(xs.emptyFn, 2);
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

        //negative
        //true
        strictEqual(collection.some(function (value) {
            return value.x === 1 && value.y === 3;
        }, 0), true);
        //false
        strictEqual(collection.some(function (value) {
            return value.x === 1 && value.y === 1;
        }, 0), false);

        //without count
        strictEqual(collection.some(function (value) {
            return value.x === 1 && value.y === 1;
        }), true);

        //positive
        //true
        strictEqual(collection.some(function (value) {
            return value.x === 1;
        }, 2), true);
        //false
        strictEqual(collection.some(function (value) {
            return value.x === 1 && value.y === 1;
        }, 2), false);


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

        //negative
        //true
        strictEqual(collection.some(function (value) {
            return value.x === 1 && value.y === 3;
        }, 0), true);
        //false
        strictEqual(collection.some(function (value) {
            return value.x === 1 && value.y === 1;
        }, 0), false);

        //without count
        strictEqual(collection.some(function (value) {
            return value.x === 1 && value.y === 1;
        }), true);

        //positive
        //true
        strictEqual(collection.some(function (value) {
            return value.x === 1;
        }, 2), true);
        //false
        strictEqual(collection.some(function (value) {
            return value.x === 1 && value.y === 1;
        }, 2), false);
    });

    test('unique', function () {
        //init test variables
        var arr = [];
        var obj = {};
        var collection;

        //test array
        collection = new xs.core.Collection([
            1,
            1,
            2,
            2,
            obj,
            null,
            true,
            false,
            '',
            obj,
            arr
        ]);
        collection.unique();
        strictEqual(JSON.stringify(collection.values()), '[1,2,{},null,true,false,"",[]]');
        strictEqual(collection.has(arr), true);
        strictEqual(collection.has(obj), true);

        //test empty array
        collection = new xs.core.Collection([]);
        collection.unique();
        strictEqual(JSON.stringify(collection.values()), '[]');

        //test object
        collection = new xs.core.Collection({
            a: 1,
            b: 1,
            c: true,
            d: arr,
            e: arr,
            f: obj,
            g: obj
        });
        collection.unique();
        strictEqual(JSON.stringify(collection.keys()), '["a","c","d","f"]');
        strictEqual(JSON.stringify(collection.values()), '[1,true,[],{}]');
        strictEqual(collection.has(arr), true);
        strictEqual(collection.has(obj), true);

        //test empty object
        collection = new xs.core.Collection({});
        collection.unique();
        strictEqual(JSON.stringify(collection.values()), '[]');
    });

    test('pick', function () {
        //init test variables
        var collection, picked, correctKeys, correctValues;

        //throws if keys list is not an array
        collection = new xs.core.Collection([1]);
        throws(function () {
            collection.pick();
        });

        //throws if some key is neither object nor string
        collection = new xs.core.Collection([1]);
        throws(function () {
            collection.pick([null]);
        });

        //throws if some key (index) is out of bounds
        collection = new xs.core.Collection([1]);
        throws(function () {
            collection.pick([2]);
        });

        //throws if some key (key) is missing
        collection = new xs.core.Collection([1]);
        throws(function () {
            collection.pick(['a']);
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
        correctKeys = '[0,1,2]';
        correctValues = '[{"x":2,"y":1},{"x":1,"y":2},{"x":2,"y":2}]';

        picked = collection.pick([
            2,
            0,
            1
        ]);
        strictEqual(JSON.stringify(picked.keys()), correctKeys);
        strictEqual(JSON.stringify(picked.values()), correctValues);

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
        correctKeys = '["b","a","d"]';
        correctValues = '[{"x":2,"y":2},{"x":1,"y":2},{"x":1,"y":1}]';

        picked = collection.pick([
            'b',
            'a',
            'd'
        ]);
        strictEqual(JSON.stringify(picked.keys()), correctKeys);
        strictEqual(JSON.stringify(picked.values()), correctValues);
    });

    test('omit', function () {
        //init test variables
        var collection, omitted, correctKeys, correctValues;

        //throws if keys list is not an array
        collection = new xs.core.Collection([1]);
        throws(function () {
            collection.omit();
        });

        //throws if some key is neither object nor string
        collection = new xs.core.Collection([1]);
        throws(function () {
            collection.omit([null]);
        });

        //throws if some key (index) is out of bounds
        collection = new xs.core.Collection([1]);
        throws(function () {
            collection.omit([2]);
        });

        //throws if some key (key) is missing
        collection = new xs.core.Collection([1]);
        throws(function () {
            collection.omit(['a']);
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
        correctKeys = '[0]';
        correctValues = '[{"x":1,"y":1}]';

        omitted = collection.omit([
            2,
            0,
            1
        ]);
        strictEqual(JSON.stringify(omitted.keys()), correctKeys);
        strictEqual(JSON.stringify(omitted.values()), correctValues);

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
        correctKeys = '["c"]';
        correctValues = '[{"x":2,"y":1}]';

        omitted = collection.omit([
            'b',
            'a',
            'd'
        ]);
        strictEqual(JSON.stringify(omitted.keys()), correctKeys);
        strictEqual(JSON.stringify(omitted.values()), correctValues);
    });

    test('toSource', function () {
        //init test variables
        var collection;
        //check simple array list
        collection = new xs.core.Collection([
            1,
            3
        ]);
        strictEqual(JSON.stringify(collection.toSource()), '{"0":1,"1":3}');

        //check empty object list
        collection = new xs.core.Collection([]);
        strictEqual(JSON.stringify(collection.toSource()), '{}');

        //check simple object list
        collection = new xs.core.Collection({
            x: 1,
            b: '2'
        });
        strictEqual(JSON.stringify(collection.toSource()), '{"x":1,"b":"2"}');

        //check empty object list
        collection = new xs.core.Collection({});
        strictEqual(JSON.stringify(collection.toSource()), '{}');
    });
});