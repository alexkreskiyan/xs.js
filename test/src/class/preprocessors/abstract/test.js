/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.abstract', function () {

    'use strict';

    test('abstract chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.class.preprocessors.abstract.Base';

        //define
        me.Base = xs.Class(function () {
        });

        //save
        if (xs.ContractsManager.has(me.BaseName)) {
            me.BaseSave = xs.ContractsManager.get(me.BaseName);
            xs.ContractsManager.remove(me.BaseName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.class.preprocessors.abstract.Parent';

        //define
        me.Parent = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.abstract.Base';
            this.abstract = true;
        });

        //save
        if (xs.ContractsManager.has(me.ParentName)) {
            me.ParentSave = xs.ContractsManager.get(me.ParentName);
            xs.ContractsManager.remove(me.ParentName);
        }

        //add to ContractsManager
        xs.ContractsManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.abstract.Child';

        //define
        me.Child = xs.Class(function () {
            this.extends = 'tests.class.preprocessors.abstract.Parent';
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

        var ns = window.tests.class.preprocessors.abstract;

        //Base
        me.object = new ns.Base();

        //Parent
        throws(function () {
            return new ns.Parent();
        });

        //Child
        me.object = new ns.Child();

    }, function () {
        var me = this;

        //Base
        xs.ContractsManager.remove(me.BaseName);

        if (me.BaseSave) {
            xs.ContractsManager.add(me.BaseName, me.BaseSave);
        }

        //Parent
        xs.ContractsManager.remove(me.ParentName);

        if (me.ParentSave) {
            xs.ContractsManager.add(me.ParentName, me.ParentSave);
        }

        //Child
        xs.ContractsManager.remove(me.ChildName);

        if (me.ChildSave) {
            xs.ContractsManager.add(me.ChildName, me.ChildSave);
        }
    });

});