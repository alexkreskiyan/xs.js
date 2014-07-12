/**
 This file is core of xs.js 0.1

 Copyright (c) 2013-2014, Annium Inc

 Contact:  http://annium.com/contact

 GNU General Public License Usage
 This file may be used under the terms of the GNU General Public License version 3.0 as
 published by the Free Software Foundation and appearing in the file LICENSE included in the
 packaging of this file.

 Please review the following information to ensure the GNU General Public License version 3.0
 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

 If you are unsure which license is appropriate for your use, please contact the sales department
 at http://annium.com/contact.

 */
'use strict';
(function (root, ns) {

    //framework shorthand
    var xs = root[ns];

    /**
     * Define xs.Base class
     */
    xs.define('xs.Base', {
        static: {
            properties: {
            },
            methods: {
                /**
                 * Returns whether this is child of given parent
                 * @param parent
                 * @returns {Boolean}
                 */
                isChild: function (parent) {
                    var me = this;
                    if (me.parent == parent) {
                        return true;
                    } else if (me.parent.isChild) {
                        return me.parent.isChild(parent);
                    } else {
                        return false;
                    }
                },
                /**
                 * Returns whether this is parent of given child
                 * @param child
                 * @returns {Boolean}
                 */
                isParent: function (child) {
                    return xs.isFunction(child.isChild) ? child.isChild(this) : false;
                }
            }
        },
        methods: {
            /**
             * returns clone of this object
             * @return {xs.Base} clone object
             */
            clone: function () {
                var me = this;
                return xs.create(me.self.label, me.toJSON());
            },
            /**
             * common method for complete destructing of object
             */
            destroy: xs.emptyFn,
            /**
             * returns json data of this object
             * @returns {Object} data hash
             */
            toJSON: function () {
                var me = this,
                    json = {};
                xs.Object.each(me.self.descriptor.properties, function (descriptor, name) {
                    json[name] = me[name];
                });
                return json;
            }
        }
    });
})(window, 'xs');