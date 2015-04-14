/**
 * xs.data.operation.model.ISave represents operation interface for saving model directly via proxy
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.data.operation.model.ISave
 *
 * @extends xs.data.operation.IModelOperation
 */
xs.define(xs.Interface, 'ns.model.ISave', function () {

    'use strict';

    var Interface = this;

    Interface.namespace = 'xs.data.operation';

    Interface.extends = 'ns.IModelOperation';

    Interface.method.save = function (model) {

    };

});