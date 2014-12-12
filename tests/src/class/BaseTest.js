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
    'xs.class.preprocessors.defineStaticMethods',
    'xs.class.preprocessors.constructor',
    'xs.class.preprocessors.defineProperties',
    'xs.class.preprocessors.defineMethods',
    'xs.class.Base'
], function () {
    'use strict';
    module('xs.Base');

    asyncTest('chain', function () {
        //setUp
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

        setTimeout(function () {
            //continue async test
            start();

            //check inherits
            strictEqual(Child.inherits(Parent), true);
            strictEqual(Parent.inherits(Base), true);
            strictEqual(Child.inherits(Base), true);

            strictEqual(Base.inherits(Parent), false);
            strictEqual(Parent.inherits(Child), false);
            strictEqual(Base.inherits(Child), false);

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
        }, 20);
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