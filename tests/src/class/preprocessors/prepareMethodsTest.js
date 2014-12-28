/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.prepareMethods', function () {

    'use strict';

    test('methods chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.class.preprocessors.prepareMethods.Base';

        me.baseA = function () {

            return 1;
        };

        //define
        me.Base = xs.Class(function () {
            this.methods.a = me.baseA;
        });

        //save
        if (xs.ContractsManager.has(me.BaseName)) {
            me.BaseSave = xs.ContractsManager.get(me.BaseName);
            xs.ContractsManager.remove(me.BaseName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.class.preprocessors.prepareMethods.Parent';

        me.parentA = function () {

            return 2;
        };
        me.parentB = function () {

            return 3;
        };
        //define
        me.Parent = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.prepareMethods.Base';
            this.methods.a = me.parentA;
            this.methods.b = me.parentB;
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.prepareMethods.Child';

        me.childC = function () {

            return 5;
        };
        //define
        me.Child = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.prepareMethods.Parent';
            this.methods.c = me.childC;
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

        var ns = window.tests.class.preprocessors.prepareMethods;

        //init methods (will be referred to descriptor.methods)
        var methods;

        //check methods definition
        //Base
        methods = ns.Base.descriptor.methods;
        //a
        strictEqual(methods.at('a').value, me.baseA);
        strictEqual(methods.at('a').writable, false);
        strictEqual(methods.at('a').configurable, false);
        strictEqual(methods.at('a').enumerable, true);

        //Parent
        methods = ns.Parent.descriptor.methods;
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
        methods = ns.Child.descriptor.methods;
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