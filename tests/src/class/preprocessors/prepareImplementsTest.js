/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.prepareImplements', function () {

    'use strict';

    test('prepareImplements', function () {
        var me = this;


        //Interface
        me.InterfaceName = 'tests.class.preprocessors.prepareImplements.Interface';

        //define
        me.Interface = xs.Interface(function () {
            var me = this;
            me.constant = ['a'];
            me.static.property.b = undefined;
            me.static.property.c = {
                get: function () {
                },
                set: function () {
                }
            };
            me.static.property.d = {
                get: function () {
                },
                set: xs.emptyFn
            };
            me.static.method.e = xs.emptyFn;
            me.static.method.f = function (a, b) {
            };
            me.property.g = undefined;
            me.property.h = {
                get: function () {
                },
                set: function () {
                }
            };
            me.property.i = {
                get: function () {
                },
                set: xs.emptyFn
            };
            me.method.j = xs.emptyFn;
            me.method.k = function (a, b) {
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
            me.constant.a = 1;
            me.static.property.b = 1;
            me.static.property.c = {get: xs.emptyFn};
            me.static.property.d = {set: xs.emptyFn};
            me.static.method.e = xs.emptyFn;
            me.static.method.f = function (a, b) {
            };
            me.property.g = 1;
            me.property.h = {get: xs.emptyFn};
            me.property.i = {set: xs.emptyFn};
            me.method.j = xs.emptyFn;
            me.method.k = function (a, b) {
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
        var ns = window.tests.class.preprocessors.prepareImplements;

        //check chain
        strictEqual(ns.Class.descriptor.implements.length, 1);
        strictEqual(ns.Class.descriptor.implements.at(0), 'tests.class.preprocessors.prepareImplements.Interface');

    }, function () {
        var me = this;

        //Interface
        xs.ContractsManager.remove(me.InterfaceName);
        if (me.InterfaceSave) {
            xs.ContractsManager.add(me.InterfaceName, me.InterfaceSave);
        }

        //Class
        xs.ContractsManager.remove(me.ClassName);
        if (me.ClassSave) {
            xs.ContractsManager.add(me.ClassName, me.ClassSave);
        }
    });

});