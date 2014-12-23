/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.prepareProperties', function () {

    test('properties chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.class.preprocessors.prepareProperties.Base';

        me.baseAGet = function () {

            return 1;
        };
        //define
        me.Base = xs.Class.create(function () {
            this.properties.a = {
                get: me.baseAGet
            };
        });

        //save
        if (xs.ClassManager.has(me.BaseName)) {
            me.BaseSave = xs.ClassManager.get(me.BaseName);
            xs.ClassManager.remove(me.BaseName);
        }

        //add to ClassManager
        xs.ClassManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.class.preprocessors.prepareProperties.Parent';

        me.parentAGet = function () {

            return this.privates.a;
        };
        me.parentBSet = function (b) {

            return this.privates.b = b + 1;
        };
        //define
        me.Parent = xs.Class.create(function () {
            this.extends = 'tests.class.preprocessors.prepareProperties.Base';
            this.properties.a = {
                get: me.parentAGet
            };
            this.properties.b = {
                set: me.parentBSet
            };
        });

        //save
        if (xs.ClassManager.has(me.ParentName)) {
            me.ParentSave = xs.ClassManager.get(me.ParentName);
            xs.ClassManager.remove(me.ParentName);
        }

        //add to ClassManager
        xs.ClassManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.prepareProperties.Child';


        me.childCGet = function () {

            return this.privates.c + '!';
        };
        me.childCSet = function (c) {

            return this.privates.c = '?' + c;
        };
        //define
        me.Child = xs.Class.create(function () {
            this.extends = 'tests.class.preprocessors.prepareProperties.Parent';
            this.properties.a = 2;
            this.properties.c = {
                get: me.childCGet,
                set: me.childCSet
            };
        });

        //save
        if (xs.ClassManager.has(me.ChildName)) {
            me.ChildSave = xs.ClassManager.get(me.ChildName);
            xs.ClassManager.remove(me.ChildName);
        }

        //add to ClassManager
        xs.ClassManager.add(me.ChildName, me.Child);

        xs.onReady([
            me.BaseName,
            me.ParentName,
            me.ChildName
        ], me.done);

        return false;
    }, function () {
        var me = this;

        var ns = tests.class.preprocessors.prepareProperties;

        //init properties (will be referred to descriptor.static.properties)
        var properties;

        //check properties definition
        //Base
        properties = ns.Base.descriptor.properties;
        //a
        strictEqual(properties.at('a').get, me.baseAGet);
        strictEqual(properties.at('a').configurable, false);
        strictEqual(properties.at('a').enumerable, true);

        //Parent
        properties = ns.Parent.descriptor.properties;
        //a
        strictEqual(properties.at('a').get, me.parentAGet);
        strictEqual(properties.at('a').configurable, false);
        strictEqual(properties.at('a').enumerable, true);
        //b
        strictEqual(properties.at('b').set, me.parentBSet);
        strictEqual(properties.at('b').configurable, false);
        strictEqual(properties.at('b').enumerable, true);

        //Child
        properties = ns.Child.descriptor.properties;
        //a
        strictEqual(properties.at('a').value, 2);
        strictEqual(properties.at('a').writable, true);
        strictEqual(properties.at('a').configurable, false);
        strictEqual(properties.at('a').enumerable, true);
        //b
        strictEqual(properties.at('b').set, me.parentBSet);
        strictEqual(properties.at('b').configurable, false);
        strictEqual(properties.at('b').enumerable, true);
        //c
        strictEqual(properties.at('c').get, me.childCGet);
        strictEqual(properties.at('c').set, me.childCSet);
        strictEqual(properties.at('c').configurable, false);
        strictEqual(properties.at('c').enumerable, true);

    }, function () {
        var me = this;

        //tearDown
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