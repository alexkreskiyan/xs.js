'use strict';

//define xs.env
xs.getNamespace(xs, 'env');

/**
 * xs.env.Context is singleton, providing basic operations to determine params of execution context
 *
 * @class xs.env.Context
 *
 * @alternateClassName xs.context
 *
 * @author Alex Kreskiyan <brutalllord@gmail.com>
 *
 * @singleton
 */
xs.env.Context = xs.context = (function () {
    var me = {};

    /**
     * Consumes userAgent from navigator and updates stored values.
     * Is called automatically once on start
     *
     * @method detect
     */
    var detect = function () {

        /**
         * Lower-cased user agent string
         *
         * @property userAgent
         *
         * @readonly
         *
         * @type {String}
         */
        var userAgent = me.userAgent = navigator.userAgent.toLowerCase();


        //set session variables with correct values

        /**
         * Browser information:
         *
         * - name
         * - major version
         * - minor version
         * - version complete string
         *
         * @property browser
         *
         * @type {Object}
         */
        me.browser = parse(userAgent, rules.browser, [
            'name',
            'major',
            'minor',
            'version'
        ]);
        me.browser.major = xs.isNumeric(me.browser.major) ? Number(me.browser.major) : 0;
        me.browser.minor = xs.isNumeric(me.browser.minor) ? Number(me.browser.minor) : 0;

        /**
         * Browser engine information:
         *
         * - name
         * - major version
         * - minor version
         * - version complete string
         *
         * @property engine
         *
         * @type {Object}
         */
        me.engine = parse(userAgent, rules.engine, [
            'name',
            'major',
            'minor',
            'version'
        ]);
        me.engine.major = xs.isNumeric(me.engine.major) ? Number(me.engine.major) : 0;
        me.engine.minor = xs.isNumeric(me.engine.minor) ? Number(me.engine.minor) : 0;

        /**
         * Device OS information:
         *
         * - name
         * - version
         *
         * @property os
         *
         * @type {Object}
         */
        me.os = parse(userAgent, rules.os, [
            'name',
            'version'
        ]);

        /**
         * CPU information:
         *
         * - architecture
         *
         * @property cpu
         *
         * @type {Object}
         */
        me.cpu = parse(userAgent, rules.cpu, [ 'architecture' ]);
        me.cpu.architecture = xs.isNumeric(me.cpu.architecture) ? Number(me.cpu.architecture) : 0;


        //set shortcuts


        //desktop browsers

        /**
         * Whether browser is chrome
         *
         * @property isChrome
         *
         * @type {Object}
         */
        me.isChrome = [
                browser.chrome,
                browser.chromium
            ].indexOf(me.browser.name) >= 0;

        /**
         * Whether browser is Firefox
         *
         * @property isFirefox
         *
         * @type {Boolean}
         */
        me.isFirefox = [
                browser.firefox,
                browser.waterfox
            ].indexOf(me.browser.name) >= 0;

        /**
         * Whether browser is Opera
         *
         * @property isOpera
         *
         * @type {Boolean}
         */
        me.isOpera = me.browser.name === browser.opera;

        /**
         * Whether browser is Safari
         *
         * @property isSafari
         *
         * @type {Boolean}
         */
        me.isSafari = me.browser.name === browser.safari;

        /**
         * Whether browser is Internet Explorer
         *
         * @property isIE
         *
         * @type {Boolean}
         */
        me.isIE = me.browser.name === browser.ie;

        //mobile browsers

        /**
         * Whether mobile browser is Chrome Mobile
         *
         * @property isChromeMobile
         *
         * @type {Boolean}
         */
        me.isChromeMobile = me.browser.name === browser.chromeMobile;

        /**
         * Whether mobile browser is Firefox Mobile
         *
         * @property isFirefoxMobile
         *
         * @type {Boolean}
         */
        me.isFirefoxMobile = me.browser.name === browser.firefoxMobile;

        /**
         * Whether mobile browser is Opera Mobile
         *
         * @property isOperaMobile
         *
         * @type {Boolean}
         */
        me.isOperaMobile = (me.browser.name === browser.operaMobile || me.browser.name === browser.operaMini);

        /**
         * Whether mobile browser is Safari Mobile
         *
         * @property isSafariMobile
         *
         * @type {Boolean}
         */
        me.isSafariMobile = me.browser.name === browser.safariMobile;

        /**
         * Whether mobile browser is Internet Explorer Mobile
         *
         * @property isIEMobile
         *
         * @type {Boolean}
         */
        me.isIEMobile = me.browser.name === browser.ieMobile;


        //Platform type (based on browser)

        /**
         * Whether platform is desktop
         *
         * @property isDesktop
         *
         * @type {Boolean}
         */
        me.isDesktop = me.isChrome || me.isFirefox || me.isOpera || me.isSafari || me.isIE;

        /**
         * Whether platform is mobile
         *
         * @property isMobile
         *
         * @type {Boolean}
         */
        me.isMobile = !me.isDesktop;


        //engines

        /**
         * Whether browser engine is WebKit
         *
         * @property isWebkit
         *
         * @type {Boolean}
         */
        me.isWebkit = me.engine.name === engine.webkit;

        /**
         * Whether browser engine is Blink
         *
         * @property isBlink
         *
         * @type {Boolean}
         */
        me.isBlink = me.engine.name === engine.blink;

        /**
         * Whether browser engine is Gecko
         *
         * @property isGecko
         *
         * @type {Boolean}
         */
        me.isGecko = me.engine.name === engine.gecko;

        /**
         * Whether browser engine is Presto
         *
         * @property isPresto
         *
         * @type {Boolean}
         */
        me.isPresto = me.engine.name === engine.presto;

        /**
         * Whether browser engine is Trident
         *
         * @property isTrident
         *
         * @type {Boolean}
         */
        me.isTrident = me.engine.name === engine.trident;


        //desktop OS

        /**
         * Whether OS is Linux
         *
         * @property isLinux
         *
         * @type {Boolean}
         */
        me.isLinux = me.os.name === os.linux;

        /**
         * Whether OS is Windows
         *
         * @property isWindows
         *
         * @type {Boolean}
         */
        me.isWindows = me.os.name === os.windows;

        /**
         * Whether OS is Max
         *
         * @property isMac
         *
         * @type {Boolean}
         */
        me.isMac = me.os.name === os.osx;

        //mobile OS

        /**
         * Whether mobile OS is Android
         *
         * @property isAndroid
         *
         * @type {Boolean}
         */
        me.isAndroid = me.os.name === os.android;

        /**
         * Whether mobile OS is iOS
         *
         * @property isiOS
         *
         * @type {Boolean}
         */
        me.isiOS = me.os.name === os.ios;

        /**
         * Whether mobile OS is WindowsPhone
         *
         * @property isWindowsPhone
         *
         * @type {Boolean}
         */
        me.isWindowsPhone = me.os.name === os.windowsPhone;


        //CPU

        /**
         * Whether cpu architecture is x86
         *
         * @property is32
         *
         * @type {Boolean}
         */
        me.is32 = me.cpu.architecture === arch.x32;

        /**
         * Whether cpu architecture is x86_64
         *
         * @property is64
         *
         * @type {Boolean}
         */
        me.is64 = me.cpu.architecture === arch.x64;


        //Touch related

        /**
         * Whether device is touch-capable
         *
         * @property isTouch
         *
         * @type {Boolean}
         */
        me.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

        /**
         * Device touch points count
         *
         * @property maxTouchPoints
         *
         * @type {Boolean}
         */
        me.maxTouchPoints = navigator.maxTouchPoints || navigator.msMaxTouchPoints;

    };

    /*
     * Rules hash for different aspects of environment detection
     * Each rule in array must have 3 items:
     *  - variables list
     *    contains variables, being fetched from rule, written in direct fetch order
     *    variable can be given as default value for relative param, or empty value - then fetched data will be used,
     *    or as array with 2 elements: variable parsing rule and it compounding string
     *  - negative regular expressions
     *    here are expressions, that have not to be executed for rule to be matched
     *  - positive and data containing regular expressions
     *    here are expressions, that have to be executed for rule to be matched. some of them contain data selections
     *    data selection order should match variables list order
     */
    var browser = {
        chrome: 'chrome',
        chromeMobile: 'chrome mobile',
        chromium: 'chromium',
        firefox: 'firefox',
        firefoxMobile: 'firefox mobile',
        ie: 'ie',
        ieMobile: 'ie mobile',
        opera: 'opera',
        operaMobile: 'opera mobile',
        operaMini: 'opera mini',
        safari: 'safari',
        safariMobile: 'safari mobile',
        ucbrowser: 'ucbrowser',
        waterfox: 'waterfox',
        yabrowserMobile: 'yabrowser mobile',
        yabrowser: 'yabrowser'
    };
    var engine = {
        webkit: 'webkit',
        blink: 'blink',
        gecko: 'gecko',
        presto: 'presto',
        trident: 'trident'
    };
    var os = {
        linux: 'linux',
        windows: 'windows',
        windowsPhone: 'windows phone',
        android: 'android',
        osx: 'os x',
        ios: 'ios'
    };
    var arch = {
        x32: 32,
        x64: 64
    };

    //set of rules
    var rules = {

        //rules for determining the browser
        browser: [
            [
                [ browser.chrome ],
                [
                    /chromium/,
                    /mobile/,
                    /yabrowser/,
                    /ucbrowser/,
                    /opr\//
                ],
                [
                    /chrome\/([\d]+)\.([\d]+)/,
                    /chrome\/([\d\.]+)/
                ]
            ],
            [
                [ browser.chromeMobile ],
                [
                    /ucbrowser/,
                    /yabrowser/,
                    /opr\//
                ],
                [
                    /mobile/,
                    /(?:chrome|crios)\/([\d]+)\.([\d]+)/,
                    /(?:chrome|crios)\/([\d\.]+)/
                ]
            ],
            [
                [ browser.chromium ],
                [],
                [
                    /chromium\/([\d]+)\.([\d]+)/,
                    /chromium\/([\d\.]+)/
                ]
            ],
            [
                [ browser.firefox ],
                [
                    /waterfox/,
                    /mobile/
                ],
                [
                    /firefox\/([\d]+)\.([\d]+)/,
                    /firefox\/([\d\.]+)/
                ]
            ],
            [
                [ browser.firefoxMobile ],
                [ /waterfox/ ],
                [
                    /mobile/,
                    /firefox\/([\d]+)\.([\d]+)/,
                    /firefox\/([\d\.]+)/
                ]
            ],
            [
                [ browser.ie ],
                [ /iemobile/ ],
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
                [ /iemobile/ ],
                [ /trident\/7/ ]
            ],
            [
                [ browser.ieMobile ],
                [],
                [
                    /iemobile\/([\d]+)\.([\d]+)/,
                    /iemobile\/([\d\.]+)/
                ]
            ],
            [
                [ browser.opera ],
                [
                    /opera\smobi/,
                    /opera\smini/
                ],
                [
                    /opera/,
                    /version\/([\d]+)\.([\d]+)/,
                    /version\/([\d\.]+)/
                ]
            ],
            [
                [ browser.opera ],
                [
                    /opera\smobi/,
                    /opera\smini/,
                    /mobile/
                ],
                [
                    /opr\/([\d]+)\.([\d]+)/,
                    /opr\/([\d\.]+)/
                ]
            ],
            [
                [ browser.operaMobile ],
                [
                    /opera\smobi/,
                    /opera\smini/
                ],
                [
                    /mobile/,
                    /opr\/([\d]+)\.([\d]+)/,
                    /opr\/([\d\.]+)/
                ]
            ],
            [
                [ browser.operaMobile ],
                [ /opera\smini/ ],
                [
                    /opera\smobi/,
                    /version\/([\d]+)\.([\d]+)/,
                    /version\/([\d\.]+)/
                ]
            ],
            [
                [ browser.operaMini ],
                [ /opera\smobi/ ],
                [
                    /opera\smini\/([\d]+)\.([\d]+)/,
                    /opera\smini\/([\d\.]+)/
                ]
            ],
            [
                [
                    browser.operaMini,
                    undefined,
                    0
                ],
                [],
                [
                    /opera\smini\/([\d]+)/,
                    /opera\smini\/([\d\.]+)/
                ]
            ],
            [
                [ browser.safari ],
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
                [ browser.safariMobile ],
                [
                    /chrome/,
                    /ucbrowser/
                ],
                [
                    /safari/,
                    /mobile/,
                    /version\/([\d]+)\.([\d]+)/,
                    /version\/([\d\.]+)/
                ]
            ],
            [
                [ browser.safariMobile ],
                [
                    /chrome/,
                    /ucbrowser/
                ],
                [
                    /safari/,
                    /mobile/,
                    /coast\/([\d]+)\.([\d]+)/,
                    /coast\/([\d\.]+)/
                ]
            ],
            [
                [ browser.waterfox ],
                [],
                [
                    /waterfox/,
                    /firefox\/([\d]+)\.([\d]+)/,
                    /firefox\/([\d\.]+)/
                ]
            ],
            [
                [ browser.ucbrowser ],
                [],
                [
                    /safari/,
                    /ucbrowser/,
                    /ucbrowser\/([\d]+)\.([\d]+)/,
                    /ucbrowser\/([\d\.]+)/
                ]
            ],
            [
                [ browser.yabrowser ],
                [ /android/ ],
                [
                    /yabrowser\/([\d]+)\.([\d]+)/,
                    /yabrowser\/([\d\.]+)/
                ]
            ],
            [
                [ browser.yabrowserMobile ],
                [],
                [
                    /android/,
                    /yabrowser\/([\d]+)\.([\d]+)/,
                    /yabrowser\/([\d\.]+)/
                ]
            ]
        ],

        //rules for determining the engine
        engine: [
            [
                [ engine.webkit ],
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
                [ engine.blink ],
                [ /chrome\/(?:[1-9]|1[0-9]|2[0-7])\./ ],
                [
                    /(?:opr|crios|chrome|yabrowser)\//,
                    /applewebkit\/([\d]+)\.([\d]+)/,
                    /applewebkit\/([\d\.]+)/
                ]
            ],
            [
                [ engine.gecko ],
                [],
                [
                    /gecko\//,
                    /rv:([\d]+)\.([\d]+)/,
                    /rv:([\d\.]+)/
                ]
            ],
            [
                [ engine.presto ],
                [],
                [
                    /presto\/([\d]+)\.([\d]+)/,
                    /presto\/([\d\.]+)/
                ]
            ],
            [
                [ engine.trident ],
                [],
                [
                    /trident\/([\d]+)\.([\d]+)/,
                    /trident\/([\d\.]+)/
                ]
            ],
            [
                [ engine.trident ],
                [],
                [ /msie/ ]
            ]
        ],

        //rules for determining the operating system
        os: [
            [
                [ os.linux ],
                [ /android/ ],
                [ /linux\s/ ]
            ],
            [
                [
                    os.windows,
                    'xp'
                ],
                [],
                [ /windows\snt\s5\.(?:1|2)/ ]
            ],
            [
                [
                    os.windows,
                    'vista'
                ],
                [],
                [ /windows\snt\s6\.0/ ]
            ],
            [
                [
                    os.windows,
                    '7'
                ],
                [],
                [ /windows\snt\s6\.1/ ]
            ],
            [
                [
                    os.windows,
                    '8'
                ],
                [],
                [ /windows\snt\s6\.2/ ]
            ],
            [
                [
                    os.windows,
                    '8.1'
                ],
                [],
                [ /windows\snt\s6\.3/ ]
            ],
            [
                [
                    os.windows,
                    '10'
                ],
                [],
                [ /windows\snt\s10\.0/ ]
            ],
            [
                [ os.windowsPhone ],
                [],
                [ /windows\sphone(?:\sos)?\s([\d\.]+)/ ]
            ],
            [
                [ os.android ],
                [],
                [ /android\s([\d\.]+)/ ]
            ],
            [
                [ os.android ],
                [],
                [ /android/ ]
            ],
            [
                [
                    os.osx,
                    [
                        /([\d]+)(?:_|\.)([\d]+)/,
                        '$1.$2'
                    ]
                ],
                [],
                [ /os\sx\s([\d_\.]+)/ ]
            ],
            [
                [
                    os.ios,
                    [
                        /([\d]+)(?:_|\.)([\d]+)/,
                        '$1.$2'
                    ]
                ],
                [],
                [ /iphone\sos\s([\d_\.]+)/ ]
            ]
        ],

        //rules for determining the processor architecture
        cpu: [
            [
                [ arch.x64 ],
                [],
                [ /(?:x86_|x|wow)64/ ]
            ],
            [
                [ arch.x32 ],
                [],
                [ /ia32/ ]
            ],
            [
                [ arch.x32 ],
                [
                    /(?:x|wow)64/,
                    /phone/
                ],
                [ /(?:windows|linux)/ ]
            ]
        ]
    };

    /**
     * Parses user agent, according to given rules to get verification result
     *
     * @method parse
     *
     * @param {String} userAgent information about the web-browser
     * @param {Array} rules rules for check browser
     * @param {Array} params ['name', 'major', 'minor', 'version']
     *
     * @return {Object} parsing result
     */
    var parse = function (userAgent, rules, params) {

        //accumulate result of the regular expression
        var result = {};

        //wrap params as collection
        params = new xs.core.Collection(params);

        (new xs.core.Collection(rules)).find(function (rule) {
            var defaults = xs.clone(rule[ 0 ]);
            var data = [];
            var match;
            var negatives = new xs.core.Collection(rule[ 1 ]);
            var positives = new xs.core.Collection(rule[ 2 ]);

            //try userAgent to match any one of negatives given in rule
            match = negatives.size ? negatives.some(function (regExp) {

                //check if userAgent matches given regExp
                return regExp.test(userAgent);
            }) : false;

            //return false if at least one of negatives matched
            if (match) {

                return false;
            }

            //to match all regular expressions in rule need to be satisfied
            match = positives.all(function (regExp) {
                //check if userAgent matches given regExp
                var result = regExp.exec(userAgent);

                //if no match - return false, that will cause loop break
                if (!result) {

                    return false;
                }

                //shift first element - that means whole match data to gain only selected ones
                result.shift();

                //if data not empty - concat data with result, saving order
                if (result.length) {
                    data = data.concat(result);
                }

                //sign, that userAgent matched this regExp
                return true;
            });

            //return false if no match established and search will continue
            if (!match) {

                return false;
            }

            //iterate over params to fill result
            params.each(function (param) {

                //if default item is array - it contains parser rules for parsing obtained result
                if (xs.isArray(defaults[ 0 ])) {
                    var raw = data.shift();
                    var parser = defaults.shift();
                    //parse raw data and assign
                    result[ param ] = raw.replace(parser[ 0 ], parser[ 1 ]);

                    //else if default item given - use it
                } else if (xs.isDefined(defaults[ 0 ])) {
                    result[ param ] = defaults.shift();

                    //else - use data, shift empty default place
                } else {
                    result[ param ] = data.shift();
                    defaults.shift();
                }
            });

            //return true to stop search
            return true;
        });

        //return search result
        return result;
    };

    //detect environment context
    detect();

    return me;
})();

xs.apply(xs, xs.env.Context);