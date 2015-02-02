/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.postprocessors.logger', function () {

    'use strict';

    test('logger created', function () {
        var me = this;
        me.Class = xs.Class(function () {

        }, me.done);

        return false;
    }, function () {
        var me = this;

        //here class is processed, but preprocessors have not run yet
        strictEqual(me.Class.hasOwnProperty('log'), false);

        //on next tick - log must be defined
        setTimeout(function () {
            //log must be defined
            strictEqual(me.Class.hasOwnProperty('log'), true);

            //log must be xs.log.Logger instance
            strictEqual(me.Class.log instanceof xs.log.Logger, true);

            me.done();

        }, 0);

        return false;
    });
});