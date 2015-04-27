/**
 * xs.data.operation.source.IDeleteSome represents operation interface for removing some models via source by given models array or primary keys array
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.data.operation.source.IDeleteSome
 *
 * @extends xs.data.operation.ISourceOperation
 */
xs.define(xs.Interface, 'ns.source.IDeleteSome', function () {

    'use strict';

    var Interface = this;

    Interface.namespace = 'xs.data.operation';

    Interface.extends = 'ns.ISourceOperation';

    Interface.method.deleteSome = function (models) {

    };

});