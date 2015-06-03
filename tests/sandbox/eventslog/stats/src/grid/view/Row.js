xs.define(xs.Class, 'ns.view.Row', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.grid';

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

        //assert, that data.name is a string
        self.assert.string(data.name, 'constructor - given data.name `$name` is not a string', {
            $name: data.name
        });

        //assert, that data.name is a string
        self.assert.string(data.name, 'constructor - given data.name `$name` is not a string', {
            $name: data.name
        });


        //call parent constructor
        self.parent.call(me);

        //set value
        me.attributes.set('value', data.value);

        //set label
        me.private.el.innerHTML = data.label;
    };

});