/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
module('xs.data.Proxy', function () {

    'use strict';

    test('constructor', function () {
        var me = this;

        me.Class = xs.Class(function () {

            var Class = this;

            Class.extends = 'xs.data.Proxy';
        }, me.done);

        return false;
    }, function () {
        var me = this;

        var proxy;

        //proxy can be constructed without config
        proxy = new me.Class();
        strictEqual(proxy.reader, undefined);
        strictEqual(proxy.writer, undefined);

        //given config must be an object
        throws(function () {
            return new me.Class(null);
        });

        //reader can be set within config
        proxy = new me.Class({
            reader: new xs.data.reader.JSON()
        });
        strictEqual(proxy.reader instanceof xs.data.reader.JSON, true);
        strictEqual(proxy.writer, undefined);

        //writer can be set within config
        proxy = new me.Class({
            writer: new xs.data.writer.JSON()
        });
        strictEqual(proxy.reader, undefined);
        strictEqual(proxy.writer instanceof xs.data.writer.JSON, true);
    });

    test('reader', function () {
        var me = this;

        me.Class = xs.Class(function () {

            var Class = this;

            Class.extends = 'xs.data.Proxy';
        }, me.done);

        return false;
    }, function () {
        var me = this;

        var proxy = new me.Class();

        //by default reader is undefined
        strictEqual(proxy.reader, undefined);

        //can not set incorrect instance
        throws(function () {
            proxy.reader = new xs.data.writer.JSON();
        });

        //correct instance is set normally
        proxy.reader = new xs.data.reader.JSON();

        strictEqual(proxy.reader instanceof xs.data.reader.JSON, true);
    });

    test('writer', function () {
        var me = this;

        me.Class = xs.Class(function () {

            var Class = this;

            Class.extends = 'xs.data.Proxy';
        }, me.done);

        return false;
    }, function () {
        var me = this;

        var proxy = new me.Class();

        //by default writer is undefined
        strictEqual(proxy.writer, undefined);

        //can not set incorrect instance
        throws(function () {
            proxy.writer = new xs.data.reader.JSON();
        });

        //correct instance is set normally
        proxy.writer = new xs.data.writer.JSON();

        strictEqual(proxy.writer instanceof xs.data.writer.JSON, true);
    });

});