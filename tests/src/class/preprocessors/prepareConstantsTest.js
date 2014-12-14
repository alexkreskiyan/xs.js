/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.prepareConstants', function () {

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
        //Base
        strictEqual(my.Base.descriptor.constants.a, 1);

        //Parent
        strictEqual(my.Parent.descriptor.constants.a, 2);
        strictEqual(my.Parent.descriptor.constants.b, 3);

        //Child
        strictEqual(my.Child.descriptor.constants.a, 2);
        strictEqual(my.Child.descriptor.constants.b, 3);
        strictEqual(my.Child.descriptor.constants.c, 5);
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