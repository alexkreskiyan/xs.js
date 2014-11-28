function speed ( fn, n ) {
    var start = Date.now();
    for ( var i = 0; i < n; i++ ) {
        fn();
    }
    var duration = Date.now() - start;
    console.log( 'duration: ', duration, 'ms for ', n, 'operations' );
    console.log( 'median: ', duration / n, 'ms per operation' );
    console.log( 'mark: about', n / duration, 'operation per ms' );
}
module( 'xs.Environment' );
var userAgents = [
    [
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/34.0.1847.116 Chrome/34.0.1847.116 Safari/537.36',
        {
            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
            engine: {name: 'blink', major: '537', minor: '36', version: '537.36'},
            os: {name: 'linux', version: undefined},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '64'}
        }
    ],
    [
        'Mozilla/5.0 (Linux; Android 4.2.1; Lenovo K900_ROW Build/JOP40D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.138 Mobile Safari/537.36',
        {
            browser: {name: 'chrome mobile', major: '35', minor: '0', version: '35.0.1916.138'},
            engine: {name: 'blink', major: '537', minor: '36', version: '537.36'},
            os: {name: 'android', version: '4.2.1'},
            device: {model: 'k900', type: 'mobile', vendor: 'lenovo'},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (Linux; U; Android 4.2.1;ru-ru; Lenovo_K900_ROW/JOP40D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.2.1 Mobile Safari/534.30',
        {
            browser: {name: 'safari mobile', major: '4', minor: '2', version: '4.2.1'},
            engine: {name: 'webkit', major: '534', minor: '30', version: '534.30'},
            os: {name: 'android', version: '4.2.1'},
            device: {model: 'k900', type: 'mobile', vendor: 'lenovo'},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (Linux; Android 4.0.4; LT28h Build/6.1.E.3.7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36',
        {
            browser: {name: 'chrome mobile', major: '34', minor: '0', version: '34.0.1847.114'},
            engine: {name: 'blink', major: '537', minor: '36', version: '537.36'},
            os: {name: 'android', version: '4.0.4'},
            device: {model: 'xperia ion', type: 'mobile', vendor: 'sony'},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (Linux; U; Android 4.0.4; ru-ru; SonyEricssonLT28h Build/6.1.E.3.7) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
        {
            browser: {name: 'safari mobile', major: '4', minor: '0', version: '4.0'},
            engine: {name: 'webkit', major: '534', minor: '30', version: '534.30'},
            os: {name: 'android', version: '4.0.4'},
            device: {model: 'xperia ion', type: 'mobile', vendor: 'sony'},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36',
        {
            browser: {name: 'chrome', major: '35', minor: '0', version: '35.0.1916.114'},
            engine: {name: 'blink', major: '537', minor: '36', version: '537.36'},
            os: {name: 'windows', version: '7'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '32'}
        }
    ],
    [
        'Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.138 Mobile Safari/537.36',
        {
            browser: {name: 'chrome mobile', major: '35', minor: '0', version: '35.0.1916.138'},
            engine: {name: 'blink', major: '537', minor: '36', version: '537.36'},
            os: {name: 'android', version: '4.4.2'},
            device: {model: 'nexus 4', type: 'mobile', vendor: 'google'},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (Linux; Android 4.2.2; GT-I9505 Build/JDQ39) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.122 Mobile Safari/537.36',
        {
            browser: {name: 'chrome mobile', major: '35', minor: '0', version: '35.0.1916.122'},
            engine: {name: 'blink', major: '537', minor: '36', version: '537.36'},
            os: {name: 'android', version: '4.2.2'},
            device: {model: 'galaxy s4', type: 'mobile', vendor: 'samsung'},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:24.0) Gecko/20100101 Firefox/24.0 Waterfox/24.0',
        {
            browser: {name: 'waterfox', major: '24', minor: '0', version: '24.0'},
            engine: {name: 'gecko', major: '24', minor: '0', version: '24.0'},
            os: {name: 'windows', version: '7'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '64'}
        }
    ],
    [
        'Mozilla/5.0 (Linux; U; Android 4.2.2; en-us; GT-I9205 Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30',
        {
            browser: {name: 'safari', major: '4', minor: '0', version: '4.0'},
            engine: {name: 'webkit', major: '534', minor: '30', version: '534.30'},
            os: {name: 'android', version: '4.2.2'},
            device: {model: 'galaxy mega', type: 'mobile', vendor: 'samsung'},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.116 Safari/537.36',
        {
            browser: {name: 'chrome', major: '34', minor: '0', version: '34.0.1847.116'},
            engine: {name: 'blink', major: '537', minor: '36', version: '537.36'},
            os: {name: 'linux', version: undefined},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '64'}
        }
    ],
    [
        'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36',
        {
            browser: {name: 'chrome', major: '35', minor: '0', version: '35.0.1916.114'},
            engine: {name: 'blink', major: '537', minor: '36', version: '537.36'},
            os: {name: 'windows', version: '8'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '64'}
        }
    ],
    [
        'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.2; ASU2JS)',
        {
            browser: {name: 'ie', major: '10', minor: '0', version: '10.0'},
            engine: {name: 'trident', major: '6', minor: '0', version: '6.0'},
            os: {name: 'windows', version: '8'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '64'}
        }
    ],
    [
        'Mozilla/5.0 (Windows NT 6.1; rv:29.0) Gecko/20100101 Firefox/29.0',
        {
            browser: {name: 'firefox', major: '29', minor: '0', version: '29.0'},
            engine: {name: 'gecko', major: '29', minor: '0', version: '29.0'},
            os: {name: 'windows', version: '7'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '32'}
        }
    ],
    [
        'Mozilla/5.0 (Linux; Android 4.2.2; en-us; SAMSUNG GT-I9205 Build/JDQ39) AppleWebKit/535.19 (KHTML, like Gecko) Version/1.0 Chrome/18.0.1025.308 Mobile Safari/535.19',
        {
            browser: {name: 'chrome mobile', major: '18', minor: '0', version: '18.0.1025.308'},
            engine: {name: 'webkit', major: '535', minor: '19', version: '535.19'},
            os: {name: 'android', version: '4.2.2'},
            device: {model: 'galaxy mega', type: 'mobile', vendor: 'samsung'},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_1 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) CriOS/35.0.1916.38 Mobile/11D201 Safari/9537.53 (000154)',
        {
            browser: {name: 'chrome mobile', major: '35', minor: '0', version: '35.0.1916.38'},
            engine: {name: 'blink', major: '537', minor: '51', version: '537.51.1'},
            os: {name: 'ios', version: '7.1.1'},
            device: {model: 'iphone', type: 'mobile', vendor: 'apple'},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile/11D201 Safari/9537.53',
        {
            browser: {name: 'safari mobile', major: '7', minor: '0', version: '7.0'},
            engine: {name: 'webkit', major: '537', minor: '51', version: '537.51.2'},
            os: {name: 'ios', version: '7.1.1'},
            device: {model: 'iphone', type: 'mobile', vendor: 'apple'},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:28.0) Gecko/20100101 Firefox/28.0',
        {
            browser: {name: 'firefox', major: '28', minor: '0', version: '28.0'},
            engine: {name: 'gecko', major: '28', minor: '0', version: '28.0'},
            os: {name: 'windows', version: '7'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '64'}
        }
    ],
    [
        'Mozilla/5.0 (Linux; Android 4.4.2; ru-ru; SAMSUNG SM-N900 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/1.5 Chrome/28.0.1500.94 Mobile Safari/537.36',
        {
            browser: {name: 'chrome mobile', major: '28', minor: '0', version: '28.0.1500.94'},
            engine: {name: 'blink', major: '537', minor: '36', version: '537.36'},
            os: {name: 'android', version: '4.4.2'},
            device: {model: 'galaxy note 3', type: 'mobile', vendor: 'samsung'},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (Linux; Android 4.4.2; SM-N900 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.138 Mobile Safari/537.36',
        {
            browser: {name: 'chrome mobile', major: '35', minor: '0', version: '35.0.1916.138'},
            engine: {name: 'blink', major: '537', minor: '36', version: '537.36'},
            os: {name: 'android', version: '4.4.2'},
            device: {model: 'galaxy note 3', type: 'mobile', vendor: 'samsung'},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
        {
            browser: {name: 'ie', major: '9', minor: '0', version: '9.0'},
            engine: {name: 'trident', major: '5', minor: '0', version: '5.0'},
            os: {name: 'windows', version: '7'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '32'}
        }
    ],
    [
        'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)',
        {
            browser: {name: 'ie', major: '9', minor: '0', version: '9.0'},
            engine: {name: 'trident', major: '5', minor: '0', version: '5.0'},
            os: {name: 'windows', version: '7'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '64'}
        }
    ],
    [
        'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154 Safari/537.36',
        {
            browser: {name: 'chrome', major: '33', minor: '0', version: '33.0.1750.154'},
            engine: {name: 'blink', major: '537', minor: '36', version: '537.36'},
            os: {name: 'windows', version: 'xp'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '32'}
        }
    ],
    [
        'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)',
        {
            browser: {name: 'ie', major: '8', minor: '0', version: '8.0'},
            engine: {name: 'trident', major: '4', minor: '0', version: '4.0'},
            os: {name: 'windows', version: '7'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '64'}
        }
    ],
    [
        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)',
        {
            browser: {name: 'ie', major: '7', minor: '0', version: '7.0'},
            engine: {name: 'trident', major: undefined, minor: undefined, version: undefined},
            os: {name: 'windows', version: '7'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '64'}
        }
    ],
    [
        'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)',
        {
            browser: {name: 'ie', major: '9', minor: '0', version: '9.0'},
            engine: {name: 'trident', major: '5', minor: '0', version: '5.0'},
            os: {name: 'windows', version: '7'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '64'}
        }
    ],
    [
        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)',
        {
            browser: {name: 'ie', major: '7', minor: '0', version: '7.0'},
            engine: {name: 'trident', major: '5', minor: '0', version: '5.0'},
            os: {name: 'windows', version: '7'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '64'}
        }
    ],
    [
        'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36',
        {
            browser: {name: 'chrome', major: '35', minor: '0', version: '35.0.1916.114'},
            engine: {name: 'blink', major: '537', minor: '36', version: '537.36'},
            os: {name: 'windows', version: 'xp'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '32'}
        }
    ],
    [
        'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.102 YaBrowser/14.2.1700.12508 Safari/537.36',
        {
            browser: {name: 'yabrowser', major: '14', minor: '2', version: '14.2.1700.12508'},
            engine: {name: 'blink', major: '537', minor: '36', version: '537.36'},
            os: {name: 'windows', version: '7'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '32'}
        }
    ],
    [
        'Mozilla/5.0 (Linux; Android 4.2.2; GT-I9190 Build/JDQ39) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.138 Mobile Safari/537.36',
        {
            browser: {name: 'chrome mobile', major: '35', minor: '0', version: '35.0.1916.138'},
            engine: {name: 'blink', major: '537', minor: '36', version: '537.36'},
            os: {name: 'android', version: '4.2.2'},
            device: {model: 'galaxy s4 mini', type: 'mobile', vendor: 'samsung'},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)',
        {
            browser: {name: 'ie', major: '7', minor: '0', version: '7.0'},
            engine: {name: 'trident', major: undefined, minor: undefined, version: undefined},
            os: {name: 'windows', version: '7'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '32'}
        }
    ],
    [
        'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)',
        {
            browser: {name: 'ie', major: '8', minor: '0', version: '8.0'},
            engine: {name: 'trident', major: '4', minor: '0', version: '4.0'},
            os: {name: 'windows', version: '7'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '32'}
        }
    ],
    [
        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)',
        {
            browser: {name: 'ie', major: '7', minor: '0', version: '7.0'},
            engine: {name: 'trident', major: '5', minor: '0', version: '5.0'},
            os: {name: 'windows', version: '7'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '32'}
        }
    ],
    [
        'Mozilla/5.0 (Linux; Android 4.2.2; Philips W6610 Build/JDQ39) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.138 Mobile Safari/537.36',
        {
            browser: {name: 'chrome mobile', major: '35', minor: '0', version: '35.0.1916.138'},
            engine: {name: 'blink', major: '537', minor: '36', version: '537.36'},
            os: {name: 'android', version: '4.2.2'},
            device: {model: 'xenium w6610', type: 'mobile', vendor: 'philips'},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (Linux; U; Android 4.2.2; ru-ru; Philips W6610 Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
        {
            browser: {name: 'safari mobile', major: '4', minor: '0', version: '4.0'},
            engine: {name: 'webkit', major: '534', minor: '30', version: '534.30'},
            os: {name: 'android', version: '4.2.2'},
            device: {model: 'xenium w6610', type: 'mobile', vendor: 'philips'},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154 Safari/537.36 OPR/20.0.1387.91 (Edition Yx)',
        {
            browser: {name: 'opera', major: '20', minor: '0', version: '20.0.1387.91'},
            engine: {name: 'blink', major: '537', minor: '36', version: '537.36'},
            os: {name: 'windows', version: '7'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '64'}
        }
    ],
    [
        'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36',
        {
            browser: {name: 'chrome', major: '35', minor: '0', version: '35.0.1916.114'},
            engine: {name: 'blink', major: '537', minor: '36', version: '537.36'},
            os: {name: 'windows', version: '7'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '64'}
        }
    ],
    [
        'Mozilla/5.0 (X11; Linux x86_64; rv:28.0) Gecko/20100101 Firefox/28.0',
        {
            browser: {name: 'firefox', major: '28', minor: '0', version: '28.0'},
            engine: {name: 'gecko', major: '28', minor: '0', version: '28.0'},
            os: {name: 'linux', version: undefined},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '64'}
        }
    ],
    [
        'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; MANM; Media Center PC 6.0; .NET4.0C; .NET4.0E; rv:11.0) like Gecko',
        {
            browser: {name: 'ie', major: '11', minor: '0', version: '11.0'},
            engine: {name: 'trident', major: '7', minor: '0', version: '7.0'},
            os: {name: 'windows', version: '7'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '64'}
        }
    ],
    [
        'Mozilla/5.0 (Linux; Android 4.2.2; ru-ru; SAMSUNG GT-I9192 Build/JDQ39) AppleWebKit/535.19 (KHTML, like Gecko) Version/1.0 Chrome/18.0.1025.308 Mobile Safari/535.19',
        {
            browser: {name: 'chrome mobile', major: '18', minor: '0', version: '18.0.1025.308'},
            engine: {name: 'webkit', major: '535', minor: '19', version: '535.19'},
            os: {name: 'android', version: '4.2.2'},
            device: {model: 'galaxy s4 mini duos', type: 'mobile', vendor: 'samsung'},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (Linux; Android 4.2.2; GT-I9192 Build/JDQ39) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.122 Mobile Safari/537.36',
        {
            browser: {name: 'chrome mobile', major: '35', minor: '0', version: '35.0.1916.122'},
            engine: {name: 'blink', major: '537', minor: '36', version: '537.36'},
            os: {name: 'android', version: '4.2.2'},
            device: {model: 'galaxy s4 mini duos', type: 'mobile', vendor: 'samsung'},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_1 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) YaBrowser/14.4.1750.8705.10 Mobile/11D201 Safari/9537.53',
        {
            browser: {name: 'yabrowser', major: '14', minor: '4', version: '14.4.1750.8705.10'},
            engine: {name: 'blink', major: '537', minor: '51', version: '537.51.1'},
            os: {name: 'ios', version: '7.1.1'},
            device: {model: 'iphone', type: 'mobile', vendor: 'apple'},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (Linux; Android 4.2.1; ZP990 Build/JOP40D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.138 Mobile Safari/537.36',
        {
            browser: {name: 'chrome mobile', major: '35', minor: '0', version: '35.0.1916.138'},
            engine: {name: 'blink', major: '537', minor: '36', version: '537.36'},
            os: {name: 'android', version: '4.2.1'},
            device: {model: 'zopo captain s', type: 'mobile', vendor: 'zopo'},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (Linux; U; Android 4.2.1; en-us; ZP990 Build/JOP40D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
        {
            browser: {name: 'safari mobile', major: '4', minor: '0', version: '4.0'},
            engine: {name: 'webkit', major: '534', minor: '30', version: '534.30'},
            os: {name: 'android', version: '4.2.1'},
            device: {model: 'zopo captain s', type: 'mobile', vendor: 'zopo'},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36',
        {
            browser: {name: 'chrome', major: '34', minor: '0', version: '34.0.1847.137'},
            engine: {name: 'blink', major: '537', minor: '36', version: '537.36'},
            os: {name: 'windows', version: '7'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '32'}
        }
    ],
    [
        'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729)',
        {
            browser: {name: 'ie', major: '10', minor: '0', version: '10.0'},
            engine: {name: 'trident', major: '6', minor: '0', version: '6.0'},
            os: {name: 'windows', version: '8'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: '64'}
        }
    ],
    [
        'Mozilla/5.0 (Linux; Android 4.2.2; GT-S7270 Build/JDQ39) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.138 Mobile Safari/537.36',
        {
            browser: {name: 'chrome mobile', major: '35', minor: '0', version: '35.0.1916.138'},
            engine: {name: 'blink', major: '537', minor: '36', version: '537.36'},
            os: {name: 'android', version: '4.2.2'},
            device: {model: 'galaxy ace 3', type: 'mobile', vendor: 'samsung'},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (Linux; Android 4.2.2; ru-ru; SAMSUNG GT-S7270 Build/JDQ39) AppleWebKit/535.19 (KHTML, like Gecko) Version/1.0 Chrome/18.0.1025.308 Mobile Safari/535.19',
        {
            browser: {name: 'chrome mobile', major: '18', minor: '0', version: '18.0.1025.308'},
            engine: {name: 'webkit', major: '535', minor: '19', version: '535.19'},
            os: {name: 'android', version: '4.2.2'},
            device: {model: 'galaxy ace 3', type: 'mobile', vendor: 'samsung'},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 4 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19',
        {
            browser: {name: 'chrome mobile', major: '18', minor: '0', version: '18.0.1025.166'},
            engine: {name: 'webkit', major: '535', minor: '19', version: '535.19'},
            os: {name: 'android', version: '4.2.1'},
            device: {model: 'nexus 4', type: 'mobile', vendor: 'google'},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.76.4 (KHTML, like Gecko) Version/7.0.4 Safari/537.76.4',
        {
            browser: {name: 'safari', major: '7', minor: '0', version: '7.0.4'},
            engine: {name: 'webkit', major: '537', minor: '76', version: '537.76.4'},
            os: {name: 'os x', version: '10.9.3'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36',
        {
            browser: {name: 'chrome', major: '35', minor: '0', version: '35.0.1916.114'},
            engine: {name: 'blink', major: '537', minor: '36', version: '537.36'},
            os: {name: 'os x', version: '10.9.3'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:28.0) Gecko/20100101 Firefox/28.0',
        {
            browser: {name: 'firefox', major: '28', minor: '0', version: '28.0'},
            engine: {name: 'gecko', major: '28', minor: '0', version: '28.0'},
            os: {name: 'os x', version: '10.9'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0_2 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A4449d Safari/9537.53',
        {
            browser: {name: 'safari mobile', major: '7', minor: '0', version: '7.0'},
            engine: {name: 'webkit', major: '537', minor: '51', version: '537.51.1'},
            os: {name: 'ios', version: '7.0.2'},
            device: {model: 'iphone', type: 'mobile', vendor: 'apple'},
            cpu: {architecture: undefined}
        }
    ],
    [
        'Mozilla/5.0 (Windows Phone 8.1; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 625) like Gecko',
        {
            browser: {name: 'ie mobile', major: '11', minor: '0', version: '11.0'},
            engine: {name: 'trident', major: '7', minor: '0', version: '7.0'},
            os: {name: 'windows phone', version: '8.1'},
            device: {model: 'lumia 625', type: 'mobile', vendor: 'nokia'},
            cpu: {architecture: undefined}
        }
    ]
];
xs.Array.each( userAgents, function ( testCase ) {
    test( 'env detection for ' + testCase[0], function () {
        var userAgent = testCase[0];
        var std = testCase[1];
        var env = xs.env;

        navigator.__defineGetter__( 'userAgent', function () {
            return userAgent; // customized user agent
        } );

        env.detect();

        //browser detection test
        strictEqual( env.browser.name, std.browser.name, 'browser name: ' + std.browser.name );
        strictEqual( env.browser.major, std.browser.major, 'browser major: ' + std.browser.major );
        strictEqual( env.browser.minor, std.browser.minor, 'browser minor: ' + std.browser.minor );
        strictEqual( env.browser.version, std.browser.version, 'browser version: ' + std.browser.version );
        //engine detection test
        strictEqual( env.engine.name, std.engine.name, 'engine name: ' + std.engine.name );
        strictEqual( env.engine.major, std.engine.major, 'engine major: ' + std.engine.major );
        strictEqual( env.engine.minor, std.engine.minor, 'engine minor: ' + std.engine.minor );
        strictEqual( env.engine.version, std.engine.version, 'engine version: ' + std.engine.version );
        //os detection test
        strictEqual( env.os.name, std.os.name, 'os name: ' + std.os.name );
        strictEqual( env.os.version, std.os.version, 'os version: ' + std.os.version );
        //device detection test
        strictEqual( env.device.model, std.device.model, 'device model: ' + std.device.model );
        strictEqual( env.device.type, std.device.type, 'device type: ' + std.device.type );
        strictEqual( env.device.vendor, std.device.vendor, 'device vendor: ' + std.device.vendor );
        //engine detection test
        strictEqual( env.cpu.architecture, std.cpu.architecture, 'cpu architecture: ' + std.cpu.architecture );
    } );
} );