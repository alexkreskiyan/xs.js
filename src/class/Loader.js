/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function (root, ns) {

    //framework shorthand
    var xs = root[ns];

    /**
     * xs.Loader is core class, that is used for class loading
     *
     * xs.Loader provides 2 public abilities:
     *
     * - paths management - allows to add/delete/get path of class
     * - class loading
     *
     * Usage example:
     *
     *     //paths managements
     *     //single path add
     *     xs.Loader.paths.add('my', 'app/my');
     *     //multiple paths add
     *     xs.Loader.paths.add({
     *         my: 'app/my',
     *         demo: 'app/demo',
     *     });
     *
     *     //single path delete
     *     xs.Loader.paths.delete('my');
     *     //multiple paths delete
     *     xs.Loader.paths.delete(['my', 'demo']);
     *
     *     //single class load
     *     xs.Loader.require('my.Base', function(Base) {
     *     });
     *     //multiple class load
     *     xs.Loader.require(['my.Base', 'my.Demo'], function(Base, Demo) {
     *     });
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class xs.Loader
     *
     * @singleton
     */
    xs.Loader = new (function () {
        var me = this;

        /**
         * Name testing regular expression
         *
         * @ignore
         *
         * @type {RegExp}
         */
        var nameRe = /^[A-z_]{1}[A-z0-9_]*(?:\.{1}[A-z_]{1}[A-z0-9_]*)*$/;

        /**
         * Internal loaded files list
         *
         * @ignore
         *
         * @property {List}
         */
        var loaded = new List('loaded');

        /**
         * Internal failed files list
         *
         * @ignore
         *
         * @property {List}
         */
        var failed = new List('failed');

        /**
         * Requires list of classes, resolving their paths. After all files loaded, given callback is executed
         *
         * @method require
         *
         * @param {String|String[]} name class name or array of class names
         * @param {Function} handleLoad successful classes' load  handler.
         * When called, hash with name:path pairs of all loaded classes will be passed as single argument
         * @param {Function} [handleFail] handler for one of files failed.
         * When called, 3 lists are passed as arguments: failed, loaded and unresolved classes.
         * Unresolved means, that those were not loaded yet before fail
         */
        me.require = function (name, handleLoad, handleFail) {
            xs.log('xs.Loader::require. Acquired:', name);

            //init loaded classes list
            var loadList = _getLoadList(xs.isArray(name) ? name : [name]);
            xs.log('xs.Loader::require. LoadList: loaded:', loadList.loaded, ', failed:', loadList.failed, ', unresolved:', loadList.unresolved);

            //if failed section is not empty - handle fail
            if (xs.size(loadList.failed)) {
                xs.log('xs.Loader::require. LoadList has failed classes. Handle fail');
                //use handleFail method if given
                if (handleFail) {
                    xs.nextTick(function () {
                        handleFail(loadList.failed, loadList.loaded, loadList.unresolved);
                    });
                } else {
                    var failed = [];
                    xs.each(loadList.failed, function (path, name) {
                        failed.push(name + ' (' + path + ')');
                    });
                    throw new LoaderError('failed loading classes: ' + failed.join(', '));
                }

                return;
            }

            //if new section is empty - handle load - all classes are in loaded section
            if (!xs.size(loadList.unresolved)) {
                xs.log('xs.Loader::require. LoadList has only loaded classes. Handle load');
                xs.nextTick(function () {
                    handleLoad(loadList.loaded);
                });

                return;
            }

            xs.log('xs.Loader::require. Add loadList to resolver');
            //add loadList to resolver
            resolver.add(loadList, handleLoad, handleFail);

            xs.log('xs.Loader::require. Add each of loadList to loader');
            //add each of loadList.unresolved to loader
            xs.each(loadList.unresolved, function (path) {
                loader.has(path) || loader.add(path);
            });
        };

        /**
         * Returns list of classes to loadChecks loaded and failed lists.
         *
         * @ignore
         *
         * @method getLoadList
         *
         * @param {String[]} classes array with class names, that are attempted to be loaded
         *
         * @return {Object} list of classes, that have to be loaded
         *
         * @throws {Error} Error is thrown, when:
         *
         * - class name is not string
         * - class name has incorrect format
         * - class was already attempted to load, but load failed - error occurred
         */
        function _getLoadList(classes) {

            /**
             * Load list
             *
             * @ignore
             *
             * @type {Object}
             */
            var loadList = {
                unresolved: {},
                loaded: {},
                failed: {}
            };

            xs.log('xs.Loader::getLoadList. Processing classes', classes);
            //process loaded and missing classes
            xs.each(classes, function (name) {
                //check, that name is string
                if (!xs.isString(name)) {
                    throw new LoaderError('loaded class name must be a string');
                }

                //check, that name matches regular expression
                if (!nameRe.test(name)) {
                    throw new LoaderError('loaded class name has incorrect format');
                }

                //resolve name with paths
                var path = paths.resolve(name);

                xs.log('xs.Loader::getLoadList. Resolved class "' + name + '" as path"' + path + '"');
                xs.log('xs.Loader::getLoadList. Check path "' + path + '"');
                //if the class is already loaded - add it to loaded section
                if (loaded.has(path)) {
                    xs.log('xs.Loader::getLoadList. Path "' + path + '" is already loaded');
                    loadList.loaded[name] = path;

                    //if the class was already attempted to load, but load failed - add it to failed section
                } else if (failed.has(path)) {
                    loadList.failed[name] = path;

                    //else - the class was not attempted to load yet - add it to unresolved section
                } else {
                    loadList.unresolved[name] = path;
                }
            });

            xs.log('xs.Loader::getLoadList. Result loadList: loaded:', loadList.loaded, ', failed:', loadList.failed, ', unresolved:', loadList.unresolved);

            //return loadList
            return loadList;
        }

        /**
         * File load succeed handler
         *
         * @ignore
         *
         * @method handleLoad
         *
         * @param {String} path
         */
        function _handleLoad(path) {
            xs.log('xs.Loader::handleLoad. Path "' + path + '" loaded');
            //add loaded path
            loaded.add(path);

            //resolve ready awaiting items
            resolver.resolve(path);
        }

        /**
         * File load failed handler
         *
         * @ignore
         *
         * @method handleFail
         *
         * @param {String} path
         *
         * @throws {Error} Error is thrown, when:
         *
         * - failed loading url
         */
        function _handleFail(path) {
            xs.log('xs.Loader::handleFail. Path "' + path + '" failed');
            //add failed path
            failed.add(path);

            //reject ready awaiting items
            resolver.reject(path);
        }

        /**
         * Internal paths class
         *
         * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
         *
         * @class xs.Loader.paths
         *
         * @singleton
         */
        var paths = me.paths = new (function () {
            var me = this;

            /**
             * Paths registry
             *
             * @ignore
             *
             * @type {Object}
             */
            var paths = {};

            /**
             * Adds new path alias. Has single and multiple mode
             *
             * For example:
             *
             *     //add single path to xs.Loader.paths
             *     xs.Loader.paths.add('my', 'app/my');
             *     //add multiple paths to xs.Loader.paths
             *     xs.Loader.paths.add({
             *         my: 'app/my',
             *         demo: 'app/demo'
             *     });
             *
             * @method add
             *
             * @param {String|Object} alias Path alias string in single mode. Object with aliases in multiple mode
             * @param {String} [path] Alias target path
             *
             * @chainable
             *
             * @throws {Error} Error is thrown:
             *
             * - if given alias is already registered
             * - if given path is not a string
             */
            me.add = function (alias, path) {
                //single alias style
                if (arguments.length > 1) {

                    //check that alias was not defined yet
                    if (me.has(alias)) {
                        throw new LoaderError('alias "' + alias + '" is already registered');
                    }

                    //check that path is string
                    if (!xs.isString(path)) {
                        throw new LoaderError('path must be a string');
                    }

                    //register new path alias
                    paths[alias] = path;

                    return this;
                }

                //check that pairs are given as list
                if (!xs.isObject(alias)) {
                    throw new LoaderError('aliases list has incorrect format');
                }

                //add each path
                xs.each(alias, function (path, alias) {
                    me.add(alias, path);
                });

                return this;
            };

            /**
             * Checks whether alias is already registered in xs.Loader
             *
             * For example:
             *
             *     //check some alias
             *     xs.Loader.paths.has('my.demo'); //false
             *     xs.Loader.paths.add('my.demo', 'my/demo');
             *     xs.Loader.paths.has('my.demo'); //true
             *
             * @method has
             *
             * @param {String} alias verified alias
             *
             * @return {Boolean} whether alias is already registered
             *
             * @throws {Error} Error is thrown:
             *
             * - if given alias is not a string
             */
            me.has = function (alias) {
                //check, that alias is string
                if (!xs.isString(alias)) {
                    throw new LoaderError('alias must be a string');
                }

                //check, that alias matches regular expression
                if (!nameRe.test(alias)) {
                    throw new LoaderError('alias is given incorrectly');
                }

                //return whether alias is in paths
                return xs.hasKey(paths, alias);
            };

            /**
             * Deletes path alias from {@link xs.Loader.paths}. Has single and multiple mode
             *
             * For example:
             *
             *     //delete single path from xs.Loader.paths
             *     xs.Loader.paths.delete('my');
             *     //delete multiple paths from xs.Loader.paths
             *     xs.Loader.paths.delete([
             *         'my',
             *         'demo'
             *     ]);
             *
             * @method delete
             *
             * @param {String|String[]} alias Single alias or aliases array
             *
             * @chainable
             *
             * @throws {Error} Error is thrown:
             *
             * - if given alias is not registered
             */
            me.delete = function (alias) {
                //single alias style
                if (!xs.isArray(alias)) {

                    //check that alias is registered
                    if (!me.has(alias)) {
                        throw new LoaderError('alias "' + alias + '" is not registered');
                    }

                    //remove alias
                    delete paths[alias];

                    return this;
                }

                //delete each alias
                xs.each(alias, me.delete);

                return this;
            };

            /**
             * Returns copy of registered paths list
             *
             * @method get
             *
             * @returns {Object} paths copy
             */
            me.get = function () {
                return xs.clone(paths);
            };

            //file extension
            var ext = '.js';

            /**
             * Resolves class path, using registered aliases.
             *
             * For example:
             *
             *     //add common alias
             *     xs.Loader.paths.add('my', 'mylib');
             *     //resolve className, that starts in "my" namespace
             *     xs.Loader.paths.resolve('my.demo.Class');//mylib/demo/Class.js
             *     //add more specific alias
             *     xs.Loader.paths.add('my.demo', 'mydemolib');
             *     //resolve same className
             *     xs.Loader.paths.resolve('my.demo.Class');//mydemolib/Class.js
             *
             * @method resolve
             *
             * @param {String} name resolved class name
             *
             * @return {String} resolved path
             *
             * @throws {Error} Error is thrown:
             *
             * - if given class name is not a string
             */
            me.resolve = function (name) {
                //throw LoaderError if name is not string
                if (!xs.isString(name)) {
                    throw new LoaderError('class name must be a string');
                }

                //check that name matches regular expression
                if (!nameRe.test(name)) {
                    throw new LoaderError('class name has incorrect format');
                }

                //most suitable alias for name
                var nameAlias = '';
                //path of most suitable alias
                var namePath = '';

                //iterate over all paths to find most suitable alias
                xs.each(paths, function (path, alias) {
                    //update current, if name starts from alias + dot and alias length if longer, than current
                    if (name.indexOf(alias + '.') === 0 && alias.length > nameAlias.length) {
                        nameAlias = alias;
                        namePath = path;
                    }
                });

                //if alias not found - return name, where dots are replaced with slashes
                if (!nameAlias) {

                    return name.split('.').join('/') + ext;
                }

                //return path joined with rest of name by / and suffix added
                return namePath + '/' + name.substring(nameAlias.length + 1).split('.').join('/') + ext;
            };
        });

        /**
         * Internal resolver instance, that handles all registered callbacks.
         * As far, as all depended paths are loaded, relative callback is executed and removed from registry
         *
         * @ignore
         *
         * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
         *
         * @class Resolver
         *
         * @singleton
         */
        var resolver = new (function () {
            var me = this;

            /**
             * Awaiting handlers list
             *
             * @type {Array}
             */
            var awaiting = [];

            /**
             * Adds new awaiting item, consisting of loaded items list and ready handler
             *
             * @method add
             *
             * @param {String[]} list loadList
             * @param {Function} handleLoad successful classes' load  handler.
             * @param {Function} [handleFail] handler for one of files failed.
             */
            me.add = function (list, handleLoad, handleFail) {
                xs.log('xs.Loader::resolver::add. Add list loaded:', list.loaded, ', failed:', list.failed, ', unresolved:', list.unresolved);
                awaiting.push({
                    list: list,
                    pending: xs.values(list.unresolved),
                    handleLoad: handleLoad,
                    handleFail: handleFail
                });
            };

            /**
             * Checks all awaiting items. Deletes path from each item's paths list. If paths list is empty - resolves item
             *
             * If any item from awaiting list has all paths' loaded, it's handler is called and item is removed
             *
             * @method handleLoad
             *
             * @param {String} path
             */
            me.resolve = function (path) {
                //find resolved items
                xs.log('xs.Loader::resolver::resolve. Handle path "' + path + '"');
                var resolved = xs.findAll(awaiting, function (item) {
                    xs.log('xs.Loader::resolver::handler. Clean up item.pending', item.pending);

                    //item is resolved, if path delete succeeds (path was deleted) and pending is empty
                    if (xs.delete(item.pending, path)) {

                        //update item list
                        var name = xs.keyOf(item.list.unresolved, path);
                        delete item.list.unresolved[name];
                        item.list.loaded[name] = path;

                        return !item.pending.length;
                    }

                    return false;
                });

                xs.log('xs.Loader::resolver::resolve. Handling items:');
                xs.each(resolved, function (item) {
                    xs.log('xs.Loader::resolver::resolve. loaded:', item.list.loaded, ', failed:', item.list.failed, ', unresolved:', item.list.unresolved);
                });

                //handle each resolved item
                xs.each(resolved, function (item) {
                    xs.delete(awaiting, item);
                    item.handleLoad(item.list.loaded);
                });
            };

            /**
             * Checks all awaiting items. If any item has path in item.paths, it's handleFail is called or respective error is thrown
             *
             * @method handleFail
             *
             * @param {String} path
             */
            me.reject = function (path) {
                //find rejected items
                xs.log('xs.Loader::resolver::reject. Handle path "' + path + '"');
                var rejected = xs.findAll(awaiting, function (item) {
                    xs.log('xs.Loader::resolver::reject. Check item.pending', item.pending);
                    //item is rejected, if pending has path
                    return xs.has(item.pending, path);
                });

                xs.log('xs.Loader::resolver::reject. Handling items', rejected);
                xs.each(rejected, function (item) {
                    xs.log('xs.Loader::resolver::reject. Rejected: loaded:', item.list.loaded, ', failed:', item.list.failed, ', unresolved:', item.list.unresolved);
                });

                //handle each rejected item
                xs.each(rejected, function (item) {
                    //delete item from awaiting list
                    xs.delete(awaiting, item);

                    //update item list
                    var name = xs.keyOf(item.list.unresolved, path);
                    delete item.list.unresolved[name];
                    item.list.failed[name] = path;

                    //handle fail if handler given, or throw error
                    if (item.handleFail) {
                        item.handleFail(item.list.failed, item.list.loaded, item.list.unresolved);
                    } else {
                        throw new LoaderError('failed loading classes: ' + name + ' (' + path + ')');
                    }
                });
            };
        });

        /**
         * Internal loader instance
         *
         * @ignore
         *
         * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
         *
         * @class Loader
         *
         * @singleton
         */
        var loader = new (function (handleLoad, handleFail) {
            var me = this;

            /**
             * Loading files list
             *
             * @type {Array}
             */
            var loading = [];

            /**
             * Add path to load
             *
             * @method add
             *
             * @param {String} path loaded path
             *
             * @chainable
             *
             * @throws {Error} Error is thrown:
             *
             * - if given path is already registered in loader
             */
            me.add = function (path) {
                var me = this;

                xs.log('xs.Loader::loader::add. Add path "' + path + '"');
                //check that path was not added yet
                if (me.has(path)) {
                    throw new LoaderError('path "' + path + '" is already loading');
                }

                //register new path alias
                loading.push(path);

                //execute load
                _load(path);

                return me;
            };

            /**
             * Checks whether loader is loading file with given path
             *
             * @param {String} path verified path
             *
             * @returns {Boolean} whether loader is loading that path
             */
            me.has = function (path) {
                return xs.has(loading, path);
            };

            /**
             * Internal loading function. Adds script tag for loading.
             *
             * Executes handleLoad on successful load end and handleFail on load error
             *
             * @method load
             *
             * @param {String} path loaded path
             */
            var _load = function (path) {
                //create script element
                var script = document.createElement('script');

                xs.log('xs.Loader::loader::load. Add script for path "' + path + '"');
                //set path as src and path (because src is resolved relative to domain)
                script.src = script.path = path;

                //script is loaded asynchronously, without blocking page rendering
                script.async = true;

                //add load event listener
                script.addEventListener('load', _handleLoad);

                //add error event listener
                script.addEventListener('error', _handleFail);

                //append script to head
                document.head.appendChild(script);
            };

            /**
             * Internal handler, that wraps external handleLoad
             */
            var _handleLoad = function () {
                var me = this;

                //remove handler after call
                me.removeEventListener('load', _handleLoad);

                //delete src from loading list
                xs.delete(loading, me.path);

                //handle load callback
                handleLoad(me.path);
            };

            /**
             * Internal handler, that wraps external handleFail
             */
            var _handleFail = function () {
                var me = this;

                //remove handler after call
                me.removeEventListener('load', _handleFail);

                //delete src from loading list
                xs.delete(loading, me.path);

                //handle load callback
                handleFail(me.path);
            };
        })(_handleLoad, _handleFail);

        /**
         * Internal list class
         *
         * @ignore
         *
         * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
         *
         * @class List
         */
        function List(name) {
            var me = this;

            /**
             * Paths storage
             *
             * @type {Array}
             */
            var list = [];

            /**
             * Store list name
             *
             * @type {String}
             */
            var listName = name;

            /**
             * Adds path to list
             *
             * @method add
             *
             * @param {String} path added path
             *
             * @chainable
             */
            me.add = function (path) {
                var me = this;

                xs.log('xs.Loader::' + name + '::add. Add path "' + path + '"');
                //check that path is not in list
                if (me.has(path)) {
                    throw new LoaderError('class "' + path + '" is already in ' + listName + ' list');
                }

                //add path to list
                list.push(path);

                return me;
            };

            /**
             * Checks whether list has path
             *
             * @param {String} path verified path
             *
             * @returns {Boolean}
             */
            me.has = function (path) {

                return xs.has(list, path);
            };

            /**
             * Deletes path from list
             *
             * @method delete
             *
             * @param {String} path deleted path
             *
             * @chainable
             */
            me.delete = function (path) {
                var me = this;

                xs.log('xs.Loader::' + name + '::delete. Delete path "' + path + '"');
                //check that path is in list
                if (!me.has(path)) {
                    throw new LoaderError('class "' + path + '" is not in ' + listName + ' list');
                }

                //delete path from list
                xs.delete(list, path);

                return me;
            };
        }

        /**
         * Internal error class
         *
         * @ignore
         *
         * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
         *
         * @class LoaderError
         */
        function LoaderError(message) {
            this.message = 'xs.Loader :: ' + message;
        }

        LoaderError.prototype = new Error();
    });

    xs.extend(xs, xs.pick(xs.Loader, [
        'require'
    ]));
})(window, 'xs');