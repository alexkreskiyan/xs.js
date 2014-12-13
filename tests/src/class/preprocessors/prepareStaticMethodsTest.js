/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.prepareStaticMethods', function () {

    test('static methods chain', function () {
        //Base
        var BaseName = 'my.Base';

        var baseA = function () {

            return 1;
        };

        //define
        var Base = xs.Class.create(function () {
            this.static.methods.a = baseA;
        });

        //save
        var BaseSave = xs.ClassManager.get(BaseName);
        BaseSave && xs.ClassManager.delete(BaseName);

        //add to ClassManager
        xs.ClassManager.add(BaseName, Base);

        //Parent
        var ParentName = 'my.Parent';

        var parentA = function () {

            return 2;
        };
        var parentB = function () {

            return 3;
        };
        //define
        var Parent = xs.Class.create(function () {
            this.extends = 'my.Base';
            this.static.methods.a = parentA;
            this.static.methods.b = parentB;
        });

        //save
        var ParentSave = xs.ClassManager.get(ParentName);
        ParentSave && xs.ClassManager.delete(ParentName);

        //add to ClassManager
        xs.ClassManager.add(ParentName, Parent);

        //Child
        var ChildName = 'my.Child';

        var childC = function () {

            return 5;
        };
        //define
        var Child = xs.Class.create(function () {
            this.extends = 'my.Parent';
            this.static.methods.c = childC;
        });

        //save
        var ChildSave = xs.ClassManager.get(ChildName);
        ChildSave && xs.ClassManager.delete(ChildName);

        //add to ClassManager
        xs.ClassManager.add(ChildName, Child);

    }, function () {
        //init methods (will be referred to descriptor.static.methods)
        var methods;

        //check static methods definition
        //Base
        methods = my.Base.descriptor.static.methods;
        //a
        strictEqual(methods.a.value, baseA);
        strictEqual(methods.a.writable, false);
        strictEqual(methods.a.configurable, false);
        strictEqual(methods.a.enumerable, true);

        //Parent
        methods = my.Parent.descriptor.static.methods;
        //a
        strictEqual(methods.a.value, parentA);
        strictEqual(methods.a.writable, false);
        strictEqual(methods.a.configurable, false);
        strictEqual(methods.a.enumerable, true);
        //b
        strictEqual(methods.b.value, parentB);
        strictEqual(methods.b.writable, false);
        strictEqual(methods.b.configurable, false);
        strictEqual(methods.b.enumerable, true);

        //Child
        methods = my.Child.descriptor.static.methods;
        //a
        strictEqual(methods.a.value, parentA);
        strictEqual(methods.a.writable, false);
        strictEqual(methods.a.configurable, false);
        strictEqual(methods.a.enumerable, true);
        //b
        strictEqual(methods.b.value, parentB);
        strictEqual(methods.b.writable, false);
        strictEqual(methods.b.configurable, false);
        strictEqual(methods.b.enumerable, true);
        //c
        strictEqual(methods.c.value, childC);
        strictEqual(methods.c.writable, false);
        strictEqual(methods.c.configurable, false);
        strictEqual(methods.c.enumerable, true);

    }, function () {
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