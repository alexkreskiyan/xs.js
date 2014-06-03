function speed(fn, n) {
    var start = Date.now();
    for (var i = 0; i < n; i++) {
        fn();
    }
    var duration = Date.now() - start;
    console.log('duration: ', duration, 'ms for ', n, 'operations');
    console.log('median: ', duration / n, 'ms per operation');
    console.log('mark: about', n / duration, 'operation per ms');
}
module('xs.Environment');
var userAgents = [
    [
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/34.0.1847.116 Chrome/34.0.1847.116 Safari/537.36',
        {
            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
            os: {name: 'linux', version: 'x86_64'},
            device: {model: undefined, type: undefined, vendor: undefined},
            cpu: {architecture: 'amd64'}
        }
    ],
//    [
//        'Mozilla/5.0 (Linux; Android 4.2.1; Lenovo K900_ROW Build/JOP40D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.138 Mobile Safari/537.36',
//        {
//            browser: {name: 'chrome', major: '35', minor: '0', version: '35.0.1916.138'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'android', version: '4.2.1'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: undefined}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Linux; U; Android 4.2.1;ru-ru; Lenovo_K900_ROW/JOP40D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.2.1 Mobile Safari/534.30',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'android', version: '4.2.1'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: undefined}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Linux; Android 4.0.4; LT28h Build/6.1.E.3.7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Linux; U; Android 4.0.4; ru-ru; SonyEricssonLT28h Build/6.1.E.3.7) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.138 Mobile Safari/537.36',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Linux; Android 4.2.2; GT-I9505 Build/JDQ39) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.122 Mobile Safari/537.36',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:24.0) Gecko/20100101 Firefox/24.0 Waterfox/24.0',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Linux; U; Android 4.2.2; en-us; GT-I9205 Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.116 Safari/537.36',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.2; ASU2JS)',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Windows NT 6.1; rv:29.0) Gecko/20100101 Firefox/29.0',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Linux; Android 4.2.2; en-us; SAMSUNG GT-I9205 Build/JDQ39) AppleWebKit/535.19 (KHTML, like Gecko) Version/1.0 Chrome/18.0.1025.308 Mobile Safari/535.19',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_1 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) CriOS/35.0.1916.38 Mobile/11D201 Safari/9537.53 (000154)',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile/11D201 Safari/9537.53',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:28.0) Gecko/20100101 Firefox/28.0',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Linux; Android 4.4.2; ru-ru; SAMSUNG SM-N900 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/1.5 Chrome/28.0.1500.94 Mobile Safari/537.36',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Linux; Android 4.4.2; SM-N900 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.138 Mobile Safari/537.36',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154 Safari/537.36',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.102 YaBrowser/14.2.1700.12508 Safari/537.36',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Linux; Android 4.2.2; GT-I9190 Build/JDQ39) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.138 Mobile Safari/537.36',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Linux; Android 4.2.2; Philips W6610 Build/JDQ39) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.138 Mobile Safari/537.36',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Linux; U; Android 4.2.2; ru-ru; Philips W6610 Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154 Safari/537.36 OPR/20.0.1387.91 (Edition Yx)',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (X11; Linux x86_64; rv:28.0) Gecko/20100101 Firefox/28.0',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; MANM; Media Center PC 6.0; .NET4.0C; .NET4.0E; rv:11.0) like Gecko',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Linux; Android 4.2.2; ru-ru; SAMSUNG GT-I9192 Build/JDQ39) AppleWebKit/535.19 (KHTML, like Gecko) Version/1.0 Chrome/18.0.1025.308 Mobile Safari/535.19',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Linux; Android 4.2.2; GT-I9192 Build/JDQ39) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.122 Mobile Safari/537.36',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_1 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) YaBrowser/14.4.1750.8705.10 Mobile/11D201 Safari/9537.53',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Linux; Android 4.2.1; ZP990 Build/JOP40D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.138 Mobile Safari/537.36',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Linux; U; Android 4.2.1; en-us; ZP990 Build/JOP40D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729)',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    [
//        'Mozilla/5.0 (Linux; Android 4.2.2; GT-S7270 Build/JDQ39) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.138 Mobile Safari/537.36',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    ['Mozilla/5.0 (Linux; Android 4.2.2; ru-ru; SAMSUNG GT-S7270 Build/JDQ39) AppleWebKit/535.19 (KHTML, like Gecko) Version/1.0 Chrome/18.0.1025.308 Mobile Safari/535.19',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    ['Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 4 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.76.4 (KHTML, like Gecko) Version/7.0.4 Safari/537.76.4',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ],
//    ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:28.0) Gecko/20100101 Firefox/28.0',
//        {
//            browser: {name: 'chromium', major: '34', minor: '0', version: '34.0.1847.116'},
//            engine: {name: 'webkit', major: '537', minor: '36', version: '537.36'},
//            os: {name: 'linux', version: 'x86_64'},
//            device: {model: undefined, type: undefined, vendor: undefined},
//            cpu: {architecture: 'amd64'}
//        }
//    ]
];
test('detection', function () {
    xs.Array.each(userAgents, function (testCase) {
        var userAgent = testCase[0];
        var std = testCase[1];
        var env = xs.env;

        navigator.__defineGetter__('userAgent', function(){
            return userAgent; // customized user agent
        });

        env.update();

        //browser detection test
        strictEqual(env.browser.name, std.browser.name, 'browser name match. UA:' + userAgent);
        strictEqual(env.browser.major, std.browser.major, 'browser major match. UA:' + userAgent);
        strictEqual(env.browser.minor, std.browser.minor, 'browser minor match. UA:' + userAgent);
        strictEqual(env.browser.version, std.browser.version, 'browser version match. UA:' + userAgent);
        //engine detection test
        strictEqual(env.engine.name, std.engine.name, 'engine name match. UA:' + userAgent);
        strictEqual(env.engine.major, std.engine.major, 'engine major match. UA:' + userAgent);
        strictEqual(env.engine.minor, std.engine.minor, 'engine minor match. UA:' + userAgent);
        strictEqual(env.engine.version, std.engine.version, 'engine version match. UA:' + userAgent);
        //os detection test
        strictEqual(env.os.name, std.os.name, 'os name match. UA:' + userAgent);
        strictEqual(env.os.version, std.os.version, 'os version match. UA:' + userAgent);
        //device detection test
        strictEqual(env.device.model, std.device.model, 'device model match. UA:' + userAgent);
        strictEqual(env.device.type, std.device.type, 'device type match. UA:' + userAgent);
        strictEqual(env.device.vendor, std.device.vendor, 'device vendor match. UA:' + userAgent);
        //engine detection test
        strictEqual(env.cpu.architecture, std.cpu.architecture, 'cpu architecture match. UA:' + userAgent);
    });
});