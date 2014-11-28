/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
require( [
    'xs.lang.Type',
    'xs.lang.List'
], function () {

    'use strict';

    module( 'xs.Type' );

    test( 'isObject', function () {
        //init test cases
        var tests = [
            {
                data: null,
                ok: false
            },
            {
                data: undefined,
                ok: false
            },
            {
                data: true,
                ok: false
            },
            {
                data: new Date(),
                ok: true
            },
            {
                data: function () {
                },
                ok: false
            },
            {
                data: {},
                ok: true
            },
            {
                data: {
                    a: 1
                },
                ok: true
            },
            {
                data: [],
                ok: false
            },
            {
                data: [1],
                ok: false
            },
            {
                data: 1,
                ok: false
            },
            {
                data: 0,
                ok: false
            },
            {
                data: '1',
                ok: false
            },
            {
                data: 'a',
                ok: false
            },
            {
                data: '',
                ok: false
            }
        ];

        //run test cases
        xs.each( tests, function ( test ) {
            strictEqual( xs.isObject( test.data ), test.ok );
        } );
    } );

    test( 'isArray', function () {
        //init test cases
        var tests = [
            {
                data: null,
                ok: false
            },
            {
                data: undefined,
                ok: false
            },
            {
                data: true,
                ok: false
            },
            {
                data: new Date(),
                ok: false
            },
            {
                data: function () {
                },
                ok: false
            },
            {
                data: {},
                ok: false
            },
            {
                data: {
                    a: 1
                },
                ok: false
            },
            {
                data: [],
                ok: true
            },
            {
                data: [1],
                ok: true
            },
            {
                data: 1,
                ok: false
            },
            {
                data: 0,
                ok: false
            },
            {
                data: '1',
                ok: false
            },
            {
                data: 'a',
                ok: false
            },
            {
                data: '',
                ok: false
            }
        ];

        //run test cases
        xs.each( tests, function ( test ) {
            strictEqual( xs.isArray( test.data ), test.ok );
        } );
    } );

    test( 'isFunction', function () {
        //init test cases
        var tests = [
            {
                data: null,
                ok: false
            },
            {
                data: undefined,
                ok: false
            },
            {
                data: true,
                ok: false
            },
            {
                data: new Date(),
                ok: false
            },
            {
                data: function () {
                },
                ok: true
            },
            {
                data: {},
                ok: false
            },
            {
                data: {
                    a: 1
                },
                ok: false
            },
            {
                data: [],
                ok: false
            },
            {
                data: [1],
                ok: false
            },
            {
                data: 1,
                ok: false
            },
            {
                data: 0,
                ok: false
            },
            {
                data: '1',
                ok: false
            },
            {
                data: 'a',
                ok: false
            },
            {
                data: '',
                ok: false
            }
        ];

        //run test cases
        xs.each( tests, function ( test ) {
            strictEqual( xs.isFunction( test.data ), test.ok );
        } );
    } );

    test( 'isString', function () {
        //init test cases
        var tests = [
            {
                data: null,
                ok: false
            },
            {
                data: undefined,
                ok: false
            },
            {
                data: true,
                ok: false
            },
            {
                data: new Date(),
                ok: false
            },
            {
                data: function () {
                },
                ok: false
            },
            {
                data: {},
                ok: false
            },
            {
                data: {
                    a: 1
                },
                ok: false
            },
            {
                data: [],
                ok: false
            },
            {
                data: [1],
                ok: false
            },
            {
                data: 1,
                ok: false
            },
            {
                data: 0,
                ok: false
            },
            {
                data: '1',
                ok: true
            },
            {
                data: 'a',
                ok: true
            },
            {
                data: '',
                ok: true
            }
        ];

        //run test cases
        xs.each( tests, function ( test ) {
            strictEqual( xs.isString( test.data ), test.ok );
        } );
    } );

    test( 'isNumber', function () {
        //init test cases
        var tests = [
            {
                data: null,
                ok: false
            },
            {
                data: undefined,
                ok: false
            },
            {
                data: true,
                ok: false
            },
            {
                data: new Date(),
                ok: false
            },
            {
                data: function () {
                },
                ok: false
            },
            {
                data: {},
                ok: false
            },
            {
                data: {
                    a: 1
                },
                ok: false
            },
            {
                data: [],
                ok: false
            },
            {
                data: [1],
                ok: false
            },
            {
                data: 1,
                ok: true
            },
            {
                data: 0,
                ok: true
            },
            {
                data: '1',
                ok: false
            },
            {
                data: 'a',
                ok: false
            },
            {
                data: '',
                ok: false
            }
        ];

        //run test cases
        xs.each( tests, function ( test ) {
            strictEqual( xs.isNumber( test.data ), test.ok );
        } );
    } );

    test( 'isBoolean', function () {
        //init test cases
        var tests = [
            {
                data: null,
                ok: false
            },
            {
                data: undefined,
                ok: false
            },
            {
                data: true,
                ok: true
            },
            {
                data: new Date(),
                ok: false
            },
            {
                data: function () {
                },
                ok: false
            },
            {
                data: {},
                ok: false
            },
            {
                data: {
                    a: 1
                },
                ok: false
            },
            {
                data: [],
                ok: false
            },
            {
                data: [1],
                ok: false
            },
            {
                data: 1,
                ok: false
            },
            {
                data: 0,
                ok: false
            },
            {
                data: '1',
                ok: false
            },
            {
                data: 'a',
                ok: false
            },
            {
                data: '',
                ok: false
            }
        ];

        //run test cases
        xs.each( tests, function ( test ) {
            strictEqual( xs.isBoolean( test.data ), test.ok );
        } );
    } );

    test( 'isRegExp', function () {
        //init test cases
        var tests = [
            {
                data: null,
                ok: false
            },
            {
                data: undefined,
                ok: false
            },
            {
                data: true,
                ok: false
            },
            {
                data: new Date(),
                ok: false
            },
            {
                data: function () {
                },
                ok: false
            },
            {
                data: {},
                ok: false
            },
            {
                data: {
                    a: 1
                },
                ok: false
            },
            {
                data: [],
                ok: false
            },
            {
                data: [1],
                ok: false
            },
            {
                data: 1,
                ok: false
            },
            {
                data: 0,
                ok: false
            },
            {
                data: '1',
                ok: false
            },
            {
                data: 'a',
                ok: false
            },
            {
                data: '',
                ok: false
            },
            {
                data: /a/,
                ok: true
            }
        ];

        //run test cases
        xs.each( tests, function ( test ) {
            strictEqual( xs.isRegExp( test.data ), test.ok );
        } );
    } );

    test( 'isError', function () {
        //init test cases
        var tests = [
            {
                data: null,
                ok: false
            },
            {
                data: undefined,
                ok: false
            },
            {
                data: true,
                ok: false
            },
            {
                data: new Date(),
                ok: false
            },
            {
                data: function () {
                },
                ok: false
            },
            {
                data: {},
                ok: false
            },
            {
                data: {
                    a: 1
                },
                ok: false
            },
            {
                data: [],
                ok: false
            },
            {
                data: [1],
                ok: false
            },
            {
                data: 1,
                ok: false
            },
            {
                data: 0,
                ok: false
            },
            {
                data: '1',
                ok: false
            },
            {
                data: 'a',
                ok: false
            },
            {
                data: '',
                ok: false
            },
            {
                data: new Error,
                ok: true
            }
        ];

        //run test cases
        xs.each( tests, function ( test ) {
            strictEqual( xs.isError( test.data ), test.ok );
        } );
    } );

    test( 'isNull', function () {
        //init test cases
        var tests = [
            {
                data: null,
                ok: true
            },
            {
                data: undefined,
                ok: false
            },
            {
                data: true,
                ok: false
            },
            {
                data: new Date(),
                ok: false
            },
            {
                data: function () {
                },
                ok: false
            },
            {
                data: {},
                ok: false
            },
            {
                data: {
                    a: 1
                },
                ok: false
            },
            {
                data: [],
                ok: false
            },
            {
                data: [1],
                ok: false
            },
            {
                data: 1,
                ok: false
            },
            {
                data: 0,
                ok: false
            },
            {
                data: '1',
                ok: false
            },
            {
                data: 'a',
                ok: false
            },
            {
                data: '',
                ok: false
            }
        ];

        //run test cases
        xs.each( tests, function ( test ) {
            strictEqual( xs.isNull( test.data ), test.ok );
        } );
    } );

    test( 'isIterable', function () {
        //init test cases
        var tests = [
            {
                data: null,
                ok: false
            },
            {
                data: undefined,
                ok: false
            },
            {
                data: true,
                ok: false
            },
            {
                data: new Date(),
                ok: true
            },
            {
                data: function () {
                },
                ok: false
            },
            {
                data: {},
                ok: true
            },
            {
                data: {
                    a: 1
                },
                ok: true
            },
            {
                data: [],
                ok: true
            },
            {
                data: [1],
                ok: true
            },
            {
                data: 1,
                ok: false
            },
            {
                data: 0,
                ok: false
            },
            {
                data: '1',
                ok: false
            },
            {
                data: 'a',
                ok: false
            },
            {
                data: '',
                ok: false
            }
        ];

        //run test cases
        xs.each( tests, function ( test ) {
            strictEqual( xs.isIterable( test.data ), test.ok );
        } );
    } );

    test( 'isPrimitive', function () {
        //init test cases
        var tests = [
            {
                data: null,
                ok: true
            },
            {
                data: undefined,
                ok: true
            },
            {
                data: true,
                ok: true
            },
            {
                data: new Date(),
                ok: false
            },
            {
                data: function () {
                },
                ok: false
            },
            {
                data: {},
                ok: false
            },
            {
                data: {
                    a: 1
                },
                ok: false
            },
            {
                data: [],
                ok: false
            },
            {
                data: [1],
                ok: false
            },
            {
                data: 1,
                ok: true
            },
            {
                data: 0,
                ok: true
            },
            {
                data: '1',
                ok: true
            },
            {
                data: 'a',
                ok: true
            },
            {
                data: '',
                ok: true
            }
        ];

        //run test cases
        xs.each( tests, function ( test ) {
            strictEqual( xs.isPrimitive( test.data ), test.ok );
        } );
    } );

    test( 'isNumeric', function () {
        //init test cases
        var tests = [
            {
                data: null,
                ok: false
            },
            {
                data: undefined,
                ok: false
            },
            {
                data: true,
                ok: false
            },
            {
                data: new Date(),
                ok: false
            },
            {
                data: function () {
                },
                ok: false
            },
            {
                data: {},
                ok: false
            },
            {
                data: {
                    a: 1
                },
                ok: false
            },
            {
                data: [],
                ok: false
            },
            {
                data: [1],
                ok: false
            },
            {
                data: 1,
                ok: true
            },
            {
                data: 0,
                ok: true
            },
            {
                data: '1',
                ok: true
            },
            {
                data: 'a',
                ok: false
            },
            {
                data: '',
                ok: false
            }
        ];

        //run test cases
        xs.each( tests, function ( test ) {
            strictEqual( xs.isNumeric( test.data ), test.ok );
        } );
    } );

    test( 'isDefined', function () {
        //init test cases
        var tests = [
            {
                data: null,
                ok: true
            },
            {
                data: undefined,
                ok: false
            },
            {
                data: true,
                ok: true
            },
            {
                data: new Date(),
                ok: true
            },
            {
                data: function () {
                },
                ok: true
            },
            {
                data: {},
                ok: true
            },
            {
                data: {
                    a: 1
                },
                ok: true
            },
            {
                data: [],
                ok: true
            },
            {
                data: [1],
                ok: true
            },
            {
                data: 1,
                ok: true
            },
            {
                data: 0,
                ok: true
            },
            {
                data: '1',
                ok: true
            },
            {
                data: 'a',
                ok: true
            },
            {
                data: '',
                ok: true
            }
        ];

        //run test cases
        xs.each( tests, function ( test ) {
            strictEqual( xs.isDefined( test.data ), test.ok );
        } );
    } );

    test( 'isEmpty', function () {
        //init test cases
        var tests = [
            {
                data: null,
                ok: true
            },
            {
                data: undefined,
                ok: true
            },
            {
                data: true,
                ok: false
            },
            {
                data: function () {
                },
                ok: false
            },
            {
                data: {},
                ok: true
            },
            {
                data: {
                    a: 1
                },
                ok: false
            },
            {
                data: [],
                ok: true
            },
            {
                data: [1],
                ok: false
            },
            {
                data: 1,
                ok: false
            },
            {
                data: 0,
                ok: true
            },
            {
                data: '1',
                ok: false
            },
            {
                data: 'a',
                ok: false
            },
            {
                data: '',
                ok: true
            }
        ];

        //run test cases
        xs.each( tests, function ( test ) {
            strictEqual( xs.isEmpty( test.data ), test.ok );
        } );
    } );
} );