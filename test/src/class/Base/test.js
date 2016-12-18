/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.Base', function () {

    'use strict';

    test('clone', function () {
        var me = this;

        me.Class = xs.Class(function () {

        }, me.done);

        return false;
    }, function () {
        var me = this;
        //create simple xs.class.Base instance
        var sample = new me.Class();
        sample.a = 1;

        //create clone
        var clone = sample.clone();

        //clone is equal by keys
        strictEqual(JSON.stringify(Object.keys(clone)), JSON.stringify(Object.keys(sample)));

        //values are equal
        Object.keys(sample).forEach(function (key) {
            strictEqual(clone[ key ], clone[ key ]);
        });

        //clone constructor is ok
        strictEqual(clone.constructor, me.Class);
    });

});