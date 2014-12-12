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
    'xs.class.preprocessors.prepareExtends',
    'xs.class.preprocessors.prepareMixins',
    'xs.class.preprocessors.imports',
    'xs.class.preprocessors.processExtends',
    'xs.class.preprocessors.prepareConstants',
    'xs.class.preprocessors.prepareStaticProperties',
    'xs.class.preprocessors.prepareStaticMethods',
    'xs.class.preprocessors.prepareProperties',
    'xs.class.preprocessors.prepareMethods',
    'xs.class.preprocessors.processMixins',
    'xs.class.preprocessors.singleton',
    'xs.class.preprocessors.defineConstants',
    'xs.class.preprocessors.defineStaticProperties',
    'xs.class.preprocessors.defineStaticMethods',
    'xs.class.preprocessors.constructor',
    'xs.class.preprocessors.defineProperties',
    'xs.class.preprocessors.defineMethods',
    'xs.class.Base'
], function () {

    'use strict';

    module('xs.class.preprocessors.defineMethods');

    test('methods chain', function () {
        //setUp

        //Base
        var BaseName = 'my.Base';

        //define
        var Base = xs.Class.create(function () {
            this.methods.a = function () {

                return 1;
            };
        });

        //save
        var BaseSave = xs.ClassManager.get(BaseName);
        BaseSave && xs.ClassManager.delete(BaseName);

        //add to ClassManager
        xs.ClassManager.add(BaseName, Base);

        //Parent
        var ParentName = 'my.Parent';

        //define
        var Parent = xs.Class.create(function () {
            this.extends = 'my.Base';
            this.methods.a = function () {

                return 2;
            };
            this.methods.b = function () {

                return 3;
            };
        });

        //save
        var ParentSave = xs.ClassManager.get(ParentName);
        ParentSave && xs.ClassManager.delete(ParentName);

        //add to ClassManager
        xs.ClassManager.add(ParentName, Parent);

        //Child
        var ChildName = 'my.Child';

        //define
        var Child = xs.Class.create(function () {
            this.extends = 'my.Parent';
            this.methods.c = function () {

                return 5;
            };
        });

        //save
        var ChildSave = xs.ClassManager.get(ChildName);
        ChildSave && xs.ClassManager.delete(ChildName);

        //add to ClassManager
        xs.ClassManager.add(ChildName, Child);


        //test
        //Base
        var base = new my.Base;
        strictEqual(base.a(), 1);

        //Parent
        var parent = new my.Parent;
        strictEqual(parent.a(), 2);
        strictEqual(parent.b(), 3);

        //Child
        var child = new my.Child;
        strictEqual(child.a(), 2);
        strictEqual(child.b(), 3);
        strictEqual(child.c(), 5);

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