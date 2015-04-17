/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.util.Collection', function () {

    'use strict';

    test('constructor', function () {
        //init test variables
        var collection;

        //no arguments is normal
        collection = new xs.util.Collection();
        //values are empty
        strictEqual(collection.private.items.length, 0);
        //type is not defined
        strictEqual(collection.private.hasOwnProperty('type'), false);

        //single argument (as value) may be an object
        collection = new xs.util.Collection({
            a: 1
        });
        //values are assigned
        strictEqual(collection.private.items[ 0 ].key, 'a');
        strictEqual(collection.private.items[ 0 ].value, 1);
        //type is not defined
        strictEqual(collection.private.hasOwnProperty('type'), false);

        //single argument (as value) may be an array
        collection = new xs.util.Collection([ 1 ]);
        //values are assigned
        strictEqual(collection.private.items[ 0 ].key, 0);
        strictEqual(collection.private.items[ 0 ].value, 1);
        //type is not defined
        strictEqual(collection.private.hasOwnProperty('type'), false);

        //single argument (as type) may be a function
        collection = new xs.util.Collection(Function);
        //values are empty
        strictEqual(collection.private.items.length, 0);
        //type is assigned
        strictEqual(collection.private.type, Function);

        //otherwise - it's error
        throws(function () {
            return new xs.util.Collection(null);
        });

        //two arguments must be a source and a type
        collection = new xs.util.Collection([ 1 ], Number);
        //values are assigned
        strictEqual(collection.private.items[ 0 ].key, 0);
        strictEqual(collection.private.items[ 0 ].value, 1);
        //type is assigned
        strictEqual(collection.private.type, Number);

        //incorrect initial value must fail
        //primitive
        throws(function () {
            return new xs.util.Collection([
                1,
                'a'
            ], Number);
        });
        //constructor
        throws(function () {
            return new xs.util.Collection([
                [],
                {}
            ], Array);
        });
        //interface
        throws(function () {
            return new xs.util.Collection([ new xs.class.Base() ], xs.interface.Base);
        });
        //class
        throws(function () {
            return new xs.util.Collection([
                new xs.util.Collection(),
                new xs.class.Base()
            ], xs.util.Collection);
        });
    });

    test('size', function () {
        //init test variables
        var collection;

        //check empty array list
        collection = new xs.util.Collection([]);
        strictEqual(collection.size, 0);

        //check array list
        collection = new xs.util.Collection([
            1,
            3
        ]);
        strictEqual(collection.size, 2);

        //check empty object list
        collection = new xs.util.Collection({});
        strictEqual(collection.size, 0);

        //check object list
        collection = new xs.util.Collection({
            a: 1,
            b: 3
        });
        strictEqual(collection.size, 2);
    });

    test('keys', function () {
        //init test variables
        var collection;

        //check simple array list
        collection = new xs.util.Collection([
            1,
            3
        ]);
        strictEqual(JSON.stringify(collection.keys()), '[0,1]');

        //check empty array list
        collection = new xs.util.Collection([]);
        strictEqual(JSON.stringify(collection.keys()), '[]');

        //check simple object list
        collection = new xs.util.Collection({
            x: 1,
            b: 2
        });
        strictEqual(JSON.stringify(collection.keys()), '["x","b"]');

        //check empty object list
        collection = new xs.util.Collection({});
        strictEqual(JSON.stringify(collection.keys()), '[]');
    });

    test('values', function () {
        //init test variables
        var collection;
        //check simple array list
        collection = new xs.util.Collection([
            1,
            3
        ]);
        strictEqual(JSON.stringify(collection.values()), '[1,3]');

        //check empty object list
        collection = new xs.util.Collection([]);
        strictEqual(JSON.stringify(collection.values()), '[]');

        //check simple object list
        collection = new xs.util.Collection({
            x: 1,
            b: '2'
        });
        strictEqual(JSON.stringify(collection.values()), '[1,"2"]');

        //check empty object list
        collection = new xs.util.Collection({});
        strictEqual(JSON.stringify(collection.values()), '[]');
    });

    test('clone', function () {
        //init test variables
        var item = {
            x: 1
        };
        var collection, clone;

        //test array list
        collection = new xs.util.Collection([
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
        strictEqual(collection.private.items[ 2 ].value === clone.private.items[ 2 ].value, true);

        //test object list
        collection = new xs.util.Collection({
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
        strictEqual(collection.private.items[ 2 ].value === clone.private.items[ 2 ].value, true);
    });

    test('hasKey', function () {
        //init test variables
        var collection;

        //check key processing
        collection = new xs.util.Collection([
            1,
            3
        ]);
        throws(function () {
            collection.hasKey([]);
        });

        //check simple array list
        collection = new xs.util.Collection([
            1,
            3
        ]);
        strictEqual(collection.hasKey(0), true);
        strictEqual(collection.hasKey(1), true);
        strictEqual(collection.hasKey(2), false);

        //check empty array list
        collection = new xs.util.Collection([]);
        strictEqual(collection.hasKey(0), false);
        strictEqual(collection.hasKey(1), false);
        strictEqual(collection.hasKey(2), false);

        //check simple object list
        collection = new xs.util.Collection({
            x: 1,
            b: 2
        });
        strictEqual(collection.hasKey('x'), true);
        strictEqual(collection.hasKey('y'), false);

        //check empty object list
        collection = new xs.util.Collection({});
        strictEqual(collection.hasKey('x'), false);
        strictEqual(collection.hasKey('y'), false);
    });

    test('has', function () {
        //init test variables
        var collection;
        var item = {
            a: 1
        };

        //test array list
        collection = new xs.util.Collection([
            1,
            3,
            item
        ]);
        strictEqual(collection.has(1), true);
        strictEqual(collection.has(item), true);
        strictEqual(collection.has('A'), false);

        //test empty array list
        collection = new xs.util.Collection([]);
        strictEqual(collection.has(1), false);
        strictEqual(collection.has('A'), false);

        //test object list
        collection = new xs.util.Collection({
            x: 1,
            b: 2,
            a: item
        });
        strictEqual(collection.has(1), true);
        strictEqual(collection.has(item), true);
        strictEqual(collection.has('1'), false);

        //test empty object list
        collection = new xs.util.Collection({});
        strictEqual(collection.has(1), false);
        strictEqual(collection.has('1'), false);

        //test typed list
        collection = new xs.util.Collection([
            1,
            3
        ], Number);
        throws(function () {
            collection.has('a');
        });
        strictEqual(collection.has(1), true);
    });

    test('keyOf', function () {
        //init test variables
        var collection;
        var item = {
            a: 1
        };

        //test array list
        collection = new xs.util.Collection([
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
        strictEqual(collection.keyOf(item, xs.util.Collection.Reverse), 5);
        strictEqual(collection.keyOf('1'), undefined);

        //test empty array list
        collection = new xs.util.Collection([]);
        strictEqual(collection.keyOf(0), undefined);
        strictEqual(collection.keyOf('0'), undefined);

        //test object list
        collection = new xs.util.Collection({
            x: 1,
            y: 1,
            c: 2,
            d: 2,
            a: item,
            b: item
        });
        strictEqual(collection.keyOf(1), 'x');
        strictEqual(collection.keyOf(item), 'a');
        strictEqual(collection.keyOf(item, xs.util.Collection.Reverse), 'b');
        strictEqual(collection.keyOf('1'), undefined);

        //test empty object list
        collection = new xs.util.Collection({});
        strictEqual(collection.keyOf(1), undefined);
        strictEqual(collection.keyOf('1'), undefined);

        //test typed list
        collection = new xs.util.Collection([
            1,
            3
        ], Number);
        throws(function () {
            collection.keyOf('a');
        });
        strictEqual(collection.keyOf(1), 0);
    });

    test('at', function () {
        //init test variables
        var collection;

        //check collection filled
        collection = new xs.util.Collection();
        throws(function () {
            collection.at(0);
        });

        //check key processing
        collection = new xs.util.Collection([
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
        collection = new xs.util.Collection([
            1,
            3
        ]);
        strictEqual(collection.at(0), 1);
        strictEqual(collection.at(1), 3);

        //check simple object list
        collection = new xs.util.Collection({
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
        collection = new xs.util.Collection([]);
        throws(function () {
            collection.first();
        });

        //test array list
        collection = new xs.util.Collection([
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
        collection = new xs.util.Collection({
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
        collection = new xs.util.Collection([]);
        throws(function () {
            collection.last();
        });

        //test array list
        collection = new xs.util.Collection([
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
        collection = new xs.util.Collection({
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
        var collection;
        var x = {
            x: 1,
            y: 2
        };

        //check object collection error handling
        collection = new xs.util.Collection({});
        //throws if no arguments
        throws(function () {
            collection.add();
        });
        //throws if key is not a string
        throws(function () {
            collection.add(1, 1);
        });
        //throws if adding with existent key
        throws(function () {
            collection.add('1', 1);
            collection.add('1', '1');
        });

        //complex test
        collection = new xs.util.Collection();
        collection.add(x);
        strictEqual(collection.last(), x);
        strictEqual(collection.at(0), x);
        collection.add('a', 3);
        strictEqual(collection.last(), 3);
        strictEqual(collection.at('a'), 3);


        //test typed list
        collection = new xs.util.Collection(Number);
        throws(function () {
            collection.add('a');
        });
        collection.add(1);
        strictEqual(collection.last(), 1);
        strictEqual(collection.at(0), 1);
        collection.add('a', 3);
        strictEqual(collection.last(), 3);
        strictEqual(collection.at('a'), 3);


        //test events
        collection = new xs.util.Collection(Number);

        var log = {
            addBefore: [],
            add: []
        };

        //add:before - add only values, that are greater than five
        collection.events.on(xs.util.collection.event.AddBefore, function (event) {
            log.addBefore.push(event.value + ':' + event.key + ':' + event.index);

            return event.value > 5 && event.value < 10;
        });

        //add - post-processing added values
        collection.events.on(xs.util.collection.event.Add, function (event) {
            log.add.push(event.value + ':' + event.key + ':' + event.index);
        });

        collection.add('a', 4);
        collection.add('b', 6);
        collection.add('c', 6);
        collection.add('d', 8);
        collection.add('e', 8);
        collection.add('f', 8);
        collection.add('g', 10);
        strictEqual(JSON.stringify(collection.toSource()), '{"b":6,"c":6,"d":8,"e":8,"f":8}');

        strictEqual(JSON.stringify(log.addBefore), JSON.stringify([
            '4:a:0',
            '6:b:0',
            '6:c:1',
            '8:d:2',
            '8:e:3',
            '8:f:4',
            '10:g:5'
        ]));

        strictEqual(JSON.stringify(log.add), JSON.stringify([
            '6:b:0',
            '6:c:1',
            '8:d:2',
            '8:e:3',
            '8:f:4'
        ]));
    });

    test('insert', function () {
        //init test variables
        var collection;
        var x = {
            x: 1
        };

        //check object collection error handling
        collection = new xs.util.Collection();
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
        collection = new xs.util.Collection({
            a: 1
        });
        throws(function () {
            collection.insert(0, 'a', 1);
        });

        //complex test
        collection = new xs.util.Collection();
        collection.insert(0, x);
        strictEqual(collection.last(), x);
        strictEqual(collection.at(0), x);
        collection.insert(0, 'a', 2);
        strictEqual(collection.first(), 2);
        strictEqual(collection.at('a'), 2);
        collection.insert(-1, 'b', 3);
        strictEqual(collection.keys().toString(), 'a,b,2');
        strictEqual(collection.at('b'), 3);

        //test typed list
        collection = new xs.util.Collection(Number);
        throws(function () {
            collection.insert(0, 'a');
        });
        collection.insert(0, 3);
        strictEqual(collection.last(), 3);
        strictEqual(collection.at(0), 3);
        collection.insert(0, 2);
        strictEqual(collection.first(), 2);
        strictEqual(collection.at(0), 2);
        collection.insert(-1, 1);
        strictEqual(collection.values().toString(), '2,1,3');
        strictEqual(collection.at(-1), 3);


        //test events
        collection = new xs.util.Collection(Number);

        var log = {
            addBefore: [],
            add: []
        };

        //add:before - insert only values, that are greater than five
        collection.events.on(xs.util.collection.event.AddBefore, function (event) {
            log.addBefore.push(event.value + ':' + event.key + ':' + event.index);

            return event.value > 5 && event.value < 10;
        });

        //add - post-processing inserted values
        collection.events.on(xs.util.collection.event.Add, function (event) {
            log.add.push(event.value + ':' + event.key + ':' + event.index);
        });

        collection.insert(0, 'a', 4);
        collection.insert(0, 'b', 6);
        collection.insert(1, 'c', 6);
        collection.insert(-1, 'd', 8);
        collection.insert(2, 'e', 8);
        collection.insert(-3, 'f', 8);
        collection.insert(4, 'g', 10);
        strictEqual(JSON.stringify(collection.toSource()), '{"b":6,"f":8,"d":8,"e":8,"c":6}');

        strictEqual(JSON.stringify(log.addBefore), JSON.stringify([
            '4:a:0',
            '6:b:0',
            '6:c:1',
            '8:d:1',
            '8:e:2',
            '8:f:1',
            '10:g:4'
        ]));

        strictEqual(JSON.stringify(log.add), JSON.stringify([
            '6:b:0',
            '6:c:1',
            '8:d:1',
            '8:e:2',
            '8:f:1'
        ]));
    });

    test('set', function () {
        //init test variables
        var collection;
        var x = {
            x: 1
        };

        //check object collection error handling
        collection = new xs.util.Collection();
        //throws if not enough arguments
        throws(function () {
            collection.set(1);
        });
        //throws if key is incorrect
        throws(function () {
            collection.set([], 1);
        });

        //throws if key (index) not in bounds
        collection = new xs.util.Collection([ 1 ]);
        throws(function () {
            collection.set(1, 1);
        });

        //throws if key (key) is missing
        collection = new xs.util.Collection({
            a: 1
        });
        throws(function () {
            collection.set('b', 1);
        });

        //complex test
        collection = new xs.util.Collection();
        collection.add('a', x);
        strictEqual(collection.at(0), x);
        collection.set(0, 2);
        strictEqual(collection.first(), 2);
        strictEqual(collection.keyOf(2), 'a');
        collection.set('a', 5);
        strictEqual(collection.at('a'), 5);

        //test typed list
        collection = new xs.util.Collection(Number);
        collection.add('a', 5);
        throws(function () {
            collection.set(0, 'b');
        });
        strictEqual(collection.at(0), 5);
        collection.set(0, 2);
        strictEqual(collection.first(), 2);
        strictEqual(collection.keyOf(2), 'a');
        collection.set('a', 4);
        strictEqual(collection.at('a'), 4);


        //test events
        collection = new xs.util.Collection({
            a: 10,
            b: 8,
            c: 7,
            d: 8,
            e: 6,
            f: 4,
            g: 5
        }, Number);

        var log = {
            setBefore: [],
            set: []
        };

        //set:before - set only values, that are greater than five
        collection.events.on(xs.util.collection.event.SetBefore, function (event) {
            log.setBefore.push(event.old + ':' + event.new + ':' + event.key + ':' + event.index);

            return event.new > 5 && event.new < 10;
        });

        //set - post-processing of set values
        collection.events.on(xs.util.collection.event.Set, function (event) {
            log.set.push(event.old + ':' + event.new + ':' + event.key + ':' + event.index);
        });

        collection.set('c', 6);
        collection.set('a', 3);
        collection.set('d', 6);
        collection.set('g', 10);
        collection.set('b', 5);
        collection.set('f', 8);
        collection.set('e', 8);
        strictEqual(JSON.stringify(collection.toSource()), '{"a":10,"b":8,"c":6,"d":6,"e":8,"f":8,"g":5}');

        strictEqual(JSON.stringify(log.setBefore), JSON.stringify([
            '7:6:c:2',
            '10:3:a:0',
            '8:6:d:3',
            '5:10:g:6',
            '8:5:b:1',
            '4:8:f:5',
            '6:8:e:4'
        ]));

        strictEqual(JSON.stringify(log.set), JSON.stringify([
            '7:6:c:2',
            '8:6:d:3',
            '4:8:f:5',
            '6:8:e:4'
        ]));
    });

    test('removeAt', function () {
        //init test variables
        var collection;

        //check object collection error handling
        collection = new xs.util.Collection();
        //throws if key is incorrect
        throws(function () {
            collection.removeAt([]);
        });

        //throws if key (index) not in bounds
        collection = new xs.util.Collection([ 1 ]);
        throws(function () {
            collection.removeAt(1);
        });

        //throws if key (key) is missing
        collection = new xs.util.Collection({
            a: 1
        });
        throws(function () {
            collection.removeAt('b');
        });

        //test array
        collection = new xs.util.Collection([
            1,
            3,
            2
        ]);

        collection.removeAt(1);
        strictEqual(collection.values().toString(), '1,2');

        //test object
        collection = new xs.util.Collection({
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


        //test events
        collection = new xs.util.Collection({
            a: 4,
            b: 6,
            c: 6,
            d: 8,
            e: 8,
            f: 8,
            g: 10
        }, Number);

        var str = '';

        var log = {
            removeBefore: [],
            remove: []
        };

        //remove:before - remove only values, that are greater than five
        collection.events.on(xs.util.collection.event.RemoveBefore, function (event) {
            log.removeBefore.push(event.value + ':' + event.key + ':' + event.index);

            return event.value > 5 && event.value < 10;
        });

        //remove - post-processing removed values
        collection.events.on(xs.util.collection.event.Remove, function (event) {
            log.remove.push(event.value + ':' + event.key + ':' + event.index);

            str += event.value + event.key + event.index + ':';
        });

        //clear - when all items removed
        collection.events.on(xs.util.collection.event.Clear, function () {
            str += '!!!';
        });

        collection.removeAt(5);
        collection.removeAt(1);
        collection.removeAt(4);
        collection.removeAt(0);
        collection.removeAt(2);
        collection.removeAt(0);
        collection.removeAt(0);
        strictEqual(JSON.stringify(collection.toSource()), '{"a":4,"c":6,"e":8,"g":10}');

        strictEqual(str, '8f5:6b1:8d2:');

        strictEqual(JSON.stringify(log.removeBefore), JSON.stringify([
            '8:f:5',
            '6:b:1',
            '10:g:4',
            '4:a:0',
            '8:d:2',
            '4:a:0',
            '4:a:0'
        ]));

        strictEqual(JSON.stringify(log.remove), JSON.stringify([
            '8:f:5',
            '6:b:1',
            '8:d:2'
        ]));
    });

    test('remove', function () {
        //init test variables
        var item = {
            x: 1
        };
        var itemString = JSON.stringify(item);
        var collection;

        //check object collection error handling
        collection = new xs.util.Collection();
        //throws if flags given and are incorrect
        throws(function () {
            collection.remove([], null);
        });

        //throws if value missing in array
        collection = new xs.util.Collection();
        throws(function () {
            collection.remove([]);
        });

        //test array
        collection = new xs.util.Collection([
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

        collection.remove(item, xs.util.Collection.Reverse);
        strictEqual(JSON.stringify(collection.keys()), '[0,1,2,3,4,5]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,' + itemString + ',2,' + itemString + ',2]');

        collection.remove(item, xs.util.Collection.All);
        strictEqual(JSON.stringify(collection.keys()), '[0,1,2,3]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,2,2]');

        collection = new xs.util.Collection({
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

        collection.remove(item, xs.util.Collection.Reverse);
        strictEqual(JSON.stringify(collection.keys()), '["a","c","d","e","f","g"]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,' + itemString + ',2,' + itemString + ',2]');

        collection.remove(item, xs.util.Collection.All);
        strictEqual(JSON.stringify(collection.keys()), '["a","c","e","g"]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,2,2]');

        //test typed list
        collection = new xs.util.Collection([
            1,
            2,
            3
        ], Number);
        throws(function () {
            collection.remove('b');
        });
        collection.remove(2);
        strictEqual(JSON.stringify(collection.values()), '[1,3]');


        //test events
        collection = new xs.util.Collection({
            a: 4,
            b: 6,
            c: 6,
            d: 8,
            e: 8,
            f: 8,
            g: 10
        }, Number);

        var str = '';

        var log = {
            removeBefore: [],
            remove: []
        };

        //remove:before - remove only values, that are greater than five
        collection.events.on(xs.util.collection.event.RemoveBefore, function (event) {
            log.removeBefore.push(event.value + ':' + event.key + ':' + event.index);

            return event.value > 5 && event.value < 10;
        });

        //remove - post-processing removed values
        collection.events.on(xs.util.collection.event.Remove, function (event) {
            log.remove.push(event.value + ':' + event.key + ':' + event.index);

            str += event.value + event.key + event.index + ':';
        });

        //clear - when all items removed
        collection.events.on(xs.util.collection.event.Clear, function () {
            str += '!!!';
        });

        collection.remove(4, xs.util.Collection.All);
        collection.remove(6, xs.util.Collection.All);
        collection.remove(8);
        collection.remove(8, xs.util.Collection.Reverse);
        collection.remove(10);
        strictEqual(JSON.stringify(collection.toSource()), '{"a":4,"e":8,"g":10}');

        //off event.RemoveBefore and event.Remove
        collection.events.off(xs.util.collection.event.RemoveBefore);
        collection.events.off(xs.util.collection.event.Remove);
        collection.remove();

        strictEqual(str, '6b1:6c1:8d1:8f2:!!!');

        strictEqual(JSON.stringify(log.removeBefore), JSON.stringify([
            '4:a:0',
            '6:b:1',
            '6:c:1',
            '8:d:1',
            '8:f:2',
            '10:g:2'
        ]));

        strictEqual(JSON.stringify(log.remove), JSON.stringify([
            '6:b:1',
            '6:c:1',
            '8:d:1',
            '8:f:2'
        ]));
    });

    test('removeBy', function () {
        //init test variables
        var item = {
            x: 1
        };
        var itemString = JSON.stringify(item);
        var collection;

        //throws if fn is not array
        collection = new xs.util.Collection();
        throws(function () {
            collection.removeBy([]);
        });

        //throws if flags given and are incorrect
        throws(function () {
            collection.remove([], null);
        });

        //test array
        collection = new xs.util.Collection([
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
        }, xs.util.Collection.Reverse);
        strictEqual(JSON.stringify(collection.keys()), '[0,1,2,3,4,5]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,' + itemString + ',2,' + itemString + ',2]');

        collection.removeBy(function (value) {
            return value === item;
        }, xs.util.Collection.All);
        strictEqual(JSON.stringify(collection.keys()), '[0,1,2,3]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,2,2]');

        collection = new xs.util.Collection({
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
        }, xs.util.Collection.Reverse);
        strictEqual(JSON.stringify(collection.keys()), '["a","c","d","e","f","g"]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,' + itemString + ',2,' + itemString + ',2]');

        collection.removeBy(function (value) {
            return value === item;
        }, xs.util.Collection.All);
        strictEqual(JSON.stringify(collection.keys()), '["a","c","e","g"]');
        strictEqual(JSON.stringify(collection.values()), '[3,3,2,2]');


        //test events
        collection = new xs.util.Collection({
            a: 4,
            b: 6,
            c: 6,
            d: 8,
            e: 8,
            f: 8,
            g: 10
        }, Number);

        var str = '';

        var log = {
            removeBefore: [],
            remove: []
        };

        //remove:before - remove only values, that are greater than five
        collection.events.on(xs.util.collection.event.RemoveBefore, function (event) {
            log.removeBefore.push(event.value + ':' + event.key + ':' + event.index);

            return event.value > 5 && event.value < 10;
        });

        //remove - post-processing removed values
        collection.events.on(xs.util.collection.event.Remove, function (event) {
            log.remove.push(event.value + ':' + event.key + ':' + event.index);

            str += event.value + event.key + event.index + ':';
        });

        //clear - when all items removed
        collection.events.on(xs.util.collection.event.Clear, function () {
            str += '!!!';
        });

        collection.removeBy(function (value) {
            return value === 4;
        }, xs.util.Collection.All);
        collection.removeBy(function (value) {
            return value === 6;
        }, xs.util.Collection.All);
        collection.removeBy(function (value) {
            return value === 8;
        });
        collection.removeBy(function (value) {
            return value === 8;
        }, xs.util.Collection.Reverse);
        collection.removeBy(function (value) {
            return value === 10;
        });
        strictEqual(JSON.stringify(collection.toSource()), '{"a":4,"e":8,"g":10}');

        //off event.RemoveBefore and event.Remove
        collection.events.off(xs.util.collection.event.RemoveBefore);
        collection.events.off(xs.util.collection.event.Remove);
        collection.removeBy(function () {
            return true;
        }, xs.util.Collection.All);

        strictEqual(str, '6b1:6c1:8d1:8f2:!!!');

        strictEqual(JSON.stringify(log.removeBefore), JSON.stringify([
            '4:a:0',
            '6:b:1',
            '6:c:1',
            '8:d:1',
            '8:f:2',
            '10:g:2'
        ]));

        strictEqual(JSON.stringify(log.remove), JSON.stringify([
            '6:b:1',
            '6:c:1',
            '8:d:1',
            '8:f:2'
        ]));
    });

    test('each', function () {
        //init test variables
        var collection, sum;

        //throws if fn is not a function
        collection = new xs.util.Collection();
        throws(function () {
            collection.each(null);
        });

        //throws if flags given and are incorrect
        throws(function () {
            collection.each(xs.noop, null);
        });

        //test array
        collection = new xs.util.Collection([
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
        }, xs.util.Collection.Reverse);
        strictEqual(sum, '21');

        //test empty array
        collection = new xs.util.Collection([]);
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
        }, xs.util.Collection.Reverse);
        strictEqual(sum, '');

        //test object
        collection = new xs.util.Collection({
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
        }, xs.util.Collection.Reverse);
        strictEqual(sum, '21');

        //test empty object
        collection = new xs.util.Collection({});
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
        }, xs.util.Collection.Reverse);
        strictEqual(sum, '');
    });

    test('find', function () {
        //init test variables
        var collection, found;

        //throws if fn is not a function
        collection = new xs.util.Collection();
        throws(function () {
            collection.find(null);
        });

        //throws if flags given and are incorrect
        throws(function () {
            collection.find(xs.noop, null);
        });

        var scope = {
            sum: function (x, y) {
                return x + y;
            },
            first: function (x) {
                return x[ 0 ];
            }
        };

        //for Array
        collection = new xs.util.Collection([
            {
                x: 2
            },
            {
                x: 2
            },
            {
                x: 0
            }
        ]);
        //direct
        found = collection.find(function (value, key) {
            return this.sum(key, value.x) === 2;
        }, 0, scope);
        strictEqual(found, collection.at(0));
        //reverse
        found = collection.find(function (value, key) {
            return this.sum(key, value.x) === 2;
        }, xs.util.Collection.Reverse, scope);
        strictEqual(found, collection.at(2));
        //all
        found = collection.find(function (value, key) {
            return this.sum(key, value.x) >= 2;
        }, xs.util.Collection.All, scope);
        strictEqual(found.at(0), collection.at(0));
        strictEqual(found.at(1), collection.at(1));
        strictEqual(found.at(2), collection.at(2));

        //for Object
        collection = new xs.util.Collection({
            aa: {
                x: 1
            },
            c: {
                x: 2
            },
            ab: {
                x: 3
            }
        });
        //direct
        found = collection.find(function (value, key) {
            return this.first(key) === 'a';
        }, 0, scope);
        strictEqual(found, collection.at('aa'));
        //reverse
        found = collection.find(function (value, key) {
            return this.first(key) === 'a';
        }, xs.util.Collection.Reverse, scope);
        strictEqual(found, collection.at('ab'));
        //all
        found = collection.find(function (value, key) {
            return this.first(key) === 'a';
        }, xs.util.Collection.All, scope);
        strictEqual(found.at('aa'), collection.at('aa'));
        strictEqual(found.at('ab'), collection.at('ab'));
    });

    test('map', function () {
        //init test variables
        var collection, map;
        var scope = {
            twice: function (x) {
                return x * 2;
            }
        };

        //throws if fn is not a function
        collection = new xs.util.Collection();
        throws(function () {
            collection.map(null);
        });

        //for Array
        collection = new xs.util.Collection([
            1,
            2,
            4
        ]);
        map = collection.map(function (value, key) {
            return key + this.twice(value);
        }, scope);
        strictEqual(JSON.stringify(map.values()), '[2,5,10]');

        //for Object
        collection = new xs.util.Collection({
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

        //throws if fn is not a function
        collection = new xs.util.Collection();
        throws(function () {
            collection.reduce(null);
        });

        //throws if flags given and are incorrect
        throws(function () {
            collection.reduce(xs.noop, null);
        });

        //test array list
        collection = new xs.util.Collection([
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
        }, xs.util.Collection.Reverse), 27);
        strictEqual(collection.reduce(function (memo, value, name) {
            return memo + 2 * value + name;
        }, xs.util.Collection.Reverse, undefined, -3), 30);

        //test object
        collection = new xs.util.Collection({
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
        }, xs.util.Collection.Reverse), '7b2x');
        strictEqual(collection.reduce(function (memo, value, name) {
            return memo + 2 * value + name;
        }, xs.util.Collection.Reverse, undefined, -3), '3a4b2x');
    });

    test('some', function () {
        //init test variables
        var collection;

        //throws if collection is empty
        collection = new xs.util.Collection();
        throws(function () {
            collection.some();
        });

        //throws if fn is not a function
        collection = new xs.util.Collection([ 1 ]);
        throws(function () {
            collection.some(null);
        });

        //throws if count is not a number
        collection = new xs.util.Collection([ 1 ]);
        throws(function () {
            collection.some(xs.noop, 'a');
        });

        //throws if count is out of bounds
        collection = new xs.util.Collection([ 1 ]);
        throws(function () {
            collection.some(xs.noop, 2);
        });

        //test array list
        collection = new xs.util.Collection([
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
        collection = new xs.util.Collection({
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

    test('all', function () {
        //init test variables
        var collection;

        //throws if collection is empty
        collection = new xs.util.Collection();
        throws(function () {
            collection.all();
        });

        //throws if fn is not a function
        collection = new xs.util.Collection([ 1 ]);
        throws(function () {
            collection.all(null);
        });

        //test array list
        collection = new xs.util.Collection([
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
        strictEqual(collection.all(function (value) {
            return value.x === 1;
        }), false);
        //positive
        strictEqual(collection.all(function (value) {
            return value.x === 1 || value.x === 2;
        }), true);


        //test object list
        collection = new xs.util.Collection({
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
        strictEqual(collection.all(function (value) {
            return value.x === 1;
        }), false);
        //positive
        strictEqual(collection.all(function (value) {
            return value.x === 1 || value.x === 2;
        }), true);
    });

    test('none', function () {
        //init test variables
        var collection;

        //throws if collection is empty
        collection = new xs.util.Collection();
        throws(function () {
            collection.none();
        });

        //throws if fn is not a function
        collection = new xs.util.Collection([ 1 ]);
        throws(function () {
            collection.none(null);
        });

        //test array list
        collection = new xs.util.Collection([
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
        strictEqual(collection.none(function (value) {
            return value.x === 1 && value.y === 1;
        }), false);
        //positive
        strictEqual(collection.none(function (value) {
            return value.x === 1 && value.y === 3;
        }), true);


        //test object list
        collection = new xs.util.Collection({
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
        strictEqual(collection.none(function (value) {
            return value.x === 1 && value.y === 1;
        }), false);
        //positive
        strictEqual(collection.none(function (value) {
            return value.x === 1 && value.y === 3;
        }), true);
    });

    test('pick', function () {
        //init test variables
        var collection, picked, correctKeys, correctValues;

        //throws if keys list is not an array
        collection = new xs.util.Collection([ 1 ]);
        throws(function () {
            collection.pick();
        });

        //throws if some key is neither object nor string
        collection = new xs.util.Collection([ 1 ]);
        throws(function () {
            collection.pick([ null ]);
        });

        //throws if some key (index) is out of bounds
        collection = new xs.util.Collection([ 1 ]);
        throws(function () {
            collection.pick([ 2 ]);
        });

        //throws if some key (key) is missing
        collection = new xs.util.Collection([ 1 ]);
        throws(function () {
            collection.pick([ 'a' ]);
        });

        //test array list
        collection = new xs.util.Collection([
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
        collection = new xs.util.Collection({
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
        collection = new xs.util.Collection([ 1 ]);
        throws(function () {
            collection.omit();
        });

        //throws if some key is neither object nor string
        collection = new xs.util.Collection([ 1 ]);
        throws(function () {
            collection.omit([ null ]);
        });

        //throws if some key (index) is out of bounds
        collection = new xs.util.Collection([ 1 ]);
        throws(function () {
            collection.omit([ 2 ]);
        });

        //throws if some key (key) is missing
        collection = new xs.util.Collection([ 1 ]);
        throws(function () {
            collection.omit([ 'a' ]);
        });

        //test array list
        collection = new xs.util.Collection([
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
        collection = new xs.util.Collection({
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
        collection = new xs.util.Collection([
            1,
            3
        ]);
        strictEqual(JSON.stringify(collection.toSource()), '{"0":1,"1":3}');

        //check empty object list
        collection = new xs.util.Collection([]);
        strictEqual(JSON.stringify(collection.toSource()), '{}');

        //check simple object list
        collection = new xs.util.Collection({
            x: 1,
            b: '2'
        });
        strictEqual(JSON.stringify(collection.toSource()), '{"x":1,"b":"2"}');

        //check empty object list
        collection = new xs.util.Collection({});
        strictEqual(JSON.stringify(collection.toSource()), '{}');
    });

});