/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.prepareConstants', function () {

    test('constants chain', function () {
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
    }, function () {
        //Base
        strictEqual(my.Base.descriptor.constants.a, 1);

        //Parent
        strictEqual(my.Parent.descriptor.constants.a, 2);
        strictEqual(my.Parent.descriptor.constants.b, 3);

        //Child
        strictEqual(my.Child.descriptor.constants.a, 2);
        strictEqual(my.Child.descriptor.constants.b, 3);
        strictEqual(my.Child.descriptor.constants.c, 5);
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
    //TODO test async extend with using xs.Loader
});