/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.prepareConstants', function () {

    test('constants chain', function () {
        var me = this;

        //Base
        me.BaseName = 'tests.class.preprocessors.prepareConstants.Base';

        //define
        me.Base = xs.Class.create(function () {
            this.constants.a = 1;
        });

        //save
        if (xs.ClassManager.has(me.BaseName)) {
            me.BaseSave = xs.ClassManager.get(me.BaseName);
            xs.ClassManager.remove(me.BaseName);
        }

        //add to ClassManager
        xs.ClassManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.class.preprocessors.prepareConstants.Parent';

        //define
        me.Parent = xs.Class.create(function () {
            this.extends = 'tests.class.preprocessors.prepareConstants.Base';
            this.constants.a = 2;
            this.constants.b = 3;
        });

        //save
        if (xs.ClassManager.has(me.ParentName)) {
            me.ParentSave = xs.ClassManager.get(me.ParentName);
            xs.ClassManager.remove(me.ParentName);
        }

        //add to ClassManager
        xs.ClassManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.prepareConstants.Child';

        //define
        me.Child = xs.Class.create(function () {
            this.extends = 'tests.class.preprocessors.prepareConstants.Parent';
            this.constants.c = 5;
        });

        //save
        if (xs.ClassManager.has(me.ChildName)) {
            me.ChildSave = xs.ClassManager.get(me.ChildName);
            xs.ClassManager.remove(me.ChildName);
        }

        //add to ClassManager
        xs.ClassManager.add(me.ChildName, me.Child);

        xs.onReady([
            me.BaseName,
            me.ParentName,
            me.ChildName
        ], me.done);

        return false;
    }, function () {
        var ns = tests.class.preprocessors.prepareConstants;

        //Base
        strictEqual(ns.Base.descriptor.constants.at('a'), 1);

        //Parent
        strictEqual(ns.Parent.descriptor.constants.at('a'), 2);
        strictEqual(ns.Parent.descriptor.constants.at('b'), 3);

        //Child
        strictEqual(ns.Child.descriptor.constants.at('a'), 2);
        strictEqual(ns.Child.descriptor.constants.at('b'), 3);
        strictEqual(ns.Child.descriptor.constants.at('c'), 5);
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