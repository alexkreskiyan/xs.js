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
    'xs.class.Loader'
], function () {

    'use strict';

    module( 'xs.Loader' );

    test( 'paths add', function () {
        //setUp
        //backup all paths
        var paths = xs.Loader.paths.get();
        xs.Loader.paths.delete( xs.keys( paths ) );


        //single mode
        //non-string alias
        throws( function () {
            xs.Loader.paths.add( 1, 1 );
        } );
        //incorrect alias
        throws( function () {
            xs.Loader.paths.add( '1', 1 );
        } );
        throws( function () {
            xs.Loader.paths.add( 'a.', 1 );
        } );
        throws( function () {
            xs.Loader.paths.add( '1a', 1 );
        } );
        throws( function () {
            xs.Loader.paths.add( 'a.a.', 1 );
        } );
        //non-string path
        throws( function () {
            xs.Loader.paths.add( 'a.a', 1 );
        } );
        //correct data
        xs.Loader.paths.add( 'a.a', 'aa' );
        strictEqual( xs.Loader.paths.has( 'a.a' ), true );

        //multiple mode
        //incorrect data
        throws( function () {
            xs.Loader.paths.add( {
                'b.a': 1,
                'b.b': 'ab'
            } );
        } );
        //correct data
        xs.Loader.paths.add( {
            'b.a': 'ba',
            'b.b': 'bb'
        } );
        strictEqual( xs.Loader.paths.has( 'b.a' ), true );
        strictEqual( xs.Loader.paths.has( 'b.b' ), true );


        //tearDown
        //remove current paths
        xs.Loader.paths.delete( xs.keys( xs.Loader.paths.get() ) );
        //restore saved paths
        xs.Loader.paths.add( paths );
    } );

    test( 'paths has', function () {
        //setUp
        //backup all paths
        var paths = xs.Loader.paths.get();
        xs.Loader.paths.delete( xs.keys( paths ) );

        //non-string alias
        //incorrect alias
        //correct data


        //tearDown
        //remove current paths
        xs.Loader.paths.delete( xs.keys( xs.Loader.paths.get() ) );
        //restore saved paths
        xs.Loader.paths.add( paths );
    } );
    test( 'paths delete', function () {
        //setUp
        //backup all paths
        var paths = xs.Loader.paths.get();
        xs.Loader.paths.delete( xs.keys( paths ) );

        //single mode
        //non-string alias
        //incorrect alias
        //correct data

        //multiple mode
        //correct data


        //tearDown
        //remove current paths
        xs.Loader.paths.delete( xs.keys( xs.Loader.paths.get() ) );
        //restore saved paths
        xs.Loader.paths.add( paths );
    } );
    test( 'paths get', function () {
        //setUp
        //backup all paths
        var paths = xs.Loader.paths.get();
        xs.Loader.paths.delete( xs.keys( paths ) );

        //tearDown
        //remove current paths
        xs.Loader.paths.delete( xs.keys( xs.Loader.paths.get() ) );
        //restore saved paths
        xs.Loader.paths.add( paths );
    } );
    test( 'paths resolve', function () {
        //setUp
        //backup all paths
        var paths = xs.Loader.paths.get();
        xs.Loader.paths.delete( xs.keys( paths ) );

        //test
        //non-string name
        //incorrect name
        //no alias result
        //single alias result
        //most suitable alias result


        //tearDown
        //remove current paths
        xs.Loader.paths.delete( xs.keys( xs.Loader.paths.get() ) );
        //restore saved paths
        xs.Loader.paths.add( paths );
    } );
} );