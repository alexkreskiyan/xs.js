/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.ContractsManager', function () {

    'use strict';

    test('has', function () {
        var me = this;

        me.Class = xs.Class(function () {
        });

        me.className = 'xs.myClass';

        //save class, if defined
        if (xs.ContractsManager.has(me.className)) {
            me.save = xs.ContractsManager.get(me.className);
            xs.ContractsManager.remove(me.className);
        }

    }, function () {
        var me = this;

        //class is not in manager
        strictEqual(xs.ContractsManager.has(me.className), false);

        //add class
        xs.ContractsManager.add(me.className, me.Class);

        //class is in manager
        strictEqual(xs.ContractsManager.has(me.className), true);


        //remove class
        xs.ContractsManager.remove(me.className);

    }, function () {
        var me = this;

        //restore save
        if (me.save) {
            xs.ContractsManager.add(me.className, me.save);
        }
    });

    test('get', function () {
        var me = this;

        me.Class = xs.Class(function () {
        });

        me.className = 'xs.myClass';

        //save class, if defined
        if (xs.ContractsManager.has(me.className)) {
            me.save = xs.ContractsManager.get(me.className);
            xs.ContractsManager.remove(me.className);
        }

        //add class
        xs.ContractsManager.add(me.className, me.Class);

    }, function () {
        var me = this;

        //class is in manager
        strictEqual(xs.ContractsManager.get(me.className), me.Class);

        //remove class
        xs.ContractsManager.remove(me.className);

        //class is not in manager
        strictEqual(xs.ContractsManager.has(me.className), false);

    }, function () {
        var me = this;

        //restore save
        if (me.save) {
            xs.ContractsManager.add(me.className, me.save);
        }
    });

    test('add', function () {
        var me = this;

        //define names
        me.classOneName = 'my.demo.first.ClassOne';
        me.classTwoName = 'my.demo.first.ClassTwo';
        me.classThreeName = 'ClassThree';

        //save classes, if defined
        if (xs.ContractsManager.has(me.classOneName)) {
            me.saveOne = xs.ContractsManager.get(me.classOneName);
            xs.ContractsManager.remove(me.classOneName);
        }

        if (xs.ContractsManager.has(me.classTwoName)) {
            me.saveTwo = xs.ContractsManager.get(me.classTwoName);
            xs.ContractsManager.remove(me.classTwoName);
        }

        if (xs.ContractsManager.has(me.classThreeName)) {
            me.saveThree = xs.ContractsManager.get(me.classThreeName);
            xs.ContractsManager.remove(me.classThreeName);
        }

        //create ClassOne
        me.ClassOne = xs.Class(function () {
        });

        //create ClassTwo
        me.ClassTwo = xs.Class(function () {
        });

        //create ClassThree
        me.ClassThree = xs.Class(function () {
        });

    }, function () {
        var me = this;

        //throws when adding non-function contract
        throws(function () {
            xs.ContractsManager.add();
        });

        //throws when adding contract for registered name
        throws(function () {
            xs.ContractsManager.add('xs.class.Base', xs.Class(xs.noop));
        });

        //throws when adding registered contract
        throws(function () {
            xs.ContractsManager.add('xs.class.Base2', xs.class.Base);
        });

        //add class one
        xs.ContractsManager.add(me.classOneName, me.ClassOne);

        //not added again with same name
        throws(function () {
            xs.ContractsManager.add(me.classOneName, me.ClassOne);
        });

        //not added again with other name
        throws(function () {
            xs.ContractsManager.add(me.classOneName + '_', me.ClassOne);
        });

        //class is in manager
        strictEqual(xs.ContractsManager.get(me.classOneName), me.ClassOne);

        //label is assigned correctly
        strictEqual(me.ClassOne.label, me.classOneName);

        //namespace ok
        strictEqual(Object.keys(window.my.demo.first).toString(), 'ClassOne');
        strictEqual(window.my.demo.first.ClassOne, me.ClassOne);

        //add class two
        xs.ContractsManager.add(me.classTwoName, me.ClassTwo);

        //not added again with same name
        throws(function () {
            xs.ContractsManager.add(me.classTwoName, me.ClassTwo);
        });

        //not added again with other name
        throws(function () {
            xs.ContractsManager.add(me.classTwoName + '_', me.ClassTwo);
        });

        //class is in manager
        strictEqual(xs.ContractsManager.get(me.classTwoName), me.ClassTwo);

        //label is assigned correctly
        strictEqual(me.ClassTwo.label, me.classTwoName);

        //namespace ok
        strictEqual(Object.keys(window.my.demo.first).toString(), 'ClassOne,ClassTwo');
        strictEqual(window.my.demo.first.ClassTwo, me.ClassTwo);

        //add class three
        xs.ContractsManager.add(me.classThreeName, me.ClassThree);

        //not added again with same name
        throws(function () {
            xs.ContractsManager.add(me.classThreeName, me.ClassThree);
        });

        //not added again with other name
        throws(function () {
            xs.ContractsManager.add(me.classThreeName + '_', me.ClassThree);
        });

        //class is in manager
        strictEqual(xs.ContractsManager.get(me.classThreeName), me.ClassThree);

        //label is assigned correctly
        strictEqual(me.ClassThree.label, me.classThreeName);

        //namespace ok
        strictEqual(window.ClassThree, me.ClassThree);

    }, function () {
        var me = this;

        //remove defined
        xs.ContractsManager.remove(me.classOneName);
        xs.ContractsManager.remove(me.classTwoName);
        xs.ContractsManager.remove(me.classThreeName);

        //restore save
        if (me.saveOne) {
            xs.ContractsManager.add(me.classOneName, me.saveOne);
        }

        if (me.saveTwo) {
            xs.ContractsManager.add(me.classTwoName, me.saveTwo);
        }

        if (me.saveThree) {
            xs.ContractsManager.add(me.classThreeName, me.saveThree);
        }
    });

    test('remove', function () {
        var me = this;

        //define names
        me.classOneName = 'my.demo.first.ClassOne';
        me.classTwoName = 'my.demo.first.ClassTwo';
        me.classThreeName = 'ClassThree';

        //save classes, if defined
        if (xs.ContractsManager.has(me.classOneName)) {
            me.saveOne = xs.ContractsManager.get(me.classOneName);
            xs.ContractsManager.remove(me.classOneName);
        }

        if (xs.ContractsManager.has(me.classTwoName)) {
            me.saveTwo = xs.ContractsManager.get(me.classTwoName);
            xs.ContractsManager.remove(me.classTwoName);
        }

        if (xs.ContractsManager.has(me.classThreeName)) {
            me.saveThree = xs.ContractsManager.get(me.classThreeName);
            xs.ContractsManager.remove(me.classThreeName);
        }

        //create ClassOne
        me.ClassOne = xs.Class(function () {
        });

        //create ClassTwo
        me.ClassTwo = xs.Class(function () {
        });

        //create ClassThree
        me.ClassThree = xs.Class(function () {
        });

        //add classOne
        xs.ContractsManager.add(me.classOneName, me.ClassOne);
        //add classTwo
        xs.ContractsManager.add(me.classTwoName, me.ClassTwo);
        //add classThree
        xs.ContractsManager.add(me.classThreeName, me.ClassThree);

    }, function () {
        var me = this;

        //throws when removing unknown contract
        throws(function () {
            xs.ContractsManager.remove('xs.unknown');
        });

        //test namespaces
        strictEqual(Object.keys(window.my.demo.first).toString(), 'ClassOne,ClassTwo');
        strictEqual(window.my.demo.first.ClassTwo, me.ClassTwo);

        //remove classOne
        xs.ContractsManager.remove(me.classOneName);

        //not removed again
        throws(function () {
            xs.ContractsManager.remove(me.classOneName);
        });

        //class is not in manager
        strictEqual(xs.ContractsManager.has(me.classOneName), false);

        //label is removed
        strictEqual(xs.Attribute.defined(me.ClassOne, 'label'), false);

        //namespace is cleaned
        strictEqual(xs.Attribute.defined(window.my.demo.first, 'ClassOne'), false);
        strictEqual(Object.keys(window.my.demo.first).toString(), 'ClassTwo');
        strictEqual(window.my.demo.first.ClassTwo, me.ClassTwo);

        //remove classTwo
        xs.ContractsManager.remove(me.classTwoName);

        //not removed again
        throws(function () {
            xs.ContractsManager.remove(me.classTwoName);
        });

        //class is not in manager
        strictEqual(xs.ContractsManager.has(me.classTwoName), false);

        //label is removed
        strictEqual(xs.Attribute.defined(me.ClassTwo, 'label'), false);

        //namespace is cleaned
        strictEqual(xs.Attribute.defined(window, 'my'), false);

        //remove classThree
        xs.ContractsManager.remove(me.classThreeName);

        //not removed again
        throws(function () {
            xs.ContractsManager.remove(me.classThreeName);
        });

        //class is not in manager
        strictEqual(xs.ContractsManager.has(me.classThreeName), false);

        //label is removed
        strictEqual(xs.Attribute.defined(me.ClassThree, 'label'), false);

        //namespace is cleaned
        strictEqual(xs.Attribute.defined(window, me.classThreeName), false);

    }, function () {
        var me = this;

        //restore save
        if (me.saveOne) {
            xs.ContractsManager.add(me.classOneName, me.saveOne);
        }

        if (me.saveTwo) {
            xs.ContractsManager.add(me.classTwoName, me.saveTwo);
        }

        if (me.saveThree) {
            xs.ContractsManager.add(me.classThreeName, me.saveThree);
        }
    });

    test('define', function () {
        var me = this;

        me.className = 'xs.myClass';

        //save class, if defined
        if (xs.ContractsManager.has(me.className)) {
            me.save = xs.ContractsManager.get(me.className);
            xs.ContractsManager.remove(me.className);
        }


        //define class
        me.Class = xs.define(xs.Class, me.className, function () {
        });

    }, function () {
        var me = this;

        //class is in manager
        strictEqual(xs.ContractsManager.get(me.className), me.Class);

        //label is assigned correctly
        strictEqual(me.Class.label, me.className);

        //namespace ok
        strictEqual(xs.myClass, me.Class);


        //remove class
        xs.ContractsManager.remove(me.className);

    }, function () {
        var me = this;
        //restore save
        if (me.save) {
            xs.ContractsManager.add(me.className, me.save);
        }
    });

    test('getName', function () {
        //path must be correct name
        throws(function () {
            xs.ContractsManager.getName('a.b.c.');
        });

        //name is part of path after last dot
        strictEqual(xs.ContractsManager.getName('a.b.c'), 'c');
    });

    test('getPath', function () {
        //path must be correct name
        throws(function () {
            xs.ContractsManager.getPath('a.b.c.');
        });

        //name is part of path after last dot
        strictEqual(xs.ContractsManager.getPath('a.b.c'), 'a.b');
    });

    test('getNamespace', function () {
        //root must be an object
        throws(function () {
            xs.ContractsManager.getNamespace('a.b.c');
        });

        var root = {};

        //path must be valid name or empty string
        throws(function () {
            xs.ContractsManager.getNamespace(root, '_');
        });

        //empty path returns root
        strictEqual(xs.ContractsManager.getNamespace(root, ''), root);

        //normal path resolves correctly
        var root1 = xs.ContractsManager.getNamespace(root, 'a.b.c');
        strictEqual(root1, root.a.b.c);

        //coherent call doesn't recreate namespace
        var root2 = xs.ContractsManager.getNamespace(root, 'a.b');
        strictEqual(root2.c, root1);
    });

});