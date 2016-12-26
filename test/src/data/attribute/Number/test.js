/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.data.attribute.Number', function () {

    'use strict';

    test('constructor', function () {
        var attribute;

        //config is optional
        attribute = new xs.data.attribute.Number();
        //default is undefined
        strictEqual(attribute.default, undefined);

        //config must be an object, if given
        throws(function () {
            return new xs.data.attribute.Number(null);
        });

        //empty config given
        attribute = new xs.data.attribute.Number({});
        //default is undefined
        strictEqual(attribute.default, undefined);

        //defined, non-number value is not accepted
        throws(function () {
            return new xs.data.attribute.Number({
                default: '5'
            });
        });

        //undefined default is accepted
        attribute = new xs.data.attribute.Number({
            default: undefined
        });

        //default is undefined
        strictEqual(attribute.default, undefined);

        //number default is accepted
        attribute = new xs.data.attribute.Number({
            default: 0
        });

        //default is ok
        strictEqual(attribute.default, 0);
    });

    test('get', function () {
        var attribute = new xs.data.attribute.Number({});

        var x = 5;
        var format = xs.data.attribute.Format;


        //undefined is always returned as is
        strictEqual(attribute.get(undefined, format.Raw), undefined);


        //xs.data.attribute.Format.Raw
        //get returns value as is
        strictEqual(attribute.get(x, format.Raw), x);


        //xs.data.attribute.Format.Storage
        //get returns value as is
        strictEqual(attribute.get(x, format.Storage), x);


        //xs.data.attribute.Format.User
        //get returns value as is without options
        strictEqual(attribute.get(x, format.User), x);

        //get returns value as is without options.precision
        strictEqual(attribute.get(x, format.User, {}), x);

        //options.precision must be a number
        throws(function () {
            return attribute.get(x, format.User, {
                precision: null
            });
        });

        //precision is used to remove valueless digits in floating value
        strictEqual(attribute.get(5.56413, format.User, {
            precision: 2
        }), 5.56);

    });

    test('set', function () {
        //init test variable
        var attribute;


        //given value must be numeric
        attribute = new xs.data.attribute.Number({});
        throws(function () {

            attribute.set('a');
        });


        //attribute without default value
        attribute = new xs.data.attribute.Number({});

        //numeric value is converted
        strictEqual(attribute.set('1'), 1);

        //number is returned as is
        strictEqual(attribute.set(5), 5);

        //undefined value is defaulted to undefined
        strictEqual(attribute.set(), undefined);


        //attribute with simple default value
        attribute = new xs.data.attribute.Number({
            default: 3
        });

        //numeric value is converted
        strictEqual(attribute.set('1'), 1);

        //number is returned as is
        strictEqual(attribute.set(5), 5);

        //undefined value is defaulted
        strictEqual(attribute.set(), 3);
    });

});