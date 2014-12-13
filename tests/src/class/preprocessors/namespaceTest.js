/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.namespace', function () {

    test('namespace usage chain', function (done) {
        //Base
        var BaseName = 'my.base.Base';

        //define
        var Base = xs.Class.create(function () {
        });

        //save
        var BaseSave = xs.ClassManager.get(BaseName);
        BaseSave && xs.ClassManager.delete(BaseName);

        //add to ClassManager
        xs.ClassManager.add(BaseName, Base);

        //Parent
        var ParentName = 'my.base.Parent';

        //define
        var Parent = xs.Class.create(function () {
            this.namespace = 'my.base';
            this.extends = 'ns.Base';
        });

        //save
        var ParentSave = xs.ClassManager.get(ParentName);
        ParentSave && xs.ClassManager.delete(ParentName);

        //add to ClassManager
        xs.ClassManager.add(ParentName, Parent);

        //Child
        var ChildName = 'my.demo.Child';

        //define
        var Child = xs.Class.create(function () {
            this.namespace = 'my.demo';
            this.extends = 'my.base.Parent';
        });

        //save
        var ChildSave = xs.ClassManager.get(ChildName);
        ChildSave && xs.ClassManager.delete(ChildName);

        //add to ClassManager
        xs.ClassManager.add(ChildName, Child);

        //call done, when classes ready to continue test
        xs.onReady(done);

        return false;
    }, function () {
        //Parent
        strictEqual(my.base.Parent.parent, my.base.Base);

        //Child
        strictEqual(my.demo.Child.parent, my.base.Parent);
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