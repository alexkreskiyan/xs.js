(function () {

    'use strict';

    var me = this;
    var head = document.getElementsByTagName('head')[0];

    var scripts = []; //all scripts sources

    var handlers = [];

    //fetches tests list from specified query param
    var params = (function () {
        var result = /\?([^#\?]+)/.exec(me.location.search);
        if (!result) {

            return {};
        }
        var paramsPairs = result.slice(1).shift().split('&');
        var params = {}, pair;
        for (var idx = 0; idx < paramsPairs.length; idx++) {
            pair = paramsPairs[idx].split('=');
            params[pair[0]] = pair[1];
        }

        return params;
    }).call(me);

    //fetches tests list from specified query param
    var testsList = params.tests.split(',');

    //get src file
    request('../src/src.json', function (src) {

        var scripts;

        //built mode
        if (params.mode) {
            scripts = ['../build/' + params.mode + '/xs.js'];

            //debug mode
        } else {
            scripts = ['../src/xs.js'];
            scripts = scripts.concat(src.core.map(function (name) {
                return resolveSourceFile(name);
            }));
            scripts = scripts.concat(Object.keys(src.modules).map(function (name) {
                return resolveSourceFile(name);
            }));
        }
        load(scripts, function () {
            //add path to loader
            xs.Loader.paths.add('xs', '../src/');

            //get tests list
            var tests = getTests(src.core, testsList).concat(getTests(Object.keys(src.modules).filter(function (name) {
                var config = src.modules[name];
                return config.type === 'class' && config.test !== false;
            }), testsList));

            load(tests.map(function (name) {
                return resolveTestFile(name);
            }), runTests);
        });
    });

    //save Qunit module method
    var module = me.module;

    //adds test module
    me.module = function (name, run) {
        //add module handler
        handlers.push(function () {
            //define module
            module(name);

            //set active module
            me.activeModule = name;

            //run tests
            run();

            //unset active module
            delete me.activeModule;
        });
    };

    //save Qunit test method
    var test = me.test;

    //adds test case
    me.test = function (name, setUp, run, tearDown) {
        //if 2 arguments - setUp is missing
        if (arguments.length === 2) {
            run = setUp;
            setUp = function () {
            };
            tearDown = function () {
            };
        } else if (arguments.length === 3) {
            tearDown = function () {
            };
            //else if incorrect arguments count
        } else if (arguments.length === 1 || arguments.length > 4) {
            throw new Error('Incorrect test case');
        }

        //get activeModule from window
        var module = me.activeModule;

        test(name, function (assert) {
            var scope = {};

            var done = assert.async();

            var handleSetUp = function () {
                scope.done = handleRun;
                if (setUp.call(scope) !== false) {
                    handleRun();
                }
            };

            var handleRun = function () {
                scope.done = handleTearDown;
                if (run.call(scope) !== false) {
                    handleTearDown();
                }
            };

            var handleTearDown = function () {
                scope.done = handleEnd;
                if (tearDown.call(scope) !== false) {
                    handleEnd();
                }
            };

            var handleEnd = function () {
                console.timeEnd(module + '::' + name);
                done();
            };

            console.time(module + '::' + name);
            handleSetUp();
        });
    };

    //get tested components
    function getTests(sources, tests) {
        var list = [];
        tests.forEach(function (test) {
            sources.forEach(function (source) {
                if (source === test || source.indexOf(test + '.') === 0) { //either strict or namespace match
                    if (list.indexOf(source) < 0) {
                        list.push(source);
                    }
                }
            });
        });
        return list;
    }

    //resolves source file name from class name
    function resolveSourceFile(name) {
        return '../src/' + name.split('.').slice(1).join('/') + '.js';
    }

    //resolves test file name from class name
    function resolveTestFile(name) {
        return '../tests/src/' + name.split('.').slice(1).join('/') + 'Test.js';
    }

    function request(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.send();
        var handleLoad = function () {
            callback(JSON.parse(xhr.response));
            xhr.removeEventListener('load', handleLoad);
        };
        xhr.addEventListener('load', handleLoad);
    }

    //adds script to container
    function addScript(container, src, onLoad) {
        //throw error if script was already added
        if (scripts.indexOf(src) >= 0) {
            throw new Error('Script "' + src + '" is already added');
        }

        //add src to scripts list
        scripts.push(src);

        //create script element
        var script = document.createElement('script');

        //assign type
        script.type = 'text/javascript';

        //assign src attribute
        script.src = src;

        //append script to head
        container.appendChild(script);

        //create loadHandler, that will be called once
        var loadHandler = function () {
            script.removeEventListener('load', loadHandler);
            onLoad();
        };

        //add load handler as event listener for script
        script.addEventListener('load', loadHandler);
    }

    //loads given files list in order
    function load(files, callback) {
        //if files list empty - return
        if (!files.length) {

            return;
        }

        //get first file from files list
        var file = files.shift();

        //if any files left
        if (files.length) {
            addScript(head, file, function () {
                load(files, callback, true);
            });

            //if it is last file
        } else {
            addScript(head, file, callback);
        }
    }

    var runTests = function () {
        handlers.forEach(function (handler) {
            handler();
        });
    };
}).call(window);
function benchmark(fn, n) {

    'use strict';

    var start = Date.now();
    for (var i = 0; i < n; i++) {
        fn();
    }
    var duration = Date.now() - start;
    console.log('duration: ', duration, 'ms for ', n, 'operations');
    console.log('median: ', duration / n, 'ms per operation');
    console.log('mark: about', n / duration, 'operation per ms');
}