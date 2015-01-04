/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.prepareMixins', function () {

    'use strict';

    test('prepareMixins', function () {
        var me = this;

        //Class
        me.ClassName = 'tests.class.preprocessors.prepareMixins.Class';

        //define
        me.Class = xs.Class(function () {
            var me = this;
            me.mixins.demo = 'xs.class.Base';
        });

        //save
        if (xs.ContractsManager.has(me.ClassName)) {
            me.ClassSave = xs.ContractsManager.get(me.ClassName);
            xs.ContractsManager.remove(me.ClassName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ClassName, me.Class);

        xs.onReady([me.ClassName], me.done);

        return false;
    }, function () {
        var ns = window.tests.class.preprocessors.prepareMixins;

        //check chain
        strictEqual(ns.Class.descriptor.mixins.length, 1);
        strictEqual(ns.Class.descriptor.mixins.at('demo'), 'xs.class.Base');

    }, function () {
        var me = this;
        //Class
        xs.ContractsManager.remove(me.ClassName);
        if (me.ClassSave) {
            xs.ContractsManager.add(me.ClassName, me.ClassSave);
        }
    });

});