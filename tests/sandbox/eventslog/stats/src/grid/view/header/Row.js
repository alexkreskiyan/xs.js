xs.define(xs.Class, 'ns.view.header.Row', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.grid';

    Class.extends = 'xs.view.View';

    Class.imports = [
        {
            Item: 'ns.view.header.Item'
        },
        {
            'event.Sort': 'ns.view.event.Sort'
        },
        {
            Template: 'xs.resource.text.HTML'
        }
    ];

    Class.positions = [
        'fields'
    ];

    Class.constant.template = xs.lazy(function () {
        return new imports.Template({
            data: '<div xs-view-position="fields"></div>'
        });
    });

    Class.constructor = function (fields) {
        var me = this;

        //assert, that fields given
        self.assert.object(fields, 'constructor - given fields `$fields` are not an object', {
            $fields: fields
        });

        //call parent constructor
        self.parent.call(me);

        //add class
        me.classes.add('header');

        fields.each(function (config) {
            var field = new imports.Item(config);

            me.fields.add(field);

            //send sort event up
            field.on(imports.event.Sort, me.events.send);
        });
    };

});