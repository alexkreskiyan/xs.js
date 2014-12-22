/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.defineMethods', function () {

    test('methods chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.class.preprocessors.defineMethods.Base';

        //define
        me.Base = xs.Class.create(function () {
            this.methods.a = function () {

                return 1;
            };
        });

        //save
        me.BaseSave = xs.ClassManager.get(me.BaseName);
        me.BaseSave && xs.ClassManager.remove(me.BaseName);

        //add to ClassManager
        xs.ClassManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.class.preprocessors.defineMethods.Parent';

        //define
        me.Parent = xs.Class.create(function () {
            this.extends = 'tests.class.preprocessors.defineMethods.Base';
            this.methods.a = function () {

                return 2;
            };
            this.methods.b = function () {

                return 3;
            };
        });

        //save
        me.ParentSave = xs.ClassManager.get(me.ParentName);
        me.ParentSave && xs.ClassManager.remove(me.ParentName);

        //add to ClassManager
        xs.ClassManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.defineMethods.Child';

        //define
        me.Child = xs.Class.create(function () {
            this.extends = 'tests.class.preprocessors.defineMethods.Parent';
            this.methods.c = function () {

                return 5;
            };
        });

        //save
        me.ChildSave = xs.ClassManager.get(me.ChildName);
        me.ChildSave && xs.ClassManager.remove(me.ChildName);

        //add to ClassManager
        xs.ClassManager.add(me.ChildName, me.Child);

        xs.onReady([
            me.BaseName,
            me.ParentName,
            me.ChildName
        ], me.done);

        return false;
    }, function () {
        var ns = tests.class.preprocessors.defineMethods;

        //Base
        var base = new ns.Base;
        strictEqual(base.a(), 1);

        //Parent
        var parent = new ns.Parent;
        strictEqual(parent.a(), 2);
        strictEqual(parent.b(), 3);

        //Child
        var child = new ns.Child;
        strictEqual(child.a(), 2);
        strictEqual(child.b(), 3);
        strictEqual(child.c(), 5);
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