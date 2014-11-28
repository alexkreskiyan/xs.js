/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
/**
 * @class xs.Loader
 * @singleton
 * @markdown

 configs:
 - cache
 - cacheParam
 - preserveScripts - ??
 - scriptChainDelay - ?? may be usefull to add always
 - scriptCharset - ?? Is it useful?

 paths:
 - add
 - has
 - delete
 - get (returns path by classname) if no variants specified/ returns path from current folder

 params:
 - queue - loading list
 - history - loaded classes list - will be private. Will have states:
 * loaded (file contains acquired class)
 * failed (load failed)
 * missing (file was loaded, but acquired class is missing in that file)

 methods:
 - require - main method, accepts:
 * names - class name or array of class names
 * callback - function, called when all those classes are loaded


 1. Load is async:
 - cls1 ... clsN
 - [cls1 ... clsN]
 : deferred
 3. xs.create => sync.load
 4. disableCache & disableCacheParam - global properties
 5. preserveScripts - leave scripts in document
 6. garbageCollect - prepare async script tag for garbage collection
 7. paths - classes paths
 8. scriptChainDelay
 9. scriptCharset

 static.history - history of loaded/loading classes???

 getPath - gets class path

 setPath - as to args, or config

 loadScript - loads script

 require - requires a set of classes

 syncRequire

 queue && refreshQueue

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
     * @author Alex Kreskiyan <brutalllord@gmail.com>
     *
     * @class xs.Loader
     *
     * @singleton
     */
    xs.Loader = new (function () {
        var me = this;

        /**
         * xs.Loader paths storage
         *
         * @author Alex Kreskiyan <brutalllord@gmail.com>
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
                        throw new Error('Alias "' + alias + '" is already registered in xs.Loader');
                    }

                    //check that path is string
                    if ( !xs.isString(path) ) {
                        throw new Error('xs.Loader path must be a string');
                    }

                    //register new path alias
                    paths[alias] = path;

                    return this;
                }

                //check that pairs are given as list
                if ( !xs.isObject(alias) ) {
                    throw new Error('Aliases list has incorrect format');
                }

                //add each path
                xs.each(alias, function ( path, alias ) {
                    me.add(alias, path);
                });

                return this;
            };

            //name matching regular expression
            var nameRe = /^[A-z_]{1}[A-z0-9_]*(?:\.{1}[A-z_]{1}[A-z0-9_]*)*$/;
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
                //throw Error if alias is not string
                if ( !xs.isString(alias) ) {
                    throw new Error('xs.Loader alias must be a string');
                }

                //check that alias matches regular expression
                if ( !nameRe.test(alias) ) {
                    throw new Error('xs.Loader alias is given incorrectly');
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
                        throw new Error('Alias "' + alias + '" is not registered in xs.Loader');
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
                //throw Error if name is not string
                if ( !xs.isString(name) ) {
                    throw new Error('xs.Loader name must be a string');
                }

                //check that name matches regular expression
                if ( !nameRe.test(name) ) {
                    throw new Error('xs.Loader name is given incorrectly');
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

        var queue = new (function () {

        })
        //        var callbacks = [];
        me.require = function ( name, callback ) {

        };
    });
})(window, 'xs');