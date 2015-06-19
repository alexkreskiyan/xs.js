/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.data.reader.JSON', function () {

    'use strict';

    test('constructor', function () {
        var reader;

        //reader can be constructed without config
        reader = new xs.data.reader.JSON();

        //given config must be an object
        throws(function () {
            reader = new xs.data.reader.JSON(null);
        });

        //given config.select must be a function
        throws(function () {
            reader = new xs.data.reader.JSON({
                select: null
            });
        });

        //correctly given ok
        reader = new xs.data.reader.JSON({
            select: function (data) {
                return data.a;
            }
        });
    });

    test('read', function () {
        var reader;

        var data = {
            a: {
                b: 1
            }
        };

        //read selects all data by default
        reader = new xs.data.reader.JSON();
        strictEqual(JSON.stringify(reader.read(JSON.stringify(data))), JSON.stringify(data));

        //select allows to configure reader flexibly
        reader = new xs.data.reader.JSON({
            select: function (data) {
                return data.a;
            }
        });
        strictEqual(JSON.stringify(reader.read(JSON.stringify(data))), JSON.stringify(data.a));
    });

});