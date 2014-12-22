/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.imports', function () {

    test('imports usage chain', function () {
        var me = this;

        //backup all paths
        me.paths = xs.Loader.paths.get();
        xs.Loader.paths.remove(xs.keys(me.paths));

        //add tests path
        xs.Loader.paths.add('tests', '/tests/resources');

        xs.define('ns.Child', function (Class, ns, imports) {
            this.namespace = 'tests.class.preprocessors.imports';
            this.extends = 'ns.Base';
            this.imports = [
                {one: 'ns.One'},
                'ns.Two',
                {three: 'ns.Three'}
            ];

            //save imports reference
            me.imports = imports;
        });

        xs.onReady([
            'tests.class.preprocessors.imports.Child',
            'tests.class.preprocessors.imports.Base',
            'tests.class.preprocessors.imports.One',
            'tests.class.preprocessors.imports.Two',
            'tests.class.preprocessors.imports.Three'
        ], me.done);


        return false;
    }, function () {
        var me = this;
        var ns = tests.class.preprocessors.imports;

        //check imports
        strictEqual(xs.keys(me.imports).toString(), 'one,three');
        strictEqual(me.imports.one, ns.One);
        strictEqual(me.imports.three, ns.Three);

    }, function () {
        var me = this;

        //remove current paths
        xs.Loader.paths.remove(xs.keys(xs.Loader.paths.get()));
        //restore saved paths
        xs.Loader.paths.add(me.paths);

        var ns = tests.class.preprocessors.imports;

        //remove created classes
        xs.ClassManager.remove(ns.One.label);
        xs.ClassManager.remove(ns.Two.label);
        xs.ClassManager.remove(ns.Three.label);
        xs.ClassManager.remove(ns.Base.label);
        xs.ClassManager.remove(ns.Child.label);
    });
});