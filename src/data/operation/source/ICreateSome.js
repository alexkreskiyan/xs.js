/**
 * xs.data.operation.source.ICreateSome represents operation interface for creating some models via source
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.data.operation.source.ICreateSome
 *
 * @extends xs.data.operation.ISourceOperation
 */
xs.define(xs.Interface, 'ns.source.ICreateSome', function () {

    'use strict';

    var Interface = this;

    Interface.namespace = 'xs.data.operation';

    Interface.extends = 'ns.ISourceOperation';

    Interface.method.createSome = function (models) {

    };

});