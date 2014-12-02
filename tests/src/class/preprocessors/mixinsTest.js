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
    'xs.lang.Attribute',
    'xs.lang.Function',
    'xs.core.Debug',
    'xs.class.Class',
    'xs.class.ClassManager',
    'xs.class.Loader',
    'xs.class.preprocessors.namespace',
    'xs.class.preprocessors.imports',
    'xs.class.preprocessors.extends',
    'xs.class.preprocessors.mixins',
    'xs.class.preprocessors.singleton',
    'xs.class.preprocessors.const',
    'xs.class.preprocessors.staticProperties',
    'xs.class.preprocessors.staticMethods',
    'xs.class.preprocessors.constructor',
    'xs.class.preprocessors.properties',
    'xs.class.preprocessors.methods',
    'xs.class.Base'
], function () {

    'use strict';

    module('xs.class.preprocessors.mixins');

    test('mixins chain', function () {
        xs.Loader.paths.add('tests','/tests/resources/');
        xs.define('tests.class.preprocessors.mixins.Child', function () {
            this.namespace = 'tests.class.preprocessors.mixins';
            this.extends = 'ns.Base';
            this.mixins.mix2 = 'ns.Mix2';
        });
    });

});