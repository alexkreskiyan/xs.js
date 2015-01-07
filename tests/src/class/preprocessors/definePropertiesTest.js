/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.defineProperties', function () {

    'use strict';

    test('properties chain', function () {
        var me = this;

        //setUp
        //Base
        me.BaseName = 'tests.class.preprocessors.defineProperties.Base';

        //define
        me.Base = xs.Class(function () {
            this.property.a = {
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
        me.ParentName = 'tests.class.preprocessors.defineProperties.Parent';

        //define
        me.Parent = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.defineProperties.Base';
            this.property.a = {
                get: function () {

                    return this.private.a;
                }
            };
            this.property.b = {
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
        me.ChildName = 'tests.class.preprocessors.defineProperties.Child';

        //define
        me.Child = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.defineProperties.Parent';
            this.property.a = 2;
            this.property.c = {
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
        var ns = window.tests.class.preprocessors.defineProperties;

        //test
        //Base
        var base = new ns.Base;
        //a
        strictEqual(base.a, 1);
        base.a = 2; //readonly
        strictEqual(base.a, 1);

        //Parent
        var parent = new ns.Parent;
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
        var child = new ns.Child;
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