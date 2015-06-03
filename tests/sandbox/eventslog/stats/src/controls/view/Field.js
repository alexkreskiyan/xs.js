xs.define(xs.Class, 'ns.view.Field', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.controls';

    Class.extends = 'xs.view.View';

    Class.imports = [
        {
            Template: 'xs.resource.text.HTML'
        },
        {
            'event.Select': 'ns.view.event.Select'
        }
    ];

    Class.positions = [ 'items' ];

    Class.constant.template = xs.lazy(function () {
        return new imports.Template({
            data: '<div><label></label><select xs-view-position="items" multiple="multiple"></select></div>'
        });
    });

    Class.constructor = function (data) {
        var me = this;

        //assert, that data given
        self.assert.object(data, 'constructor - given data `$data` is not an object', {
            $data: data
        });

        //assert, that data.name given
        self.assert.string(data.name, 'constructor - given data.name `$name` is not a string', {
            $name: data.name
        });

        //assert, that data.field given
        self.assert.string(data.field, 'constructor - given data.field `$field` is not a string', {
            $field: data.field
        });

        //assert, that data.label given
        self.assert.string(data.label, 'constructor - given data.label `$label` is not a string', {
            $label: data.label
        });


        //call parent constructor
        self.parent.call(me);

        //add name for select
        me.query('select').classes.add(data.name);

        //set group label
        me.query('label').private.el.innerHTML = data.label;

        //add select handler
        me.query('select').private.el.addEventListener('change', function (event) {
            me.events.send(new imports.event.Select(event));
        });

        //set privates
        me.private.name = data.name;
        me.private.field = data.field;
        me.private.label = data.label;
    };

    Class.property.name = {
        set: xs.noop
    };

    Class.property.field = {
        set: xs.noop
    };

    Class.property.label = {
        set: xs.noop
    };

});