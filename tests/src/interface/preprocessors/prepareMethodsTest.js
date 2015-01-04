/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.interface.preprocessors.prepareMethods', function () {

    'use strict';

    test('methods chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.interface.preprocessors.prepareMethods.Base';

        me.baseA = function (base, a) {

            return base + a;
        };

        //define
        me.Base = xs.Interface(function () {
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
        me.ParentName = 'tests.interface.preprocessors.prepareMethods.Parent';

        me.parentA = function (parent, a) {

            return parent + a;
        };
        me.parentB = function (parent, b) {

            return parent + b;
        };
        //define
        me.Parent = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.prepareMethods.Base';
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
        me.ChildName = 'tests.interface.preprocessors.prepareMethods.Child';

        me.childC = function (child, c) {

            return child + c;
        };
        //define
        me.Child = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.prepareMethods.Parent';
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
        var ns = window.tests.interface.preprocessors.prepareMethods;

        //init methods (will be referred to descriptor.methods)
        var methods;

        //check methods definition
        //Base
        methods = ns.Base.descriptor.methods;
        //a
        strictEqual(methods.at('a').args.toString(), 'base,a');

        //Parent
        methods = ns.Parent.descriptor.methods;
        //a
        strictEqual(methods.at('a').args.toString(), 'parent,a');
        //b
        strictEqual(methods.at('b').args.toString(), 'parent,b');

        //Child
        methods = ns.Child.descriptor.methods;
        //a
        strictEqual(methods.at('a').args.toString(), 'parent,a');
        //b
        strictEqual(methods.at('b').args.toString(), 'parent,b');
        //c
        strictEqual(methods.at('c').args.toString(), 'child,c');

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