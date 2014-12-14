/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.Loader', function () {

    test('paths add', function () {
        var me = this;

        //backup all paths
        me.paths = xs.Loader.paths.get();
        xs.Loader.paths.delete(xs.keys(me.paths));

    }, function () {
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

    }, function () {
        var me = this;

        //remove current paths
        xs.Loader.paths.delete(xs.keys(xs.Loader.paths.get()));
        //restore saved paths
        xs.Loader.paths.add(me.paths);
    });

    test('paths has', function () {
        var me = this;

        //backup all paths
        me.paths = xs.Loader.paths.get();
        xs.Loader.paths.delete(xs.keys(me.paths));

    }, function () {
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

    }, function () {
        var me = this;

        //remove current paths
        xs.Loader.paths.delete(xs.keys(xs.Loader.paths.get()));
        //restore saved paths
        xs.Loader.paths.add(me.paths);
    });

    test('paths delete', function () {
        var me = this;

        //backup all paths
        me.paths = xs.Loader.paths.get();
        xs.Loader.paths.delete(xs.keys(me.paths));

    }, function () {
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

    }, function () {
        var me = this;

        //remove current paths
        xs.Loader.paths.delete(xs.keys(xs.Loader.paths.get()));
        //restore saved paths
        xs.Loader.paths.add(me.paths);
    });

    test('paths get', function () {
        var me = this;

        //backup all paths
        me.paths = xs.Loader.paths.get();
        xs.Loader.paths.delete(xs.keys(me.paths));

    }, function () {

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

    }, function () {
        var me = this;

        //remove current paths
        xs.Loader.paths.delete(xs.keys(xs.Loader.paths.get()));
        //restore saved paths
        xs.Loader.paths.add(me.paths);
    });

    test('paths resolve', function () {
        var me = this;

        //backup all paths
        me.paths = xs.Loader.paths.get();
        xs.Loader.paths.delete(xs.keys(me.paths));

    }, function () {
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

    }, function () {
        var me = this;

        //remove current paths
        xs.Loader.paths.delete(xs.keys(xs.Loader.paths.get()));
        //restore saved paths
        xs.Loader.paths.add(me.paths);
    });

    test('require', function () {

        xs.Loader.paths.add('demo.loader', '/tests/resources/class/Loader');
    }, function () {
        var me = this;

        //assert classes were not loaded yet
        strictEqual(xs.ClassManager.has('demo.loader.Demo'), false);
        strictEqual(xs.ClassManager.has('demo.loader.Sample'), false);

        //require classes
        xs.Loader.require([
            'demo.loader.Demo',
            'demo.loader.Sample'
        ], function (loaded) {

            //assert all was loaded nicely
            strictEqual(JSON.stringify(loaded), '{"demo.loader.Demo":"/tests/resources/class/Loader/Demo.js","demo.loader.Sample":"/tests/resources/class/Loader/Sample.js"}');

            //assert classes loaded
            strictEqual(xs.ClassManager.has('demo.loader.Demo'), true);
            strictEqual(xs.ClassManager.has('demo.loader.Sample'), true);

            //cleanUp
            xs.ClassManager.delete('demo.loader.Demo');
            xs.ClassManager.delete('demo.loader.Sample');

            //require loaded and failed classes
            xs.Loader.require([
                'demo.loader.Demo',
                'demo.loader.Sample2'
            ], function (loaded) {
            }, function (failed, loaded) {

                //assert require results are correct
                strictEqual(JSON.stringify(failed), '{"demo.loader.Sample2":"/tests/resources/class/Loader/Sample2.js"}');
                strictEqual(JSON.stringify(loaded), '{"demo.loader.Demo":"/tests/resources/class/Loader/Demo.js"}');

                //assert classes not loaded
                strictEqual(xs.ClassManager.has('demo.loader.Demo'), false);
                strictEqual(xs.ClassManager.has('demo.loader.Sample'), false);

                me.done();
            });
        });

        return false;
    }, function () {
        xs.Loader.paths.delete('demo.loader');
    });
});