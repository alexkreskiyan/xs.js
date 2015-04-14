/**
 * xs.data.operation.model.IRead represents operation interface for reading model data directly via proxy by primary key
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.data.operation.model.IRead
 *
 * @extends xs.data.operation.IModelOperation
 */
xs.define(xs.Interface, 'ns.model.IRead', function () {

    'use strict';

    var Interface = this;

    Interface.namespace = 'xs.data.operation';

    Interface.extends = 'ns.IModelOperation';

    Interface.method.read = function (key) {

    };

});