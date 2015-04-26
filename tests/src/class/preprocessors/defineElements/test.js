/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.defineElements', function () {

    'use strict';

    test('constants chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.class.preprocessors.defineElements.constants.Base';

        //define
        me.Base = xs.Class(function () {
            this.constant.a = xs.generator(Object);
        });

        //save
        if (xs.ContractsManager.has(me.BaseName)) {
            me.BaseSave = xs.ContractsManager.get(me.BaseName);
            xs.ContractsManager.remove(me.BaseName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.class.preprocessors.defineElements.constants.Parent';

        //define
        me.Parent = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.defineElements.constants.Base';
            this.constant.a = xs.generator(Object);
            this.constant.b = 3;
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.defineElements.constants.Child';

        //define
        me.Child = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.defineElements.constants.Parent';
            this.constant.c = 5;
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
        var ns = window.tests.class.preprocessors.defineElements.constants;

        //Base
        //a
        strictEqual(xs.isObject(ns.Base.a), true);
        strictEqual(xs.Attribute.isWritable(ns.Base, 'a'), false);
        strictEqual(xs.Attribute.isConfigurable(ns.Base, 'a'), false);

        //Parent
        //a
        strictEqual(xs.isObject(ns.Parent.a), true);
        strictEqual(ns.Parent.a === ns.Base.a, false);
        strictEqual(xs.Attribute.isWritable(ns.Parent, 'a'), false);
        strictEqual(xs.Attribute.isConfigurable(ns.Parent, 'a'), false);
        //b
        strictEqual(ns.Parent.b, 3);
        strictEqual(xs.Attribute.isWritable(ns.Parent, 'b'), false);
        strictEqual(xs.Attribute.isConfigurable(ns.Parent, 'b'), false);

        //Child
        //a
        strictEqual(xs.isObject(ns.Child.a), true);
        strictEqual(ns.Child.a === ns.Base.a, false);
        strictEqual(ns.Child.a === ns.Parent.a, false);
        strictEqual(xs.Attribute.isWritable(ns.Child, 'a'), false);
        strictEqual(xs.Attribute.isConfigurable(ns.Child, 'a'), false);
        //b
        strictEqual(ns.Child.b, 3);
        strictEqual(xs.Attribute.isWritable(ns.Child, 'b'), false);
        strictEqual(xs.Attribute.isConfigurable(ns.Child, 'b'), false);
        //c
        strictEqual(ns.Child.c, 5);
        strictEqual(xs.Attribute.isWritable(ns.Child, 'c'), false);
        strictEqual(xs.Attribute.isConfigurable(ns.Child, 'c'), false);
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

    test('static properties chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.class.preprocessors.defineElements.staticProperties.Base';

        me.baseAGet = function () {

            return 1;
        };
        //define
        me.Base = xs.Class(function () {
            this.static.property.a = {
                get: me.baseAGet
            };
            this.static.property.d = xs.generator(Array);
        });

        //save
        if (xs.ContractsManager.has(me.BaseName)) {
            me.BaseSave = xs.ContractsManager.get(me.BaseName);
            xs.ContractsManager.remove(me.BaseName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.class.preprocessors.defineElements.staticProperties.Parent';

        me.parentAGet = function () {

            return this.private.a;
        };
        me.parentBSet = function (b) {

            this.private.b = b + 1;
        };
        //define
        me.Parent = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.defineElements.staticProperties.Base';
            this.static.property.a = {
                get: me.parentAGet
            };
            this.static.property.b = {
                set: me.parentBSet
            };
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.defineElements.staticProperties.Child';

        me.childCGet = function () {

            return this.private.c + '!';
        };
        me.childCSet = function (c) {

            this.private.c = '?' + c;
        };
        //define
        me.Child = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.defineElements.staticProperties.Parent';
            this.static.property.a = 2;
            this.static.property.c = {
                get: me.childCGet,
                set: me.childCSet
            };
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
        var ns = window.tests.class.preprocessors.defineElements.staticProperties;

        //Base
        //a
        strictEqual(ns.Base.a, 1);
        ns.Base.a = 2; //readonly
        strictEqual(ns.Base.a, 1);
        //d
        strictEqual(xs.isArray(ns.Base.d), true);

        //Parent
        //a
        strictEqual(ns.Parent.a, undefined);
        ns.Parent.a = 2; //setter assigned
        strictEqual(ns.Parent.a, 2);
        strictEqual(ns.Parent.private.a, 2);
        //b
        strictEqual(ns.Parent.b, undefined);
        ns.Parent.b = 2; //getter assigned
        strictEqual(ns.Parent.b, 3);
        strictEqual(ns.Parent.private.b, 3);
        //d
        strictEqual(xs.isArray(ns.Base.d), true);
        strictEqual(ns.Parent.d === ns.Base.d, false);

        //Child
        //a
        strictEqual(ns.Child.a, 2);
        //b
        strictEqual(ns.Child.b, undefined);
        ns.Child.b = 2; //getter assigned
        strictEqual(ns.Child.b, 3);
        strictEqual(ns.Child.private.b, 3);
        //c
        strictEqual(ns.Child.c, 'undefined!');
        strictEqual(ns.Child.private.c, undefined);
        ns.Child.c = 3;
        strictEqual(ns.Child.c, '?3!');
        strictEqual(ns.Child.private.c, '?3');
        //d
        strictEqual(xs.isArray(ns.Base.d), true);
        strictEqual(ns.Child.d === ns.Base.d, false);
        strictEqual(ns.Child.d === ns.Parent.d, false);

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

    test('static methods chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.class.preprocessors.defineElements.staticMethods.Base';

        me.baseA = function () {

            return 1;
        };

        //define
        me.Base = xs.Class(function () {
            this.static.method.a = me.baseA;
        });

        //save
        if (xs.ContractsManager.has(me.BaseName)) {
            me.BaseSave = xs.ContractsManager.get(me.BaseName);
            xs.ContractsManager.remove(me.BaseName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.class.preprocessors.defineElements.staticMethods.Parent';

        me.parentA = function () {

            return 2;
        };
        me.parentB = function () {

            return 3;
        };
        //define
        me.Parent = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.defineElements.staticMethods.Base';
            this.static.method.a = me.parentA;
            this.static.method.b = me.parentB;
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.defineElements.staticMethods.Child';

        me.childC = function () {

            return 5;
        };
        //define
        me.Child = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.defineElements.staticMethods.Parent';
            this.static.method.c = me.childC;
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
        var ns = window.tests.class.preprocessors.defineElements.staticMethods;

        //Base
        strictEqual(ns.Base.a(), 1);

        //Parent
        strictEqual(ns.Parent.a(), 2);
        strictEqual(ns.Parent.b(), 3);

        //Child
        strictEqual(ns.Child.a(), 2);
        strictEqual(ns.Child.b(), 3);
        strictEqual(ns.Child.c(), 5);

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

    test('properties chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.class.preprocessors.defineElements.properties.Base';

        me.baseAGet = function () {

            return 1;
        };
        //define
        me.Base = xs.Class(function () {
            this.property.a = {
                get: me.baseAGet
            };
        });

        //save
        if (xs.ContractsManager.has(me.BaseName)) {
            me.BaseSave = xs.ContractsManager.get(me.BaseName);
            xs.ContractsManager.remove(me.BaseName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.class.preprocessors.defineElements.properties.Parent';

        me.parentAGet = function () {

            return this.private.a;
        };
        me.parentBSet = function (b) {

            this.private.b = b + 1;
        };
        //define
        me.Parent = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.defineElements.properties.Base';
            this.property.a = {
                get: me.parentAGet
            };
            this.property.b = {
                set: me.parentBSet
            };
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.defineElements.properties.Child';


        me.childCGet = function () {

            return this.private.c + '!';
        };
        me.childCSet = function (c) {

            this.private.c = '?' + c;
        };
        //define
        me.Child = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.defineElements.properties.Parent';
            this.property.a = 2;
            this.property.c = {
                get: me.childCGet,
                set: me.childCSet
            };
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
        var ns = window.tests.class.preprocessors.defineElements.properties;

        //Base
        var base = new ns.Base();
        //a
        strictEqual(base.a, 1);
        base.a = 2; //readonly
        strictEqual(base.a, 1);

        //Parent
        var parent = new ns.Parent();
        //a
        strictEqual(parent.a, undefined);
        parent.a = 2; //setter assigned
        strictEqual(parent.a, 2);
        strictEqual(parent.private.a, 2);
        //b
        strictEqual(parent.b, undefined);
        parent.b = 2; //getter assigned
        strictEqual(parent.b, 3);
        strictEqual(parent.private.b, 3);

        //Child
        var child = new ns.Child();
        //a
        strictEqual(child.a, 2);
        //b
        strictEqual(child.b, undefined);
        child.b = 2; //getter assigned
        strictEqual(child.b, 3);
        strictEqual(child.private.b, 3);
        //c
        strictEqual(child.c, 'undefined!');
        strictEqual(child.private.c, undefined);
        child.c = 3;
        strictEqual(child.c, '?3!');
        strictEqual(child.private.c, '?3');

    }, function () {
        var me = this;

        //tearDown
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

    test('methods chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.class.preprocessors.defineElements.methods.Base';

        me.baseA = function () {

            return 1;
        };

        //define
        me.Base = xs.Class(function () {
            this.method.a = me.baseA;
        });

        //save
        if (xs.ContractsManager.has(me.BaseName)) {
            me.BaseSave = xs.ContractsManager.get(me.BaseName);
            xs.ContractsManager.remove(me.BaseName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.class.preprocessors.defineElements.methods.Parent';

        me.parentA = function () {

            return 2;
        };
        me.parentB = function () {

            return 3;
        };
        //define
        me.Parent = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.defineElements.methods.Base';
            this.method.a = me.parentA;
            this.method.b = me.parentB;
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.defineElements.methods.Child';

        me.childC = function () {

            return 5;
        };
        //define
        me.Child = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.defineElements.methods.Parent';
            this.method.c = me.childC;
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
        var ns = window.tests.class.preprocessors.defineElements.methods;

        //Base
        var base = new ns.Base();
        strictEqual(base.a(), 1);

        //Parent
        var parent = new ns.Parent();
        strictEqual(parent.a(), 2);
        strictEqual(parent.b(), 3);

        //Child
        var child = new ns.Child();
        strictEqual(child.a(), 2);
        strictEqual(child.b(), 3);
        strictEqual(child.c(), 5);

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