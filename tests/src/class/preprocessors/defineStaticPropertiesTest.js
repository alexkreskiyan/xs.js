/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.defineStaticProperties', function () {

    test('static properties chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.class.preprocessors.defineStaticProperties.Base';

        //define
        me.Base = xs.Class.create(function () {
            this.static.properties.a = {
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
        me.Parent = xs.Class.create(function () {
            this.extends = 'tests.class.preprocessors.defineStaticProperties.Base';
            this.static.properties.a = {
                get: function () {

                    return this.privates.a;
                }
            };
            this.static.properties.b = {
                set: function (b) {

                    return this.privates.b = b + 1;
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
        me.Child = xs.Class.create(function () {
            this.extends = 'tests.class.preprocessors.defineStaticProperties.Parent';
            this.static.properties.a = 2;
            this.static.properties.c = {
                get: function () {

                    return this.privates.c + '!';
                },
                set: function (c) {

                    return this.privates.c = '?' + c;
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
        var ns = tests.class.preprocessors.defineStaticProperties;

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
        strictEqual(ns.Parent.privates.a, 2);
        //b
        strictEqual(ns.Parent.b, undefined);
        ns.Parent.b = 2; //getter assigned
        strictEqual(ns.Parent.b, 3);
        strictEqual(ns.Parent.privates.b, 3);

        //Child
        //a
        strictEqual(ns.Child.a, 2);
        //b
        strictEqual(ns.Child.b, undefined);
        ns.Child.b = 2; //getter assigned
        strictEqual(ns.Child.b, 3);
        strictEqual(ns.Child.privates.b, 3);
        //c
        strictEqual(ns.Child.c, 'undefined!');
        strictEqual(ns.Child.privates.c, undefined);
        ns.Child.c = 3;
        strictEqual(ns.Child.c, '?3!');
        strictEqual(ns.Child.privates.c, '?3');
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