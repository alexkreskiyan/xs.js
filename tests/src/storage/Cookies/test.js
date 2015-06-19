/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.storage.Cookie', function () {

    'use strict';

    test('demo', function () {
        var me = this;

        me.Class = xs.Class(function () {
            var Class = this;

            Class.extends = 'xs.storage.Cookie';
        },  me.done);

        return false;

    }, function () {
        var cookies = this.Class;

        var user = prompt('Введите ваше имя:','');
        if (user != '' && user != null) {
            cookies.add('username', user, {
                maxAge: 30
            });
        }
        var cookie = cookies.get('username');
        if (cookie) {
            alert('Значение cookie : '+ cookie);
            cookies.remove();
            if (!cookies.get('username')) {
                alert('кука удалена');
            }
        }
    });

});