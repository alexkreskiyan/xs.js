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
     * - paths management - allows to add/remove/get path of class
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
     *     //single path remove
     *     xs.Loader.paths.remove('my');
     *     //multiple paths remove
     *     xs.Loader.paths.remove(['my', 'demo']);
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
         *
         * @throws {Error} Error is thrown, when:
         *
         * - some of required classes' already failed to load
         */
        me.require = function (name, handleLoad, handleFail) {
            xs.log('xs.Loader::require. Acquired:', name);

            //init loaded classes list
            var loadList = _getLoadList(new xs.core.Collection(xs.isArray(name) ? name : [name]));
            xs.log('xs.Loader::require. LoadList: loaded:', loadList.loaded.toSource(), ', failed:', loadList.failed.toSource(), ', unresolved:', loadList.unresolved.toSource());

            //if failed section is not empty - handle fail
            if (loadList.failed.length) {
                xs.log('xs.Loader::require. LoadList has failed classes. Handle fail');
                //use handleFail method if given
                if (handleFail) {
                    xs.nextTick(function () {
                        handleFail(loadList.failed.toSource(), loadList.loaded.toSource(), loadList.unresolved.toSource());
                    });
                } else {
                    var failed = [];
                    loadList.failed.each(function (path, name) {
                        failed.push(name + ' (' + path + ')');
                    });
                    throw new LoaderError('failed loading classes: ' + failed.join(', '));
                }

                return;
            }

            //if new section is empty - handle load - all classes are in loaded section
            if (!loadList.unresolved.length) {
                xs.log('xs.Loader::require. LoadList has only loaded classes. Handle load');
                xs.nextTick(function () {
                    handleLoad(loadList.loaded.toSource());
                });

                return;
            }

            xs.log('xs.Loader::require. Add loadList to resolver');
            //add loadList to resolver
            resolver.add(loadList, handleLoad, handleFail);

            xs.log('xs.Loader::require. Add each of loadList to loader');
            //add each of loadList.unresolved to loader
            loadList.unresolved.each(function (path) {
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
         * @param {xs.core.Collection} classes array with class names, that are attempted to be loaded
         *
         * @return {Object} list of classes, that have to be loaded
         *
         * @throws {Error} Error is thrown, when:
         *
         * - class name is not string
         * - class name has incorrect format
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
                unresolved: new xs.core.Collection,
                loaded: new xs.core.Collection,
                failed: new xs.core.Collection
            };

            xs.log('xs.Loader::getLoadList. Processing classes', classes.toSource());
            //process loaded and missing classes
            classes.each(function (name) {
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
                    loadList.loaded.add(name, path);

                    //if the class was already attempted to load, but load failed - add it to failed section
                } else if (failed.has(path)) {
                    loadList.failed.add(name, path);

                    //else - the class was not attempted to load yet - add it to unresolved section
                } else {
                    loadList.unresolved.add(name, path);
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
             * @type {xs.core.Collection}
             */
            var paths = new xs.core.Collection;

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
             * - if given aliases list has incorrect format
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
                    paths.add(alias, path);

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
             * - if given alias has incorrect format
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
                return paths.hasKey(alias);
            };

            /**
             * Deletes path alias from {@link xs.Loader.paths}. Has single and multiple mode
             *
             * For example:
             *
             *     //remove single path from xs.Loader.paths
             *     xs.Loader.paths.remove('my');
             *     //remove multiple paths from xs.Loader.paths
             *     xs.Loader.paths.remove([
             *         'my',
             *         'demo'
             *     ]);
             *
             * @method remove
             *
             * @param {String|String[]} alias Single alias or aliases array
             *
             * @chainable
             *
             * @throws {Error} Error is thrown:
             *
             * - if given alias is not registered
             */
            me.remove = function (alias) {
                //single alias style
                if (!xs.isArray(alias)) {

                    //check that alias is registered
                    if (!me.has(alias)) {
                        throw new LoaderError('alias "' + alias + '" is not registered');
                    }

                    //remove alias
                    paths.removeAt(alias);

                    return this;
                }

                //remove each alias
                xs.each(alias, me.remove, me);

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
                return paths.toSource();
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
             * - if given class name has incorrect format
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
                paths.each(function (path, alias) {
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
             * @type {xs.core.Collection}
             */
            var awaiting = new xs.core.Collection;

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
                awaiting.add({
                    list: list,
                    pending: list.unresolved.clone(),
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
                var resolved = awaiting.find(function (item) {
                    xs.log('xs.Loader::resolver::resolve. Clean up item.pending', item.pending);

                    //item is resolved, if path remove succeeds (path was removed) and pending is empty
                    if (item.pending.has(path)) {

                        item.pending.remove(path);

                        //update item list
                        var name = item.list.unresolved.keyOf(path);
                        item.list.unresolved.removeAt(name);
                        item.list.loaded.add(name, path);

                        return !item.pending.length;
                    }

                    return false;
                }, xs.core.Collection.ALL);

                xs.log('xs.Loader::resolver::resolve. Handling items:');
                resolved.each(function (item) {
                    xs.log('xs.Loader::resolver::resolve. loaded:', item.list.loaded.toSource(), ', failed:', item.list.failed.toSource(), ', unresolved:', item.list.unresolved.toSource());
                });

                //handle each resolved item
                resolved.each(function (item) {
                    awaiting.remove(item);
                    item.handleLoad(item.list.loaded.toSource());
                });
            };

            /**
             * Checks all awaiting items. If any item has path in item.paths, it's handleFail is called or respective error is thrown
             *
             * @method handleFail
             *
             * @param {String} path
             *
             * @throws {Error} Error is thrown:
             *
             * - if no handleFail is specified to handle load fail of given class
             */
            me.reject = function (path) {
                //find rejected items
                xs.log('xs.Loader::resolver::reject. Handle path "' + path + '"');
                var rejected = awaiting.find(function (item) {
                    xs.log('xs.Loader::resolver::reject. Check item.pending', item.pending);
                    //item is rejected, if pending has path
                    return item.pending.has(path);
                }, xs.core.Collection.ALL);

                xs.log('xs.Loader::resolver::reject. Handling items', rejected);
                rejected.each(function (item) {
                    xs.log('xs.Loader::resolver::reject. Rejected: loaded:', item.list.loaded, ', failed:', item.list.failed, ', unresolved:', item.list.unresolved);
                });

                //handle each rejected item
                rejected.each(function (item) {
                    //remove item from awaiting list
                    awaiting.remove(item);

                    //update item list
                    var name = item.list.unresolved.keyOf(path);
                    item.list.unresolved.removeAt(name);
                    item.list.failed.add(name, path);

                    //handle fail if handler given, or throw error
                    if (item.handleFail) {
                        item.handleFail(item.list.failed.toSource(), item.list.loaded.toSource(), item.list.unresolved.toSource());
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
             * @type {xs.core.Collection}
             */
            var loading = new xs.core.Collection;

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
                loading.add(path);

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
                return loading.has(path);
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

                //remove src from loading list
                loading.remove(me.path);

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

                //remove src from loading list
                loading.remove(me.path);

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
             * @type {xs.core.Collection}
             */
            var list = new xs.core.Collection;

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
             *
             * @throws {Error} Error is thrown:
             *
             * - if given class path is already in list
             */
            me.add = function (path) {
                var me = this;

                xs.log('xs.Loader::' + name + '::add. Add path "' + path + '"');
                //check that path is not in list
                if (me.has(path)) {
                    throw new LoaderError('class "' + path + '" is already in ' + listName + ' list');
                }

                //add path to list
                list.add(path);

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

                return list.has(path);
            };

            /**
             * Deletes path from list
             *
             * @method remove
             *
             * @param {String} path removed path
             *
             * @chainable
             */
            me.remove = function (path) {
                var me = this;

                xs.log('xs.Loader::' + name + '::remove. Delete path "' + path + '"');
                //check that path is in list
                if (!me.has(path)) {
                    throw new LoaderError('class "' + path + '" is not in ' + listName + ' list');
                }

                //remove path from list
                list.remove(path);

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