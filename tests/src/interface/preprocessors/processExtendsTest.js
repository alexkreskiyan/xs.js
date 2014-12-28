/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.interface.preprocessors.processExtends', function () {

    'use strict';

    test('extend base', function () {
        var me = this;

        me.InterfaceName = 'tests.interface.preprocessors.processExtends.Interface';

        //create Interface
        me.Interface = xs.define(xs.Interface, 'tests.interface.preprocessors.processExtends.Interface', function () {
        });

        xs.onReady([me.InterfaceName], me.done);

        return false;
    }, function () {
        var me = this;

        //Interface extends xs.interface.Base
        strictEqual(me.Interface.parent, xs.interface.Base);
    }, function () {
        var me = this;

        //remove Interface from ContractsManager
        xs.ContractsManager.remove(me.Interface.label);
    });

    test('extend chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.interface.preprocessors.processExtends.Base';

        //define
        me.Base = xs.Interface(function () {
        });

        //save
        if (xs.ContractsManager.has(me.BaseName)) {
            me.BaseSave = xs.ContractsManager.get(me.BaseName);
            xs.ContractsManager.remove(me.BaseName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.interface.preprocessors.processExtends.Parent';

        //define
        me.Parent = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.processExtends.Base';
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.interface.preprocessors.processExtends.Child';

        //define
        me.Child = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.processExtends.Parent';
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

        var ns = window.tests.interface.preprocessors.processExtends;

        //check chain
        strictEqual(ns.Base.parent, xs.interface.Base);
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