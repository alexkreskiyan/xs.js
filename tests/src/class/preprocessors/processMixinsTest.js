/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.processMixins', function () {

    test('mixins chain', function () {
        var me = this;

        //add tests path
        xs.Loader.paths.add('tests', '/tests/resources');

        //define child class
        xs.define('ns.Child', function () {
            this.namespace = 'tests.class.preprocessors.processMixins';
            this.imports = [
                'ns.Base',
                'ns.Mix2'
            ];
            this.extends = 'ns.Base';
            this.mixins.mix2 = 'ns.Mix2';
        });

        xs.onReady([
            'tests.class.preprocessors.processMixins.Child',
            'tests.class.preprocessors.processMixins.Base',
            'tests.class.preprocessors.processMixins.Mix1',
            'tests.class.preprocessors.processMixins.Mix2'
        ], me.done);

        return false;
    }, function () {
        var Child = tests.class.preprocessors.processMixins.Child;

        //check attributes from Mix1
        var Mix1 = Child.prototype.mixins.mix1;
        strictEqual(Child.descriptor.constants.a, Mix1.descriptor.constants.a);
        strictEqual(Child.descriptor.properties.a, Mix1.descriptor.properties.a);
        strictEqual(Child.descriptor.methods.printA, Mix1.descriptor.methods.printA);

        //check attributes from Mix2
        var Mix2 = Child.prototype.mixins.mix2;
        strictEqual(Child.descriptor.constants.b, Mix2.descriptor.constants.b);
        strictEqual(Child.descriptor.properties.b, Mix2.descriptor.properties.b);
        strictEqual(Child.descriptor.methods.printB, Mix2.descriptor.methods.printB);
    }, function () {
        var me = this;
        xs.Loader.paths.remove('tests');

        //remove created classes from namespace
        var ns = tests.class.preprocessors.processMixins;
        xs.ClassManager.remove(ns.Child.label);
        xs.ClassManager.remove(ns.Base.label);
        xs.ClassManager.remove(ns.Mix1.label);
        xs.ClassManager.remove(ns.Mix2.label);
    });

});