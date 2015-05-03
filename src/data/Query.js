/**
 * Query is a key element in xs.js data workflow. It's aim is data aggregation from several sources
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.data.Query
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Query', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data';

    Class.imports = [
        {
            Enumerable: 'ns.Enumerable'
        }
    ];

    Class.mixins.observable = 'xs.event.Observable';

    Class.mixins.enumerable = 'xs.data.Enumerable';

    Class.constructor = function (source) {
        var me = this;

        //assert, that source is iterable
        self.assert.iterable(source, 'constructor - given `$source` is not an iterable', {
            $source: source
        });

        //call enumerable constructor
        self.mixins.enumerable.call(me);

        setSource.call(me, source);

        //call observable constructor
        self.mixins.observable.call(me, xs.noop);
    };

    Class.property.isExecuted = {
        set: xs.noop
    };

    Class.method.innerJoin = function (source, condition) {
    };

    Class.method.outerJoin = function (source, condition, emptyValue) {
    };

    Class.method.groupJoin = function (source, condition, alias) {
    };

    Class.method.where = function (selector) {
    };

    Class.method.sort = function (sorter) {
    };

    Class.method.group = function (grouper) {
    };

    Class.method.select = function (selector) {
    };

    Class.method.execute = function () {
    };

    Class.method.destroy = function () {
        var me = this;

        //call Enumerable.destroy
        self.mixins.enumerable.prototype.destroy.call(me);

        //call Observable.destroy
        self.mixins.observable.prototype.destroy.call(me);

        //call parent destroy
        self.parent.prototype.destroy.call(me);
    };

    var setSource = function (source) {
        var me = this;

        if (xs.isInstance(source) && source.self.mixins(imports.Enumerable)) {

            me.private.source = xs.lazy(function () {
                return source;
            });
        } else {

            me.private.source = xs.lazy(function () {
                return new xs.core.Collection(source);
            });
        }

    };

});