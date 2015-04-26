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

        xs.define(xs.Class, 'ns.Child', function (Class, imports) {
            this.namespace = 'tests.class.preprocessors.imports';
            this.extends = 'ns.resources.Base';
            this.imports = [
                {
                    'sample.One': 'ns.resources.One'
                },
                'ns.resources.Base',
                {
                    Two: 'ns.resources.Two'
                },
                {
                    'sample.Three': 'ns.resources.Three'
                }
            ];

            //save imports reference
            me.imports = imports;
        }, me.done);


        return false;
    }, function () {
        var me = this;
        var ns = window.tests.class.preprocessors.imports;

        //check imports
        strictEqual(Object.keys(me.imports).toString(), 'sample,Two');
        strictEqual(me.imports.sample.One, ns.resources.One);
        strictEqual(me.imports.sample.Three, ns.resources.Three);

    }, function () {
        var ns = window.tests.class.preprocessors.imports;

        //remove created classes
        xs.ContractsManager.remove(ns.resources.One.label);
        xs.ContractsManager.remove(ns.resources.Two.label);
        xs.ContractsManager.remove(ns.resources.Three.label);
        xs.ContractsManager.remove(ns.resources.Base.label);
        xs.ContractsManager.remove(ns.Child.label);
    });

});