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
    'xs.lang.Function'
], function () {

    'use strict';

    module('xs.lang.Function');

    test('bind', function () {
        //init test function
        var fn = function ( a, b, c ) {
            return this.x + (a - b) * c;
        };

        //get bind
        var binded = xs.bind(fn, {x: 5}, [
            2,
            3
        ]);

        //check bind
        strictEqual(binded(4), 5 + (2 - 3) * 4);
    });

    test('prefill', function () {
        //init test function
        var fn = function ( a, b, c ) {
            return this.x + (a - b) * c;
        };

        //get prefilled function
        var filled = xs.prefill(fn, [
            1,
            2,
            3
        ], {x: 5});

        //check prefill
        strictEqual(filled(4), 5 + (4 - 2) * 3);
    });

    test('memorize', function () {
        //init memorized function
        var fn = function ( obj ) {
            obj.x++;
        };
        //init scope
        var obj = {x: 1};

        //get memorized function
        var one = xs.memorize(fn);

        //test memorize
        one(obj);
        strictEqual(obj.x, 2);
        one(obj);
        strictEqual(obj.x, 2);
    });

    test('wrap', function () {
        //init wrapped function
        var fn = function ( val ) {
            return 2 * val;
        };

        //get wrapped
        var wrapped = xs.wrap(fn, function ( func, a, b, c ) {
            return this.x + a + func(b) + c;
        }, {x: 1});

        //test wrapped
        strictEqual(wrapped(1, 2, 3), 9);
    });

    test('getName', function () {
        //test anonymous function
        strictEqual(xs.Function.getName(function () {
        }), '');

        //test named function
        strictEqual(xs.Function.getName(function demo123_Asd () {
        }), 'demo123_Asd');
    });

    test('getArguments', function () {
        //test empty arguments
        strictEqual(JSON.stringify(xs.Function.getArguments(function () {
        })), '[]');

        //test arguments
        strictEqual(JSON.stringify(xs.Function.getArguments(function demo123_Asd ( demo123_Asd, asd_123_ASD ) {
        })), '["demo123_Asd","asd_123_ASD"]');
    });

    test('getBody', function () {
        //test empty body
        strictEqual(xs.Function.getBody(function () {
        }).trim(), '');

        //test named function
        strictEqual(xs.Function.getBody(function demo123_Asd ( demo123_Asd, asd_123_ASD ) {
            return demo123_Asd + asd_123_ASD + "";
        }).trim(), 'return demo123_Asd + asd_123_ASD + "";');
    });

    test('parse', function () {
        //get parse data
        var data = xs.Function.parse(function demo123_Asd ( demo123_Asd, asd_123_ASD ) {
            return demo123_Asd + asd_123_ASD + "";
        });

        //test parsing results
        strictEqual(data.name, 'demo123_Asd');
        strictEqual(JSON.stringify(data.arguments), '["demo123_Asd","asd_123_ASD"]');
        strictEqual(data.body.trim(), 'return demo123_Asd + asd_123_ASD + "";');
    });
});