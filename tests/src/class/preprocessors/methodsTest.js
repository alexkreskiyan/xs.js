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
    'xs.class.preprocessors.methods'
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
        strictEqual(xs.Attribute.isWritable(base, 'a'), false);
        strictEqual(xs.Attribute.isConfigurable(base, 'a'), false);

        //Parent
        var parent = new my.Parent;
        strictEqual(parent.a(), 2);
        strictEqual(xs.Attribute.isWritable(parent, 'a'), false);
        strictEqual(xs.Attribute.isConfigurable(parent, 'a'), false);
        strictEqual(parent.b(), 3);
        strictEqual(xs.Attribute.isWritable(parent, 'b'), false);
        strictEqual(xs.Attribute.isConfigurable(parent, 'b'), false);

        //Child
        var child = new my.Child;
        strictEqual(child.a(), 2);
        strictEqual(xs.Attribute.isWritable(child, 'a'), false);
        strictEqual(xs.Attribute.isConfigurable(child, 'a'), false);
        strictEqual(child.b(), 3);
        strictEqual(xs.Attribute.isWritable(child, 'b'), false);
        strictEqual(xs.Attribute.isConfigurable(child, 'b'), false);
        strictEqual(child.c(), 5);
        strictEqual(xs.Attribute.isWritable(child, 'c'), false);
        strictEqual(xs.Attribute.isConfigurable(child, 'c'), false);

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