/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.namespace', function () {

    test('namespace usage chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.class.preprocessors.namespace.base.Base';

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
        me.ParentName = 'tests.class.preprocessors.namespace.base.Parent';

        //define
        me.Parent = xs.Class(function () {
            this.namespace = 'tests.class.preprocessors.namespace.base';
            this.extends = 'ns.Base';
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.namespace.demo.Child';

        //define
        me.Child = xs.Class(function () {
            this.namespace = 'tests.class.preprocessors.namespace.demo';
            this.extends = 'tests.class.preprocessors.namespace.base.Parent';
        });

        //save
        if (xs.ContractsManager.has(me.ChildName)) {
            me.ChildSave = xs.ContractsManager.get(me.ChildName);
            xs.ContractsManager.remove(me.ChildName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ChildName, me.Child);

        //call done, when classes ready to continue test
        xs.onReady([
            me.BaseName,
            me.ParentName,
            me.ChildName
        ], me.done);

        return false;
    }, function () {
        var ns = tests.class.preprocessors.namespace;

        //Parent
        strictEqual(ns.base.Parent.parent, ns.base.Base);

        //Child
        strictEqual(ns.demo.Child.parent, ns.base.Parent);
    }, function () {
        var me = this;

        //Base
        xs.ContractsManager.remove(me.BaseName);
        me.BaseSave && xs.ContractsManager.add(me.BaseName, me.BaseSave);

        //Parent
        xs.ContractsManager.remove(me.ParentName);
        me.ParentSave && xs.ContractsManager.add(me.ParentName, me.ParentSave);

        //Child
        xs.ContractsManager.remove(me.ChildName);
        me.ChildSave && xs.ContractsManager.add(me.ChildName, me.ChildSave);
    });
});