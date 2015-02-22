/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */

/**
 * Key data workflow element of xs.js.
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.data.proxy.storage.Local
 *
 * @extends xs.data.proxy.Proxy
 */
xs.define(xs.Class, 'ns.proxy.storage.Local', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data';

    Class.extends = 'ns.proxy.Proxy';

    Class.method.create = function (operation) {
        var me = this;

        //call parent
        self.parent.prototype.create.call(me, operation);
    };

    Class.method.createAll = function (operation) {
        var me = this;

        //call parent
        self.parent.prototype.createAll.call(me, operation);
    };

    Class.method.read = function (operation) {
        var me = this;

        //call parent
        self.parent.prototype.read.call(me, operation);
    };

    Class.method.getCount = function (operation) {
        var me = this;

        //call parent
        self.parent.prototype.getCount.call(me, operation);
    };

    Class.method.readAll = function (operation) {
        var me = this;

        //call parent
        self.parent.prototype.readAll.call(me, operation);
    };

    Class.method.update = function (operation) {
        var me = this;

        //call parent
        self.parent.prototype.update.call(me, operation);
    };

    Class.method.updateAll = function (operation) {
        var me = this;

        //call parent
        self.parent.prototype.updateAll.call(me, operation);
    };

    Class.method.delete = function (operation) {
        var me = this;

        //call parent
        self.parent.prototype.delete.call(me, operation);
    };

    Class.method.deleteAll = function (operation) {
        var me = this;

        //call parent
        self.parent.prototype.deleteAll.call(me, operation);
    };

});