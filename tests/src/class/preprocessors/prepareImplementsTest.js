/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.prepareImplements', function () {

    test('prepareImplements', function () {
        var me = this;


        //Interface
        me.InterfaceName = 'tests.class.preprocessors.prepareImplements.Interface';

        //define
        me.Interface = xs.Interface(function () {
            var me = this;
            me.constants = ['a'];
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
            me.static.methods.e = xs.emptyFn;
            me.static.methods.f = function (a, b) {
            };
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
            me.methods.j = xs.emptyFn;
            me.methods.k = function (a, b) {
            };
        });

        //save
        if (xs.ContractsManager.has(me.InterfaceName)) {
            me.InterfaceSave = xs.ContractsManager.get(me.InterfaceName);
            xs.ContractsManager.remove(me.InterfaceName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.InterfaceName, me.Interface);


        //Class
        me.ClassName = 'tests.class.preprocessors.prepareImplements.Class';

        //define
        me.Class = xs.Class(function () {
            var me = this;
            me.implements = ['tests.class.preprocessors.prepareImplements.Interface'];
            me.constants.a = 1;
            me.static.properties.b = 1;
            me.static.properties.c = {get: xs.emptyFn};
            me.static.properties.d = {set: xs.emptyFn};
            me.static.methods.e = xs.emptyFn;
            me.static.methods.f = function (a, b) {
            };
            me.properties.g = 1;
            me.properties.h = {get: xs.emptyFn};
            me.properties.i = {set: xs.emptyFn};
            me.methods.j = xs.emptyFn;
            me.methods.k = function (a, b) {
            };
        });

        //save
        if (xs.ContractsManager.has(me.ClassName)) {
            me.ClassSave = xs.ContractsManager.get(me.ClassName);
            xs.ContractsManager.remove(me.ClassName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ClassName, me.Class);

        xs.onReady([me.ClassName], me.done);

        return false;
    }, function () {
        var ns = tests.class.preprocessors.prepareImplements;

        //check chain
        strictEqual(ns.Class.descriptor.implements.length, 1);
        strictEqual(ns.Class.descriptor.implements.at(0), 'tests.class.preprocessors.prepareImplements.Interface');

    }, function () {
        var me = this;

        //Interface
        xs.ContractsManager.remove(me.InterfaceName);
        me.InterfaceSave && xs.ContractsManager.add(me.InterfaceName, me.InterfaceSave);

        //Class
        xs.ContractsManager.remove(me.ClassName);
        me.ClassSave && xs.ContractsManager.add(me.ClassName, me.ClassSave);
    });

});