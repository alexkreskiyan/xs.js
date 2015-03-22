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
/**
 * @class xs.request.Data represents request data object
 */
'use strict';
xs.define(xs.Class, 'xs.request.Data', function () {
    return {
        constructor: function () {
            var me = this;
            //raw data is always simple object
            me.__set('raw', {});
            //Check if browser supports FormData API and set data
            var version = xs.browser.major;
            if ((xs.isChrome && version >= 7) || (xs.isFirefox && version >= 4) || (xs.isIE && version >= 10) || (xs.isOpera && version >= 12) || (xs.isSafari && version >= 5)) {
                me.__set('data', new FormData);
            }
        },
        properties: {
            isFormData: {
                get: function () {
                    return this.__get('data') instanceof FormData;
                },
                set: xs.noop
            },
            raw: {
                get: function () {
                    return this.__get('raw');
                },
                set: xs.noop
            },
            data: {
                get: function () {
                    var me = this;
                    var data = me.__get('data');
                    return data ? data : me.__get('raw');
                },
                set: xs.noop
            }
        },
        methods: {
            add: function (name, value) {
                var me = this;
                me.__get('raw')[name] = value;
                if (me.isFormData) {
                    me.__get('data').append[name] = value;
                }
                console.log(params);
            },
            get: function (name) {
                var me = this;
                console.log('get', name);
            },
            remove: function () {
                var me = this, params = xs.Array.unique(xs.Array.union(xs.Array.clone(arguments)));
                console.log(params);
            }
        }
    };
});
























