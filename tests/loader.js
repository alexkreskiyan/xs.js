(function () {
    var me = this;
    var head = document.getElementsByTagName('head')[0];
    var scripts = [];

    var tests = (function (key) {
        var paramsPairs = /\?([^#\?]+)/.exec(me.location.search).slice(1).shift().split('&');
        var pair;
        for (var idx = 0; idx < paramsPairs.length; i++) {
            pair = paramsPairs[idx].split('=');
            if (pair[0] == key) {
                return pair[1].split(',');
            }
        }
    }).call(me, 'tests');

    var addScript = function (container, src, onLoad) {
        if (scripts.indexOf(src) >= 0) {
            onLoad && onLoad();
            return;
        }
        scripts.push(src);

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        container.appendChild(script);
        if (!onLoad) {
            return;
        }
        var loadHandler = function () {
            script.removeEventListener('load', loadHandler);
            onLoad();
        };
        script.addEventListener('load', loadHandler);
    };

    var request = function (url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.send();
        var handleLoad = function () {
            callback(JSON.parse(xhr.response));
            xhr.removeEventListener('load', handleLoad);
        };
        xhr.addEventListener('load', handleLoad);
    };

    request('/src/src.json', function (sources) {
        getTests(sources, tests).forEach(function (test) {
            addScript(head, resolveTestFileName(test));
        });
    });
    var resolveSourceFileName = function (name) {
        return '/src/' + name.split('.').slice(1).join('/') + '.js';
    };
    var resolveTestFileName = function (name) {
        return '/tests/src/' + name.split('.').slice(1).join('/') + 'Test.js';
    };
    var getTests = function (sources, tests) {
        var list = [];
        sources.forEach(function (source) {
            tests.forEach(function (test) {
                if (source === test || source.indexOf(test + '.') == 0) { //either strict or namespace match
                    list.indexOf(source) < 0 && list.push(source);
                }
            });
        });
        return list;
    };

    me.syncLoad = function (files, callback) {
        if (!files.length) {
            return;
        }
        var file = resolveSourceFileName(files[0]);
        if (files.length == 1) {
            addScript(head, file, callback);
        } else {
            addScript(head, file, function () {
                me.syncLoad(files.slice(1), callback);
            });
        }
    };
}).call(window);