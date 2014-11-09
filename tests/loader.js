(function () {
    var me = this;
    var head = document.getElementsByTagName('head')[0];

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
        getTestFiles(sources, tests).forEach(function (file) {
            addScript(head, file);
        });
    });
    var resolveSourceFileName = function (name) {
        return '/src/' + name.split('.').slice(1).join('/') + '.js';
    };
    var resolveTestFileName = function (name) {
        return '/tests/src/' + name.split('.').slice(1).join('/') + 'Test.js';
    };
    var getTestFiles = function (sources, tests) {
        var files = [];
        sources.forEach(function (source) {
            tests.forEach(function (test) {
                var file = resolveTestFileName(source);
                source.indexOf(test) === 0 && files.indexOf(file) < 0 && files.push(file);
            });
        });
        return files;
    };

    me.syncLoad = function (files, callback) {
        if (!files.length) {
            return;
        }
        if (files.length == 1) {
            addScript(head, resolveSourceFileName(files[0]), callback);
        } else {
            addScript(head, resolveSourceFileName(files[0]), function () {
                me.syncLoad(files.slice(1), callback);
            });
        }
    };
}).call(window);