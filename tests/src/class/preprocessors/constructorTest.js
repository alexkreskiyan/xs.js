/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.constructor', function () {

    test('constructor chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.class.preprocessors.constructor.Base';

        me.constructor = function () {

        };

        me.constructor2 = function () {

        };

        //define
        me.Base = xs.Class.create(function () {
            this.constructor = me.constructor;
        });

        //save
        me.BaseSave = xs.ClassManager.get(me.BaseName);
        me.BaseSave && xs.ClassManager.remove(me.BaseName);

        //add to ClassManager
        xs.ClassManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.class.preprocessors.constructor.Parent';

        //define
        me.Parent = xs.Class.create(function () {
            this.extends = 'tests.class.preprocessors.constructor.Base';
        });

        //save
        me.ParentSave = xs.ClassManager.get(me.ParentName);
        me.ParentSave && xs.ClassManager.remove(me.ParentName);

        //add to ClassManager
        xs.ClassManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.constructor.Child';

        //define
        me.Child = xs.Class.create(function () {
            this.extends = 'tests.class.preprocessors.constructor.Parent';
            this.constructor = me.constructor2;
        });

        //save
        me.ChildSave = xs.ClassManager.get(me.ChildName);
        me.ChildSave && xs.ClassManager.remove(me.ChildName);

        //add to ClassManager
        xs.ClassManager.add(me.ChildName, me.Child);

        xs.onReady([
            me.BaseName,
            me.ParentName,
            me.ChildName
        ], me.done);

        return false;
    }, function () {
        var me = this;

        var ns = tests.class.preprocessors.constructor;
        //check chain
        //Base
        strictEqual(ns.Base.descriptor.constructor, me.constructor);

        //Parent
        strictEqual(ns.Parent.descriptor.constructor, me.constructor);

        //Child
        strictEqual(ns.Child.descriptor.constructor, me.constructor2);
    }, function () {
        var me = this;

        //Base
        xs.ClassManager.remove(me.BaseName);
        me.BaseSave && xs.ClassManager.add(me.BaseName, me.BaseSave);

        //Parent
        xs.ClassManager.remove(me.ParentName);
        me.ParentSave && xs.ClassManager.add(me.ParentName, me.ParentSave);

        //Child
        xs.ClassManager.remove(me.ChildName);
        me.ChildSave && xs.ClassManager.add(me.ChildName, me.ChildSave);
    });
});