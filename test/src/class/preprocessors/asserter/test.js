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

        //assert must be defined
        strictEqual(me.Class.hasOwnProperty('assert'), true);

        //assert must be xs.core.Asserter instance
        strictEqual(me.Class.assert instanceof xs.core.Asserter, true);
    });

});