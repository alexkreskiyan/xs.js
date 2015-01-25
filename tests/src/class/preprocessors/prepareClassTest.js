/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.prepareClass', function () {

    'use strict';

    test('extend base', function () {
        //create Class
        var Class = xs.Class(function () {
        });

        //Class extends xs.class.Base
        strictEqual(Class.descriptor.extends, undefined);
    });

    test('extend chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.class.preprocessors.prepareClass.extends.Base';

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
        me.ParentName = 'tests.class.preprocessors.prepareClass.extends.Parent';

        //define
        me.Parent = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.prepareClass.extends.Base';
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.prepareClass.extends.Child';

        //define
        me.Child = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.prepareClass.extends.Parent';
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
        var ns = window.tests.class.preprocessors.prepareClass.extends;

        //check chain
        strictEqual(ns.Base.parent, xs.class.Base);
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

    test('mixins', function () {
        var me = this;

        //Class
        me.ClassName = 'tests.class.preprocessors.prepareClass.mixins.Class';

        //define
        me.Class = xs.Class(function () {
            var me = this;
            me.mixins.demo = 'xs.class.Base';
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
        var ns = window.tests.class.preprocessors.prepareClass.mixins;

        //check chain
        strictEqual(ns.Class.descriptor.mixins.length, 1);
        strictEqual(ns.Class.descriptor.mixins.at('demo'), 'xs.class.Base');

    }, function () {
        var me = this;
        //Class
        xs.ContractsManager.remove(me.ClassName);
        if (me.ClassSave) {
            xs.ContractsManager.add(me.ClassName, me.ClassSave);
        }
    });

    test('implements', function () {
        var me = this;


        //Interface
        me.InterfaceName = 'tests.class.preprocessors.prepareClass.implements.Interface';

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
        me.ClassName = 'tests.class.preprocessors.prepareClass.implements.Class';

        //define
        me.Class = xs.Class(function () {
            var me = this;
            me.implements = ['tests.class.preprocessors.prepareClass.implements.Interface'];
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
        var ns = window.tests.class.preprocessors.prepareClass.implements;

        //check chain
        strictEqual(ns.Class.descriptor.implements.length, 1);
        strictEqual(ns.Class.descriptor.implements.at(0), 'tests.class.preprocessors.prepareClass.implements.Interface');

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