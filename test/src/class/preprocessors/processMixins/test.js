/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.processMixins', function () {

    'use strict';

    test('mixins chain', function () {
        var me = this;

        //define child class
        xs.define(xs.Class, 'ns.Child', function () {
            var Class = this;
            Class.namespace = 'tests.class.preprocessors.processMixins';
            Class.extends = 'ns.resources.Base';
            Class.mixins.mix2 = 'ns.resources.Mix2';
        }, me.done);

        return false;
    }, function () {
        var ns = window.tests.class.preprocessors.processMixins;
        var Child = ns.Child;

        //verify descriptor
        strictEqual(Child.descriptor.mixins.size, 1);
        strictEqual(Child.descriptor.mixins.at('mix2'), ns.resources.Mix2);
        strictEqual(Child.descriptor.allMixins.size, 2);
        strictEqual(Child.descriptor.allMixins.at(0), ns.resources.Mix1);
        strictEqual(Child.descriptor.allMixins.at(1), ns.resources.Mix2);

        //check attributes from Mix1
        var Mix1 = ns.resources.Mix1;
        strictEqual(Child.descriptor.constant.a, Mix1.descriptor.constant.a);
        strictEqual(Child.descriptor.property.a, Mix1.descriptor.property.a);
        strictEqual(Child.descriptor.method.printA, Mix1.descriptor.method.printA);

        //check attributes from Mix2
        var Mix2 = ns.resources.Mix2;
        strictEqual(Child.descriptor.constant.b, Mix2.descriptor.constant.b);
        strictEqual(Child.descriptor.property.b, Mix2.descriptor.property.b);
        strictEqual(Child.descriptor.method.printB, Mix2.descriptor.method.printB);

        //verify mixins function
        strictEqual(Child.mixins(Mix1), true);
        strictEqual(Child.mixins(Mix2), true);
        strictEqual(Child.mixins([
            Mix1,
            Mix2
        ]), true);
        strictEqual(Child.mixins(ns.resources.Base), false);
        strictEqual(Child.mixins(xs.class.Base), true);
    }, function () {
        //remove created classes from namespace
        var ns = window.tests.class.preprocessors.processMixins;
        xs.ContractsManager.remove(ns.Child.label);
        xs.ContractsManager.remove(ns.resources.Base.label);
        xs.ContractsManager.remove(ns.resources.Mix1.label);
        xs.ContractsManager.remove(ns.resources.Mix2.label);
    });

});