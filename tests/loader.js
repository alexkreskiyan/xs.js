(function () {
    var me = this;
    var head = document.getElementsByTagName('head')[0];
    var coverage = '/node_modules/blanket/dist/qunit/blanket.js';
    var scripts = []; //all scripts sources
    var sources = []; //all sources
    var pendingSources = []; //pending sources
    var readySources = []; //pending sources
    var tests = []; //all acquired tests files
    var pendingTests = []; //registered tests handlers
    var readyTests = []; //registered tests handlers

    //resolves source File
    var resolveSourceFile = function (name) {
        return '/src/' + name.split('.').slice(1).join('/') + '.js';
    };
    var resolveTestFile = function (name) {
        return '/tests/src/' + name.split('.').slice(1).join('/') + 'Test.js';
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

    //adds script to container
    var addScript = function (container, src, onLoad, cover) {
        if (scripts.indexOf(src) >= 0) {
            onLoad && onLoad();
            return;
        }
        scripts.push(src);

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        cover && script.setAttribute('data-cover', '');
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

    var load = function (files, callback) {
        if (!files.length) {
            return;
        }
        var file = resolveSourceFile(files[0]);
        if (files.length == 1) {
            addScript(head, file, callback, true);
        } else {
            addScript(head, file, function () {
                me.syncLoad(files.slice(1), callback, true);
            });
        }
    };

    var addFiles = function (files) {
        if (pendingSources) {

        }
    };

    // Adds sources to pending list and callback to handlers
    me.require = function (files, callback) {

    };

    var testsList = (function (key) {
        var result = /\?([^#\?]+)/.exec(me.location.search);
        if (!result) {
            return [];
        }
        var paramsPairs = result.slice(1).shift().split('&');
        var pair;
        for (var idx = 0; idx < paramsPairs.length; i++) {
            pair = paramsPairs[idx].split('=');
            if (pair[0] == key) {
                return pair[1].split(',');
            }
        }
    }).call(me, 'tests');

    request('/src/src.json', function (src) {
        sources = src;
        tests = getTests(src, testsList);
        tests.forEach(function (test) {
            var name = test;
            pendingTests.push(name);
            console.log('add pending test', name);
            console.log('pending ...', pendingTests);
            addScript(head, resolveTestFile(name), function () {
                pendingTests.splice(pendingTests.indexOf(name), 1);
                console.log('remove pending test', name);
                console.log('pending ...', pendingTests);
            });
        });
    });
}).call(window);
function benchmark(fn, n) {
    var start = Date.now();
    for (var i = 0; i < n; i++) {
        fn();
    }
    var duration = Date.now() - start;
    console.log('duration: ', duration, 'ms for ', n, 'operations');
    console.log('median: ', duration / n, 'ms per operation');
    console.log('mark: about', n / duration, 'operation per ms');
}