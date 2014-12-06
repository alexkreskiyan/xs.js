/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
require([
    'xs.lang.Type',
    'xs.lang.List',
    'xs.lang.Object'
], function () {

    'use strict';

    module('xs.lang.Object');

    test('extend', function () {
        //init test data
        var a = { a: 1 };
        var b = { b: 1 };
        var c = { c: 1 };
        var x = {
            a: a,
            b: b,
            c: c,
            d: 1,
            e: xs.clone(a)
        };

        //extend
        xs.extend(x, { a: b }, 3, [
            4,
            5
        ], { b: 1 }, { e: a });

        //check replacements
        strictEqual(x.a, b);
        strictEqual(x.b, 1);
        strictEqual(x.c, c);
        strictEqual(x.d, 1);
        strictEqual(x.e, a);
    });
});