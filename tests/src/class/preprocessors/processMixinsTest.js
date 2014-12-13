/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.class.preprocessors.mixins', function () {

    test('mixins chain', function () {
        expect(0);
        xs.Loader.paths.add('tests', '/tests/resources');
        xs.define('ns.Child', function () {
            this.namespace = 'tests.class.preprocessors.mixins';
            this.imports = [
                'ns.Base',
                'ns.Mix2'
            ];
            this.extends = 'ns.Base';
            this.mixins.mix2 = 'ns.Mix2';
        });
    });

});