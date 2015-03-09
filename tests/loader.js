(function () {

    'use strict';

    var me = this;
    var head = document.getElementsByTagName('head')[0];

    var scripts = []; //all scripts sources

    var handlers = [];

    //fetches tests list from specified query param
    var params = (function (query) {
        var result = /\?([^#\?]+)/.exec(query);
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
    })(me.location.search);

    //fetches tests list from specified query param
    var testsList = params.tests.split(',');

    //get src file
    request('../make/source.json', function (src) {

        if (params.mode && params.mode !== 'source') {
            loadBuild(src, params.mode, testsLoader);
        } else {
            loadSource(src, testsLoader);
        }
    });

    var loadBuild = function (src, mode, callback) {

        load(['../build/' + mode + '/xs.js'], function () {

            //add path to loader
            xs.Loader.paths.add('xs', '../src');

            //add debug log route
            xs.log.Router.routes.add(new xs.log.route.Console('console'));

            //mark xs.log.Router as ready
            xs.log.Router.ready();

            xs.onReady(function () {
                callback(src);
            });
        });
    };

    var loadSource = function (src, callback) {

        load(['../build/source/xs.js'], function () {

            //add path to loader
            xs.Loader.paths.add('xs', '../src');

            var modules = {};
            assemblyModules(modules, src.modules);

            xs.Loader.require(Object.keys(modules), function () {

                xs.onReady(function () {
                    //add debug log route
                    xs.log.Router.routes.add(new xs.log.route.Console('console'));

                    //mark xs.log.Router as ready
                    xs.log.Router.ready();

                    callback(src);
                });
            });
        });
    };

    var testsLoader = function (src) {

        var core = assemblyCore(src.core);

        var modules = {};
        assemblyModules(modules, src.modules);

        loadTests(core, modules, testsList);
    };

    var loadTests = function (core, modules, testsList) {
        var tested = {
            core: undefined,
            modules: undefined
        };

        tested.core = Object.keys(core).filter(function (name) {
            return core[name].test !== false;
        });

        tested.modules = Object.keys(modules).filter(function (name) {
            var config = modules[name];
            return config.contract === 'class' && config.test !== false;
        });

        //get tests list
        var tests = getTests(tested.core, testsList).concat(getTests(tested.modules, testsList));

        load(tests.map(function (name) {
            return resolveTestFile(name);
        }), runTests);
    };

    function assemblyCore(modules) {
        var names = Object.keys(modules);

        var core = {};

        for (var i = 0; i < names.length; i++) {

            var name = names[i];
            var module = modules[name];

            if (isModule(module)) {

                core[name] = module;

                continue;
            }

            //concat core with module
            var keys = Object.keys(module);
            for (var j = 0; j < keys.length; j++) {
                var key = keys[j];
                core[key] = module[key];
            }
        }

        return core;
    }

    function assemblyModules(list, modules, name) {
        //modules is node, if given string contract
        if (typeof modules.contract === 'string') {
            list[name] = modules;

            return;
        }

        //modules is category
        Object.keys(modules).forEach(function (key) {
            assemblyModules(list, modules[key], name ? (name + '.' + key) : key);
        });
    }

    function isModule(description) {
        return (Object.keys(description).length === 0) || (typeof description.contract === 'string') || (typeof description.test === 'boolean');
    }


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
                console.info(module + '::' + name, '-', +((new Date()).valueOf() - time));
                done();
            };

            var time = (new Date()).valueOf();
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

        //create errorHandler, that will be called once
        var errorHandler = function () {
            script.removeEventListener('error', errorHandler);
            me.write.error('failed ' + src);
            onLoad();
        };

        //add error handler as event listener for script
        script.addEventListener('error', errorHandler);
    }

    //loads given files list in order
    function load(files, callback) {
        //if files list empty - return
        if (!files.length) {
            callback();

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

    me.benchmark = function (fn, n) {

        var start = Date.now();
        for (var i = 0; i < n; i++) {
            fn();
        }
        var duration = Date.now() - start;
        console.log('duration: ', duration, 'ms for ', n, 'operations');
        console.log('median: ', duration / n, 'ms per operation');
        console.log('mark: about', n / duration, 'operation per ms');
    };

}).call(window);