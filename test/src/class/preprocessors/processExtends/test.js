/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.processExtends', function () {

    'use strict';

    test('extend base', function () {
        var me = this;

        me.ClassName = 'tests.class.preprocessors.processExtends.Class';

        //create Class
        me.Class = xs.define(xs.Class, 'tests.class.preprocessors.processExtends.Class', function () {
        });

        xs.onReady([ me.ClassName ], me.done);

        return false;
    }, function () {
        var me = this;

        //Class extends xs.class.Base
        strictEqual(me.Class.parent, xs.class.Base);
    }, function () {
        var me = this;

        //remove Class from ContractsManager
        xs.ContractsManager.remove(me.Class.label);
    });

    test('extend chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.class.preprocessors.processExtends.Base';

        //define
        me.Base = xs.Class(function () {
        });

        //save
        if (xs.ContractsManager.has(me.BaseName)) {
            me.BaseSave = xs.ContractsManager.get(me.BaseName);
            xs.ContractsManager.remove(me.BaseName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.class.preprocessors.processExtends.Parent';

        //define
        me.Parent = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.processExtends.Base';
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.processExtends.Child';

        //define
        me.Child = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.processExtends.Parent';
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

        var ns = window.tests.class.preprocessors.processExtends;

        //check chain
        strictEqual(ns.Base.parent, xs.class.Base);
        strictEqual(ns.Parent.parent, ns.Base);
        strictEqual(ns.Child.parent, ns.Parent);

        //check inherits
        strictEqual(me.Child.inherits(me.Parent), true);
        strictEqual(me.Parent.inherits(me.Base), true);
        strictEqual(me.Child.inherits(me.Base), true);

        strictEqual(me.Base.inherits(me.Parent), false);
        strictEqual(me.Parent.inherits(me.Child), false);
        strictEqual(me.Base.inherits(me.Child), false);

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