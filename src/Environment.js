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

    var environment = new (function () {
        var me = this;
        var userAgent = me.userAgent = navigator.userAgent.toLowerCase();

        var browserName = 'name',
            browserMajor = 'major',
            browserMinor = 'minor',
            browserVersion = 'version',
            engineName = 'name',
            engineMajor = 'major',
            engineMinor = 'minor',
            engineVersion = 'version',
            osName = 'name',
            osVersion = 'version',
            deviceModel = 'model',
            deviceType = 'type',
            deviceVendor = 'vendor',
            cpuArchitecture = 'architecture';

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
        var rules = {
            browser: [
                [
                    [
                        [browserName, 'chrome'],
                        browserMajor,
                        browserMinor,
                        browserVersion
                    ],
                    [/chromium/],
                    [/chrome\/([\d]+)\.([\d]+)/, /chrome\/([\d\.]+)/]
                ],
                [
                    [
                        [browserName, 'chromium'],
                        browserMajor,
                        browserMinor,
                        browserVersion
                    ],
                    [],
                    [/chrome\/([\d]+)\.([\d]+)/, /chrome\/([\d\.]+)/]
                ],
                [
                    [
                        [browserName, 'firefox'],
                        browserMajor,
                        browserMinor,
                        browserVersion
                    ],
                    [],
                    [/firefox\/([\d]+)\.([\d]+)/, /firefox\/([\d\.]+)/]
                ],
                [
                    [
                        [browserName, 'opera'],
                        browserMajor,
                        browserMinor,
                        browserVersion
                    ],
                    [],
                    [/opera/, /version\/([\d]+)\.([\d]+)/, /version\/([\d\.]+)/]
                ]
            ],
            engine: [
                [
                    [
                        [engineName, 'webkit'],
                        engineMajor,
                        engineMinor,
                        engineVersion
                    ],
                    [],
                    [/applewebkit\/([\d]+)\.([\d]+)/, /applewebkit\/([\d\.]+)/]
                ],
                [
                    [
                        [engineName, 'gecko'],
                        engineMajor,
                        engineMinor,
                        engineVersion
                    ],
                    [],
                    [/firefox\/([\d]+)\.([\d]+)/, /firefox\/([\d\.]+)/]
                ],
                [
                    [
                        [engineName, 'presto'],
                        engineMajor,
                        engineMinor,
                        engineVersion
                    ],
                    [],
                    [/presto\/([\d]+)\.([\d]+)/, /presto\/([\d\.]+)/]
                ]
            ],
            os: [
                [
                    [
                        [osName, 'linux'],
                        osVersion
                    ],
                    [],
                    [/linux\s([\d\w_]+)/]
                ]
            ],
            device: [
            ],
            cpu: [
                [
                    [
                        [cpuArchitecture, 'amd64']
                    ],
                    [],
                    [/x86_64/]
                ]
            ]
        };

        var parse = function (userAgent, rules, defaults) {
            var result = xs.extend({}, defaults);
            xs.Array.find(rules, function (rule) {
                var params = rule[0],
                    negativeRegExps = rule[1],
                    positiveRegExps = rule[2],
                    data = [],
                    match;

                //check if userAgent doesn't match any one of negativeRegExps given in rule
                match = xs.Array.some(negativeRegExps, function (regExp) {
                    //check if userAgent matches given regExp
                    return regExp.exec(userAgent);
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

                //iterate params and fill result
                xs.Array.each(params, function (param) {
                    //if param is given as array, than it has it's fixed value and we use it
                    if (xs.isArray(param)) {
                        result[param[0]] = param[1];
                        //else - use related data element, specified by index in data array
                    } else {
                        result[param] = data.shift();
                    }
                });

                //return true stops search
                return true;
            });

            //return search result
            return result;
        };
        me.browser = parse(userAgent, rules.browser, {
            name: undefined,
            major: undefined,
            minor: undefined,
            version: undefined
        });
        me.engine = parse(userAgent, rules.engine, {
            name: undefined,
            major: undefined,
            minor: undefined,
            version: undefined
        });
        me.os = parse(userAgent, rules.os, {
            name: undefined,
            version: undefined
        });
        me.device = parse(userAgent, rules.device, {
            model: undefined,
            type: undefined,
            vendor: undefined
        });
        me.cpu = parse(userAgent, rules.cpu, {
            architecture: undefined
        });
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
    xs.env = {};
    xs.Object.extend(xs.env, {
        userAgent: environment.userAgent,
        browser: environment.browser,
        engine: environment.engine,
        os: environment.os,
        device: environment.device,
        cpu: environment.cpu
    });
})(window, 'xs');