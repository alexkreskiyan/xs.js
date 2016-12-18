/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.core.Generator', function () {

    'use strict';

    test('create', function () {

        //non-function evaluation throws
        throws(function () {
            return xs.generator();
        });

        throws(function () {
            return xs.generator(null);
        });

        //get generator value
        var generator = xs.generator(function () {
            return 5;
        });

        //generator is xs.core.Generator instance
        strictEqual(generator instanceof xs.core.Generator, true);

        //create function is defined
        strictEqual(generator.hasOwnProperty('create'), true);
        strictEqual(xs.isFunction(generator.create), true);

        //get value
        var value = generator.create();

        //value is fetched
        strictEqual(value, 5);
    });

});