/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.enum.preprocessors.namespace', function () {

    'use strict';

    test('namespace', function () {
        var me = this;

        //Enum
        me.EnumName = 'tests.enum.preprocessors.namespace.Enum';

        //define
        me.Enum = xs.Enum({
            a: 1,
            b: 2
        });

        //save
        if (xs.ContractsManager.has(me.EnumName)) {
            me.EnumName = xs.ContractsManager.get(me.EnumName);
            xs.ContractsManager.remove(me.EnumName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.EnumName, me.Enum);

        //call done, when enumes ready to continue test
        xs.onReady([
            me.EnumName
        ], me.done);

        return false;
    }, function () {
        var me = this;

        var ns = window.tests.enum.preprocessors.namespace;

        //Parent
        strictEqual(ns.Enum, me.Enum);
    }, function () {
        var me = this;

        //Enum
        xs.ContractsManager.remove(me.EnumName);
        if (me.EnumSave) {
            xs.ContractsManager.add(me.EnumName, me.EnumSave);
        }
    });

});