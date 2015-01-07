/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.processImplements', function () {

    'use strict';

    test('processImplements', function () {
        var me = this;

        var ns = 'tests.class.preprocessors.processImplements';

        //Base Interface
        me.BaseInterfaceName = ns + '.BaseInterface';

        //define
        me.BaseInterface = xs.Interface(function () {
            var me = this;
            me.constant = ['a'];
            me.static.properties.b = undefined;
            me.static.properties.c = {
                get: function () {
                },
                set: function () {
                }
            };
            me.static.properties.d = {
                get: function () {
                },
                set: xs.emptyFn
            };
            me.static.method.e = xs.emptyFn;
            me.static.method.f = function (a, b) {
            };
        });

        //save
        if (xs.ContractsManager.has(me.BaseInterfaceName)) {
            me.BaseInterfaceSave = xs.ContractsManager.get(me.BaseInterfaceName);
            xs.ContractsManager.remove(me.BaseInterfaceName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.BaseInterfaceName, me.BaseInterface);


        //Child Interface
        me.ChildInterfaceName = ns + '.ChildInterface';

        //define
        me.ChildInterface = xs.Interface(function () {
            var me = this;
            me.extends = ns + '.BaseInterface';
            me.properties.g = undefined;
            me.properties.h = {
                get: function () {
                },
                set: function () {
                }
            };
            me.properties.i = {
                get: function () {
                },
                set: xs.emptyFn
            };
            me.method.j = xs.emptyFn;
            me.method.k = function (a, b) {
            };
        });

        //save
        if (xs.ContractsManager.has(me.ChildInterfaceName)) {
            me.ChildInterfaceSave = xs.ContractsManager.get(me.ChildInterfaceName);
            xs.ContractsManager.remove(me.ChildInterfaceName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ChildInterfaceName, me.ChildInterface);


        //Base Class
        me.BaseClassName = ns + '.BaseClass';

        //define
        me.BaseClass = xs.Class(function () {
            var me = this;
            me.implements = ['tests.class.preprocessors.processImplements.BaseInterface'];
            me.constant.a = 1;
            me.static.properties.b = 1;
            me.static.properties.c = {get: xs.emptyFn};
            me.static.properties.d = {set: xs.emptyFn};
            me.static.method.e = xs.emptyFn;
            me.static.method.f = function (a, b) {
            };
        });

        //save
        if (xs.ContractsManager.has(me.BaseClassName)) {
            me.BaseClassSave = xs.ContractsManager.get(me.BaseClassName);
            xs.ContractsManager.remove(me.BaseClassName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.BaseClassName, me.BaseClass);


        //Child Class
        me.ChildClassName = ns + '.ChildClass';

        //define
        me.ChildClass = xs.Class(function () {
            var me = this;
            me.extends = 'tests.class.preprocessors.processImplements.BaseClass';
            me.implements = ['tests.class.preprocessors.processImplements.ChildInterface'];
            me.properties.g = 1;
            me.properties.h = {get: xs.emptyFn};
            me.properties.i = {set: xs.emptyFn};
            me.method.j = xs.emptyFn;
            me.method.k = function (a, b) {
            };
        });

        //save
        if (xs.ContractsManager.has(me.ChildClassName)) {
            me.ChildClassSave = xs.ContractsManager.get(me.ChildClassName);
            xs.ContractsManager.remove(me.ChildClassName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ChildClassName, me.ChildClass);

        xs.onReady([me.ChildClassName], me.done);

        return false;
    }, function () {
        var ns = window.tests.class.preprocessors.processImplements;

        //check chain
        strictEqual(ns.BaseClass.descriptor.implements.length, 1);
        strictEqual(ns.BaseClass.descriptor.implements.at(0), 'tests.class.preprocessors.processImplements.BaseInterface');
        strictEqual(ns.ChildClass.descriptor.implements.length, 2);
        strictEqual(ns.ChildClass.descriptor.implements.at(0), 'tests.class.preprocessors.processImplements.ChildInterface');
        strictEqual(ns.ChildClass.descriptor.implements.at(1), 'tests.class.preprocessors.processImplements.BaseInterface');

        //check implements method
        strictEqual(ns.BaseClass.implements(ns.BaseInterface), true);
        strictEqual(ns.BaseClass.implements(ns.ChildInterface), false);
        strictEqual(ns.ChildClass.implements(ns.BaseInterface), true);
        strictEqual(ns.ChildClass.implements(ns.ChildInterface), true);

    }, function () {
        var me = this;

        //BaseInterface
        xs.ContractsManager.remove(me.BaseInterfaceName);
        if (me.BaseInterfaceSave) {
            xs.ContractsManager.add(me.BaseInterfaceName, me.BaseInterfaceSave);
        }

        //ChildInterface
        xs.ContractsManager.remove(me.ChildInterfaceName);
        if (me.ChildInterfaceSave) {
            xs.ContractsManager.add(me.ChildInterfaceName, me.ChildInterfaceSave);
        }

        //BaseClass
        xs.ContractsManager.remove(me.BaseClassName);
        if (me.BaseClassSave) {
            xs.ContractsManager.add(me.BaseClassName, me.BaseClassSave);
        }

        //ChildClass
        xs.ContractsManager.remove(me.ChildClassName);
        if (me.ChildClassSave) {
            xs.ContractsManager.add(me.ChildClassName, me.ChildClassSave);
        }
    });

});