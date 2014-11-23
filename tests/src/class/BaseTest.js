require([
    'xs.lang.Type',
    'xs.lang.List',
    'xs.lang.Object',
    'xs.lang.Attribute',
    'xs.lang.Function',
    'xs.class.Class',
    'xs.class.ClassManager',
    'xs.class.preprocessors.extend',
    'xs.class.preprocessors.const',
    'xs.class.preprocessors.staticProperties',
    'xs.class.preprocessors.staticMethods',
    'xs.class.preprocessors.properties',
    'xs.class.preprocessors.methods',
    'xs.class.preprocessors.singleton',
    'xs.class.Base'
], function () {
    'use strict';
    module('xs.Base');

    test('chain', function () {
        //setUp
        //Base
        var BaseName = 'my.Base';

        //define
        var Base = xs.Class.create(function () {

            return {
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
                extends: 'my.Parent'
            };
        });

        //save
        var ChildSave = xs.ClassManager.get(ChildName);
        ChildSave && xs.ClassManager.delete(ChildName);

        //add to ClassManager
        xs.ClassManager.add(ChildName, Child);


        //check isChild
        strictEqual(Child.isChild(Parent), true);
        strictEqual(Parent.isChild(Base), true);
        strictEqual(Child.isChild(Base), true);

        strictEqual(Base.isChild(Parent), false);
        strictEqual(Parent.isChild(Child), false);
        strictEqual(Base.isChild(Child), false);

        //check isParent
        strictEqual(Base.isParent(Parent), true);
        strictEqual(Parent.isParent(Child), true);
        strictEqual(Base.isParent(Child), true);

        strictEqual(Child.isParent(Parent), false);
        strictEqual(Parent.isParent(Base), false);
        strictEqual(Child.isParent(Base), false);

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