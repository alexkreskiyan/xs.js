/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.reactive.Stream', function () {

    'use strict';

    test('constructor', function () {
        expect(0);
        //
        //var stream = new xs.reactive.Stream(function (send, end) {
        //    debugger;
        //
        //    var i = 0;
        //    var emit = function () {
        //        send(i);
        //        i++;
        //        if (i > 10) {
        //            end(i);
        //        }
        //    };
        //    var interval = 100;
        //
        //    var intervalId;
        //
        //    return {
        //        on: function () {
        //            intervalId = setInterval(emit, interval);
        //        },
        //        off: function (data) {
        //            clearInterval(intervalId);
        //        }
        //    };
        //});
        //
        //stream.listen(function (data) {
        //    console.log('listener1', data);
        //});
        //
        //stream.listen(function (data) {
        //    console.log('listener2', data);
        //});
    });
});