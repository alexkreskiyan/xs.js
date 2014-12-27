/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.interface.preprocessors.prepareConstants', function () {

    test('constants chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.interface.preprocessors.prepareConstants.Base';

        //define
        me.Base = xs.Interface(function () {
            this.constants = [
                'a'
            ];
        });

        //save
        if (xs.ContractsManager.has(me.BaseName)) {
            me.BaseSave = xs.ContractsManager.get(me.BaseName);
            xs.ContractsManager.remove(me.BaseName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.interface.preprocessors.prepareConstants.Parent';

        //define
        me.Parent = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.prepareConstants.Base';
            this.constants = [
                'a',
                'b'
            ];
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.interface.preprocessors.prepareConstants.Child';

        //define
        me.Child = xs.Interface(function () {
            this.extends = 'tests.interface.preprocessors.prepareConstants.Parent';
            this.constants = [
                'a',
                'b',
                'c'
            ];
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
        var ns = tests.interface.preprocessors.prepareConstants;

        //Base
        strictEqual(ns.Base.descriptor.constants.values().toString(), 'a');

        //Parent
        strictEqual(ns.Parent.descriptor.constants.values().toString(), 'a,b');

        //Child
        strictEqual(ns.Child.descriptor.constants.values().toString(), 'a,b,c');
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