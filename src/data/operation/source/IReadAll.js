/**
 * xs.data.operation.source.IReadAll represents operation interface for reading all models via source
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.data.operation.source.IReadAll
 *
 * @extends xs.data.operation.ISourceOperation
 */
xs.define(xs.Interface, 'ns.source.IReadAll', function () {

    'use strict';

    var Interface = this;

    Interface.namespace = 'xs.data.operation';

    Interface.extends = 'ns.ISourceOperation';

    Interface.method.readAll = function () {

    };

});