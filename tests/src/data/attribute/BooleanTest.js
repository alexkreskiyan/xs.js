/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.data.attribute.Boolean', function () {

    'use strict';

    test('constructor', function () {
        var attribute;

        //config is optional
        attribute = new xs.data.attribute.Boolean();
        //default is undefined
        strictEqual(attribute.default, undefined);

        //config must be an object, if given
        throws(function () {
            return new xs.data.attribute.Boolean(null);
        });

        //empty config given
        attribute = new xs.data.attribute.Boolean({});
        //default is undefined
        strictEqual(attribute.default, undefined);

        //defined, non-boolean value is not accepted
        throws(function () {
            return new xs.data.attribute.Boolean({
                default: null
            });
        });

        //undefined default is accepted
        attribute = new xs.data.attribute.Boolean({
            default: undefined
        });

        //default is undefined
        strictEqual(attribute.default, undefined);

        //boolean default is accepted
        attribute = new xs.data.attribute.Boolean({
            default: false
        });

        //default is ok
        strictEqual(attribute.default, false);
    });

    test('get', function () {
        var attribute = new xs.data.attribute.Boolean({});
        var x;

        //defined, non-boolean value is not accepted
        throws(function () {
            return attribute.get(null);
        });

        //get returns value as is - undefined
        x = undefined;
        strictEqual(attribute.get(x), x);

        //get returns value as is - boolean
        x = true;
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