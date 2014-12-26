/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.interface.Base', function () {
    test('chain', function () {
        var me = this;
        //Base
        me.BaseName = 'my.Base';

        //define
        me.Base = xs.Interface(function () {

        });

        //save
        if (xs.ContractsManager.has(me.BaseName)) {
            me.BaseSave = xs.ContractsManager.get(me.BaseName);
            xs.ContractsManager.remove(me.BaseName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'my.Parent';

        //define
        me.Parent = xs.Interface(function () {
            this.extends = 'my.Base';
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'my.Child';

        //define
        me.Child = xs.Interface(function () {
            this.extends = 'my.Parent';
        });

        //save
        if (xs.ContractsManager.has(me.ChildName)) {
            me.ChildSave = xs.ContractsManager.get(me.ChildName);
            xs.ContractsManager.remove(me.ChildName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ChildName, me.Child);

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
        xs.ContractsManager.remove(me.BaseName);
        me.BaseSave && xs.ContractsManager.add(me.BaseName, me.BaseSave);

        //Parent
        xs.ContractsManager.remove(me.ParentName);
        me.ParentSave && xs.ContractsManager.add(me.ParentName, me.ParentSave);

        //Child
        xs.ContractsManager.remove(me.ChildName);
        me.ChildSave && xs.ContractsManager.add(me.ChildName, me.ChildSave);
    });
});