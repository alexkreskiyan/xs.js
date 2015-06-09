xs.define(xs.Class, 'ns.view.Row', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.grid';

    Class.imports = {
        event: {
            Select: 'ns.view.event.Select'
        },
        Model: 'xs.data.Model'
    };

    Class.extends = 'xs.view.Element';

    var states = {
        active: '&#9733;',
        inactive: '&#9734;'
    };

    Class.constructor = function (model, fields) {
        var me = this;

        self.assert.ok(model instanceof imports.Model, 'constructor - given model `$model` is not a `$Model` instance', {
            $model: model,
            $Model: imports.Model
        });

        var row = document.createElement('div');

        //call parent constructor
        self.parent.call(me, row);

        //add class
        me.classes.add('row');

        me.private.state = states.inactive;

        //add state item
        var state = document.createElement('div');
        state.classList.add('state');
        state.innerHTML = me.private.state;
        row.appendChild(state);

        var data = model.get(fields);

        //add fields to row
        for (var i = 0; i < fields.length; i++) {
            var field = document.createElement('div');
            field.classList.add('field');
            field.innerHTML = data[ fields[ i ] ];
            row.appendChild(field);
        }

        row.addEventListener('click', function () {
            var selected;

            if (me.private.state === states.active) {
                me.private.state = states.inactive;
                selected = false;
            } else {
                me.private.state = states.active;
                selected = true;
            }

            state.innerHTML = me.private.state;

            me.events.send(new imports.event.Select({
                model: model,
                state: selected
            }));
        });

    };

});