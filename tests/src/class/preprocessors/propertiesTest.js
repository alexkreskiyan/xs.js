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
    'xs.class.preprocessors.properties'
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
                properties: {
                    a: {
                        get: function () {
                            return 1;
                        }
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
                extends:    'my.Base',
                properties: {
                    a: {
                        get: function () {
                            return this.privates.a;
                        }
                    },
                    b: {
                        set: function (b) {
                            return this.privates.b = b + 1;
                        }
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
                extends:    'my.Parent',
                properties: {
                    a: 2,
                    c: {
                        get: function () {
                            return this.privates.c + '!';
                        },
                        set: function (c) {
                            return this.privates.c = '?' + c;
                        }
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
        //TODO
        base.privates = {};
        strictEqual(base.a, 1);
        //readonly
        base.a = 2;
        strictEqual(base.a, 1);

        //Parent
        var parent = new my.Parent;
        //TODO
        parent.privates = {};
        strictEqual(parent.a, undefined);
        //setter assigned
        parent.a = 2;
        strictEqual(parent.a, 2);
        strictEqual(parent.privates.a, 2);

        strictEqual(parent.b, undefined);
        //getter assigned
        parent.b = 2;
        strictEqual(parent.b, 3);
        strictEqual(parent.privates.b, 3);

        //Child
        var child = new my.Child;
        //TODO
        child.privates = {};
        strictEqual(child.a, undefined); //TODO - default not assigned

        strictEqual(child.b, undefined);
        //getter assigned
        child.b = 2;
        strictEqual(child.b, 3);
        strictEqual(child.privates.b, 3);

        strictEqual(child.c, 'undefined!');
        strictEqual(child.privates.c, undefined);
        child.c = 3;
        strictEqual(child.c, '?3!');
        strictEqual(child.privates.c, '?3');


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