/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.prepareMixins', function () {

    test('prepareMixins', function () {
        var me = this;

        //Class
        me.ClassName = 'tests.class.preprocessors.prepareMixins.Class';

        //define
        me.Class = xs.Class.create(function () {
            var me = this;
            me.mixins.demo = 'xs.Base';
        });

        //save
        if (xs.ClassManager.has(me.ClassName)) {
            me.ClassSave = xs.ClassManager.get(me.ClassName);
            xs.ClassManager.remove(me.ClassName);
        }

        //add to ClassManager
        xs.ClassManager.add(me.ClassName, me.Class);

        xs.onReady([me.ClassName], me.done);

        return false;
    }, function () {
        var ns = tests.class.preprocessors.prepareMixins;

        //check chain
        strictEqual(xs.size(ns.Class.descriptor.mixins), 1);
        strictEqual(ns.Class.descriptor.mixins.at('demo'), 'xs.Base');

    }, function () {
        var me = this;
        //Class
        xs.ClassManager.remove(me.ClassName);
        me.ClassSave && xs.ClassManager.add(me.ClassName, me.ClassSave);
    });

});