/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.data.attribute.String', function () {

    'use strict';

    test('constructor', function () {
        var attribute;

        //config is optional
        attribute = new xs.data.attribute.String();
        //default is undefined
        strictEqual(attribute.default, undefined);

        //config must be an object, if given
        throws(function () {
            return new xs.data.attribute.String(null);
        });

        //empty config given
        attribute = new xs.data.attribute.String({});
        //default is undefined
        strictEqual(attribute.default, undefined);

        //defined, non-String value is not accepted
        throws(function () {
            return new xs.data.attribute.String({
                default: 5
            });
        });

        //undefined default is accepted
        attribute = new xs.data.attribute.String({
            default: undefined
        });

        //default is undefined
        strictEqual(attribute.default, undefined);

        //String default is accepted
        attribute = new xs.data.attribute.String({
            default: 'a'
        });

        //default is ok
        strictEqual(attribute.default, 'a');
    });

    test('get', function () {
        var attribute = new xs.data.attribute.String({});

        var x = 'a';

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
        attribute = new xs.data.attribute.String({});

        //given value is converted
        strictEqual(attribute.set(x), '[object Object]');

        //undefined value is defaulted to undefined
        strictEqual(attribute.set(), undefined);


        //attribute with simple default value
        attribute = new xs.data.attribute.String({
            default: 'true'
        });

        //given value is returned as-is
        strictEqual(attribute.set(false), 'false');

        //undefined value is defaulted
        strictEqual(attribute.set(), 'true');
    });

});