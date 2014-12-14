/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.prepareStaticProperties', function () {

    test('static properties chain', function () {
        var me = this;

        //Base
        me.BaseName = 'my.Base';

        me.baseAGet = function () {

            return 1;
        };
        //define
        me.Base = xs.Class.create(function () {
            this.static.properties.a = {
                get: me.baseAGet
            };
        });

        //save
        me.BaseSave = xs.ClassManager.get(me.BaseName);
        me.BaseSave && xs.ClassManager.delete(me.BaseName);

        //add to ClassManager
        xs.ClassManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'my.Parent';

        me.parentAGet = function () {

            return this.privates.a;
        };
        me.parentBSet = function (b) {

            return this.privates.b = b + 1;
        };
        //define
        me.Parent = xs.Class.create(function () {
            this.extends = 'my.Base';
            this.static.properties.a = {
                get: me.parentAGet
            };
            this.static.properties.b = {
                set: me.parentBSet
            };
        });

        //save
        me.ParentSave = xs.ClassManager.get(me.ParentName);
        me.ParentSave && xs.ClassManager.delete(me.ParentName);

        //add to ClassManager
        xs.ClassManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'my.Child';

        me.childCGet = function () {

            return this.privates.c + '!';
        };
        me.childCSet = function (c) {

            return this.privates.c = '?' + c;
        };
        //define
        me.Child = xs.Class.create(function () {
            this.extends = 'my.Parent';
            this.static.properties.a = 2;
            this.static.properties.c = {
                get: me.childCGet,
                set: me.childCSet
            };
        });

        //save
        me.ChildSave = xs.ClassManager.get(me.ChildName);
        me.ChildSave && xs.ClassManager.delete(me.ChildName);

        //add to ClassManager
        xs.ClassManager.add(me.ChildName, me.Child);

        xs.onReady(me.done);

        return false;
    }, function () {
        var me = this;

        //init properties (will be referred to descriptor.static.properties)
        var properties;

        //check static properties definition
        //Base
        properties = my.Base.descriptor.static.properties;
        //a
        strictEqual(properties.a.get, me.baseAGet);
        strictEqual(properties.a.configurable, false);
        strictEqual(properties.a.enumerable, true);

        //Parent
        properties = my.Parent.descriptor.static.properties;
        //a
        strictEqual(properties.a.get, me.parentAGet);
        strictEqual(properties.a.configurable, false);
        strictEqual(properties.a.enumerable, true);
        //b
        strictEqual(properties.b.set, me.parentBSet);
        strictEqual(properties.b.configurable, false);
        strictEqual(properties.b.enumerable, true);

        //Child
        properties = my.Child.descriptor.static.properties;
        //a
        strictEqual(properties.a.value, 2);
        strictEqual(properties.a.writable, true);
        strictEqual(properties.a.configurable, false);
        strictEqual(properties.a.enumerable, true);
        //b
        strictEqual(properties.b.set, me.parentBSet);
        strictEqual(properties.b.configurable, false);
        strictEqual(properties.b.enumerable, true);
        //c
        strictEqual(properties.c.get, me.childCGet);
        strictEqual(properties.c.set, me.childCSet);
        strictEqual(properties.c.configurable, false);
        strictEqual(properties.c.enumerable, true);

    }, function () {
        var me = this;

        //Base
        xs.ClassManager.delete(me.BaseName);
        me.BaseSave && xs.ClassManager.add(me.BaseName, me.BaseSave);

        //Parent
        xs.ClassManager.delete(me.ParentName);
        me.ParentSave && xs.ClassManager.add(me.ParentName, me.ParentSave);

        //Child
        xs.ClassManager.delete(me.ChildName);
        me.ChildSave && xs.ClassManager.add(me.ChildName, me.ChildSave);
    });
});