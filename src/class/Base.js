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
/**
 * @class xs.Base
 * xs.Base is base class for all classes, defined by {@link xs#define xs.define}. All classes, defined that way, inherit {@link xs.Base xs.Base}.
 */
xs.define('xs.Base', function (self) {
    return {
        static: {
            methods: {
                /**
                 * Returns whether this is child of given parent
                 * @static
                 * @method
                 * @param {xs.Base} parent
                 * @return {Boolean}
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
                 * @static
                 * @method
                 * @param {xs.Base} child
                 * @return {Boolean}
                 */
                isParent: function (child) {
                    return xs.isFunction(child.isChild) ? child.isChild(this) : false;
                }
            }
        },
        methods: {
            /**
             * Returns clone of this object. Basically clone is made by instantiating Class with this object {@link #toJSON JSON representation}
             * @member
             * @method
             * @return {xs.Base} clone object
             */
            clone: function () {
                var me = this;
                return xs.create(me.self.label, me.toJSON());
            },
            /**
             * Completes internal object destruction
             * @member
             * @method
             */
            destroy: xs.emptyFn,
            /**
             * Returns object JSON representation. Basically is returned hash with object's values for all declared properties
             * @member
             * @method
             * @return {Object} object JSON representation
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
    };
});