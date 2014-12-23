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
        if (xs.ClassManager.has(me.BaseName)) {
            me.BaseSave = xs.ClassManager.get(me.BaseName);
            xs.ClassManager.remove(me.BaseName);
        }

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
        if (xs.ClassManager.has(me.ParentName)) {
            me.ParentSave = xs.ClassManager.get(me.ParentName);
            xs.ClassManager.remove(me.ParentName);
        }

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
        if (xs.ClassManager.has(me.ChildName)) {
            me.ChildSave = xs.ClassManager.get(me.ChildName);
            xs.ClassManager.remove(me.ChildName);
        }

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
        strictEqual(methods.at('a').value, me.baseA);
        strictEqual(methods.at('a').writable, false);
        strictEqual(methods.at('a').configurable, false);
        strictEqual(methods.at('a').enumerable, true);

        //Parent
        methods = ns.Parent.descriptor.static.methods;
        //a
        strictEqual(methods.at('a').value, me.parentA);
        strictEqual(methods.at('a').writable, false);
        strictEqual(methods.at('a').configurable, false);
        strictEqual(methods.at('a').enumerable, true);
        //b
        strictEqual(methods.at('b').value, me.parentB);
        strictEqual(methods.at('b').writable, false);
        strictEqual(methods.at('b').configurable, false);
        strictEqual(methods.at('b').enumerable, true);

        //Child
        methods = ns.Child.descriptor.static.methods;
        //a
        strictEqual(methods.at('a').value, me.parentA);
        strictEqual(methods.at('a').writable, false);
        strictEqual(methods.at('a').configurable, false);
        strictEqual(methods.at('a').enumerable, true);
        //b
        strictEqual(methods.at('b').value, me.parentB);
        strictEqual(methods.at('b').writable, false);
        strictEqual(methods.at('b').configurable, false);
        strictEqual(methods.at('b').enumerable, true);
        //c
        strictEqual(methods.at('c').value, me.childC);
        strictEqual(methods.at('c').writable, false);
        strictEqual(methods.at('c').configurable, false);
        strictEqual(methods.at('c').enumerable, true);

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