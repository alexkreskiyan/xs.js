/**
 * xs.data.operation.source.IUpdateSome represents operation interface for updating some models via source
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.data.operation.source.IUpdateSome
 *
 * @extends xs.data.operation.ISourceOperation
 */
xs.define(xs.Interface, 'ns.source.IUpdateSome', function () {

    'use strict';

    var Interface = this;

    Interface.namespace = 'xs.data.operation';

    Interface.extends = 'ns.ISourceOperation';

    Interface.method.updateSome = function (models) {

    };

});