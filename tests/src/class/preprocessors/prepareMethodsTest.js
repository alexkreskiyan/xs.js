/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.prepareMethods', function () {

    test('methods chain', function () {
        var me = this;

        //Base
        me.BaseName = 'my.Base';

        me.baseA = function () {

            return 1;
        };

        //define
        me.Base = xs.Class.create(function () {
            this.methods.a = me.baseA;
        });

        //save
        me.BaseSave = xs.ClassManager.get(me.BaseName);
        me.BaseSave && xs.ClassManager.delete(me.BaseName);

        //add to ClassManager
        xs.ClassManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'my.Parent';

        me.parentA = function () {

            return 2;
        };
        me.parentB = function () {

            return 3;
        };
        //define
        me.Parent = xs.Class.create(function () {
            this.extends = 'my.Base';
            this.methods.a = me.parentA;
            this.methods.b = me.parentB;
        });

        //save
        me.ParentSave = xs.ClassManager.get(me.ParentName);
        me.ParentSave && xs.ClassManager.delete(me.ParentName);

        //add to ClassManager
        xs.ClassManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'my.Child';

        me.childC = function () {

            return 5;
        };
        //define
        me.Child = xs.Class.create(function () {
            this.extends = 'my.Parent';
            this.methods.c = me.childC;
        });

        //save
        me.ChildSave = xs.ClassManager.get(me.ChildName);
        me.ChildSave && xs.ClassManager.delete(me.ChildName);

        //add to ClassManager
        xs.ClassManager.add(me.ChildName, me.Child);

        xs.onReady(me.done);

        return false;
    }, function () {
        var me = this;

        //init methods (will be referred to descriptor.methods)
        var methods;

        //check methods definition
        //Base
        methods = my.Base.descriptor.methods;
        //a
        strictEqual(methods.a.value, me.baseA);
        strictEqual(methods.a.writable, false);
        strictEqual(methods.a.configurable, false);
        strictEqual(methods.a.enumerable, true);

        //Parent
        methods = my.Parent.descriptor.methods;
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
        methods = my.Child.descriptor.methods;
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