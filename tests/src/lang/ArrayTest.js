/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.lang.Array', function () {

    test('shuffle', function () {
        //init sample
        var item = { x: 1 };

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
        xs.Array.shuffle(x);

        //check items all saved
        Object.keys(clone).forEach(function (key) {
            strictEqual(true, x.indexOf(clone[key]) >= 0);
        });

        //check all keys exist
        Object.keys(clone).forEach(function (key) {
            strictEqual(true, key in x);
        });
    });
});