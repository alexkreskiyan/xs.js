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

        //single argument (as value) may be an object
        collection = new xs.util.Collection({a: 1});
        //values are assigned
        strictEqual(collection.private.items[0].key, 'a');
        strictEqual(collection.private.items[0].value, 1);
        //type is not defined
        strictEqual(collection.private.hasOwnProperty('type'), false);

        //single argument (as value) may be an array
        collection = new xs.util.Collection([1]);
        //values are assigned
        strictEqual(collection.private.items[0].key, 0);
        strictEqual(collection.private.items[0].value, 1);
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
        collection = new xs.util.Collection([1], Number);
        //values are assigned
        strictEqual(collection.private.items[0].key, 0);
        strictEqual(collection.private.items[0].value, 1);
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
            return new xs.util.Collection([new xs.class.Base()], xs.interface.Base);
        });
        //class
        throws(function () {
            return new xs.util.Collection([
                new xs.util.Collection,
                new xs.class.Base()
            ], xs.util.Collection);
        });
    });

});