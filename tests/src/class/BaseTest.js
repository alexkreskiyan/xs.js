/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.Base', function () {
    test('chain', function () {
        var me = this;
        //Base
        me.BaseName = 'my.Base';

        //define
        me.Base = xs.Class.create(function () {

        });

        //save
        me.BaseSave = xs.ClassManager.get(me.BaseName);
        me.BaseSave && xs.ClassManager.delete(me.BaseName);

        //add to ClassManager
        xs.ClassManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'my.Parent';

        //define
        me.Parent = xs.Class.create(function () {
            this.extends = 'my.Base';
        });

        //save
        me.ParentSave = xs.ClassManager.get(me.ParentName);
        me.ParentSave && xs.ClassManager.delete(me.ParentName);

        //add to ClassManager
        xs.ClassManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'my.Child';

        //define
        me.Child = xs.Class.create(function () {
            this.extends = 'my.Parent';
        });

        //save
        me.ChildSave = xs.ClassManager.get(me.ChildName);
        me.ChildSave && xs.ClassManager.delete(me.ChildName);

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
        //check inherits
        strictEqual(me.Child.inherits(me.Parent), true);
        strictEqual(me.Parent.inherits(me.Base), true);
        strictEqual(me.Child.inherits(me.Base), true);

        strictEqual(me.Base.inherits(me.Parent), false);
        strictEqual(me.Parent.inherits(me.Child), false);
        strictEqual(me.Base.inherits(me.Child), false);

    }, function () {
        var me = this;
        //Base
        xs.ClassManager.delete(me.BaseName);
        me.BaseSave && xs.ClassManager.add(me.BaseName, me.BaseSave);

        //Parent
        xs.ClassManager.delete(me.ParentName);
        me.ParentSave && xs.ClassManager.add(me.ParentName, me.ParentSave);

        //Child
        xs.ClassManager.delete(me.ChildName);
        me.ChildSave && xs.ClassManager.add(me.ChildName, me.ChildSave);
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