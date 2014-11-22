/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
require([
    'xs.lang.Type',
    'xs.lang.List',
    'xs.lang.Object',
    'xs.lang.Array'
], function () {

    'use strict';

    module('xs.lang.Array');

    test('shuffle', function () {
        //init sample
        var item = {x: 1};

        //define shuffled array and it's clone
        var x, clone;
        x = [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            30,
            item
        ];

        //create clone
        clone = xs.clone(x);

        //shuffle original array
        xs.shuffle(x);

        //check items all saved
        strictEqual(true, xs.every(clone, function (value) {
            return xs.has(x, value);
        }));

        //check all keys exist
        strictEqual(true, xs.every(clone, function (value, key) {
            return xs.hasKey(x, key);
        }));

        //check order is changed
        strictEqual(false, xs.every(clone, function (value) {
            return xs.keyOf(x, value) === xs.keyOf(clone, value);
        }));
    });
});