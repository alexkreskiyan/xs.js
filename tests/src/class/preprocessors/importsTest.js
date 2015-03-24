/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.imports', function () {

    'use strict';

    test('imports usage chain', function () {
        var me = this;

        //backup all paths
        me.paths = xs.Loader.paths.get();
        xs.Loader.paths.remove(Object.keys(me.paths));

        //add tests path
        xs.Loader.paths.add('tests', 'resources');

        xs.define(xs.Class, 'ns.Child', function (Class, imports) {
            this.namespace = 'tests.class.preprocessors.imports';
            this.extends = 'ns.Base';
            this.imports = [
                {
                    'sample.One': 'ns.One'
                },
                'ns.Base',
                {
                    Two: 'ns.Two'
                },
                {
                    'sample.Three': 'ns.Three'
                }
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
        var ns = window.tests.class.preprocessors.imports;

        //check imports
        strictEqual(Object.keys(me.imports).toString(), 'sample,Two');
        strictEqual(me.imports.sample.One, ns.One);
        strictEqual(me.imports.sample.Three, ns.Three);

    }, function () {
        var me = this;

        //remove current paths
        xs.Loader.paths.remove(Object.keys(xs.Loader.paths.get()));
        //restore saved paths
        xs.Loader.paths.add(me.paths);

        var ns = window.tests.class.preprocessors.imports;

        //remove created classes
        xs.ContractsManager.remove(ns.One.label);
        xs.ContractsManager.remove(ns.Two.label);
        xs.ContractsManager.remove(ns.Three.label);
        xs.ContractsManager.remove(ns.Base.label);
        xs.ContractsManager.remove(ns.Child.label);
    });

});