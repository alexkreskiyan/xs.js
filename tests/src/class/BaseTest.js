/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.Base', function () {
    test('chain', function () {
        //Base
        var BaseName = 'my.Base';

        //define
        var Base = xs.Class.create(function () {

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
        });

        //save
        var ChildSave = xs.ClassManager.get(ChildName);
        ChildSave && xs.ClassManager.delete(ChildName);

        //add to ClassManager
        xs.ClassManager.add(ChildName, Child);

    }, function () {
        //check inherits
        strictEqual(Child.inherits(Parent), true);
        strictEqual(Parent.inherits(Base), true);
        strictEqual(Child.inherits(Base), true);

        strictEqual(Base.inherits(Parent), false);
        strictEqual(Parent.inherits(Child), false);
        strictEqual(Base.inherits(Child), false);

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

    test('clone', function () {
        //create simple xs.Base instance
        var sample = new xs.Base;
        sample.a = 1;

        //create clone
        var clone = sample.clone();

        //clone is equal by keys
        strictEqual(JSON.stringify(xs.keys(clone)), JSON.stringify(xs.keys(sample)));

        //values are equal
        xs.each(sample, function (value, key) {
            strictEqual(clone[key], value);
        });

        //clone constructor is ok
        strictEqual(clone.constructor, xs.Base);
    })
});