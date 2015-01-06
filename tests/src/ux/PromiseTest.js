/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.ux.Promise', function () {

    'use strict';

    test('promise', function () {
        expect(0);

        var p = new xs.ux.Promise();
        var state = 0;
        var step = 25;
        var max = 100;
        var interval = setInterval(function () {
            if (state < max) {
                state += step;
                p.progress(state);
            } else {
                p.resolve('ready');
                clearInterval(interval);
            }
        }, 1000);
        p.then(function (data) {
            console.info('first promise resolved with data:', data, '- item one');
            var p = new xs.ux.Promise();
            setTimeout(function () {
                console.info('internal promise resolved with data:', data, '- item one');
                p.resolve(data);
            }, 1000);

            return p;
        }, function (reason) {
            console.info('first promise rejected with reason:', reason, '- item one');

            return reason;
        }, function (state) {
            console.info('first promise progressed to state:', state, '- item one');

            return state;
        }).then(function (data) {
            console.info('second promise resolved with data:', data, '- item one');

            return data;
        }, function (reason) {
            console.info('second promise rejected with reason:', reason, '- item one');

            return reason;
        }, function (state) {
            console.info('second promise progressed to state:', state, '- item one');

            return state;
        });
        setTimeout(function () {
            p.then(function (data) {
                console.info('first promise resolved with data:', data, '- item two');

                return data;
            }, function (reason) {
                console.info('first promise rejected with reason:', reason, '- item two');

                return reason;
            }, function (state) {
                console.info('first promise progressed to state:', state, '- item two');

                return state;
            });
        }, 500);
    });
});