/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.defineConstants', function () {

    test('constants chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.class.preprocessors.defineConstants.Base';

        //define
        me.Base = xs.Class.create(function () {
            this.constants.a = 1;
        });

        //save
        me.BaseSave = xs.ClassManager.get(me.BaseName);
        me.BaseSave && xs.ClassManager.delete(me.BaseName);

        //add to ClassManager
        xs.ClassManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.class.preprocessors.defineConstants.Parent';

        //define
        me.Parent = xs.Class.create(function () {
            this.extends = 'tests.class.preprocessors.defineConstants.Base';
            this.constants.a = 2;
            this.constants.b = 3;
        });

        //save
        me.ParentSave = xs.ClassManager.get(me.ParentName);
        me.ParentSave && xs.ClassManager.delete(me.ParentName);

        //add to ClassManager
        xs.ClassManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.defineConstants.Child';

        //define
        me.Child = xs.Class.create(function () {
            this.extends = 'tests.class.preprocessors.defineConstants.Parent';
            this.constants.c = 5;
        });

        //save
        me.ChildSave = xs.ClassManager.get(me.ChildName);
        me.ChildSave && xs.ClassManager.delete(me.ChildName);

        //add to ClassManager
        xs.ClassManager.add(me.ChildName, me.Child);

        xs.onReady([
            me.BaseName,
            me.ParentName,
            me.ChildName
        ], me.done);

        return false;
    }, function () {
        var ns = tests.class.preprocessors.defineConstants;

        //check constants
        //Base
        //a
        strictEqual(ns.Base.a, 1);
        strictEqual(xs.Attribute.isWritable(ns.Base, 'a'), false);
        strictEqual(xs.Attribute.isConfigurable(ns.Base, 'a'), false);

        //Parent
        //a
        strictEqual(ns.Parent.a, 2);
        strictEqual(xs.Attribute.isWritable(ns.Parent, 'a'), false);
        strictEqual(xs.Attribute.isConfigurable(ns.Parent, 'a'), false);
        //b
        strictEqual(ns.Parent.b, 3);
        strictEqual(xs.Attribute.isWritable(ns.Parent, 'b'), false);
        strictEqual(xs.Attribute.isConfigurable(ns.Parent, 'b'), false);

        //Child
        //a
        strictEqual(ns.Child.a, 2);
        strictEqual(xs.Attribute.isWritable(ns.Child, 'a'), false);
        strictEqual(xs.Attribute.isConfigurable(ns.Child, 'a'), false);
        //b
        strictEqual(ns.Child.b, 3);
        strictEqual(xs.Attribute.isWritable(ns.Child, 'b'), false);
        strictEqual(xs.Attribute.isConfigurable(ns.Child, 'b'), false);
        //c
        strictEqual(ns.Child.c, 5);
        strictEqual(xs.Attribute.isWritable(ns.Child, 'c'), false);
        strictEqual(xs.Attribute.isConfigurable(ns.Child, 'c'), false);


    }, function () {
        var me = this;

        //Base
        xs.ClassManager.delete(me.BaseName);
        me.BaseSave && xs.ClassManager.add(me.BaseName, me.BaseSave);

        //Parent
        xs.ClassManager.delete(me.ParentName);
        me.ParentSave && xs.ClassManager.add(me.ParentName, me.ParentSave);

        //Child
        xs.ClassManager.delete(me.ChildName);
        me.ChildSave && xs.ClassManager.add(me.ChildName, me.ChildSave);
    });
});