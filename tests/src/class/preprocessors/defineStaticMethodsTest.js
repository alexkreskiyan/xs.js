/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.defineStaticMethods', function () {

    test('static methods chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.class.preprocessors.defineStaticMethods.Base';

        //define
        me.Base = xs.Class.create(function () {
            this.static.methods.a = function () {

                return 1;
            };
        });

        //save
        me.BaseSave = xs.ClassManager.get(me.BaseName);
        me.BaseSave && xs.ClassManager.remove(me.BaseName);

        //add to ClassManager
        xs.ClassManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.class.preprocessors.defineStaticMethods.Parent';

        //define
        me.Parent = xs.Class.create(function () {
            this.extends = 'tests.class.preprocessors.defineStaticMethods.Base';
            this.static.methods.a = function () {

                return 2;
            };
            this.static.methods.b = function () {

                return 3;
            };
        });

        //save
        me.ParentSave = xs.ClassManager.get(me.ParentName);
        me.ParentSave && xs.ClassManager.remove(me.ParentName);

        //add to ClassManager
        xs.ClassManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.defineStaticMethods.Child';

        //define
        me.Child = xs.Class.create(function () {
            this.extends = 'tests.class.preprocessors.defineStaticMethods.Parent';
            this.static.methods.c = function () {

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
        var ns = tests.class.preprocessors.defineStaticMethods;

        //test
        //Base
        strictEqual(ns.Base.a(), 1);

        //Parent
        strictEqual(ns.Parent.a(), 2);
        strictEqual(ns.Parent.b(), 3);

        //Child
        strictEqual(ns.Child.a(), 2);
        strictEqual(ns.Child.b(), 3);
        strictEqual(ns.Child.c(), 5);

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