/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.interface.preprocessors.prepareProperties', function () {

    test('properties chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.interface.preprocessors.prepareProperties.Base';

        me.baseAGet = function () {

            return 1;
        };
        //define
        me.Base = xs.Interface(function () {
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
        me.ParentName = 'tests.interface.preprocessors.prepareProperties.Parent';

        me.parentAGet = function () {

            return this.privates.a;
        };
        me.parentBSet = function (b) {

            return this.privates.b = b + 1;
        };
        //define
        me.Parent = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.prepareProperties.Base';
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
        me.ChildName = 'tests.interface.preprocessors.prepareProperties.Child';


        me.childCGet = function () {

            return this.privates.c + '!';
        };
        me.childCSet = function (c) {

            return this.privates.c = '?' + c;
        };
        //define
        me.Child = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.prepareProperties.Parent';
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

        var ns = tests.interface.preprocessors.prepareProperties;

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
        me.BaseSave && xs.ContractsManager.add(me.BaseName, me.BaseSave);

        //Parent
        xs.ContractsManager.remove(me.ParentName);
        me.ParentSave && xs.ContractsManager.add(me.ParentName, me.ParentSave);

        //Child
        xs.ContractsManager.remove(me.ChildName);
        me.ChildSave && xs.ContractsManager.add(me.ChildName, me.ChildSave);
    });
});