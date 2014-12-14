/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.namespace', function () {

    test('namespace usage chain', function () {
        var me = this;

        //Base
        me.BaseName = 'my.base.Base';

        //define
        me.Base = xs.Class.create(function () {
        });

        //save
        me.BaseSave = xs.ClassManager.get(me.BaseName);
        me.BaseSave && xs.ClassManager.delete(me.BaseName);

        //add to ClassManager
        xs.ClassManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'my.base.Parent';

        //define
        me.Parent = xs.Class.create(function () {
            this.namespace = 'my.base';
            this.extends = 'ns.Base';
        });

        //save
        me.ParentSave = xs.ClassManager.get(me.ParentName);
        me.ParentSave && xs.ClassManager.delete(me.ParentName);

        //add to ClassManager
        xs.ClassManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'my.demo.Child';

        //define
        me.Child = xs.Class.create(function () {
            this.namespace = 'my.demo';
            this.extends = 'my.base.Parent';
        });

        //save
        me.ChildSave = xs.ClassManager.get(me.ChildName);
        me.ChildSave && xs.ClassManager.delete(me.ChildName);

        //add to ClassManager
        xs.ClassManager.add(me.ChildName, me.Child);

        //call done, when classes ready to continue test
        xs.onReady(me.done);

        return false;
    }, function () {
        //Parent
        strictEqual(my.base.Parent.parent, my.base.Base);

        //Child
        strictEqual(my.demo.Child.parent, my.base.Parent);
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