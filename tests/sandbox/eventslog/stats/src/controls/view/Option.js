xs.define(xs.Class, 'ns.view.Option', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.controls';

    Class.extends = 'xs.view.View';

    Class.imports = [
        {
            Template: 'xs.resource.text.HTML'
        }
    ];

    Class.constant.template = xs.lazy(function () {
        return new imports.Template({
            data: '<option></option>'
        });
    });

    Class.constructor = function (data) {
        var me = this;

        //assert, that data given
        self.assert.object(data, 'constructor - given data `$data` is not an object', {
            $data: data
        });

        //assert, that data.name given
        self.assert.ok(xs.isString(data.value) || xs.isNumber(data.value), 'constructor - given data.value `$value` is neither a string nor a number', {
            $value: data.value
        });

        //assert, that data.label given
        self.assert.ok(xs.isString(data.label) || xs.isNumber(data.label), 'constructor - given data.label `$label` is not a string', {
            $label: data.label
        });


        //call parent constructor
        self.parent.call(me);

        //set value
        me.attributes.set('value', data.value);

        //set label
        me.private.el.innerHTML = data.label;
    };

});