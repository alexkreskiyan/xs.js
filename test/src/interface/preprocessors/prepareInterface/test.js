/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.interface.preprocessors.prepareInterface', function () {

    'use strict';

    test('extend base', function () {
        //create Interface
        var Interface = xs.Interface(function () {
        });

        //Interface extends xs.interface.Base
        strictEqual(Interface.descriptor.extends, undefined);
    });

    test('extend chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.interface.preprocessors.prepareInterface.Base';

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
        me.ParentName = 'tests.interface.preprocessors.prepareInterface.Parent';

        //define
        me.Parent = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.prepareInterface.Base';
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.interface.preprocessors.prepareInterface.Child';

        //define
        me.Child = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.prepareInterface.Parent';
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
        var ns = window.tests.interface.preprocessors.prepareInterface;

        //check chain
        strictEqual(ns.Base.parent, xs.interface.Base);
        strictEqual(ns.Parent.parent, ns.Base);
        strictEqual(ns.Child.parent, ns.Parent);

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