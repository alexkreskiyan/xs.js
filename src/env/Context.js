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
(function (root, ns) {

    'use strict';

    //framework shorthand
    var xs = root[ns];
    xs.isObject(env) || (xs.env = {});

    /**
     * xs.environment.Context is private singleton,provision of basic operations to determine the browser and
     * definition of the system architecture
     *
     * @class xs.lang.List
     *
     * @author Alex Kreskiyan <brutalllord@gmail.com>
     *
     * @singleton
     *
     * @private
     */
    //create or update xs.env
    xs.env.Context = new (function () {
        var me = this;

        /**
         * Parsing the packet header to determine the type of browser
         *
         * @method defined
         *
         * @param {String} userAgent information about the web-browser

         * @param {Array} rules rules for check browser
         *
         * @param {Array} params ['name', 'major', 'minor', 'version']
         *
         * @returns {boolean} verification result
         */
        var parse = function (userAgent, rules, params) {

            //accumulate result of the regular expression
            var result = {};
            xs.Array.find(rules, function (rule) {
                var defaults = xs.Array.clone(rule[0]), negativeRegExps = rule[1], positiveRegExps = rule[2], data = [], match;

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
                    if (xs.isString(defaults[0])) {
                        result[param] = defaults.shift();
                    } else if (xs.isArray(defaults[0])) {
                        //defaults item contains parser rules for parsing obtained result
                        var raw = data.shift();
                        var parser = defaults.shift();
                        //parse raw data and assign
                        result[param] = raw.replace(parser[0], parser[1]);
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
         * Detect function, that consumes userAgent from navigator and updates stored values.
         * Is called automatically once on start
         *
         * @method define
         *
         * @param none
         */
        me.detect = function () {
            //user agent string
            var userAgent = me.userAgent = navigator.userAgent.toLowerCase();
            //location
            me.location = location;
            //set session variables with correct values
            me.browser = parse(userAgent, rules.browser, [
                'name',
                'major',
                'minor',
                'version'
            ]);
            me.browser.major = Number(me.browser.major);
            me.browser.minor = Number(me.browser.minor);
            me.engine = parse(userAgent, rules.engine, [
                'name',
                'major',
                'minor',
                'version'
            ]);
            me.engine.major = Number(me.engine.major);
            me.engine.minor = Number(me.engine.minor);
            me.os = parse(userAgent, rules.os, [
                'name',
                'version'
            ]);

            me.cpu = parse(userAgent, rules.cpu, ['architecture']);
            //set shortcuts
            //for desktop os
            me.isLinux = me.os.name == os.linux;
            me.isWindows = me.os.name == os.windows;
            me.isMac = me.os.name == os.osx;
            //mobile os
            me.isAndroid = me.os.name == os.android;
            me.isiOS = me.os.name == os.ios;
            me.isWindowsPhone = me.os.name == os.windowsPhone;
            //engines
            me.isWebkit = me.engine.name == engine.webkit;
            me.isBlink = me.engine.name == engine.blink;
            me.isGecko = me.engine.name == engine.gecko;
            me.isPresto = me.engine.name == engine.presto;
            me.isTrident = me.engine.name == engine.trident;
            //desktop browsers
            me.isChrome = xs.Array.has([
                browser.chrome,
                browser.chromium
            ], me.browser.name);
            me.isFirefox = me.browser.name == browser.firefox;
            me.isOpera = me.browser.name == browser.opera;
            me.isSafari = me.browser.name == browser.safari;
            me.isIE = me.browser.name == browser.ie;
            //mobile browsers
            me.isChromeMobile = me.browser.name == browser.chromeMobile;
            me.isFirefoxMobile = me.browser.name == browser.firefoxMobile;
            me.isOperaMobile = (me.browser.name == browser.operaMobile || me.browser.name == browser.operaMini);
            me.isSafariMobile = me.browser.name == browser.safariMobile;
            me.isIEMobile = me.browser.name == browser.ieMobile;
            //arch
            me.is32 = me.cpu.architecture == arch.x32;
            me.is64 = me.cpu.architecture == arch.x64;
        };

        /**
         * Rules hash for different aspects of environment detection
         * Each rule in array must have 3 items:
         *  - variables list
         *    contains variables, being fetched from rule, written is direct fetch order
         *    variable can be given as default value for relative param, or empty value - then fetched data will be used,
         *    or as array with 2 elements: variable parsing rule and it compunding string
         *  - negative regular expressions
         *    here are expressions, that have not to be executed for rule to be matched
         *  - positive and data containing regular expressions
         *    here are expressions, that have to be executed for rule to be matched. some of them contain data selections
         *    data selection order should match variables list order
         *
         */
        var browser = {
            chrome:        'chrome',
            chromeMobile:  'chrome mobile',
            chromium:      'chromium',
            firefox:       'firefox',
            firefoxMobile: 'firefox mobile',
            waterfox:      'waterfox',
            safari:        'safari',
            safariMobile:  'safari mobile',
            opera:         'opera',
            operaMobile:   'opera mobile',
            operaMini:     'opera mini',
            ie:            'ie',
            ieMobile:      'ie mobile',
            yabrowser:     'yabrowser'
        }, engine = {
            webkit:  'webkit',
            blink:   'blink',
            gecko:   'gecko',
            presto:  'presto',
            trident: 'trident'
        }, os = {
            linux:        'linux',
            windows:      'windows',
            windowsPhone: 'windows phone',
            android:      'android',
            osx:          'os x',
            ios:          'ios'
        }, arch = {
            x32: '32',
            x64: '64'
        };

        //set of rules
        var rules = {

            //rules for determining the browser
            browser: [
                [
                    [browser.chrome],
                    [
                        /chromium/,
                        /mobile/,
                        /yabrowser/,
                        /opr\//
                    ],
                    [
                        /chrome\/([\d]+)\.([\d]+)/,
                        /chrome\/([\d\.]+)/
                    ]
                ],
                [
                    [browser.chromeMobile],
                    [/yabrowser/],
                    [
                        /mobile/,
                        /(?:chrome|crios)\/([\d]+)\.([\d]+)/,
                        /(?:chrome|crios)\/([\d\.]+)/
                    ]
                ],
                [
                    [browser.chromium],
                    [],
                    [
                        /chromium\/([\d]+)\.([\d]+)/,
                        /chromium\/([\d\.]+)/
                    ]
                ],
                [
                    [browser.firefox],
                    [/waterfox/],
                    [
                        /firefox\/([\d]+)\.([\d]+)/,
                        /firefox\/([\d\.]+)/
                    ]
                ],
                [
                    [browser.waterfox],
                    [],
                    [
                        /waterfox/,
                        /firefox\/([\d]+)\.([\d]+)/,
                        /firefox\/([\d\.]+)/
                    ]
                ],
                [
                    [browser.safari],
                    [
                        /chrome/,
                        /mobile/
                    ],
                    [
                        /safari/,
                        /version\/([\d]+)\.([\d]+)/,
                        /version\/([\d\.]+)/
                    ]
                ],
                [
                    [browser.safariMobile],
                    [/chrome/],
                    [
                        /mobile/,
                        /version\/([\d]+)\.([\d]+)/,
                        /version\/([\d\.]+)/
                    ]
                ],
                [
                    [browser.opera],
                    [],
                    [
                        /opera/,
                        /version\/([\d]+)\.([\d]+)/,
                        /version\/([\d\.]+)/
                    ]
                ],
                [
                    [browser.opera],
                    [],
                    [
                        /opr\/([\d]+)\.([\d]+)/,
                        /opr\/([\d\.]+)/
                    ]
                ],
                [
                    [browser.ie],
                    [/iemobile/],
                    [
                        /msie\s([\d]+)\.([\d]+)/,
                        /msie\s([\d\.]+)/
                    ]
                ],
                [
                    [
                        browser.ie,
                        '11',
                        '0',
                        '11.0'
                    ],
                    [/iemobile/],
                    [/trident\/7/]
                ],
                [
                    [browser.ieMobile],
                    [],
                    [
                        /iemobile\/([\d]+)\.([\d]+)/,
                        /iemobile\/([\d\.]+)/
                    ]
                ],
                [
                    [browser.yabrowser],
                    [],
                    [
                        /yabrowser\/([\d]+)\.([\d]+)/,
                        /yabrowser\/([\d\.]+)/
                    ]
                ]
            ],

            //rules for determining the engine
            engine:  [
                [
                    [engine.webkit],
                    [
                        /opr\//,
                        /yabrowser\//,
                        /(?:chrome|crios)\/(?:2[8-9]|[3-9][0-9])\./
                    ],
                    [
                        /applewebkit\/([\d]+)\.([\d]+)/,
                        /applewebkit\/([\d\.]+)/
                    ]
                ],
                [
                    [engine.blink],
                    [/chrome\/(?:[1-9]|1[0-9]|2[0-7])\./],
                    [
                        /(?:opr|crios|chrome|yabrowser)\//,
                        /applewebkit\/([\d]+)\.([\d]+)/,
                        /applewebkit\/([\d\.]+)/
                    ]
                ],
                [
                    [engine.gecko],
                    [],
                    [
                        /gecko\//,
                        /rv:([\d]+)\.([\d]+)/,
                        /rv:([\d\.]+)/
                    ]
                ],
                [
                    [engine.presto],
                    [],
                    [
                        /presto\/([\d]+)\.([\d]+)/,
                        /presto\/([\d\.]+)/
                    ]
                ],
                [
                    [engine.trident],
                    [],
                    [
                        /trident\/([\d]+)\.([\d]+)/,
                        /trident\/([\d\.]+)/
                    ]
                ],
                [
                    [engine.trident],
                    [],
                    [/msie/]
                ]
            ],

            //rules for determining the operating system
            os:      [
                [
                    [os.linux],
                    [/android/],
                    [/linux\s/]
                ],
                [
                    [
                        os.windows,
                        'xp'
                    ],
                    [],
                    [/windows\snt\s5\.(?:1|2)/]
                ],
                [
                    [
                        os.windows,
                        'vista'
                    ],
                    [],
                    [/windows\snt\s6\.0/]
                ],
                [
                    [
                        os.windows,
                        '7'
                    ],
                    [],
                    [/windows\snt\s6\.1/]
                ],
                [
                    [
                        os.windows,
                        '8'
                    ],
                    [],
                    [/windows\snt\s6\.2/]
                ],
                [
                    [
                        os.windows,
                        '8.1'
                    ],
                    [],
                    [/windows\snt\s6\.3/]
                ],
                [
                    [os.windowsPhone],
                    [],
                    [/windows\sphone(?:\sos)?\s([\d\.]+)/]
                ],
                [
                    [os.android],
                    [],
                    [/android\s([\d\.]+)/]
                ],
                [
                    [
                        os.osx,
                        [
                            /([\d]+)(?:_|\.)([\d]+)(?:_|\.)([\d]+)/,
                            '$1.$2.$3'
                        ]
                    ],
                    [],
                    [/os\sx\s([\d_\.]+)/]
                ],
                [
                    [
                        os.ios,
                        [
                            /([\d]+)(?:_|\.)([\d]+)(?:_|\.)([\d]+)/,
                            '$1.$2.$3'
                        ]
                    ],
                    [],
                    [/iphone\sos\s([\d_\.]+)/]
                ]
            ],

            //rules for determining the processor architecture
            cpu:     [
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
                    [
                        /(?:x|wow)64/,
                        /phone/
                    ],
                    [/windows/]
                ]
            ]
        };
        me.detect();
    });

    //Needed simple xs.extend(xs, xs.env.Context)
    xs.extend(xs, {
        //commons
        userAgent:       xs.env.userAgent,
        location:        xs.env.location,
        browser:         xs.env.browser,
        engine:          xs.env.engine,
        os:              xs.env.os,
        cpu:             xs.env.cpu,
        //shortcuts
        //desktop os
        isLinux:         xs.env.isLinux,
        isWindows:       xs.env.isWindows,
        isMac:           xs.env.isMac,
        //mobile os
        isAndroid:       xs.env.isAndroid,
        isiOS:           xs.env.isiOS,
        isWindowsPhone:  xs.env.isWindowsPhone,
        //engines
        isWebkit:        xs.env.isWebkit,
        isBlink:         xs.env.isBlink,
        isGecko:         xs.env.isGecko,
        isPresto:        xs.env.isPresto,
        isTrident:       xs.env.isTrident,
        //desktop browsers
        isChrome:        xs.env.isChrome,
        isFirefox:       xs.env.isFirefox,
        isOpera:         xs.env.isOpera,
        isSafari:        xs.env.isSafari,
        isIE:            xs.env.isIE,
        //mobile browsers
        isChromeMobile:  xs.env.isChromeMobile,
        isFirefoxMobile: xs.env.isFirefoxMobile,
        isOperaMobile:   xs.env.isOperaMobile,
        isSafariMobile:  xs.env.isSafariMobile,
        isIEMobile:      xs.env.isIEMobile,
        //arch
        is32:            xs.env.is32,
        is64:            xs.env.is64
    });
})(window, 'xs');