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
    'xs.class.preprocessors.extend',
    'xs.class.preprocessors.properties',
    'xs.class.preprocessors.methods',
    'xs.class.Base'
], function () {

    'use strict';

    module('xs.class.preprocessors.methods');

    test('methods chain', function () {
        //setUp

        //Base
        var BaseName = 'my.Base';

        //define
        var Base = xs.Class.create(function () {

            return {
                methods: {
                    a: function () {
                        return 1;
                    }
                }
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
                extends: 'my.Base',
                methods: {
                    a: function () {
                        return 2;
                    },
                    b: function () {
                        return 3;
                    }
                }
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
                extends: 'my.Parent',
                methods: {
                    c: function () {

                        return 5;
                    }
                }
            };
        });

        //save
        var ChildSave = xs.ClassManager.get(ChildName);
        ChildSave && xs.ClassManager.delete(ChildName);

        //add to ClassManager
        xs.ClassManager.add(ChildName, Child);

        //check methods
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