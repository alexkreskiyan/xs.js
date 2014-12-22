/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.defineProperties', function () {

    test('properties chain', function () {
        var me = this;

        //setUp
        //Base
        me.BaseName = 'tests.class.preprocessors.defineProperties.Base';

        //define
        me.Base = xs.Class.create(function () {
            this.properties.a = {
                get: function () {

                    return 1;
                }
            };
        });

        //save
        me.BaseSave = xs.ClassManager.get(me.BaseName);
        me.BaseSave && xs.ClassManager.remove(me.BaseName);

        //add to ClassManager
        xs.ClassManager.add(me.BaseName, me.Base);

        //Parent
        me.ParentName = 'tests.class.preprocessors.defineProperties.Parent';

        //define
        me.Parent = xs.Class.create(function () {
            this.extends = 'tests.class.preprocessors.defineProperties.Base';
            this.properties.a = {
                get: function () {

                    return this.privates.a;
                }
            };
            this.properties.b = {
                set: function (b) {

                    return this.privates.b = b + 1;
                }
            };
        });

        //save
        me.ParentSave = xs.ClassManager.get(me.ParentName);
        me.ParentSave && xs.ClassManager.remove(me.ParentName);

        //add to ClassManager
        xs.ClassManager.add(me.ParentName, me.Parent);

        //Child
        me.ChildName = 'tests.class.preprocessors.defineProperties.Child';

        //define
        me.Child = xs.Class.create(function () {
            this.extends = 'tests.class.preprocessors.defineProperties.Parent';
            this.properties.a = 2;
            this.properties.c = {
                get: function () {

                    return this.privates.c + '!';
                },
                set: function (c) {

                    return this.privates.c = '?' + c;
                }
            };
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
        var ns = tests.class.preprocessors.defineProperties;

        //test
        //Base
        var base = new ns.Base;
        //a
        strictEqual(base.a, 1);
        base.a = 2; //readonly
        strictEqual(base.a, 1);

        //Parent
        var parent = new ns.Parent;
        //a
        strictEqual(parent.a, undefined);
        parent.a = 2; //setter assigned
        strictEqual(parent.a, 2);
        strictEqual(parent.privates.a, 2);
        //b
        strictEqual(parent.b, undefined);
        parent.b = 2; //getter assigned
        strictEqual(parent.b, 3);
        strictEqual(parent.privates.b, 3);

        //Child
        var child = new ns.Child;
        //a
        strictEqual(child.a, 2);
        //b
        strictEqual(child.b, undefined);
        child.b = 2; //getter assigned
        strictEqual(child.b, 3);
        strictEqual(child.privates.b, 3);
        //c
        strictEqual(child.c, 'undefined!');
        strictEqual(child.privates.c, undefined);
        child.c = 3;
        strictEqual(child.c, '?3!');
        strictEqual(child.privates.c, '?3');

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