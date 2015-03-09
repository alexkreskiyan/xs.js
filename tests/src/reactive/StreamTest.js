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

        window.stream = new xs.reactive.Stream(function (send, end) {
            var i = 10;
            var interval = 100;
            var intervalId;
            var generator = function () {
                send(i);
                i--;
                if (i === 0) {
                    end();
                }
            };
            return {
                on: function () {
                    intervalId = setInterval(generator, interval);
                },
                off: function () {
                    clearInterval(intervalId);
                }
            };
        });
        /*
         Common stream scheme:
         var result = new xs.reactive.Stream(function(emit, destroy, a, b, c) {
         },[a, b, c])
         Any stream is created that way - describing function, and optional other sources




         Streams combination:
         1. Simple combination stream.
         Combines any count of reactive objects, emitting them without any buffering
         a: --1--X
         b: -2-3--X

         z: -213--X

         2. parallel combination stream.
         Collects buffer with one event from each stream, synchronizing them. Is destroyed automatically, when can not emit any more events.
         (One of streams has no buffered values and was just ended - thus this test is done on end of one of sources)
         a: 123-X
         b: --4-8---X
         c: -5-6-7-X

         z: --e-e---X

         1 - [1,4,5]
         2 - [2,8,6]

         Ends with `b`, because `a` and `c` have had buffered values

         3. subsequent combination stream

         return Board.EventLayer.eventChain()
         .once("mousedown", this._placeStartPoint, this)
         .any(function (chain) {
         return chain
         .any("mousemove", this.__drawTemporaryFigure, this)
         .once({"keydown": 32}, this._placePolygonePoint, this);
         }, this)
         .once("mouseup", this._placePolygonePoint, this)
         .cancel({"keydown": 27}, this.cancelDrawing, this)
         .atLast(this.__saveFigure, this)
         .init();

         .after - creates synchronization stream
         the problem - do incorrect events break synchronization or are ignored?
         */
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