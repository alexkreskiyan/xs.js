/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function ( root, ns ) {

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
         * @param {Function} callback successful load callback
         */
        me.require = function ( name, callback ) {
            var me = this;
            xs.log('xs.Loader::require. Acquired:', name);

            //init loaded classes list
            var loadList = _getLoadList.call(me, xs.isArray(name) ? name : [name]);
            xs.log('xs.Loader::require. LoadList:', loadList);

            //if list is empty - handle callback
            if ( !xs.size(loadList) ) {
                xs.log('xs.Loader::require. LoadList is empty. Run callback');
                callback();

                return;
            }

            xs.log('xs.Loader::require. Add loadList to resolver');
            //add loadList to resolver
            resolver.add(loadList, callback);

            xs.log('xs.Loader::require. Add each of loadList to loader');
            //add each of loadList to loader
            xs.each(loadList, function ( path ) {
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
         * @return {String[]} list of classes, that have to be loaded
         *
         * @throws {Error} Error is thrown, when:
         *
         * - class name is not string
         * - class name has incorrect format
         * - class was already attempted to load, but load failed - error occurred
         */
        function _getLoadList ( classes ) {
            var me = this;

            /**
             * Load list
             *
             * @ignore
             *
             * @type {Object}
             */
            var loadList = {};

            xs.log('xs.Loader::getLoadList. Processing classes', classes);
            //process loaded and missing classes
            xs.each(classes, function ( name ) {
                //check, that name is string
                if ( !xs.isString(name) ) {
                    throw new LoaderError('loaded class name must be a string');
                }

                //check, that name matches regular expression
                if ( !nameRe.test(name) ) {
                    throw new LoaderError('loaded class name has incorrect format');
                }

                //resolve name with paths
                var path = me.paths.resolve(name);

                xs.log('xs.Loader::getLoadList. Resolved class "' + name + '" as path"' + path + '"');
                //initial suggestion is that class is not loaded yet
                loadList[path] = false;

                xs.log('xs.Loader::getLoadList. Check path "' + path + '"');
                //if the class is already loaded - mark that in checklist
                if ( loaded.has(path) ) {
                    xs.log('xs.Loader::getLoadList. Path "' + path + '" is already loaded');
                    loadList[path] = true;
                }

                //if the class was already attempted to load, but load failed - error occurred
                if ( failed.has(path) ) {
                    throw new LoaderError('failed loading url "' + path + '"');
                }
            });

            xs.log('xs.Loader::getLoadList. Result loadList:', loadList);

            //return names of not loaded classes
            return xs.keys(xs.findAll(loadList, function ( state ) {

                return !state;
            }));
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
        function _handleLoad ( path ) {
            xs.log('xs.Loader::handleLoad. Path "' + path + '" loaded');
            //add loaded path
            loaded.add(path);

            //resolve ready awaiting items
            resolver.handle(path);
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
        function _handleFail ( path ) {
            xs.log('xs.Loader::handleFail. Path "' + path + '" failed');
            //add failed path
            failed.add(path);

            //throw load error
            throw new LoaderError('failed loading url "' + path + '"');
        }

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
             * Adds new awaiting item, consisting of loaded paths list and ready handler
             *
             * @method add
             *
             * @param {String[]} paths loaded paths
             * @param {Function} handler handler, that is called, when all paths are loaded
             */
            me.add = function ( paths, handler ) {
                xs.log('xs.Loader::resolver::add. Add paths ', paths);
                awaiting.push({
                    paths: paths,
                    handle: handler
                });
            };

            /**
             * Checks all awaiting items. Deletes path from each item's paths list. If paths list is empty - resolves item
             *
             * If any item from awaiting list has all paths' loaded, it's handler is called and item is removed
             *
             * @method handle
             *
             * @param {String} path
             */
            me.handle = function ( path ) {
                //find resolved items
                xs.log('xs.Loader::resolver::handler. Handle path "' + path + '"');
                var resolved = xs.findAll(awaiting, function ( item ) {
                    xs.log('xs.Loader::resolver::handler. Clean up item.paths', item.paths);
                    //item is resolved, if path delete succeeds (path was deleted) and paths are empty
                    return xs.delete(item.paths, path) && !item.paths.length;
                });

                xs.log('xs.Loader::resolver::handler. Handling items', resolved);

                //handle each resolved item
                xs.each(resolved, function ( item ) {
                    xs.delete(awaiting, item);
                    item.handle();
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
        var loader = new (function ( handleLoad, handleFail ) {
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
             */
            me.add = function ( path ) {

                xs.log('xs.Loader::loader::add. Add path "' + path + '"');
                //check that path was not added yet
                if ( me.has(path) ) {
                    throw new LoaderError('path "' + path + '" is already loading');
                }

                //register new path alias
                loading.push(path);

                //execute load
                _load(path);

                return this;
            };

            /**
             * Checks whether loader is loading file with given path
             *
             * @param {String} path verified path
             *
             * @returns {Boolean} whether loader is loading that path
             */
            me.has = function ( path ) {
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
            var _load = function ( path ) {
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
                //remove handler after call
                this.removeEventListener('load', _handleLoad);

                //delete src from loading list
                xs.delete(loading, this.path);

                //handle load callback
                handleLoad(this.path);
            };

            /**
             * Internal handler, that wraps external handleFail
             */
            var _handleFail = function () {
                //remove handler after call
                this.removeEventListener('load', _handleFail);

                //delete src from loading list
                xs.delete(loading, this.path);

                //handle load callback
                handleFail(this.path);
            };
        })(_handleLoad, _handleFail);

        /**
         * Internal paths class
         *
         * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
         *
         * @class xs.Loader.paths
         *
         * @singleton
         */
        me.paths = new (function () {
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
            me.add = function ( alias, path ) {
                //single alias style
                if ( arguments.length > 1 ) {

                    //check that alias was not defined yet
                    if ( me.has(alias) ) {
                        throw new LoaderError('alias "' + alias + '" is already registered');
                    }

                    //check that path is string
                    if ( !xs.isString(path) ) {
                        throw new LoaderError('path must be a string');
                    }

                    //register new path alias
                    paths[alias] = path;

                    return this;
                }

                //check that pairs are given as list
                if ( !xs.isObject(alias) ) {
                    throw new LoaderError('aliases list has incorrect format');
                }

                //add each path
                xs.each(alias, function ( path, alias ) {
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
            me.has = function ( alias ) {
                //check, that alias is string
                if ( !xs.isString(alias) ) {
                    throw new LoaderError('alias must be a string');
                }

                //check, that alias matches regular expression
                if ( !nameRe.test(alias) ) {
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
            me.delete = function ( alias ) {
                //single alias style
                if ( !xs.isArray(alias) ) {

                    //check that alias is registered
                    if ( !me.has(alias) ) {
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
            me.resolve = function ( name ) {
                //throw LoaderError if name is not string
                if ( !xs.isString(name) ) {
                    throw new LoaderError('class name must be a string');
                }

                //check that name matches regular expression
                if ( !nameRe.test(name) ) {
                    throw new LoaderError('class name has incorrect format');
                }

                //most suitable alias for name
                var nameAlias = '';
                //path of most suitable alias
                var namePath = '';

                //iterate over all paths to find most suitable alias
                xs.each(paths, function ( path, alias ) {
                    //update current, if name starts from alias + dot and alias length if longer, than current
                    if ( name.indexOf(alias + '.') === 0 && alias.length > nameAlias.length ) {
                        nameAlias = alias;
                        namePath = path;
                    }
                });

                //if alias not found - return name, where dots are replaced with slashes
                if ( !nameAlias ) {

                    return name.split('.').join('/') + ext;
                }

                //return path joined with rest of name by / and suffix added
                return namePath + '/' + name.substring(nameAlias.length + 1).split('.').join('/') + ext;
            };
        });

        /**
         * Internal list class
         *
         * @ignore
         *
         * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
         *
         * @class List
         */
        function List ( name ) {
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
            me.add = function ( path ) {
                var me = this;

                xs.log('xs.Loader::' + name + '::add. Add path "' + path + '"');
                //check that path is not in list
                if ( me.has(path) ) {
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
            me.has = function ( path ) {

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
            me.delete = function ( path ) {
                var me = this;

                xs.log('xs.Loader::' + name + '::delete. Delete path "' + path + '"');
                //check that path is in list
                if ( !me.has(path) ) {
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
        function LoaderError ( message ) {
            this.message = 'xs.Loader :: ' + message;
        }

        LoaderError.prototype = new Error();
    });
})(window, 'xs');