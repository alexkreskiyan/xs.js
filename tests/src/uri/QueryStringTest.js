/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.uri.QueryString', function () {

    'use strict';

    test('from string', function () {
        var me = this;
        me.decoded = 'a[0]=1&a[1][b]=1&c[0]=2&c[1][x]=2&c[2]=3фыв';

        me.encoded = 'a%5B0%5D=1&a%5B1%5D%5Bb%5D=1&c%5B0%5D=2&c%5B1%5D%5Bx%5D=2&c%5B2%5D=3%25D1%2584%25D1%258B%25D0%25B2';
    }, function () {
        var me = this;
        var qs;

        //check decoded
        qs = new xs.uri.QueryString(me.decoded);
        strictEqual(JSON.stringify(qs.params), '{"a":[1,{"b":1}],"c":[2,{"x":2},"3фыв"]}');

        //check encoded
        qs = new xs.uri.QueryString(me.encoded);
        strictEqual(JSON.stringify(qs.params), '{"a":[1,{"b":1}],"c":[2,{"x":2},"3фыв"]}');
    });

    test('to string', function () {
        var me = this;
        me.decoded = 'a[0]=1&a[1][b]=1&c[0]=2&c[1][x]=2&c[2]=3фыв';

        me.encoded = 'a%5B0%5D=1&a%5B1%5D%5Bb%5D=1&c%5B0%5D=2&c%5B1%5D%5Bx%5D=2&c%5B2%5D=3%D1%84%D1%8B%D0%B2';

        me.source = {
            a: [
                1,
                {
                    b: 1
                }
            ],
            c: [
                2,
                {
                    x: 2
                },
                '3фыв'
            ]
        };
    }, function () {
        var me = this;
        var qs = new xs.uri.QueryString(me.source);

        //check decoded
        strictEqual(qs.toString(), me.decoded);

        //check encoded
        strictEqual(qs.toString(true), me.encoded);
    });
});