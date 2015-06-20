xs.define(xs.Class, 'ns.view.Entry', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.comparison';

    Class.imports = {
        Model: 'xs.data.Model'
    };

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
            var element = renderField(data[ field ]);
            root.appendChild(element);

        }
    };

    var renderField = function (data) {
        var element;

        if (xs.isObject(data)) {
            element = document.createElement('pre');
            //element.classList.add('field');
            element.setAttribute('title', data);
            element.innerHTML = syntaxHighlight(JSON.stringify(data, undefined, 2));
        } else {
            element = document.createElement('div');
            element.classList.add('field');
            element.setAttribute('title', data);
            element.innerHTML = data;
        }

        return element;
    };

    function syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';

            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }

            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

});