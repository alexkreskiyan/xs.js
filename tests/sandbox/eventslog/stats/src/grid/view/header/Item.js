xs.define(xs.Class, 'ns.view.header.Item', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.grid';

    Class.imports = [
        {
            'event.Sort': 'ns.view.event.Sort'
        }
    ];

    Class.extends = 'xs.view.Element';

    var direction = {
        asc: '&#9650;',
        desc: '&#9660;'
    };

    Class.constructor = function (data) {
        var me = this;

        //assert, that data given
        self.assert.object(data, 'constructor - given data `$data` is not an object', {
            $data: data
        });

        //assert, that data.name given
        self.assert.string(data.field, 'constructor - given data.field `$field` is to a string', {
            $value: data.value
        });

        //assert, that data.label given
        self.assert.string(data.label, 'constructor - given data.label `$label` is not a string', {
            $label: data.label
        });


        //call parent constructor
        self.parent.call(me, document.createElement('div'));

        //by default - asc
        me.private.direction = direction.asc;

        //add classes
        me.classes.add('field');
        me.classes.add(data.field);

        //set label
        me.private.el.innerHTML = data.label + me.private.direction;

        me.private.el.addEventListener('click', function () {
            if (me.private.direction === direction.asc) {
                me.private.direction = direction.desc;

                me.events.send(new imports.event.Sort({
                    field: data.field,
                    direction: 'DESC'
                }));
            } else {
                me.private.direction = direction.asc;

                me.events.send(new imports.event.Sort({
                    field: data.field,
                    direction: 'ASC'
                }));
            }

            //update label
            me.private.el.innerHTML = data.label + me.private.direction;
        });
    };

});