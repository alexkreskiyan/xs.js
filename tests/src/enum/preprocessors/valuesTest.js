/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.enum.preprocessors.values', function () {

    'use strict';

    test('values', function () {
        var me = this;

        //Enum
        me.EnumName = 'tests.enum.preprocessors.values.Enum';

        me.fn = function () {
        };
        //define
        me.Enum = xs.Enum({
            a: 1,
            b: me.fn
        });

        //save
        if (xs.ContractsManager.has(me.EnumName)) {
            me.EnumSave = xs.ContractsManager.get(me.EnumName);
            xs.ContractsManager.remove(me.EnumName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.EnumName, me.Enum);

        xs.onReady([
            me.EnumName
        ], me.done);

        return false;
    }, function () {
        var me = this;

        var ns = window.tests.enum.preprocessors.values;

        //Enum
        //a
        strictEqual(ns.Enum.a, 1);
        strictEqual(xs.Attribute.isWritable(ns.Enum, 'a'), false);
        strictEqual(xs.Attribute.isConfigurable(ns.Enum, 'a'), false);
        //b
        strictEqual(ns.Enum.b, me.fn);
        strictEqual(xs.Attribute.isWritable(ns.Enum, 'a'), false);
        strictEqual(xs.Attribute.isConfigurable(ns.Enum, 'a'), false);

    }, function () {
        var me = this;

        //Enum
        xs.ContractsManager.remove(me.EnumName);

        if (me.EnumSave) {
            xs.ContractsManager.add(me.EnumName, me.EnumSave);
        }

        delete me.fn;
    });

});