(function () {

    'use strict';

    var me = this;
    var log, info, warn, error;

    document.addEventListener('DOMContentLoaded', function () {
        log = me.write.log;
        info = me.write.info;
        warn = me.write.warn;
        error = me.write.error;

        run();
    });

    var logBrowser = function () {
        log('navigator.userAgent');
        log(navigator.userAgent);
    };

    var windowApplicationCache = function () {
        log('window.applicationCache');

        if ('applicationCache' in window) {
            info('application cache supported');
        } else {
            warn('application cache missing');
        }
    };

    var windowDevicePixelRatio = function () {
        log('window.devicePixelRatio');

        if ('devicePixelRatio' in window) {
            info('window.devicePixelRatio supported: ' + window.devicePixelRatio);
        } else {
            warn('window.devicePixelRatio missing');
        }
    };

    var windowHistory = function () {
        log('window.history');

        if ('history' in window) {
            info('window.history supported');
        } else {
            warn('window.history missing');
        }
    };

    var windowInnerWidth = function () {
        log('window.innerWidth');

        if ('innerWidth' in window) {
            info('window.innerWidth supported: ' + window.innerWidth);
        } else {
            warn('window.innerWidth missing');
        }
    };

    var windowInnerHeight = function () {
        log('window.innerHeight');

        if ('innerHeight' in window) {
            info('window.innerHeight supported: ' + window.innerHeight);
        } else {
            warn('window.innerHeight missing');
        }
    };

    var windowLocalStorage = function () {
        log('window.localStorage');

        if ('localStorage' in window) {
            info('window.localStorage supported');
        } else {
            warn('window.localStorage missing');
        }
    };

    var windowLocation = function () {
        log('window.location');

        if ('location' in window) {
            info('window.location supported');
        } else {
            warn('window.location missing');
        }
    };

    var windowOuterWidth = function () {
        log('window.outerWidth');

        if ('outerWidth' in window) {
            info('window.outerWidth supported: ' + window.outerWidth);
        } else {
            warn('window.outerWidth missing');
        }
    };

    var windowOuterHeight = function () {
        log('window.outerHeight');

        if ('outerHeight' in window) {
            info('window.outerHeight supported: ' + window.outerHeight);
        } else {
            warn('window.outerHeight missing');
        }
    };

    var windowPerformance = function () {
        log('window.performance');

        if (!window.performance) {
            warn('window.performance not supported');

            return;
        }

        if (window.performance.timing) {
            info('window.performance.timing supported');
        } else {
            warn('window.performance.timing missing');
        }

        if (window.performance.now) {
            info('window.performance.now supported');
        } else {
            warn('window.performance.now missing');
        }

        if (window.performance.getEntries) {
            info('window.performance.getEntries supported');
        } else {
            warn('window.performance.getEntries missing');
        }
    };

    var windowScreen = function () {
        log('window.screen');

        if (!window.screen) {
            warn('window.screen not supported');

            return;
        }

        info('window.screen.width:' + window.screen.width);
        info('window.screen.height:' + window.screen.height);
        info('window.screen.colorDepth:' + window.screen.colorDepth);
        info('window.screen.pixelDepth:' + window.screen.pixelDepth);
        info('window.screen.availWidth:' + window.screen.availWidth);
        info('window.screen.availHeight:' + window.screen.availHeight);
    };

    var windowSessionStorage = function () {
        log('window.sessionStorage');

        if ('sessionStorage' in window) {
            info('window.sessionStorage supported');
        } else {
            warn('window.sessionStorage missing');
        }
    };

    var windowOnBlur = function () {
        log('window.onblur');

        if (!('onblur' in window)) {
            warn('window.onblur missing');

            return;
        }

        info('window.onblur supported');

        window.addEventListener('blur', function (event) {
            info('blur event captured:' + shallowStringify(event));
        });
    };

    var windowOnChange = function () {
        log('window.onchange');

        if (!('onchange' in window)) {
            warn('window.onchange missing');

            return;
        }

        info('window.onchange supported');

        window.addEventListener('change', function (event) {
            info('change event captured:' + shallowStringify(event));
        });
    };

    var windowOnClick = function () {
        log('window.onclick');

        if (!('onclick' in window)) {
            warn('window.onclick missing');

            return;
        }

        info('window.onclick supported');

        window.addEventListener('click', function (event) {
            info('click event captured:' + shallowStringify(event));
        });
    };

    var windowOnFocus = function () {
        log('window.onfocus');

        if (!('onfocus' in window)) {
            warn('window.onfocus missing');

            return;
        }

        info('window.onfocus supported');

        window.addEventListener('focus', function (event) {
            info('focus event captured:' + shallowStringify(event));
        });
    };

    var windowOnKeyDown = function () {
        log('window.onkeydown');

        if (!('onkeydown' in window)) {
            warn('window.onkeydown missing');

            return;
        }

        info('window.onkeydown supported');

        window.addEventListener('keydown', function (event) {
            //info('keydown event captured:' + shallowStringify(event));
        });
    };

    var windowOnKeyUp = function () {
        log('window.onkeyup');

        if (!('onkeyup' in window)) {
            warn('window.onkeyup missing');

            return;
        }

        info('window.onkeyup supported');

        window.addEventListener('keyup', function (event) {
            //info('keyup event captured:' + shallowStringify(event));
        });
    };

    var windowOnKeyPress = function () {
        log('window.onkeypress');

        if (!('onkeypress' in window)) {
            warn('window.onkeypress missing');

            return;
        }

        info('window.onkeypress supported');

        window.addEventListener('keypress', function (event) {
            //info('keypress event captured:' + shallowStringify(event));
        });
    };

    var windowOnMouseDown = function () {
        log('window.onmousedown');

        if (!('onmousedown' in window)) {
            warn('window.onmousedown missing');

            return;
        }

        info('window.onmousedown supported');

        window.addEventListener('mousedown', function (event) {
            //info('mousedown event captured:' + shallowStringify(event));
        });
    };

    var windowOnMouseUp = function () {
        log('window.onmouseup');

        if (!('onmouseup' in window)) {
            warn('window.onmouseup missing');

            return;
        }

        info('window.onmouseup supported');

        window.addEventListener('mouseup', function (event) {
            //info('mouseup event captured:' + shallowStringify(event));
        });
    };

    var windowOnMouseMove = function () {
        log('window.onmousemove');

        if (!('onmousemove' in window)) {
            warn('window.onmousemove missing');

            return;
        }

        info('window.onmousemove supported');

        window.addEventListener('mousemove', function (event) {
            //info('mousemove event captured:' + shallowStringify(event));
        });
    };

    var windowOnMouseOver = function () {
        log('window.onmouseover');

        if (!('onmouseover' in window)) {
            warn('window.onmouseover missing');

            return;
        }

        info('window.onmouseover supported');

        window.addEventListener('mouseover', function (event) {
            //info('mouseover event captured:' + shallowStringify(event));
        });
    };

    var windowOnMouseOut = function () {
        log('window.onmouseout');

        if (!('onmouseout' in window)) {
            warn('window.onmouseout missing');

            return;
        }

        info('window.onmouseout supported');

        window.addEventListener('mouseout', function (event) {
            //info('mouseout event captured:' + shallowStringify(event));
        });
    };

    var windowOnResize = function () {
        log('window.onresize');

        if (!('onresize' in window)) {
            warn('window.onresize missing');

            return;
        }

        info('window.onresize supported');

        window.addEventListener('resize', function (event) {
            info('resize event captured:' + shallowStringify(event));
        });
    };

    var windowGetComputedStyle = function () {
        log('window.getComputedStyle');

        if ('getComputedStyle' in window) {
            info('window.getComputedStyle supported');
        } else {
            warn('window.getComputedStyle missing');
        }
    };

    var windowPostMessage = function () {
        log('window.postMessage');

        if ('postMessage' in window) {
            info('window.postMessage supported');
        } else {
            warn('window.postMessage missing');
        }
    };

    var windowRequestAnimationFrame = function () {
        log('window.requestAnimationFrame');

        if ('requestAnimationFrame' in window) {
            info('window.requestAnimationFrame supported');
        } else {
            warn('window.requestAnimationFrame missing');
        }
    };

    var navigatorOnLine = function () {
        log('navigator.onLine');

        if (!('onLine' in navigator)) {
            warn('navigator.onLine missing');

            return;
        }

        info('navigator.onLine supported');

        window.addEventListener('online', function (event) {
            info('online event captured:' + shallowStringify(event));
        });
        window.addEventListener('offline', function (event) {
            info('offline event captured:' + shallowStringify(event));
        });
    };

    var elementClassList = function () {
        log('element.classList');
        var el = document.createElement('div');

        if (!('classList' in el)) {
            warn('element.classList missing');

            return;
        }

        if (el.classList instanceof window.DOMTokenList) {
            info('element.classList supported');
        } else {
            warn('element.classList is not a DOMTokenList');

        }
    };

    var elementAttributeAccess = function () {
        log('element.attributeAccess');
        var el = document.createElement('div');

        if ('attributes' in el) {
            if (el.attributes instanceof window.NamedNodeMap) {
                info('element.attributes supported');
            } else {
                warn('element.attributes is not a NamedNodeMap');
            }
        } else {
            warn('element does not have attributes property');
        }

        if ('setAttribute' in el) {
            info('element has setAttribute method');
        } else {
            warn('element does not have setAttribute method');
        }

        if ('getAttribute' in el) {
            info('element has getAttribute method');
        } else {
            warn('element does not have getAttribute method');
        }
    };

    var elementStyleAccess = function () {
        log('element.styleAccess');
        var el = document.createElement('div');

        if (!('style' in el)) {
            warn('element.style missing');

            return;
        }

        if (el.style instanceof window.CSSStyleDeclaration) {
            info('element.style supported');
        } else {
            warn('element.style is not a CSSStyleDeclaration');
        }
    };

    var run = function () {
        logBrowser();
        windowApplicationCache();
        windowDevicePixelRatio();
        windowHistory();
        windowInnerWidth();
        windowInnerHeight();
        windowLocalStorage();
        windowLocation();
        windowOuterWidth();
        windowOuterHeight();
        windowPerformance();
        windowScreen();
        windowSessionStorage();
        windowLocalStorage();
        windowOnBlur();
        windowOnChange();
        windowOnClick();
        windowOnFocus();
        windowOnKeyDown();
        windowOnKeyUp();
        windowOnKeyPress();
        windowOnMouseDown();
        windowOnMouseUp();
        windowOnMouseMove();
        windowOnMouseOver();
        windowOnMouseOut();
        windowOnResize();
        windowGetComputedStyle();
        windowPostMessage();
        windowRequestAnimationFrame();
        navigatorOnLine();
        elementClassList();
        elementAttributeAccess();
        elementStyleAccess();
    };

    var shallowStringify = function (object) {
        var shallow = {};
        var keys = Object.keys(object);
        keys.forEach(function (key) {
            shallow[ key ] = String(object[ key ]);
        });

        return JSON.stringify(shallow);
    };

}).call(window);