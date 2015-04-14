/**
 * xs.data.operation.ISourceOperation represents interface, that is implemented by all operations via source
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.data.operation.IModelOperation
 *
 * @extends xs.data.operation.IOperation
 */
xs.define(xs.Interface, 'ns.IModelOperation', function () {

    'use strict';

    var Interface = this;

    Interface.namespace = 'xs.data.operation';

    Interface.extends = 'ns.IOperation';

});