/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
xs.define(xs.Class, 'C', function () {
    this.extends = 'B';
    this.method.on = function () {
        debugger;
    };
});
xs.define(xs.Class, 'B', function () {
    this.extends = 'A';
});
xs.define(xs.Class, 'A', function () {
    this.mixins.observable = 'xs.event.Observable';
});

var str = '<div class="container"><div class="base"><div class="parent"><div class="child"></div></div></div></div>';
var view = new xs.ux.View(str);

/**
 * Core xs.js view object
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.ux.View
 */
xs.define(xs.Class, 'ns.view.PositionsCollection', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.ux';

    var positionRe = /\{\{[A-Za-z0-9]+\}\}/g;

    //var positionTemplate = '<xs-template-position name="$name"/>';

    Class.constructor = function (template) {
        var me = this;

        //assert, that template is string
        xs.assert.string(template, 'constructor - given template "$template" is not a string', {
            $template: template
        }, PositionsCollectionError);

        //get template positions
        var items = _getTemplatePositions(template);

        //convert it to xs.core.Collection format
        me.items = (new xs.core.Collection(items)).items;
    };

    /**
     * Processes template's positions
     *
     * @ignore
     *
     * @private
     *
     * @method getTemplatePositions
     *
     * @param {String} template
     *
     * @return {String} processed template
     */
    var _getTemplatePositions = function (template) {

        //try to match positions
        var positions = template.match(positionRe);

        //if no positions, return template as is
        if (!positions) {

            return [];
        }

        //return map of positions list, removing brackets
        return positions.map(function (index) {
            return index.slice(2, index.length - 2);
        });
    };

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class PositionsCollectionError
     */
    function PositionsCollectionError(message) {
        this.message = self.label + '::' + message;
    }

    PositionsCollectionError.prototype = new Error();
});