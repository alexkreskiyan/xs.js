xs.define(xs.Class, 'ns.view.Entry', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.comparison';

    Class.imports = [
        {
            Model: 'xs.data.Model'
        }
    ];

    Class.extends = 'xs.view.Element';

    Class.constructor = function (model, fields) {
        var me = this;

        self.assert.ok(model instanceof imports.Model, 'constructor - given model `$model` is not a `$Model` instance', {
            $model: model,
            $Model: imports.Model
        });

        //call parent constructor
        self.parent.call(me, document.createElement('div'));

        //add class
        me.classes.add('entry');

        //render model data
        var data = model.get(fields);
        var root = me.private.el;

        for (var i = 0; i < fields.length; i++) {
            var field = fields[ i ];
            var element = renderField(data[ field ], 1);
            root.appendChild(element);

        }
    };

    var renderField = function (data, level) {
        var element = document.createElement('div');

        if (xs.isObject(data)) {
            Object.keys(data).forEach(function (key) {
                element.appendChild(renderField(key + ': ' + data[ key ], level + 1));
            });
        } else {
            element.classList.add('field');
            element.setAttribute('title', data);
            element.innerHTML = '-'.repeat(level) + ' ' + data;
        }

        return element;
    };

});