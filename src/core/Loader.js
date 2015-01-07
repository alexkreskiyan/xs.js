/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function (root, ns) {

    'use strict';

    //framework shorthand
    var xs = root[ns];

    /**
     * xs.core.Loader is core class, that is used for class loading
     *
     * xs.core.Loader provides 2 public abilities:
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
     * @class xs.core.Loader
     *
     * @alternateClassName xs.Loader
     *
     * @singleton
     */
    xs.Loader = (function () {
        var me = {};

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
            xs.log('xs.core.Loader::require. Acquired:', name);

            //init loaded classes list
            var loadList = _getLoadList(new xs.core.Collection(xs.isArray(name) ? name : [name]));
            xs.log('xs.core.Loader::require. LoadList: loaded:', loadList.loaded.toSource(), ', failed:', loadList.failed.toSource(), ', unresolved:', loadList.unresolved.toSource());

            //if failed section is not empty - handle fail
            if (loadList.failed.length) {
                xs.log('xs.core.Loader::require. LoadList has failed classes. Handle fail');
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
                xs.log('xs.core.Loader::require. LoadList has only loaded classes. Handle load');
                xs.nextTick(function () {
                    handleLoad(loadList.loaded.toSource());
                });

                return;
            }

            xs.log('xs.core.Loader::require. Add loadList to resolver');
            //add loadList to resolver
            resolver.add(loadList, handleLoad, handleFail);

            xs.log('xs.core.Loader::require. Add each of loadList to loader');
            //add each of loadList.unresolved to loader
            loadList.unresolved.each(function (path, name) {
                if (!loader.has(name)) {
                    loader.add(name, path);
                }
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
                unresolved: new xs.core.Collection(),
                loaded: new xs.core.Collection(),
                failed: new xs.core.Collection()
            };

            xs.log('xs.core.Loader::getLoadList. Processing classes', classes.toSource());
            //process loaded and missing classes
            classes.each(function (name) {
                //assert, that name is string
                xs.assert.string(name, 'getLoadList - given loaded class name "$name" is not a string', {
                    $name: name
                }, LoaderError);

                //assert, that name matches regular expression
                xs.assert.ok(nameRe.test(name), 'getLoadList - given loaded class name "$name" has incorrect format', {
                    $name: name
                }, LoaderError);

                //resolve name with paths
                var path = paths.resolve(name);

                xs.log('xs.core.Loader::getLoadList. Resolved class "' + name + '" as path"' + path + '"');
                xs.log('xs.core.Loader::getLoadList. Check class "' + name + '"');
                //if the class is already loaded - add it to loaded section
                if (loaded.has(name)) {
                    xs.log('xs.core.Loader::getLoadList. Class "' + name + '" is already loaded');
                    loadList.loaded.add(name, path);

                    //if the class was already attempted to load, but load failed - add it to failed section
                } else if (failed.has(name)) {
                    loadList.failed.add(name, path);

                    //else - the class was not attempted to load yet - add it to unresolved section
                } else {
                    loadList.unresolved.add(name, path);
                }
            });

            xs.log('xs.core.Loader::getLoadList. Result loadList: loaded:', loadList.loaded.toSource(), ', failed:', loadList.failed.toSource(), ', unresolved:', loadList.unresolved.toSource());

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
         * @param {String} name name of loaded class
         */
        function _handleLoad(name) {
            //handle load if class was loaded
            if (xs.ContractsManager.has(name)) {

                xs.log('xs.core.Loader::handleLoad. Class "' + name + '" loaded');
                //add loaded path
                loaded.add(name);

                //resolve ready awaiting items
                resolver.resolve(name);

                //handle fail if class is missing
            } else {

                xs.log('xs.core.Loader::handleFail. Class "' + name + '" failed to load');
                //add failed path
                failed.add(name);

                //reject ready awaiting items
                resolver.reject(name);
            }
        }

        /**
         * File load failed handler
         *
         * @ignore
         *
         * @method handleFail
         *
         * @param {String} name name of failed class
         */
        function _handleFail(name) {
            xs.log('xs.core.Loader::handleFail. Class "' + name + '" failed to load');
            //add failed path
            failed.add(name);

            //reject ready awaiting items
            resolver.reject(name);
        }

        /**
         * Internal paths class
         *
         * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
         *
         * @class xs.core.Loader.paths
         *
         * @alternateClassName xs.Loader.paths
         *
         * @singleton
         */
        var paths = me.paths = (function () {
            var me = {};

            /**
             * Paths registry
             *
             * @ignore
             *
             * @type {xs.core.Collection}
             */
            var paths = new xs.core.Collection();

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
             */
            me.add = function (alias, path) {
                //single alias style
                if (arguments.length > 1) {

                    //assert that alias was not defined yet
                    xs.assert.not(me.has(alias), 'paths::add - alias "$alias" is already registered', {
                        $alias: alias
                    }, LoaderError);

                    //assert that path is string
                    xs.assert.string(path, 'paths::add - given path "$path" is not a string', {
                        $path: path
                    }, LoaderError);

                    //register new path alias
                    paths.add(alias, path);

                    return this;
                }

                //assert that paths list is object
                xs.assert.object(alias, 'paths::add - given paths list "$paths" is not an object', {
                    $paths: alias
                }, LoaderError);

                //add each path
                (new xs.core.Collection(alias)).each(function (path, alias) {
                    me.add(alias, path);
                });

                return this;
            };

            /**
             * Checks whether alias is already registered in xs.core.Loader
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
             */
            me.has = function (alias) {
                //assert that alias is string
                xs.assert.string(alias, 'paths::has - given alias "$alias" is not a string', {
                    $alias: alias
                }, LoaderError);

                //assert that alias matches regular expression
                xs.assert.ok(nameRe.test(alias), 'paths::has - given alias "$alias" is not correct', {
                    $alias: alias
                }, LoaderError);

                //return whether alias is in paths
                return paths.hasKey(alias);
            };

            /**
             * Deletes path alias from {@link xs.core.Loader.paths}. Has single and multiple mode
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
             */
            me.remove = function (alias) {
                //single alias style
                if (!xs.isArray(alias)) {

                    //assert that alias is registered
                    xs.assert.ok(me.has(alias), 'paths::remove - alias "$alias" is not registered', {
                        $alias: alias
                    }, LoaderError);

                    //remove alias
                    paths.removeAt(alias);

                    return this;
                }

                //remove each alias
                (new xs.core.Collection(alias)).each(me.remove, 0, me);

                return this;
            };

            /**
             * Returns copy of registered paths list
             *
             * @method get
             *
             * @return {Object} paths copy
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
             */
            me.resolve = function (name) {
                //assert that name is string
                xs.assert.string(name, 'paths::resolve - given class name "$name" is not a string', {
                    $name: name
                }, LoaderError);

                //assert that name matches regular expression
                xs.assert.ok(nameRe.test(name), 'paths::resolve - given class name "$name" is not correct', {
                    $name: name
                }, LoaderError);

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

            return me;
        })();

        /**
         * Internal resolver instance, that handles all registered callbacks.
         * As far, as all depended paths are loaded, relative callback is executed and removed from registry
         *
         * @ignore
         *
         * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
         *
         * @class resolver
         *
         * @singleton
         */
        var resolver = (function () {
            var me = {};

            /**
             * Awaiting handlers list
             *
             * @type {xs.core.Collection}
             */
            var awaiting = new xs.core.Collection();

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
                xs.log('xs.core.Loader::resolver::add. Add list loaded:', list.loaded.toSource(), ', failed:', list.failed.toSource(), ', unresolved:', list.unresolved.toSource());
                awaiting.add({
                    list: list,
                    pending: new xs.core.Collection(list.unresolved.keys()),
                    handleLoad: handleLoad,
                    handleFail: handleFail
                });
            };

            /**
             * Checks all awaiting items. Deletes class from each item's classes' list. If classes list is empty - resolves item
             *
             * If any item from awaiting list has all classes loaded, it's handler is called and item is removed
             *
             * @method handleLoad
             *
             * @param {String} name
             */
            me.resolve = function (name) {
                //find resolved items
                xs.log('xs.core.Loader::resolver::resolve. Handle class "' + name + '"');
                var resolved = awaiting.find(function (item) {
                    xs.log('xs.core.Loader::resolver::resolve. Clean up item.pending', item.pending.toSource());

                    //item is resolved, if item.pending had name, and after name was removed from pending, item.pending became empty
                    if (item.pending.has(name)) {

                        item.pending.remove(name);

                        //update item list
                        var path = item.list.unresolved.at(name);
                        item.list.unresolved.removeAt(name);
                        item.list.loaded.add(name, path);

                        return !item.pending.length;
                    }

                    return false;
                }, xs.core.Collection.ALL);

                xs.log('xs.core.Loader::resolver::resolve. Handling items:');
                resolved.each(function (item) {
                    xs.log('xs.core.Loader::resolver::resolve. loaded:', item.list.loaded.toSource(), ', failed:', item.list.failed.toSource(), ', unresolved:', item.list.unresolved.toSource());
                });

                //handle each resolved item
                resolved.each(function (item) {
                    awaiting.remove(item);
                    item.handleLoad(item.list.loaded.toSource());
                });
            };

            /**
             * Checks all awaiting items. If any item has name in item.pending, it's handleFail is called or respective error is thrown
             *
             * @method handleFail
             *
             * @param {String} name
             */
            me.reject = function (name) {
                //find rejected items
                xs.log('xs.core.Loader::resolver::reject. Handle name "' + name + '"');
                var rejected = awaiting.find(function (item) {
                    xs.log('xs.core.Loader::resolver::reject. Check item.pending', item.pending.toSource());

                    //item is rejected, if item.pending has name
                    return item.pending.has(name);
                }, xs.core.Collection.ALL);

                xs.log('xs.core.Loader::resolver::reject. Handling items', rejected.toSource());
                rejected.each(function (item) {
                    xs.log('xs.core.Loader::resolver::reject. Rejected: loaded:', item.list.loaded, ', failed:', item.list.failed, ', unresolved:', item.list.unresolved);
                });

                //handle each rejected item
                rejected.each(function (item) {
                    //remove item from awaiting list
                    awaiting.remove(item);

                    //update item list
                    var path = item.list.unresolved.at(name);
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

            return me;
        })();

        /**
         * Internal loader instance
         *
         * @ignore
         *
         * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
         *
         * @class loader
         *
         * @singleton
         */
        var loader = (function (handleLoad, handleFail) {
            var me = {};

            /**
             * Loading classes list
             *
             * @type {xs.core.Collection}
             */
            var loading = new xs.core.Collection();

            /**
             * Add class to load
             *
             * @method add
             *
             * @param {String} name loaded class name
             * @param {String} path loaded path
             *
             * @chainable
             */
            me.add = function (name, path) {
                var me = this;

                xs.log('xs.core.Loader::loader::add. Add class "' + name + '" with path "' + path + '"');
                //assert that path was not added yet
                xs.assert.not(me.has(path), 'loader::add - class "$Class" with path "$path" is already loading', {
                    $Class: name,
                    $path: path
                }, LoaderError);

                //register new path alias
                loading.add(name, path);

                //execute load
                _load(name, path);

                return me;
            };

            /**
             * Checks whether loader is loading class with given name
             *
             * @param {String} name verified name
             *
             * @return {Boolean} whether loader is loading that class
             */
            me.has = function (name) {
                return loading.hasKey(name);
            };

            /**
             * Internal loading function. Adds script tag for loading.
             *
             * Executes handleLoad on successful load end and handleFail on load error
             *
             * @method load
             *
             * @param {String} name loaded class name
             * @param {String} path loaded path
             */
            var _load = function (name, path) {
                //create script element
                var script = document.createElement('script');

                xs.log('xs.core.Loader::loader::load. Add script for class "' + name + '" with path "' + path + '"');
                //set name - class name
                script.name = name;

                //set path as src
                script.src = path;

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
                loading.removeAt(me.name);

                //handle load callback
                handleLoad(me.name);
            };

            /**
             * Internal handler, that wraps external handleFail
             */
            var _handleFail = function () {
                var me = this;

                //remove handler after call
                me.removeEventListener('load', _handleFail);

                //remove src from loading list
                loading.removeAt(me.name);

                //handle load callback
                handleFail(me.name);
            };

            return me;
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
        function List(label) {
            var me = this;

            /**
             * Names storage
             *
             * @type {xs.core.Collection}
             */
            var list = new xs.core.Collection();

            /**
             * Store list name
             *
             * @type {String}
             */
            var listName = label;

            /**
             * Adds name to list
             *
             * @method add
             *
             * @param {String} name added name
             *
             * @chainable
             */
            me.add = function (name) {
                var me = this;

                xs.log('xs.core.Loader::' + listName + '::add. Add name "' + name + '"');
                //assert that name is not in list
                xs.assert.not(me.has(name), '$list::add - class "$name" is already in $list list', {
                    $list: listName,
                    $name: name
                }, LoaderError);

                //add name to list
                list.add(name);

                return me;
            };

            /**
             * Checks whether list has name
             *
             * @param {String} name verified name
             *
             * @return {Boolean}
             */
            me.has = function (name) {

                return list.has(name);
            };

            /**
             * Deletes name from list
             *
             * @method remove
             *
             * @param {String} name removed name
             *
             * @chainable
             */
            me.remove = function (name) {
                var me = this;

                xs.log('xs.core.Loader::' + listName + '::remove. Delete name "' + name + '"');
                //assert that name is in list
                xs.assert.ok(me.has(name), '$list::remove - class "$name" is not in $list list', {
                    $list: listName,
                    $name: name
                }, LoaderError);

                //remove name from list
                list.remove(name);

                return me;
            };
        }

        return me;
    })();

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
        this.message = 'xs.core.Loader::' + message;
    }

    LoaderError.prototype = new Error();

    xs.extend(xs, {
        require: xs.Loader.require
    });
})(window, 'xs');