/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.data.attribute.Raw', function () {

    'use strict';

    test('constructor', function () {
        var attribute;

        //config is optional
        attribute = new xs.data.attribute.Raw();
        //default is undefined
        strictEqual(attribute.default, undefined);

        //config must be an object, if given
        throws(function () {
            return new xs.data.attribute.Raw(null);
        });

        //empty config given
        attribute = new xs.data.attribute.Raw({});
        //default is undefined
        strictEqual(attribute.default, undefined);

        //undefined default is accepted
        attribute = new xs.data.attribute.Raw({
            default: undefined
        });

        //default is undefined
        strictEqual(attribute.default, undefined);

        //other value is accepted
        attribute = new xs.data.attribute.Raw({
            default: null
        });

        //default is ok
        strictEqual(attribute.default, null);
    });

    test('get', function () {
        var attribute = new xs.data.attribute.Raw({});

        var x = {
            a: 1
        };

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
        attribute = new xs.data.attribute.Raw({});

        //given value is returned as-is
        strictEqual(attribute.set(x), x);

        //undefined value is defaulted to undefined
        strictEqual(attribute.set(), undefined);


        //attribute with simple default value
        attribute = new xs.data.attribute.Raw({
            default: x
        });

        //given value is returned as-is
        strictEqual(attribute.set(x), x);

        //undefined value is defaulted
        strictEqual(attribute.set(), x);


        //attribute with generator default value
        attribute = new xs.data.attribute.Raw({
            default: xs.generator(function () {

                return new xs.core.Collection();
            })
        });

        //given value is returned as-is
        strictEqual(attribute.set(x), x);

        //undefined value is defaulted to generated one
        strictEqual(attribute.set() instanceof xs.core.Collection, true);
    });

});