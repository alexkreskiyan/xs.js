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
        me.BaseSave = xs.ClassManager.get(me.BaseName);
        me.BaseSave && xs.ClassManager.remove(me.BaseName);

        //add to ClassManager
        xs.ClassManager.add(me.BaseName, me.Base);

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
        me.ParentSave = xs.ClassManager.get(me.ParentName);
        me.ParentSave && xs.ClassManager.remove(me.ParentName);

        //add to ClassManager
        xs.ClassManager.add(me.ParentName, me.Parent);

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
        me.ChildSave = xs.ClassManager.get(me.ChildName);
        me.ChildSave && xs.ClassManager.remove(me.ChildName);

        //add to ClassManager
        xs.ClassManager.add(me.ChildName, me.Child);

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
        xs.ClassManager.remove(me.BaseName);
        me.BaseSave && xs.ClassManager.add(me.BaseName, me.BaseSave);

        //Parent
        xs.ClassManager.remove(me.ParentName);
        me.ParentSave && xs.ClassManager.add(me.ParentName, me.ParentSave);

        //Child
        xs.ClassManager.remove(me.ChildName);
        me.ChildSave && xs.ClassManager.add(me.ChildName, me.ChildSave);
    });
});