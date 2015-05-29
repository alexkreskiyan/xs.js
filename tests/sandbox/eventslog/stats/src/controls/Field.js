xs.define(xs.Class, 'ns.Field', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.controls';

    Class.extends = 'xs.view.View';

    Class.positions = [ 'items' ];

    Class.constant.template = xs.lazy(function () {
        return new xs.resource.text.HTML({
            data: '<div><label></label><select><xs-view-position name="items"/></select></div>'
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
    };

});