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
    'xs.class.preprocessors.prepareStaticMethods',
    'xs.class.preprocessors.prepareProperties',
    'xs.class.preprocessors.prepareMethods',
    'xs.class.preprocessors.mixins',
    'xs.class.preprocessors.singleton',
    'xs.class.preprocessors.defineConstants',
    'xs.class.Base'
], function () {

    'use strict';

    module('xs.class.preprocessors.defineConstants');

    test('constants chain', function () {
        //setUp
        //Base
        var BaseName = 'my.Base';

        //define
        var Base = xs.Class.create(function () {
            this.constants.a = 1;
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
            this.constants.a = 2;
            this.constants.b = 3;
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
            this.constants.c = 5;
        });

        //save
        var ChildSave = xs.ClassManager.get(ChildName);
        ChildSave && xs.ClassManager.delete(ChildName);

        //add to ClassManager
        xs.ClassManager.add(ChildName, Child);


        //run test

        //check constants
        //Base
        //a
        strictEqual(my.Base.a, 1);
        strictEqual(xs.Attribute.isWritable(my.Base, 'a'), false);
        strictEqual(xs.Attribute.isConfigurable(my.Base, 'a'), true);

        //Parent
        //a
        strictEqual(my.Parent.a, 2);
        strictEqual(xs.Attribute.isWritable(my.Parent, 'a'), false);
        strictEqual(xs.Attribute.isConfigurable(my.Parent, 'a'), true);
        //b
        strictEqual(my.Parent.b, 3);
        strictEqual(xs.Attribute.isWritable(my.Parent, 'b'), false);
        strictEqual(xs.Attribute.isConfigurable(my.Parent, 'b'), true);

        //Child
        //a
        strictEqual(my.Child.a, 2);
        strictEqual(xs.Attribute.isWritable(my.Child, 'a'), false);
        strictEqual(xs.Attribute.isConfigurable(my.Child, 'a'), true);
        //b
        strictEqual(my.Child.b, 3);
        strictEqual(xs.Attribute.isWritable(my.Child, 'b'), false);
        strictEqual(xs.Attribute.isConfigurable(my.Child, 'b'), true);
        //c
        strictEqual(my.Child.c, 5);
        strictEqual(xs.Attribute.isWritable(my.Child, 'c'), false);
        strictEqual(xs.Attribute.isConfigurable(my.Child, 'c'), true);


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
    //TODO test async extend with using xs.Loader
});