/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.prepareStaticMethods', function () {

    test('static methods chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.class.preprocessors.prepareStaticMethods.Base';

        me.baseA = function () {

            return 1;
        };

        //define
        me.Base = xs.Class.create(function () {
            this.static.methods.a = me.baseA;
        });

        //save
        me.BaseSave = xs.ClassManager.get(me.BaseName);
        me.BaseSave && xs.ClassManager.delete(me.BaseName);

        //add to ClassManager
        xs.ClassManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.class.preprocessors.prepareStaticMethods.Parent';

        me.parentA = function () {

            return 2;
        };
        me.parentB = function () {

            return 3;
        };
        //define
        me.Parent = xs.Class.create(function () {
            this.extends = 'tests.class.preprocessors.prepareStaticMethods.Base';
            this.static.methods.a = me.parentA;
            this.static.methods.b = me.parentB;
        });

        //save
        me.ParentSave = xs.ClassManager.get(me.ParentName);
        me.ParentSave && xs.ClassManager.delete(me.ParentName);

        //add to ClassManager
        xs.ClassManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.prepareStaticMethods.Child';

        me.childC = function () {

            return 5;
        };
        //define
        me.Child = xs.Class.create(function () {
            this.extends = 'tests.class.preprocessors.prepareStaticMethods.Parent';
            this.static.methods.c = me.childC;
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
        var me = this;

        var ns = tests.class.preprocessors.prepareStaticMethods;

        //init methods (will be referred to descriptor.static.methods)
        var methods;

        //check static methods definition
        //Base
        methods = ns.Base.descriptor.static.methods;
        //a
        strictEqual(methods.a.value, me.baseA);
        strictEqual(methods.a.writable, false);
        strictEqual(methods.a.configurable, false);
        strictEqual(methods.a.enumerable, true);

        //Parent
        methods = ns.Parent.descriptor.static.methods;
        //a
        strictEqual(methods.a.value, me.parentA);
        strictEqual(methods.a.writable, false);
        strictEqual(methods.a.configurable, false);
        strictEqual(methods.a.enumerable, true);
        //b
        strictEqual(methods.b.value, me.parentB);
        strictEqual(methods.b.writable, false);
        strictEqual(methods.b.configurable, false);
        strictEqual(methods.b.enumerable, true);

        //Child
        methods = ns.Child.descriptor.static.methods;
        //a
        strictEqual(methods.a.value, me.parentA);
        strictEqual(methods.a.writable, false);
        strictEqual(methods.a.configurable, false);
        strictEqual(methods.a.enumerable, true);
        //b
        strictEqual(methods.b.value, me.parentB);
        strictEqual(methods.b.writable, false);
        strictEqual(methods.b.configurable, false);
        strictEqual(methods.b.enumerable, true);
        //c
        strictEqual(methods.c.value, me.childC);
        strictEqual(methods.c.writable, false);
        strictEqual(methods.c.configurable, false);
        strictEqual(methods.c.enumerable, true);

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