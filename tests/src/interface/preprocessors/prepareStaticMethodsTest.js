/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.interface.preprocessors.prepareStaticMethods', function () {

    test('static methods chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.interface.preprocessors.prepareStaticMethods.Base';

        me.baseA = function (base, a) {

            return base + a;
        };

        //define
        me.Base = xs.Interface(function () {
            this.static.methods.a = me.baseA;
        });

        //save
        if (xs.ContractsManager.has(me.BaseName)) {
            me.BaseSave = xs.ContractsManager.get(me.BaseName);
            xs.ContractsManager.remove(me.BaseName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.interface.preprocessors.prepareStaticMethods.Parent';

        me.parentA = function (parent, a) {

            return parent + a;
        };
        me.parentB = function (parent, b) {

            return parent + b;
        };
        //define
        me.Parent = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.prepareStaticMethods.Base';
            this.static.methods.a = me.parentA;
            this.static.methods.b = me.parentB;
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.interface.preprocessors.prepareStaticMethods.Child';

        me.childC = function (child, c) {

            return child + c;
        };
        //define
        me.Child = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.prepareStaticMethods.Parent';
            this.static.methods.c = me.childC;
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
        var ns = tests.interface.preprocessors.prepareStaticMethods;

        //init methods (will be referred to descriptor.static.methods)
        var methods;

        //check static methods definition
        //Base
        methods = ns.Base.descriptor.static.methods;
        //a
        strictEqual(methods.at('a').arguments.toString(), 'base,a');

        //Parent
        methods = ns.Parent.descriptor.static.methods;
        //a
        strictEqual(methods.at('a').arguments.toString(), 'parent,a');
        //b
        strictEqual(methods.at('b').arguments.toString(), 'parent,b');

        //Child
        methods = ns.Child.descriptor.static.methods;
        //a
        strictEqual(methods.at('a').arguments.toString(), 'parent,a');
        //b
        strictEqual(methods.at('b').arguments.toString(), 'parent,b');
        //c
        strictEqual(methods.at('c').arguments.toString(), 'child,c');

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