/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.data.attribute.Boolean', function () {

    'use strict';

    test('constructor', function () {
        //config is required
        throws(function () {
            return new xs.data.attribute.Boolean();
        });

        //config must be an object
        throws(function () {
            return new xs.data.attribute.Boolean(null);
        });
    });

    test('get', function () {
        var attribute = new xs.data.attribute.Boolean({});

        var x = true;

        //get returns value as is
        strictEqual(attribute.get(x), x);
    });

    test('set', function () {
        //init test variable
        var attribute;
        var x = {
            a: 1
        };


        //attribute without default value
        attribute = new xs.data.attribute.Boolean({});

        //given value is converted
        strictEqual(attribute.set(x), true);

        //undefined value is defaulted to undefined
        strictEqual(attribute.set(), undefined);


        //attribute with simple default value
        attribute = new xs.data.attribute.Boolean({
            default: true
        });

        //given value is returned as-is
        strictEqual(attribute.set(false), false);

        //undefined value is defaulted
        strictEqual(attribute.set(), true);
    });

});