/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.defineStaticMethods', function () {

    'use strict';

    test('static methods chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.class.preprocessors.defineStaticMethods.Base';

        //define
        me.Base = xs.Class(function () {
            this.static.method.a = function () {

                return 1;
            };
        });

        //save
        if (xs.ContractsManager.has(me.BaseName)) {
            me.BaseSave = xs.ContractsManager.get(me.BaseName);
            xs.ContractsManager.remove(me.BaseName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.class.preprocessors.defineStaticMethods.Parent';

        //define
        me.Parent = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.defineStaticMethods.Base';
            this.static.method.a = function () {

                return 2;
            };
            this.static.method.b = function () {

                return 3;
            };
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.defineStaticMethods.Child';

        //define
        me.Child = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.defineStaticMethods.Parent';
            this.static.method.c = function () {

                return 5;
            };
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
        var ns = window.tests.class.preprocessors.defineStaticMethods;

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