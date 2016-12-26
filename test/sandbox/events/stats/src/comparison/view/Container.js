xs.define(xs.Class, 'ns.view.Container', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.comparison';

    Class.imports = {
        Element: 'xs.view.Element',
        Entry: 'ns.view.Entry',
        Template: 'xs.resource.text.HTML'
    };

    Class.extends = 'xs.view.View';

    Class.positions = [
        'controls',
        'items'
    ];

    Class.constant.template = xs.lazy(function () {
        return new imports.Template({
            data: '<div class="hidden invisible"><div xs-view-position="controls" class="controls"></div><div class="labels"></div><div class="container"><div xs-view-position="items" class="items"></div></div></div>'
        });
    });

    Class.constructor = function (fields) {
        var me = this;

        //call parent constructor
        self.parent.call(me);

        //create close button
        var close = new imports.Element(document.createElement('div'));
        close.classes.add('control');
        close.classes.add('close');
        close.private.el.innerHTML = 'Закрыть';
        close.private.el.addEventListener('click', function () {
            me.hide().then(function () {
                me.items.remove();
            });
        });

        //add close button to controls
        me.controls.add(close);

        var labels = me.query('.labels');

        //add labels
        fields.each(function (field) {
            var label = document.createElement('div');
            label.classList.add('field');
            label.innerHTML = field.label;
            labels.private.el.appendChild(label);
        });
    };

    Class.method.show = function () {
        var me = this;

        var promise = new xs.core.Promise();

        me.classes.remove('hidden');
        me.classes.remove('invisible');
        setTimeout(function () {
            promise.resolve();
        }, 200);

        return promise;
    };

    Class.method.hide = function () {
        var me = this;

        var promise = new xs.core.Promise();

        me.classes.add('invisible');
        setTimeout(function () {
            me.classes.add('hidden');
            promise.resolve();
        }, 200);

        return promise;
    };

});