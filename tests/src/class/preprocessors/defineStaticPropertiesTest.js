/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.defineStaticProperties', function () {

    'use strict';

    test('static properties chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.class.preprocessors.defineStaticProperties.Base';

        //define
        me.Base = xs.Class(function () {
            this.static.property.a = {
                get: function () {

                    return 1;
                }
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
        me.ParentName = 'tests.class.preprocessors.defineStaticProperties.Parent';

        //define
        me.Parent = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.defineStaticProperties.Base';
            this.static.property.a = {
                get: function () {

                    return this.private.a;
                }
            };
            this.static.property.b = {
                set: function (b) {

                    this.private.b = b + 1;
                }
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
        me.ChildName = 'tests.class.preprocessors.defineStaticProperties.Child';

        //define
        me.Child = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.defineStaticProperties.Parent';
            this.static.property.a = 2;
            this.static.property.c = {
                get: function () {

                    return this.private.c + '!';
                },
                set: function (c) {

                    this.private.c = '?' + c;
                }
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
        var ns = window.tests.class.preprocessors.defineStaticProperties;

        //Base
        //a
        strictEqual(ns.Base.a, 1);
        ns.Base.a = 2; //readonly
        strictEqual(ns.Base.a, 1);

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