/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.postprocessors.asserter', function () {

    'use strict';

    test('asserter created', function () {
        var me = this;
        me.Class = xs.Class(function () {

        }, me.done);

        return false;
    }, function () {
        var me = this;

        //here class is processed, but preprocessors have not run yet
        strictEqual(me.Class.hasOwnProperty('assert'), false);

        //on next tick - assert must be defined
        setTimeout(function () {
            //assert must be defined
            strictEqual(me.Class.hasOwnProperty('assert'), true);

            //assert must be xs.assert.Asserter instance
            strictEqual(me.Class.assert instanceof xs.assert.Asserter, true);

            me.done();

        }, 0);

        return false;
    });
});