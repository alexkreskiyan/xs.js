/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.lang.List', function () {

    'use strict';

    test('clone', function () {
        throws(function () {
            xs.clone(xs.emptyFn);
        });

        //init test variables
        var item = {x: 1};
        var x, clone;

        //test array list
        x = [
            1,
            2,
            item
        ];
        clone = xs.clone(x);
        //equals
        strictEqual(JSON.stringify(clone), JSON.stringify(x));
        //links are saved
        strictEqual(x[2] === clone[2], true);

        //test object list
        x = {
            a: 1,
            c: 2,
            b: item
        };
        clone = xs.clone(x);
        //equals
        strictEqual(JSON.stringify(clone), JSON.stringify(x));
        //links are saved
        strictEqual(x.b === clone.b, true);
    });
});