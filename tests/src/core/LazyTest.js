/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.core.Lazy', function () {

    'use strict';

    test('get', function () {

        //non-function evaluation throws
        throws(function () {
            return xs.lazy();
        });

        throws(function () {
            return xs.lazy(null);
        });

        //get lazy value
        var lazy = xs.lazy(function () {
            return 5;
        });

        //v is xs.core.Lazy instance
        strictEqual(lazy instanceof xs.core.Lazy, true);

        //get function is defined
        strictEqual(lazy.hasOwnProperty('get'), true);
        strictEqual(xs.isFunction(lazy.get), true);

        //get value
        var value = lazy.get();

        //get function is removed
        strictEqual(lazy.hasOwnProperty('get'), false);

        //value is fetched
        strictEqual(value, 5);
    });

});