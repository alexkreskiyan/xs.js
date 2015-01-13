/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.interface.preprocessors.prepareConstructor', function () {

    'use strict';

    test('constructor chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.interface.preprocessors.prepareConstructor.Base';

        me.constructor = function (a, b) {

        };

        me.constructor2 = function (b, c) {

        };

        //define
        me.Base = xs.Interface(function () {
            this.constructor = me.constructor;
        });

        //save
        if (xs.ContractsManager.has(me.BaseName)) {
            me.BaseSave = xs.ContractsManager.get(me.BaseName);
            xs.ContractsManager.remove(me.BaseName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.interface.preprocessors.prepareConstructor.Parent';

        //define
        me.Parent = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.prepareConstructor.Base';
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.interface.preprocessors.prepareConstructor.Child';

        //define
        me.Child = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.prepareConstructor.Parent';
            this.constructor = me.constructor2;
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
        var ns = window.tests.interface.preprocessors.prepareConstructor;

        //init methods (will be referred to descriptor.method)
        var methods;

        //check chain
        //Base
        strictEqual(ns.Base.descriptor.constructor.args.toString(), 'a,b');

        //Parent
        strictEqual(ns.Parent.descriptor.constructor.args.toString(), 'a,b');

        //Child
        strictEqual(ns.Child.descriptor.constructor.args.toString(), 'b,c');

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