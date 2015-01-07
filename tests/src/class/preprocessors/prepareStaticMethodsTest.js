/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.prepareStaticMethods', function () {

    'use strict';

    test('static methods chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.class.preprocessors.prepareStaticMethods.Base';

        me.baseA = function () {

            return 1;
        };

        //define
        me.Base = xs.Class(function () {
            this.static.method.a = me.baseA;
        });

        //save
        if (xs.ContractsManager.has(me.BaseName)) {
            me.BaseSave = xs.ContractsManager.get(me.BaseName);
            xs.ContractsManager.remove(me.BaseName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.class.preprocessors.prepareStaticMethods.Parent';

        me.parentA = function () {

            return 2;
        };
        me.parentB = function () {

            return 3;
        };
        //define
        me.Parent = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.prepareStaticMethods.Base';
            this.static.method.a = me.parentA;
            this.static.method.b = me.parentB;
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.prepareStaticMethods.Child';

        me.childC = function () {

            return 5;
        };
        //define
        me.Child = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.prepareStaticMethods.Parent';
            this.static.method.c = me.childC;
        });

        //save
        if (xs.ContractsManager.has(me.ChildName)) {
            me.ChildSave = xs.ContractsManager.get(me.ChildName);
            xs.ContractsManager.remove(me.ChildName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ChildName, me.Child);

        xs.onReady([
            me.BaseName,
            me.ParentName,
            me.ChildName
        ], me.done);

        return false;
    }, function () {
        var me = this;

        var ns = window.tests.class.preprocessors.prepareStaticMethods;

        //init methods (will be referred to descriptor.static.method)
        var methods;

        //check static methods definition
        //Base
        methods = ns.Base.descriptor.static.method;
        //a
        strictEqual(methods.at('a').value, me.baseA);
        strictEqual(methods.at('a').writable, false);
        strictEqual(methods.at('a').configurable, false);
        strictEqual(methods.at('a').enumerable, true);

        //Parent
        methods = ns.Parent.descriptor.static.method;
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
        methods = ns.Child.descriptor.static.method;
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
        xs.ContractsManager.remove(me.BaseName);
        if (me.BaseSave) {
            xs.ContractsManager.add(me.BaseName, me.BaseSave);
        }

        //Parent
        xs.ContractsManager.remove(me.ParentName);
        if (me.ParentSave) {
            xs.ContractsManager.add(me.ParentName, me.ParentSave);
        }

        //Child
        xs.ContractsManager.remove(me.ChildName);
        if (me.ChildSave) {
            xs.ContractsManager.add(me.ChildName, me.ChildSave);
        }
    });
});