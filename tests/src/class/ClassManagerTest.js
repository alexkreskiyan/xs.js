/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
require( [
    'xs.lang.Type',
    'xs.lang.List',
    'xs.lang.Object',
    'xs.lang.Attribute',
    'xs.lang.Function',
    'xs.class.Class',
    'xs.class.ClassManager'
], function () {

    'use strict';

    module( 'xs.ClassManager' );

    test( 'has', function () {
        var Class = xs.Class.create( function () {
        } );

        var className = 'xs.myClass';

        //save class, if defined
        var save = xs.ClassManager.get( className );
        save && xs.ClassManager.delete( className );


        //class is not in manager
        strictEqual( xs.ClassManager.has( className ), false );

        //add class
        xs.ClassManager.add( className, Class );

        //class is in manager
        strictEqual( xs.ClassManager.has( className ), true );


        //delete class
        xs.ClassManager.delete( className );


        //restore save
        save && xs.ClassManager.add( className, save );
    } );

    test( 'get', function () {
        var Class = xs.Class.create( function () {
        } );

        var className = 'xs.myClass';

        //save class, if defined
        var save = xs.ClassManager.get( className );
        save && xs.ClassManager.delete( className );


        //add class
        xs.ClassManager.add( className, Class );

        //class is in manager
        strictEqual( xs.ClassManager.get( className ), Class );


        //delete class
        xs.ClassManager.delete( className );

        //class is not in manager
        strictEqual( xs.ClassManager.get( className ), undefined );


        //restore save
        save && xs.ClassManager.add( className, save );
    } );

    test( 'add', function () {
        //setUp
        //define names
        var classOneName = 'my.demo.first.ClassOne';
        var classTwoName = 'my.demo.first.ClassTwo';
        var classThreeName = 'ClassThree';

        //save classes, if defined
        var saveOne = xs.ClassManager.get( classOneName );
        saveOne && xs.ClassManager.delete( classOneName );
        var saveTwo = xs.ClassManager.get( classTwoName );
        saveTwo && xs.ClassManager.delete( classTwoName );
        var saveThree = xs.ClassManager.get( classThreeName );
        saveThree && xs.ClassManager.delete( classThreeName );


        //run test

        //create ClassOne
        var ClassOne = xs.Class.create( function () {
        } );

        //create ClassTwo
        var ClassTwo = xs.Class.create( function () {
        } );

        //create ClassThree
        var ClassThree = xs.Class.create( function () {
        } );

        //add class one
        xs.ClassManager.add( classOneName, ClassOne );

        //not added again with same name
        throws( function () {
            xs.ClassManager.add( classOneName, ClassOne );
        } );

        //not added again with other name
        throws( function () {
            xs.ClassManager.add( classOneName + '_', ClassOne );
        } );

        //class is in manager
        strictEqual( xs.ClassManager.get( classOneName ), ClassOne );

        //label is assigned correctly
        strictEqual( ClassOne.label, classOneName );

        //namespace ok
        strictEqual( xs.keys( my.demo.first ).toString(), 'ClassOne' );
        strictEqual( my.demo.first.ClassOne, ClassOne );
        strictEqual( xs.keys( my.demo.first.ClassOne.namespace ).toString(), 'ClassOne' );
        strictEqual( my.demo.first.ClassOne.namespace.ClassOne, ClassOne );

        //add class two
        xs.ClassManager.add( classTwoName, ClassTwo );

        //not added again with same name
        throws( function () {
            xs.ClassManager.add( classTwoName, ClassTwo );
        } );

        //not added again with other name
        throws( function () {
            xs.ClassManager.add( classTwoName + '_', ClassTwo );
        } );

        //class is in manager
        strictEqual( xs.ClassManager.get( classTwoName ), ClassTwo );

        //label is assigned correctly
        strictEqual( ClassTwo.label, classTwoName );

        //namespace ok
        strictEqual( xs.keys( my.demo.first ).toString(), 'ClassOne,ClassTwo' );
        strictEqual( my.demo.first.ClassTwo, ClassTwo );
        strictEqual( xs.keys( my.demo.first.ClassOne.namespace ).toString(), 'ClassOne,ClassTwo' );
        strictEqual( my.demo.first.ClassOne.namespace.ClassOne, ClassOne );
        strictEqual( my.demo.first.ClassOne.namespace.ClassTwo, ClassTwo );
        strictEqual( xs.keys( my.demo.first.ClassTwo.namespace ).toString(), 'ClassOne,ClassTwo' );
        strictEqual( my.demo.first.ClassTwo.namespace.ClassOne, ClassOne );
        strictEqual( my.demo.first.ClassTwo.namespace.ClassTwo, ClassTwo );

        //add class three
        xs.ClassManager.add( classThreeName, ClassThree );

        //not added again with same name
        throws( function () {
            xs.ClassManager.add( classThreeName, ClassThree );
        } );

        //not added again with other name
        throws( function () {
            xs.ClassManager.add( classThreeName + '_', ClassThree );
        } );

        //class is in manager
        strictEqual( xs.ClassManager.get( classThreeName ), ClassThree );

        //label is assigned correctly
        strictEqual( ClassThree.label, classThreeName );

        //namespace ok
        strictEqual( window.ClassThree, ClassThree );
        strictEqual( xs.keys( window.ClassThree.namespace ).toString(), 'ClassThree' );
        strictEqual( window.ClassThree.namespace.ClassThree, ClassThree );


        //tearDown

        //remove defined
        xs.ClassManager.delete( classOneName );
        xs.ClassManager.delete( classTwoName );
        xs.ClassManager.delete( classThreeName );

        //restore save
        saveOne && xs.ClassManager.add( classOneName, saveOne );
        saveTwo && xs.ClassManager.add( classTwoName, saveTwo );
        saveThree && xs.ClassManager.add( classThreeName, saveThree );
    } );

    test( 'delete', function () {
        //setUp
        //define names
        var classOneName = 'my.demo.first.ClassOne';
        var classTwoName = 'my.demo.first.ClassTwo';
        var classThreeName = 'ClassThree';

        //save classes, if defined
        var saveOne = xs.ClassManager.get( classOneName );
        saveOne && xs.ClassManager.delete( classOneName );
        var saveTwo = xs.ClassManager.get( classTwoName );
        saveTwo && xs.ClassManager.delete( classTwoName );
        var saveThree = xs.ClassManager.get( classThreeName );
        saveThree && xs.ClassManager.delete( classThreeName );


        //run test

        //create ClassOne
        var ClassOne = xs.Class.create( function () {
        } );

        //create ClassTwo
        var ClassTwo = xs.Class.create( function () {
        } );

        //create ClassThree
        var ClassThree = xs.Class.create( function () {
        } );

        //add classOne
        xs.ClassManager.add( classOneName, ClassOne );
        //add classTwo
        xs.ClassManager.add( classTwoName, ClassTwo );
        //add classThree
        xs.ClassManager.add( classThreeName, ClassThree );

        //test namespaces
        strictEqual( xs.keys( my.demo.first ).toString(), 'ClassOne,ClassTwo' );
        strictEqual( my.demo.first.ClassTwo, ClassTwo );
        strictEqual( xs.keys( my.demo.first.ClassOne.namespace ).toString(), 'ClassOne,ClassTwo' );
        strictEqual( my.demo.first.ClassOne.namespace.ClassOne, ClassOne );
        strictEqual( my.demo.first.ClassOne.namespace.ClassTwo, ClassTwo );
        strictEqual( xs.keys( my.demo.first.ClassTwo.namespace ).toString(), 'ClassOne,ClassTwo' );
        strictEqual( my.demo.first.ClassTwo.namespace.ClassOne, ClassOne );
        strictEqual( my.demo.first.ClassTwo.namespace.ClassTwo, ClassTwo );

        //delete classOne
        xs.ClassManager.delete( classOneName );

        //not deleted again
        throws( function () {
            xs.ClassManager.delete( classOneName );
        } );

        //class is not in manager
        strictEqual( xs.ClassManager.get( classOneName ), undefined );

        //label is removed
        strictEqual( xs.Attribute.defined( ClassOne, 'label' ), false );

        //namespace is cleaned
        strictEqual( xs.Attribute.defined( my.demo.first, 'ClassOne' ), false );
        strictEqual( xs.keys( my.demo.first ).toString(), 'ClassTwo' );
        strictEqual( my.demo.first.ClassTwo, ClassTwo );
        strictEqual( xs.keys( my.demo.first.ClassTwo.namespace ).toString(), 'ClassTwo' );
        strictEqual( my.demo.first.ClassTwo.namespace.ClassTwo, ClassTwo );

        //delete classTwo
        xs.ClassManager.delete( classTwoName );

        //not deleted again
        throws( function () {
            xs.ClassManager.delete( classTwoName );
        } );

        //class is not in manager
        strictEqual( xs.ClassManager.get( classTwoName ), undefined );

        //label is removed
        strictEqual( xs.Attribute.defined( ClassTwo, 'label' ), false );

        //namespace is cleaned
        strictEqual( xs.Attribute.defined( window, 'my' ), false );
        strictEqual( xs.keys( ClassTwo.namespace ).toString(), '' );

        //delete classThree
        xs.ClassManager.delete( classThreeName );

        //not deleted again
        throws( function () {
            xs.ClassManager.delete( classThreeName );
        } );

        //class is not in manager
        strictEqual( xs.ClassManager.get( classThreeName ), undefined );

        //label is removed
        strictEqual( xs.Attribute.defined( ClassThree, 'label' ), false );

        //namespace is cleaned
        strictEqual( xs.Attribute.defined( window, classThreeName ), false );


        //tearDown

        //restore save
        saveOne && xs.ClassManager.add( classOneName, saveOne );
        saveTwo && xs.ClassManager.add( classTwoName, saveTwo );
        saveThree && xs.ClassManager.add( classThreeName, saveThree );
    } );

    test( 'define', function () {
        var className = 'xs.myClass';

        //save class, if defined
        var save = xs.ClassManager.get( className );
        save && xs.ClassManager.delete( className );


        //define class
        var Class = xs.define( className, function () {
        } );

        //not defined again
        throws( function () {
            xs.define( className, function () {
            } )
        } );

        //class is in manager
        strictEqual( xs.ClassManager.get( className ), Class );

        //label is assigned correctly
        strictEqual( Class.label, className );

        //namespace ok
        strictEqual( xs.myClass, Class );


        //delete class
        xs.ClassManager.delete( className );


        //restore save
        save && xs.ClassManager.add( className, save );
    } );
} );