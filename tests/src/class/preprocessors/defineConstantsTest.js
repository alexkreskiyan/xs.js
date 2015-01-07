/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.defineConstants', function () {

    'use strict';

    test('constants chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.class.preprocessors.defineConstants.Base';

        //define
        me.Base = xs.Class(function () {
            this.constant.a = 1;
        });

        //save
        if (xs.ContractsManager.has(me.BaseName)) {
            me.BaseSave = xs.ContractsManager.get(me.BaseName);
            xs.ContractsManager.remove(me.BaseName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.class.preprocessors.defineConstants.Parent';

        //define
        me.Parent = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.defineConstants.Base';
            this.constant.a = 2;
            this.constant.b = 3;
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.defineConstants.Child';

        //define
        me.Child = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.defineConstants.Parent';
            this.constant.c = 5;
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
        var ns = window.tests.class.preprocessors.defineConstants;

        //check constants
        //Base
        //a
        strictEqual(ns.Base.a, 1);
        strictEqual(xs.Attribute.isWritable(ns.Base, 'a'), false);
        strictEqual(xs.Attribute.isConfigurable(ns.Base, 'a'), false);

        //Parent
        //a
        strictEqual(ns.Parent.a, 2);
        strictEqual(xs.Attribute.isWritable(ns.Parent, 'a'), false);
        strictEqual(xs.Attribute.isConfigurable(ns.Parent, 'a'), false);
        //b
        strictEqual(ns.Parent.b, 3);
        strictEqual(xs.Attribute.isWritable(ns.Parent, 'b'), false);
        strictEqual(xs.Attribute.isConfigurable(ns.Parent, 'b'), false);

        //Child
        //a
        strictEqual(ns.Child.a, 2);
        strictEqual(xs.Attribute.isWritable(ns.Child, 'a'), false);
        strictEqual(xs.Attribute.isConfigurable(ns.Child, 'a'), false);
        //b
        strictEqual(ns.Child.b, 3);
        strictEqual(xs.Attribute.isWritable(ns.Child, 'b'), false);
        strictEqual(xs.Attribute.isConfigurable(ns.Child, 'b'), false);
        //c
        strictEqual(ns.Child.c, 5);
        strictEqual(xs.Attribute.isWritable(ns.Child, 'c'), false);
        strictEqual(xs.Attribute.isConfigurable(ns.Child, 'c'), false);


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