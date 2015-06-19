xs.define(xs.Class, 'ns.view.header.Row', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.grid';

    Class.extends = 'xs.view.View';

    Class.imports = {
        event: {
            Sort: 'ns.view.event.Sort'
        },
        Element: 'xs.view.Element',
        Item: 'ns.view.header.Item',
        Template: 'xs.resource.text.HTML'
    };

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

        //add state field
        var stateField = new imports.Element(document.createElement('div'));
        stateField.classes.add('state');
        me.fields.add(stateField);

        fields.each(function (config) {
            var field = new imports.Item(config);

            me.fields.add(field);

            //send sort event up
            field.on(imports.event.Sort, me.events.emitter.send);
        });
    };

});