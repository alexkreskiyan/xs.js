/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.data.writer.JSON', function () {

    'use strict';

    test('constructor', function () {
        var writer;

        //writer can be constructed without config
        writer = new xs.data.writer.JSON();

        //given config must be an object
        throws(function () {
            writer = new xs.data.writer.JSON(null);
        });

        //given config.select must be a function
        throws(function () {
            writer = new xs.data.writer.JSON({
                select: null
            });
        });

        //correctly given ok
        writer = new xs.data.writer.JSON({
            select: function (data) {
                return data.a;
            }
        });
    });

    test('write', function () {
        var writer;

        var data = {
            a: {
                b: 1
            }
        };

        //write selects all data by default
        writer = new xs.data.writer.JSON();
        strictEqual(writer.write(data), JSON.stringify(data));

        //select allows to configure writer flexibly
        writer = new xs.data.writer.JSON({
            select: function (data) {
                return data.a;
            }
        });
        strictEqual(writer.write(data), JSON.stringify(data.a));
    });

});