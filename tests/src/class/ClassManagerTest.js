require([
    'xs.lang.Detect',
    'xs.lang.List',
    'xs.lang.Object',
    'xs.lang.Attribute',
    'xs.lang.Function',
    'xs.class.Class',
    'xs.class.ClassManager'
], function () {
    'use strict';
    module('xs.ClassManager');
    test('has', function () {
        var Class = xs.Class.create(function () {
            return {};
        });

        var className = 'xs.myClass';

        //save class, if defined
        var save = xs.ClassManager.get(className);
        save && xs.ClassManager.delete(className);


        //class is not in manager
        strictEqual(xs.ClassManager.has(className), false);

        //add class
        xs.ClassManager.add(className, Class);

        //class is in manager
        strictEqual(xs.ClassManager.has(className), true);


        //delete class
        xs.ClassManager.delete(className);


        //restore save
        save && xs.ClassManager.add(className, save);
    });
    test('get', function () {
        var Class = xs.Class.create(function () {
            return {};
        });

        var className = 'xs.myClass';

        //save class, if defined
        var save = xs.ClassManager.get(className);
        save && xs.ClassManager.delete(className);


        //add class
        xs.ClassManager.add(className, Class);

        //class is in manager
        strictEqual(xs.ClassManager.get(className), Class);


        //delete class
        xs.ClassManager.delete(className);

        //class is not in manager
        strictEqual(xs.ClassManager.get(className), undefined);


        //restore save
        save && xs.ClassManager.add(className, save);
    });
    test('add', function () {
        var Class = xs.Class.create(function () {
            return {};
        });

        var className = 'xs.myClass';

        //save class, if defined
        var save = xs.ClassManager.get(className);
        save && xs.ClassManager.delete(className);


        //add class
        xs.ClassManager.add(className, Class);

        //not added again
        throws(function () {
            xs.ClassManager.add(className, Class);
        });

        //class is in manager
        strictEqual(xs.ClassManager.get(className), Class);

        //label is assigned correctly
        strictEqual(Class.label, className);

        //namespace ok
        strictEqual(xs.myClass, Class);


        //delete class
        xs.ClassManager.delete(className);


        //restore save
        save && xs.ClassManager.add(className, save);
    });
    test('delete', function () {
        var Class = xs.Class.create(function () {
            return {};
        });

        var className = 'xs.myClass';

        //save class, if defined
        var save = xs.ClassManager.get(className);
        save && xs.ClassManager.delete(className);


        //add class
        xs.ClassManager.add(className, Class);


        //delete class
        xs.ClassManager.delete(className);

        //not deleted again
        throws(function () {
            xs.ClassManager.delete(className);
        });

        //class is not in manager
        strictEqual(xs.ClassManager.get(className), undefined);

        //label is removed
        strictEqual(xs.Attribute.defined(Class, 'label'), false);

        //namespace is cleaned
        strictEqual(xs.Attribute.defined(xs, 'myClass'), false);


        //restore save
        save && xs.ClassManager.add(className, save);
    });
    test('define', function () {
        var className = 'xs.myClass';

        //save class, if defined
        var save = xs.ClassManager.get(className);
        save && xs.ClassManager.delete(className);


        //define class
        var Class = xs.define(className, function () {
            return {};
        });

        //not defined again
        throws(function () {
            xs.define(className, function () {
                return {};
            })
        });

        //class is in manager
        strictEqual(xs.ClassManager.get(className), Class);

        //label is assigned correctly
        strictEqual(Class.label, className);

        //namespace ok
        strictEqual(xs.myClass, Class);


        //delete class
        xs.ClassManager.delete(className);


        //restore save
        save && xs.ClassManager.add(className, save);
    });
    test('is', function () {
        var One = xs.Class.create(function () {
            return {};
        });
        var oneName = 'xs.myOne';

        //save class, if defined
        var saveOne = xs.ClassManager.get(oneName);
        saveOne && xs.ClassManager.delete(oneName);


        var Two = xs.Class.create(function () {
            return {};
        });
        var twoName = 'xs.myTwo';

        //save class, if defined
        var saveTwo = xs.ClassManager.get(twoName);
        saveTwo && xs.ClassManager.delete(twoName);


        //add classes
        xs.ClassManager.add(oneName, One);
        xs.ClassManager.add(twoName, Two);

        var x = new One;

        //direct class notation
        strictEqual(xs.is(x, One), true);
        strictEqual(xs.is(x, Two), false);

        //use namespace notation
        strictEqual(xs.is(x, xs.myOne), true);
        strictEqual(xs.is(x, xs.myTwo), false);

        //use string notation
        strictEqual(xs.is(x, 'xs.myOne'), true);
        strictEqual(xs.is(x, 'xs.myTwo'), false);

        //delete classes
        xs.ClassManager.delete(oneName);
        xs.ClassManager.delete(twoName);


        //restore saved
        saveOne && xs.ClassManager.add(oneName, saveOne);
        saveTwo && xs.ClassManager.add(twoName, saveTwo);
    });
});