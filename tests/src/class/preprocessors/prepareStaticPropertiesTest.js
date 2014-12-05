/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
require([
    'xs.lang.Type',
    'xs.lang.List',
    'xs.lang.Object',
    'xs.lang.Attribute',
    'xs.lang.Function',
    'xs.core.Debug',
    'xs.class.Class',
    'xs.class.ClassManager',
    'xs.class.preprocessors.namespace',
    'xs.class.preprocessors.imports',
    'xs.class.preprocessors.extends',
    'xs.class.preprocessors.prepareConstants',
    'xs.class.preprocessors.prepareStaticProperties',
    'xs.class.Base'
], function () {

    'use strict';

    module('xs.class.preprocessors.prepareStaticProperties');

    test('static properties chain', function () {
        //setUp
        //Base
        var BaseName = 'my.Base';

        var baseAGet = function () {

            return 1;
        };
        //define
        var Base = xs.Class.create(function () {
            this.static.properties.a = {
                get: baseAGet
            };
        });

        //save
        var BaseSave = xs.ClassManager.get(BaseName);
        BaseSave && xs.ClassManager.delete(BaseName);

        //add to ClassManager
        xs.ClassManager.add(BaseName, Base);

        //Parent
        var ParentName = 'my.Parent';

        var parentAGet = function () {

            return this.privates.a;
        };
        var parentBSet = function ( b ) {

            return this.privates.b = b + 1;
        };
        //define
        var Parent = xs.Class.create(function () {
            this.extends = 'my.Base';
            this.static.properties.a = {
                get: parentAGet
            };
            this.static.properties.b = {
                set: parentBSet
            };
        });

        //save
        var ParentSave = xs.ClassManager.get(ParentName);
        ParentSave && xs.ClassManager.delete(ParentName);

        //add to ClassManager
        xs.ClassManager.add(ParentName, Parent);

        //Child
        var ChildName = 'my.Child';

        var childCGet = function () {

            return this.privates.c + '!';
        };
        var childCSet = function ( c ) {

            return this.privates.c = '?' + c;
        };
        //define
        var Child = xs.Class.create(function () {
            this.extends = 'my.Parent';
            this.static.properties.a = 2;
            this.static.properties.c = {
                get: childCGet,
                set: childCSet
            };
        });

        //save
        var ChildSave = xs.ClassManager.get(ChildName);
        ChildSave && xs.ClassManager.delete(ChildName);

        //add to ClassManager
        xs.ClassManager.add(ChildName, Child);


        //test
        //init properties (will be referred to descriptor.static.properties)
        var properties;

        //check static properties definition
        //Base
        properties = my.Base.descriptor.static.properties;
        //a
        strictEqual(properties.a.get, baseAGet);
        strictEqual(properties.a.configurable, true);
        strictEqual(properties.a.enumerable, true);

        //Parent
        properties = my.Parent.descriptor.static.properties;
        //a
        strictEqual(properties.a.get, parentAGet);
        strictEqual(properties.a.configurable, true);
        strictEqual(properties.a.enumerable, true);
        //b
        strictEqual(properties.b.set, parentBSet);
        strictEqual(properties.b.configurable, true);
        strictEqual(properties.b.enumerable, true);

        //Child
        properties = my.Child.descriptor.static.properties;
        //a
        strictEqual(properties.a.value, 2);
        strictEqual(properties.a.writable, true);
        strictEqual(properties.a.configurable, true);
        strictEqual(properties.a.enumerable, true);
        //b
        strictEqual(properties.b.set, parentBSet);
        strictEqual(properties.b.configurable, true);
        strictEqual(properties.b.enumerable, true);
        //c
        strictEqual(properties.c.get, childCGet);
        strictEqual(properties.c.set, childCSet);
        strictEqual(properties.c.configurable, true);
        strictEqual(properties.c.enumerable, true);


        //tearDown
        //Base
        xs.ClassManager.delete(BaseName);
        BaseSave && xs.ClassManager.add(BaseName, BaseSave);

        //Parent
        xs.ClassManager.delete(ParentName);
        ParentSave && xs.ClassManager.add(ParentName, ParentSave);

        //Child
        xs.ClassManager.delete(ChildName);
        ChildSave && xs.ClassManager.add(ChildName, ChildSave);
    });
});