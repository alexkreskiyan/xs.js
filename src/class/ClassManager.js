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
     * xs.ClassManager is core class, that is used to manage created classes
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class xs.ClassManager
     *
     * @singleton
     */
    xs.ClassManager = new (function () {
        var me = this;

        /**
         * Store of all registered classes
         *
         * @private
         *
         * @property registry
         *
         * @type {xs.core.Collection}
         */
        var registry = new xs.core.Collection;

        /**
         * Checks whether class with given name is already defined by ClassManager
         *
         * For example:
         *
         *     console.log(xs.ClassManager.has('xs.myClass')); // false
         *
         * @method has
         *
         * @param {String} name verified name
         *
         * @return {Boolean} verification result
         */
        var _has = me.has = function (name) {

            return registry.hasKey(name);
        };

        /**
         * Returns class from registry by name, or undefined if no class registered
         *
         * For example:
         *
         *      xs.ClassManager.get('xs.myClass');
         *
         * @method get
         *
         * @param {String} name class name
         *
         * @return {Function|undefined} class by name or undefined
         */
        me.get = function (name) {

            return registry.at(name);
        };

        /**
         * Registers class in registry with given name. If class with given name is already defined - respective
         * error is thrown. Internally:
         *
         * - label is assigned for class
         * - namespace is created if not defined
         * - class is saved in namespace
         * - class is saved in registry with name
         *
         * For example:
         *
         *     var Class = xs.Class.create(function() {
         *         return {};
         *     });
         *     xs.ClassManager.add('xs.myClass', Class);
         *
         * @method add
         *
         * @param {String} name new class name
         * @param {Function} Class registered class
         *
         * @throws {Error} Error is thrown, when:
         *
         * - class with given name is already registered
         * - class is not function
         * - class is not extended from xs.Base
         */
        var _add = me.add = function (name, Class) {
            //throw error if trying to set defined
            if (_has(name)) {
                throw new ClassManagerError('class "' + name + '" is already defined');
            }

            //throw error if trying to add already added with other name
            if (registry.has(Class)) {
                throw new ClassManagerError('class "' + Class.label + '" can not be added as "' + name + '"');
            }

            //throw error if Class is not function
            if (!xs.isFunction(Class)) {
                throw new ClassManagerError('class "' + name + '" is not a function');
            }

            //assign real name as label
            Class.label = name;

            //get short name of Class
            var label = _getName(name);

            //get Class namespace by path
            var namespace = _namespace(root, _getPath(name));

            //save Class to namespace
            namespace[label] = Class;

            //save Class to registry
            registry.add(name, Class);

            //sync namespaces
            _syncNamespaces(namespace, 'add', label);
        };

        /**
         * Removes class, registered with given name from registry. If class with given name is not defined - respective
         * error is thrown. Internally:
         *
         * - label is removed for class
         * - namespace is created if not defined
         * - class is saved in namespace
         * - class is saved in registry with name
         *
         * For example:
         *
         *     //unset Class
         *     xs.ClassManager.remove('xs.myClass');
         *
         * @method remove
         *
         * @param {String} name name of unset Class
         *
         * @throws {Error} Error is thrown, when:
         *
         * - class with given name is not registered
         */
        me.remove = function (name) {
            //throw error if trying to unset undefined
            if (!_has(name)) {
                throw new ClassManagerError('class "' + name + '" is not defined');
            }

            //unset Class label
            delete registry.at(name).label;

            //get short name of Class
            var label = _getName(name);

            //get path of Class
            var path = _getPath(name);

            //get Class namespace by path
            var namespace = _namespace(root, path);

            //sync namespaces
            _syncNamespaces(namespace, 'remove', label);

            //unset Class from namespace
            delete namespace[label];

            //clean namespace
            _cleanNamespace(root, path);

            //remove Class from registry
            registry.removeAt(name);
        };

        /**
         * Creates class sample via {@link xs.Class#create xs.Class}. After that, when {@link xs.Class#preprocessors}
         * stack is processed, saves created class in internal registry with given name. If class with that name is already defined,
         * respective error is thrown.
         *
         * For example:
         *
         *     //define simple class
         *     xs.define('myClass', function (self, ns) {
         *         //here is Class descriptor returned
         *         return {
         *         };
         *     }, function(Class) {
         *         console.log('class', Class, 'created');
         *     );
         *
         * @method define
         *
         * @param {String} name name of created class
         * @param {Function} descFn descriptor function. Is called with 2 params:
         *
         * - self. Created class instance
         * - ns. namespace object, where namespace references are placed
         *
         * @param {Function} createdFn class creation callback. Is called after
         * {@link xs.Class#preprocessors preprocessors} stack is processed. When called, created class is passed as param
         *
         * @return {Function} created Class
         *
         * @throws {Error} Error is thrown, when:
         *
         * - class with given name is already registered
         */
        me.define = function (name, descFn, createdFn) {
            //create Class and start it's processing
            var Class = xs.Class.create(descFn, createdFn);

            //here class namespace is evaluated. Evaluate real name of class
            name = Class.descriptor.resolveName(name);

            //throw error if trying to redefine
            if (_has(name)) {
                throw new ClassManagerError('class "' + name + '" is already defined');
            }

            //save Class in registry by name
            _add(name, Class);

            return Class;
        };

        /**
         * Returns short name of class by full name
         *
         * For example:
         *
         *     _getName('xs.module.my.Class'); //Class
         *
         * @ignore
         *
         * @method getName
         *
         * @param {String} name class name
         *
         * @return {String} short name
         */
        var _getName = function (name) {

            return name.split('.').slice(-1).join('.');
        };

        /**
         * Returns class path by full name
         *
         * For example:
         *
         *     _getPath('xs.module.my.Class'); //xs.module.my
         *
         * @ignore
         *
         * @method getPath
         *
         * @param {String} name class name
         *
         * @return {String} class path
         */
        var _getPath = function (name) {

            return name.split('.').slice(0, -1).join('.');
        };

        /**
         * Returns namespace in root by given full name. If any part does not exist, it is created
         *
         * For example:
         *
         *     var namespace = _namespace(window, 'xs.module.my'); //returns window.xs.module.my reference
         *
         * @ignore
         *
         * @method namespace
         *
         * @param {Object|Function} root namespace relative root
         * @param {String} path relative path to root
         *
         * @return {Object|Function} namespace for given path
         */
        var _namespace = function (root, path) {
            //use root if no path
            if (!path) {
                return root;
            }

            //explode name to parts
            var parts = path.split('.');

            //get first path's part
            var part = parts.shift();

            //create namespace if missing
            if (!xs.isFunction(root[part]) && !xs.isObject(root[part])) {
                root[part] = {};
            }

            //process down or return
            if (parts.length) {

                return _namespace(root[part], parts.join('.'));
            }

            return root[part];
        };

        /**
         * Clears all empty namespaces from namespace, specified by name down to given root
         *
         * For example:
         *
         *     _cleanNamespace(window, 'xs.module.my');
         *
         * @ignore
         *
         * @method cleanNamespace
         *
         * @param {Object|Function} root namespace relative root
         * @param {String} path relative path to root
         */
        var _cleanNamespace = function (root, path) {
            //return if path is empty
            if (!path) {
                return;
            }

            //explode name to parts
            var parts = path.split('.');

            //get last path's part
            var part = parts.pop();

            //set path to parent
            path = parts.join('.');

            //get parent namespace
            var namespace = _namespace(root, path);

            //remove namespace if empty
            if (xs.isEmpty(namespace[part])) {

                //remove empty namespace
                delete namespace[part];

                //try to clean parent
                _cleanNamespace(root, path);
            }
        };

        /**
         * Updates internal namespaces of all classes, registered in namespace
         *
         * For example:
         *
         *     _syncNamespaces(window, 'add', 'Demo');
         *
         * @ignore
         *
         * @method syncNamespaces
         *
         * @param {Object|Function} namespace synchronized namespace
         * @param {String} operation operation name
         * @param {String} name name of changed class
         */
        var _syncNamespaces = function (namespace, operation, name) {
            var classes = new xs.core.Collection(namespace).find(function (value) {
                return xs.isFunction(value) && xs.isObject(value.namespace);
            }, xs.core.Collection.ALL);
            var changedClass = classes.at(name);

            //add new class to all namespaces
            if (operation == 'add') {
                //add all classes to new class' namespace
                classes.each(function (Class, name) {
                    changedClass.namespace[name] = Class;
                });

                //add new class to all namespaces
                classes.each(function (Class) {
                    Class.namespace[name] = classes.at(name);
                });
            } else if (operation == 'remove') {
                //empty old class' namespace
                Object.keys(changedClass.namespace).forEach(function (key) {
                    delete changedClass.namespace[key];
                });

                //remove old class from all namespaces
                classes.each(function (Class) {
                    delete Class.namespace[name];
                });
            }
        };
    });

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class ClassManagerError
     */
    function ClassManagerError(message) {
        this.message = 'xs.ClassManager :: ' + message;
    }

    ClassManagerError.prototype = new Error();

    xs.extend(xs, {
        define: xs.ClassManager.define
    });
})(window, 'xs');