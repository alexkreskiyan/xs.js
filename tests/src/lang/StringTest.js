/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.lang.String', function () {

    test('translate', function () {
        var me = this;
        //get translated version
        me.str = xs.translate('My fox is small and brown. I love my small brown fox', {
            small: 'big',
            brown: 'black',
            fox: 'bear'
        });

    }, function () {
        var me = this;
        //check translation
        strictEqual(me.str, 'My bear is big and black. I love my big black bear');
    });
});