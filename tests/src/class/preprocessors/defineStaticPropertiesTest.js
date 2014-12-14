/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.defineStaticProperties', function () {

    test('static properties chain', function () {
        var me = this;

        //Base
        me.BaseName = 'my.Base';

        //define
        me.Base = xs.Class.create(function () {
            this.static.properties.a = {
                get: function () {

                    return 1;
                }
            };
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
            this.static.properties.a = {
                get: function () {

                    return this.privates.a;
                }
            };
            this.static.properties.b = {
                set: function (b) {

                    return this.privates.b = b + 1;
                }
            };
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
            this.static.properties.a = 2;
            this.static.properties.c = {
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
        me.ChildSave && xs.ClassManager.delete(me.ChildName);

        //add to ClassManager
        xs.ClassManager.add(me.ChildName, me.Child);

        xs.onReady(me.done);

        return false;
    }, function () {
        //Base
        //a
        strictEqual(my.Base.a, 1);
        my.Base.a = 2; //readonly
        strictEqual(my.Base.a, 1);

        //Parent
        //a
        strictEqual(my.Parent.a, undefined);
        my.Parent.a = 2; //setter assigned
        strictEqual(my.Parent.a, 2);
        strictEqual(my.Parent.privates.a, 2);
        //b
        strictEqual(my.Parent.b, undefined);
        my.Parent.b = 2; //getter assigned
        strictEqual(my.Parent.b, 3);
        strictEqual(my.Parent.privates.b, 3);

        //Child
        //a
        strictEqual(my.Child.a, 2);
        //b
        strictEqual(my.Child.b, undefined);
        my.Child.b = 2; //getter assigned
        strictEqual(my.Child.b, 3);
        strictEqual(my.Child.privates.b, 3);
        //c
        strictEqual(my.Child.c, 'undefined!');
        strictEqual(my.Child.privates.c, undefined);
        my.Child.c = 3;
        strictEqual(my.Child.c, '?3!');
        strictEqual(my.Child.privates.c, '?3');
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
});