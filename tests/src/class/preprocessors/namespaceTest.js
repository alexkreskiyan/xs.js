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
        me.BaseName = 'tests.class.preprocessors.namespace.base.Base';

        //define
        me.Base = xs.Class.create(function () {
        });

        //save
        me.BaseSave = xs.ClassManager.get(me.BaseName);
        me.BaseSave && xs.ClassManager.remove(me.BaseName);

        //add to ClassManager
        xs.ClassManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.class.preprocessors.namespace.base.Parent';

        //define
        me.Parent = xs.Class.create(function () {
            this.namespace = 'tests.class.preprocessors.namespace.base';
            this.extends = 'ns.Base';
        });

        //save
        me.ParentSave = xs.ClassManager.get(me.ParentName);
        me.ParentSave && xs.ClassManager.remove(me.ParentName);

        //add to ClassManager
        xs.ClassManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.namespace.demo.Child';

        //define
        me.Child = xs.Class.create(function () {
            this.namespace = 'tests.class.preprocessors.namespace.demo';
            this.extends = 'tests.class.preprocessors.namespace.base.Parent';
        });

        //save
        me.ChildSave = xs.ClassManager.get(me.ChildName);
        me.ChildSave && xs.ClassManager.remove(me.ChildName);

        //add to ClassManager
        xs.ClassManager.add(me.ChildName, me.Child);

        //call done, when classes ready to continue test
        xs.onReady([
            me.BaseName,
            me.ParentName,
            me.ChildName
        ], me.done);

        return false;
    }, function () {
        var ns = tests.class.preprocessors.namespace;

        //Parent
        strictEqual(ns.base.Parent.parent, ns.base.Base);

        //Child
        strictEqual(ns.demo.Child.parent, ns.base.Parent);
    }, function () {
        var me = this;

        //Base
        xs.ClassManager.remove(me.BaseName);
        me.BaseSave && xs.ClassManager.add(me.BaseName, me.BaseSave);

        //Parent
        xs.ClassManager.remove(me.ParentName);
        me.ParentSave && xs.ClassManager.add(me.ParentName, me.ParentSave);

        //Child
        xs.ClassManager.remove(me.ChildName);
        me.ChildSave && xs.ClassManager.add(me.ChildName, me.ChildSave);
    });
});