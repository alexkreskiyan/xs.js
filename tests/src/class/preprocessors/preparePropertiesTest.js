/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.prepareProperties', function () {

    'use strict';

    test('properties chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.class.preprocessors.prepareProperties.Base';

        me.baseAGet = function () {

            return 1;
        };
        //define
        me.Base = xs.Class(function () {
            this.properties.a = {
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
        me.ParentName = 'tests.class.preprocessors.prepareProperties.Parent';

        me.parentAGet = function () {

            return this.private.a;
        };
        me.parentBSet = function (b) {

            this.private.b = b + 1;
        };
        //define
        me.Parent = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.prepareProperties.Base';
            this.properties.a = {
                get: me.parentAGet
            };
            this.properties.b = {
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
        me.ChildName = 'tests.class.preprocessors.prepareProperties.Child';


        me.childCGet = function () {

            return this.private.c + '!';
        };
        me.childCSet = function (c) {

            this.private.c = '?' + c;
        };
        //define
        me.Child = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.prepareProperties.Parent';
            this.properties.a = 2;
            this.properties.c = {
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
        var me = this;

        var ns = window.tests.class.preprocessors.prepareProperties;

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