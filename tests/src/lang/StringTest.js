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
    'xs.lang.String'
], function () {

    'use strict';

    module('xs.lang.String');

    test('translate', function () {
        //get translated version
        var str = xs.translate('My fox is small and brown. I love my small brown fox', {
            small: 'big',
            brown: 'black',
            fox:   'bear'
        });

        //check translation
        strictEqual(str, 'My bear is big and black. I love my big black bear');
    });
});