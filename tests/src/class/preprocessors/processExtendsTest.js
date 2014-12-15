/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.processExtends', function () {

    test('extend base', function () {
        var me = this;

        me.ClassName = 'tests.class.preprocessors.processExtends.Class';

        //create Class
        me.Class = xs.define('tests.class.preprocessors.processExtends.Class', function () {
        });

        xs.onReady([me.ClassName], me.done);

        return false;
    }, function () {
        var me = this;

        //Class extends xs.Base
        strictEqual(me.Class.parent, xs.Base);
    }, function () {
        //delete Class from ClassManager
        xs.ClassManager.delete(me.Class.label);
    });

    test('extend chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.class.preprocessors.processExtends.Base';

        //define
        me.Base = xs.Class.create(function () {
        });

        //save
        me.BaseSave = xs.ClassManager.get(me.BaseName);
        me.BaseSave && xs.ClassManager.delete(me.BaseName);

        //add to ClassManager
        xs.ClassManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.class.preprocessors.processExtends.Parent';

        //define
        me.Parent = xs.Class.create(function () {
            this.extends = 'tests.class.preprocessors.processExtends.Base';
        });

        //save
        me.ParentSave = xs.ClassManager.get(me.ParentName);
        me.ParentSave && xs.ClassManager.delete(me.ParentName);

        //add to ClassManager
        xs.ClassManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.processExtends.Child';

        //define
        me.Child = xs.Class.create(function () {
            this.extends = 'tests.class.preprocessors.processExtends.Parent';
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
        //check chain
        strictEqual(ns.Base.parent, xs.Base);
        strictEqual(ns.Parent.parent, ns.Base);
        strictEqual(ns.Child.parent, ns.Parent);

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