require([
    'xs.lang.Detect',
    'xs.lang.List',
    'xs.lang.Object',
    'xs.lang.Attribute',
    'xs.lang.Function',
    'xs.class.Class',
    'xs.class.ClassManager',
    'xs.class.Base',
    'xs.class.preprocessors.extend',
    'xs.class.preprocessors.const'
], function () {
    'use strict';
    module('xs.class.preprocessors.const');
    test('const chain', function () {
        //setUp

        //Base
        var BaseName = 'my.Base';
        //define
        var Base = xs.Class.create(function () {
            return {
                const: {
                    a: 1
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
                const:   {
                    a: 2,
                    b: 3
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
                const:   {
                    c: 5
                }
            };
        });
        //save
        var ChildSave = xs.ClassManager.get(ChildName);
        ChildSave && xs.ClassManager.delete(ChildName);
        //add to ClassManager
        xs.ClassManager.add(ChildName, Child);

        //check constants
        //Base
        strictEqual(my.Base.a, 1);
        strictEqual(xs.Attribute.isWritable(my.Base, 'a'), false);
        strictEqual(xs.Attribute.isConfigurable(my.Base, 'a'), false);

        //Parent
        strictEqual(my.Parent.a, 2);
        strictEqual(xs.Attribute.isWritable(my.Parent, 'a'), false);
        strictEqual(xs.Attribute.isConfigurable(my.Parent, 'a'), false);
        strictEqual(my.Parent.b, 3);
        strictEqual(xs.Attribute.isWritable(my.Parent, 'b'), false);
        strictEqual(xs.Attribute.isConfigurable(my.Parent, 'b'), false);

        //Child
        strictEqual(my.Child.a, 2);
        strictEqual(xs.Attribute.isWritable(my.Child, 'a'), false);
        strictEqual(xs.Attribute.isConfigurable(my.Child, 'a'), false);
        strictEqual(my.Child.b, 3);
        strictEqual(xs.Attribute.isWritable(my.Child, 'b'), false);
        strictEqual(xs.Attribute.isConfigurable(my.Child, 'b'), false);
        strictEqual(my.Child.c, 5);
        strictEqual(xs.Attribute.isWritable(my.Child, 'c'), false);
        strictEqual(xs.Attribute.isConfigurable(my.Child, 'c'), false);

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