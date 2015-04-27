/**
 * xs.data.operation.source.IReadSome represents operation interface for reading some models data via source by primary keys
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.data.operation.source.IReadSome
 *
 * @extends xs.data.operation.ISourceOperation
 */
xs.define(xs.Interface, 'ns.source.IReadSome', function () {

    'use strict';

    var Interface = this;

    Interface.namespace = 'xs.data.operation';

    Interface.extends = 'ns.ISourceOperation';

    Interface.method.readSome = function (keys) {

    };

});