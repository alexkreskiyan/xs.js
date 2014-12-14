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
        me.BaseName = 'my.Base';

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
        me.ParentName = 'my.Parent';

        //define
        me.Parent = xs.Class.create(function () {
            this.extends = 'my.Base';
            this.constants.a = 2;
            this.constants.b = 3;
        });

        //save
        me.ParentSave = xs.ClassManager.get(me.ParentName);
        me.ParentSave && xs.ClassManager.delete(me.ParentName);

        //add to ClassManager
        xs.ClassManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'my.Child';

        //define
        me.Child = xs.Class.create(function () {
            this.extends = 'my.Parent';
            this.constants.c = 5;
        });

        //save
        me.ChildSave = xs.ClassManager.get(me.ChildName);
        me.ChildSave && xs.ClassManager.delete(me.ChildName);

        //add to ClassManager
        xs.ClassManager.add(me.ChildName, me.Child);

        xs.onReady(me.done);

        return false;
    }, function () {
        //check constants
        //Base
        //a
        strictEqual(my.Base.a, 1);
        strictEqual(xs.Attribute.isWritable(my.Base, 'a'), false);
        strictEqual(xs.Attribute.isConfigurable(my.Base, 'a'), false);

        //Parent
        //a
        strictEqual(my.Parent.a, 2);
        strictEqual(xs.Attribute.isWritable(my.Parent, 'a'), false);
        strictEqual(xs.Attribute.isConfigurable(my.Parent, 'a'), false);
        //b
        strictEqual(my.Parent.b, 3);
        strictEqual(xs.Attribute.isWritable(my.Parent, 'b'), false);
        strictEqual(xs.Attribute.isConfigurable(my.Parent, 'b'), false);

        //Child
        //a
        strictEqual(my.Child.a, 2);
        strictEqual(xs.Attribute.isWritable(my.Child, 'a'), false);
        strictEqual(xs.Attribute.isConfigurable(my.Child, 'a'), false);
        //b
        strictEqual(my.Child.b, 3);
        strictEqual(xs.Attribute.isWritable(my.Child, 'b'), false);
        strictEqual(xs.Attribute.isConfigurable(my.Child, 'b'), false);
        //c
        strictEqual(my.Child.c, 5);
        strictEqual(xs.Attribute.isWritable(my.Child, 'c'), false);
        strictEqual(xs.Attribute.isConfigurable(my.Child, 'c'), false);


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