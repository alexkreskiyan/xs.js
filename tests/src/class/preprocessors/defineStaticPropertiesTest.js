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
    'xs.class.preprocessors.defineStaticProperties',
    'xs.class.Base'
], function () {

    'use strict';

    module('xs.class.preprocessors.defineStaticProperties');

    test('static properties chain', function () {
        //setUp
        //Base
        var BaseName = 'my.Base';

        //define
        var Base = xs.Class.create(function () {
            this.static.properties.a = {
                get: function () {

                    return 1;
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
            this.extends = 'my.Base';
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
        var ParentSave = xs.ClassManager.get(ParentName);
        ParentSave && xs.ClassManager.delete(ParentName);

        //add to ClassManager
        xs.ClassManager.add(ParentName, Parent);

        //Child
        var ChildName = 'my.Child';

        //define
        var Child = xs.Class.create(function () {
            this.extends = 'my.Parent';
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
        var ChildSave = xs.ClassManager.get(ChildName);
        ChildSave && xs.ClassManager.delete(ChildName);

        //add to ClassManager
        xs.ClassManager.add(ChildName, Child);


        //test
        //Base
        //a
        strictEqual(my.Base.a, 1);
        my.Base.a = 2; //readonly
        strictEqual(my.Base.a, 1);

        //Parent
        //a
        strictEqual(my.Parent.a, undefined);
        my.Parent.a = 2; //setter assigned
        strictEqual(my.Parent.a, 2);
        strictEqual(my.Parent.privates.a, 2);
        //b
        strictEqual(my.Parent.b, undefined);
        my.Parent.b = 2; //getter assigned
        strictEqual(my.Parent.b, 3);
        strictEqual(my.Parent.privates.b, 3);

        //Child
        //a
        strictEqual(my.Child.a, 2);
        //b
        strictEqual(my.Child.b, undefined);
        my.Child.b = 2; //getter assigned
        strictEqual(my.Child.b, 3);
        strictEqual(my.Child.privates.b, 3);
        //c
        strictEqual(my.Child.c, 'undefined!');
        strictEqual(my.Child.privates.c, undefined);
        my.Child.c = 3;
        strictEqual(my.Child.c, '?3!');
        strictEqual(my.Child.privates.c, '?3');


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