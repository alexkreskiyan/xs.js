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
    'xs.class.Class',
    'xs.class.ClassManager',
    'xs.class.preprocessors.namespace',
    'xs.class.preprocessors.extend',
    'xs.class.preprocessors.constructor',
    'xs.class.Base'
], function () {

    'use strict';

    module('xs.class.preprocessors.constructor');

    test('constructor chain', function () {
        //setUp
        //Base
        var BaseName = 'my.Base';

        var constructor = function () {

        };

        var constructor2 = function () {

        };

        //define
        var Base = xs.Class.create(function () {

            return {
                constructor: constructor
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

            return {
                extends: 'my.Base'
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

            return {
                extends:     'my.Parent',
                constructor: constructor2
            };
        });

        //save
        var ChildSave = xs.ClassManager.get(ChildName);
        ChildSave && xs.ClassManager.delete(ChildName);

        //add to ClassManager
        xs.ClassManager.add(ChildName, Child);


        //check chain
        //Base
        strictEqual(my.Base.descriptor.constructor, constructor);

        //Parent
        strictEqual(my.Parent.descriptor.constructor, constructor);

        //Child
        strictEqual(my.Child.descriptor.constructor, constructor2);


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