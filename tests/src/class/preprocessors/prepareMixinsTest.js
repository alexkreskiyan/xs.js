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
        me.ClassName = 'my.Class';

        //define
        me.Class = xs.Class.create(function () {
            var me = this;
            me.mixins.demo = 'xs.Base';
        });

        //save
        me.ClassSave = xs.ClassManager.get(me.ClassName);
        me.ClassSave && xs.ClassManager.delete(me.ClassName);

        //add to ClassManager
        xs.ClassManager.add(me.ClassName, me.Class);

        xs.onReady(me.done);

        return false;
    }, function () {
        //check chain
        strictEqual(xs.size(my.Class.descriptor.mixins), 1);
        strictEqual(my.Class.descriptor.mixins.demo, 'xs.Base');

    }, function () {
        var me = this;
        //Class
        xs.ClassManager.delete(me.ClassName);
        me.ClassSave && xs.ClassManager.add(me.ClassName, me.ClassSave);
    });

});