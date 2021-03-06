/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.data.attribute.Collection', function () {

    'use strict';

    test('constructor', function () {
        var attribute;

        //config is optional
        attribute = new xs.data.attribute.Collection();
        //default is undefined
        strictEqual(attribute.default, undefined);

        //config must be an object, if given
        throws(function () {
            return new xs.data.attribute.Collection(null);
        });

        //empty config given
        attribute = new xs.data.attribute.Collection({});
        //default is undefined
        strictEqual(attribute.default, undefined);

        //defined, non-generator value is not accepted
        throws(function () {
            return new xs.data.attribute.Collection({
                default: new xs.core.Collection()
            });
        });

        //undefined default is accepted
        attribute = new xs.data.attribute.Collection({
            default: undefined
        });

        //default is undefined
        strictEqual(attribute.default, undefined);

        //generator default is accepted
        attribute = new xs.data.attribute.Collection({
            default: xs.generator(function () {

                return new xs.core.Collection();
            })
        });

        //default is instance of xs.core.Generator
        strictEqual(attribute.default instanceof xs.core.Generator, true);
    });

    test('get', function () {
        var attribute = new xs.data.attribute.Collection({});

        var collection = new xs.core.Collection({
            a: 'c',
            b: 'd'
        });

        var format = xs.data.attribute.Format;


        //undefined is always returned as is
        strictEqual(attribute.get(undefined, format.Raw), undefined);


        //xs.data.attribute.Format.Raw
        //get returns value as is
        strictEqual(attribute.get(collection, format.Raw), collection);


        //xs.data.attribute.Format.Storage
        //get returns value as converted to object without options
        strictEqual(JSON.stringify(attribute.get(collection, format.Storage)), '{"a":"c","b":"d"}');

        //get returns value as is without options.array
        strictEqual(JSON.stringify(attribute.get(collection, format.Storage, {})), '{"a":"c","b":"d"}');

        //options.array must be a boolean
        throws(function () {
            return attribute.get(collection, format.Storage, {
                array: null
            });
        });

        //precision is used to select collection storage format - array or object
        strictEqual(JSON.stringify(attribute.get(collection, format.Storage, {
            array: true
        })), '["c","d"]');
        strictEqual(JSON.stringify(attribute.get(collection, format.Storage, {
            array: false
        })), '{"a":"c","b":"d"}');


        //xs.data.attribute.Format.User
        //get returns value as is
        strictEqual(attribute.get(collection, format.User), collection);

    });

    test('set', function () {
        //init test variables
        var attribute, collection;


        //given value must be iterable
        attribute = new xs.data.attribute.Collection({});
        throws(function () {

            attribute.set(xs.noop);
        });


        //attribute without default value
        attribute = new xs.data.attribute.Collection({});

        //array is converted
        collection = attribute.set([
            1,
            2
        ]);
        strictEqual(collection.keys().toString(), '0,1');
        strictEqual(collection.values().toString(), '1,2');

        //object is converted
        collection = attribute.set({
            a: 1,
            b: 2
        });
        strictEqual(collection.keys().toString(), 'a,b');
        strictEqual(collection.values().toString(), '1,2');

        //undefined value is defaulted to undefined
        strictEqual(attribute.set(), undefined);


        //attribute with generator default value
        attribute = new xs.data.attribute.Raw({
            default: xs.generator(function () {

                return new xs.core.Collection();
            })
        });

        //undefined value is defaulted to generated one
        strictEqual(attribute.set() instanceof xs.core.Collection, true);
    });

});