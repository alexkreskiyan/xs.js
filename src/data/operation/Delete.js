/**
 * xs.data.operation.Delete represents operation, performed by proxy with model, being deleted on server
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.data.operation.Delete
 *
 * @extends xs.data.operation.Operation
 */
xs.define(xs.Class, 'ns.operation.Delete', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data';

    Class.imports = [
        {IModel: 'ns.IModel'}
    ];

    Class.extends = 'ns.operation.Operation';

    Class.constructor = function (model) {
        var me = this;

        //verify that model is given
        self.assert.implements(model, imports.IModel, 'constructor - given model `$model` does not implement interface `$Interface`', {
            $model: model,
            $Interface: imports.IModel
        });

        //call parent constructor
        self.parent.call(me);

        //save model
        me.private.model = model;
    };

    Class.property.model = {
        set: xs.noop
    };

});