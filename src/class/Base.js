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

    xs.Base = function () {
    };
    var descriptor = xs.Class.applyDescriptor(xs.Base, {
        const: {
        },
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
                    if (!xs.isFunction(this.parent)) {
                        return false;
                    } else if (this.parent == parent) {
                        return true;
                    } else {
                        return this.parent.isChild(parent);
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
        properties: {
        },
        methods: {
        }
    });
    //property, that contains xs.Base class descriptor
    xs.property.define(xs.Base, 'descriptor', {
        get: function () {
            return descriptor;
        }
    });
    xs.ClassManager.set('xs.Base', xs.Base);
})(window, 'xs');