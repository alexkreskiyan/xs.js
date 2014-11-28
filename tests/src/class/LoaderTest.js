/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
require([
    'xs.lang.Type',
    'xs.lang.List',
    'xs.lang.Object',
    'xs.class.Loader'
], function () {

    'use strict';

    module('xs.Loader');

    test('paths add', function () {
        //setUp
        //backup all paths
        var paths = xs.Loader.paths.get();
        xs.Loader.paths.delete(xs.keys(paths));


        //single mode
        //non-string alias
        throws(function () {
            xs.Loader.paths.add(1, 1);
        });
        //incorrect alias
        throws(function () {
            xs.Loader.paths.add('1', 1);
        });
        throws(function () {
            xs.Loader.paths.add('a.', 1);
        });
        throws(function () {
            xs.Loader.paths.add('1a', 1);
        });
        throws(function () {
            xs.Loader.paths.add('a.a.', 1);
        });
        //non-string path
        throws(function () {
            xs.Loader.paths.add('a.a', 1);
        });
        //correct data
        xs.Loader.paths.add('a.a', 'aa');
        strictEqual(xs.Loader.paths.has('a.a'), true);

        //multiple mode
        //incorrect data
        throws(function () {
            xs.Loader.paths.add({
                'b.a': 1,
                'b.b': 'ab'
            });
        });
        //correct data
        strictEqual(xs.Loader.paths.has('b.a'), false);
        strictEqual(xs.Loader.paths.has('b.b'), false);
        xs.Loader.paths.add({
            'b.a': 'ba',
            'b.b': 'bb'
        });
        strictEqual(xs.Loader.paths.has('b.a'), true);
        strictEqual(xs.Loader.paths.has('b.b'), true);


        //tearDown
        //remove current paths
        xs.Loader.paths.delete(xs.keys(xs.Loader.paths.get()));
        //restore saved paths
        xs.Loader.paths.add(paths);
    });

    test('paths has', function () {
        //setUp
        //backup all paths
        var paths = xs.Loader.paths.get();
        xs.Loader.paths.delete(xs.keys(paths));

        //test
        //non-string alias
        throws(function () {
            xs.Loader.paths.has(1);
        });
        //incorrect alias
        throws(function () {
            xs.Loader.paths.has('1');
        });
        throws(function () {
            xs.Loader.paths.has('a.');
        });
        throws(function () {
            xs.Loader.paths.has('1a');
        });
        throws(function () {
            xs.Loader.paths.has('a.a.');
        });
        //correct data
        strictEqual(xs.Loader.paths.has('a'), false);
        xs.Loader.paths.add('a', 'a');
        strictEqual(xs.Loader.paths.has('a'), true);


        //tearDown
        //remove current paths
        xs.Loader.paths.delete(xs.keys(xs.Loader.paths.get()));
        //restore saved paths
        xs.Loader.paths.add(paths);
    });

    test('paths delete', function () {
        //setUp
        //backup all paths
        var paths = xs.Loader.paths.get();
        xs.Loader.paths.delete(xs.keys(paths));

        //single mode
        //non-string alias
        throws(function () {
            xs.Loader.paths.delete(1);
        });
        //incorrect alias
        throws(function () {
            xs.Loader.paths.delete('1');
        });
        throws(function () {
            xs.Loader.paths.delete('a.');
        });
        throws(function () {
            xs.Loader.paths.delete('1a');
        });
        throws(function () {
            xs.Loader.paths.delete('a.a.');
        });
        //correct data
        strictEqual(xs.Loader.paths.has('a'), false);
        xs.Loader.paths.add('a', 'a');
        strictEqual(xs.Loader.paths.has('a'), true);
        xs.Loader.paths.delete('a');
        strictEqual(xs.Loader.paths.has('a'), false);

        //multiple mode
        //correct data
        strictEqual(xs.Loader.paths.has('a'), false);
        strictEqual(xs.Loader.paths.has('b'), false);
        xs.Loader.paths.add({
            a: 'path1',
            b: 'path1'
        });
        strictEqual(xs.Loader.paths.has('a'), true);
        strictEqual(xs.Loader.paths.has('b'), true);
        xs.Loader.paths.delete([
            'a',
            'b'
        ]);
        strictEqual(xs.Loader.paths.has('a'), false);
        strictEqual(xs.Loader.paths.has('b'), false);


        //tearDown
        //remove current paths
        xs.Loader.paths.delete(xs.keys(xs.Loader.paths.get()));
        //restore saved paths
        xs.Loader.paths.add(paths);
    });

    test('paths get', function () {
        //setUp
        //backup all paths
        var paths = xs.Loader.paths.get();
        xs.Loader.paths.delete(xs.keys(paths));


        //test
        strictEqual(JSON.stringify(xs.Loader.paths.get()), '{}');
        xs.Loader.paths.add({
            a: 'path1',
            b: 'path2'
        });
        strictEqual(JSON.stringify(xs.Loader.paths.get()), '{"a":"path1","b":"path2"}');
        xs.Loader.paths.delete([
            'a',
            'b'
        ]);
        strictEqual(JSON.stringify(xs.Loader.paths.get()), '{}');


        //tearDown
        //remove current paths
        xs.Loader.paths.delete(xs.keys(xs.Loader.paths.get()));
        //restore saved paths
        xs.Loader.paths.add(paths);
    });

    test('paths resolve', function () {
        //setUp
        //backup all paths
        var paths = xs.Loader.paths.get();
        xs.Loader.paths.delete(xs.keys(paths));

        //test
        //non-string name
        throws(function () {
            xs.Loader.paths.resolve(1);
        });
        //incorrect name
        throws(function () {
            xs.Loader.paths.resolve('1');
        });
        throws(function () {
            xs.Loader.paths.resolve('a.');
        });
        throws(function () {
            xs.Loader.paths.resolve('1a');
        });
        throws(function () {
            xs.Loader.paths.resolve('a.a.');
        });
        //no alias result
        strictEqual(xs.Loader.paths.resolve('my.demo.first.Class'), 'my/demo/first/Class.js');
        //single alias result
        xs.Loader.paths.add('my.demo', 'mydemo');
        strictEqual(xs.Loader.paths.resolve('my.demo.first.Class'), 'mydemo/first/Class.js');
        //most suitable alias result
        xs.Loader.paths.add('my.demo.firsty', 'mydemofirsty');
        xs.Loader.paths.add('my.demo.first', 'mydemofirst');
        strictEqual(xs.Loader.paths.resolve('my.demo.first.Class'), 'mydemofirst/Class.js');


        //tearDown
        //remove current paths
        xs.Loader.paths.delete(xs.keys(xs.Loader.paths.get()));
        //restore saved paths
        xs.Loader.paths.add(paths);
    });
});