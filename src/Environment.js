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
 * set class pre-definition
 * @type {Object}
 */
'use strict';
(function (root, ns) {

    //framework shorthand
    var xs = root[ns];

    var environment = xs.env = new (function () {
        var me = this;

        //'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36'
        /**
         * Rules hash for different aspects of environment detection
         * Each rule in array must have 3 items:
         *  - variables list
         *    contains variables, being fetched from rule, written is direct fetch order
         *    variable can be given as string from list of variables above, or as array with 2 elements:
         *    variable name and it's value, that will be set for this variable
         *  - negative regular expressions
         *    here are expressions, that have not to be executed for rule to be matched
         *  - positive and data containing regular expressions
         *    here are expressions, that have to be executed for rule to be matched. some of them contain data selections
         *    data selection order should match variables list order
         * @type {Object}
         */

        var browser = {
                chrome: 'chrome',
                chromeMobile: 'chrome mobile',
                chromium: 'chromium',
                firefox: 'firefox',
                firefoxMobile: 'firefox mobile',
                waterfox: 'waterfox',
                safari: 'safari',
                safariMobile: 'safari mobile',
                opera: 'opera',
                operaMobile: 'opera mobile',
                operaMini: 'opera mini',
                ie: 'ie',
                ieMobile: 'iemobile',
                yabrowser: 'yabrowser'
            },
            engine = {
                webkit: 'webkit',
                gecko: 'gecko',
                presto: 'presto',
                trident: 'trident'
            },
            os = {
                windows: 'windows',
                linux: 'linux',
                osx: 'os x',
                android: 'android',
                ios: 'ios'
            },
            device = {
                mobile: 'mobile',
                tablet: 'tablet'
            },
            arch = {
                x32: '32',
                x64: '64'
            };
        var rules = {
            browser: [
                [
                    [browser.chrome],
                    [/chromium/, /mobile/, /yabrowser/],
                    [/chrome\/([\d]+)\.([\d]+)/, /chrome\/([\d\.]+)/]
                ],
                [
                    [browser.chromeMobile],
                    [],
                    [/mobile/, /(?:chrome|crios)\/([\d]+)\.([\d]+)/, /(?:chrome|crios)\/([\d\.]+)/]
                ],
                [
                    [browser.chromium],
                    [],
                    [/chromium\/([\d]+)\.([\d]+)/, /chromium\/([\d\.]+)/]
                ],
                [
                    [browser.firefox],
                    [/waterfox/],
                    [/firefox\/([\d]+)\.([\d]+)/, /firefox\/([\d\.]+)/]
                ],
                [
                    [browser.waterfox],
                    [],
                    [/waterfox/, /firefox\/([\d]+)\.([\d]+)/, /firefox\/([\d\.]+)/]
                ],
                [
                    [browser.safari],
                    [/chrome/, /mobile/],
                    [/safari/, /version\/([\d]+)\.([\d]+)/, /version\/([\d\.]+)/]
                ],
                [
                    [browser.safariMobile],
                    [/chrome/],
                    [/mobile/, /version\/([\d]+)\.([\d]+)/, /version\/([\d\.]+)/]
                ],
                [
                    [browser.opera],
                    [],
                    [/opera/, /version\/([\d]+)\.([\d]+)/, /version\/([\d\.]+)/]
                ],
                [
                    [browser.ie],
                    [],
                    [/msie\s([\d]+)\.([\d]+)/, /msie\s([\d\.]+)/]
                ],
                [
                    [browser.ie, '11', '0', '11.0'],
                    [],
                    [/trident\/7/]
                ],
                [
                    [browser.yabrowser],
                    [],
                    [/yabrowser\/([\d]+)\.([\d]+)/, /yabrowser\/([\d\.]+)/]
                ]
            ],
            engine: [
                [
                    [engine.webkit],
                    [],
                    [/applewebkit\/([\d]+)\.([\d]+)/, /applewebkit\/([\d\.]+)/]
                ],
                [
                    [engine.gecko],
                    [],
                    [/firefox\/([\d]+)\.([\d]+)/, /firefox\/([\d\.]+)/]
                ],
                [
                    [engine.presto],
                    [],
                    [/presto\/([\d]+)\.([\d]+)/, /presto\/([\d\.]+)/]
                ]
            ],
            os: [
                [
                    [os.linux],
                    [/android/],
                    [/linux\s/]
                ],
                [
                    [os.android],
                    [],
                    [/android\s([\d\.]+)/]
                ],
                [
                    [os.windows, 'xp'],
                    [],
                    [/windows\snt\s5\.(?:1|2)/]
                ],
                [
                    [os.windows, 'vista'],
                    [],
                    [/windows\snt\s6\.0/]
                ],
                [
                    [os.windows, '7'],
                    [],
                    [/windows\snt\s6\.1/]
                ],
                [
                    [os.windows, '8'],
                    [],
                    [/windows\snt\s6\.2/]
                ],
                [
                    [os.windows, '8.1'],
                    [],
                    [/windows\snt\s6\.3/]
                ]
            ],
            device: [
                [
                    ['k900', device.mobile, 'lenovo'],
                    [],
                    [/k900/]
                ],
                [
                    ['xperia ion', device.mobile, 'sony'],
                    [],
                    [/lt28h/]
                ],
                [
                    [null, device.mobile, 'google'],
                    [],
                    [/(nexus\s(?:4|5|6)+)/]
                ],
                [
                    [null, device.tablet, 'google'],
                    [],
                    [/(nexus\s(?:7|8|9|10)+)/]
                ],
                [
                    ['galaxy s4', 'mobile', 'samsung'],
                    [],
                    [/gt-i9505/]
                ]
            ],
            cpu: [
                [
                    [arch.x64],
                    [],
                    [/(?:x86_|x|wow)64/]
                ],
                [
                    [arch.x32],
                    [],
                    [/ia32/]
                ],
                [
                    [arch.x32],
                    [/(?:x|wow)64/],
                    [/windows/]
                ]
            ]
        };

        var parse = function (userAgent, rules, params) {
            var result = {};
            xs.Array.find(rules, function (rule) {
                var defaults = xs.Array.clone(rule[0]),
                    negativeRegExps = rule[1],
                    positiveRegExps = rule[2],
                    data = [],
                    match;

                //check if userAgent doesn't match any one of negativeRegExps given in rule
                match = xs.Array.some(negativeRegExps, function (regExp) {
                    //check if userAgent matches given regExp
                    return regExp.test(userAgent);
                });

                //return false if at least one of negativeRegExps matched
                if (match) {
                    return false;
                }

                //check if userAgent matches all positiveRegExps given in rule
                match = xs.Array.every(positiveRegExps, function (regExp) {
                    //check if userAgent matches given regExp
                    var result = regExp.exec(userAgent);

                    //if no match - return false, that will cause xs.Array.every loop break
                    if (!result) {
                        return false;
                    }

                    //shift first element - that means whole match data to gain only selected ones
                    result.shift();
                    //if data not empty - union data with result, saving order
                    if (result.length) {
                        data = xs.Array.union(data, result);
                    }
                    //sign, that userAgent matched this regExp
                    return true;
                });

                //return false if no match established and search will be continues
                if (!match) {
                    return false;
                }

                //iterate result and fill it
                xs.Array.each(params, function (param) {
                    //if default value given - use it, else - fetch value from data
                    if (defaults[0]) {
                        result[param] = defaults.shift();
                    } else {
                        result[param] = data.shift();
                        //shift empty default value
                        defaults.length && defaults.shift();
                    }
                });

                //return true stops search
                return true;
            });

            //return search result
            return result;
        };

        /**
         * Simple update function, that consumes userAgent from navigator and updates stored values.
         * Is called automatically once on start
         */
        me.update = function () {
            var userAgent = me.userAgent = navigator.userAgent.toLowerCase();
            //update session variables with correct values
            me.browser = parse(userAgent, rules.browser, ['name', 'major', 'minor', 'version']);
            me.engine = parse(userAgent, rules.engine, ['name', 'major', 'minor', 'version']);
            me.os = parse(userAgent, rules.os, ['name', 'version']);
            me.device = parse(userAgent, rules.device, ['model', 'type', 'vendor']);
            me.cpu = parse(userAgent, rules.cpu, ['architecture']);
        };
        me.update();
        /**
         * browser
         * * name
         * * major
         * * minor
         * * version
         * engine
         * * name
         * * major
         * * minor
         * * version
         * os
         * * name
         * * version
         * device
         * * model
         * * type
         * * vendor
         * cpu
         * * architecture
         */

    });
})(window, 'xs');