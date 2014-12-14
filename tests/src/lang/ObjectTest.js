/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.lang.Object', function () {

    test('extend', function () {
        var me = this;
        //init test data
        me.a = { a: 1 };
        me.b = { b: 1 };
        me.c = { c: 1 };
        me.x = {
            a: me.a,
            b: me.b,
            c: me.c,
            d: 1,
            e: xs.clone(me.a)
        };
    }, function () {
        var me = this;
        //extend
        xs.extend(me.x, { a: me.b }, 3, [
            4,
            5
        ], { b: 1 }, { e: me.a });

        //check replacements
        strictEqual(me.x.a, me.b);
        strictEqual(me.x.b, 1);
        strictEqual(me.x.c, me.c);
        strictEqual(me.x.d, 1);
        strictEqual(me.x.e, me.a);
    });
});