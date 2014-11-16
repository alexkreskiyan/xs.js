/*!
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact:  http://annium.com/contact

 GNU General Public License Usage
 This file may be used under the terms of the GNU General Public License version 3.0 as
 published by the Free Software Foundation and appearing in the file LICENSE included in the
 packaging of this file.

 Please review the following information to ensure the GNU General Public License version 3.0
 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

 If you are unsure which license is appropriate for your use, please contact the sales department
 at http://annium.com/contact.

 */
(function (root, ns) {

    //framework shorthand
    var xs = root[ns];

    /**
     * xs.ClassManager is core class, that is used to manage created classes
     *
     * @class xs.ClassManager
     *
     * @author Alex Kreskiyan <brutalllord@gmail.com>
     *
     * @singleton
     */
    xs.ClassManager = (function () {
        var me = {};
        var registry = {};

        /**
         * Checks whether class with given name is already defined by ClassManager
         *
         * For example:
         *
         *     console.log(xs.ClassManager.has('xs.myClass')); // false
         *
         * @method has
         *
         * @param {string} name verified name
         *
         * @return {boolean} verification result
         */
        var _has = me.has = function (name) {
            return xs.hasKey(registry, name);
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
         * @param {string} name class name
         *
         * @return {Function|undefined} class by name or undefined
         */
        me.get = function (name) {
            return registry[name];
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
         * @param {string} name new class name
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
                throw new Error('Class "' + name + '" is already defined');
            }

            //throw error if Class is not function
            if (!xs.isFunction(Class)) {
                throw new Error('Class "' + name + '" is not a function');
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
            registry[name] = Class;
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
         *     xs.ClassManager.delete('xs.myClass');
         *
         * @method delete
         *
         * @param {string} name name of unset Class
         *
         * @throws {Error} Error is thrown, when:
         *
         * - class with given name is not registered
         */
        me.delete = function (name) {
            //throw error if trying to unset undefined
            if (!_has(name)) {
                throw new Error('Class "' + name + '" is not defined');
            }

            //unset Class label
            delete registry[name].label;

            //get short name of Class
            var label = _getName(name);

            var path = _getPath(name);
            //get Class namespace by path
            var namespace = _namespace(root, path);

            //unset Class from namespace
            delete namespace[label];

            //clean namespace
            _cleanNamespace(root, path);

            //unset Class from registry
            delete registry[name];
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
         * @param {string} name name of created class
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
            //throw error if trying to redefine
            if (_has(name)) {
                throw new Error('Class "' + name + '" is already defined');
            }

            //create Class and save it to registry
            var Class = xs.Class.create(descFn, createdFn);

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
         * @param {string} name class name
         *
         * @return {string} short name
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
         * @param {string} name class name
         *
         * @return {string} class path
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
         * @param {string} name relative name to root
         *
         * @return {Object|Function} namespace for given name
         */
        var _namespace = function (root, name) {
            //explode name to parts
            var parts = name.split('.');

            //get name parent part
            var part = parts.shift();

            //create namespace if missing
            if (!xs.isFunction(root[part]) && !xs.isObject(root[part])) {
                root[part] = {};
            }

            //process down or return
            if (parts.length) {

                return _namespace(root[part], parts.join('.'));
            } else {

                return root[part];
            }
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
         * @param {string} name relative name to root
         */
        var _cleanNamespace = function (root, name) {

        };

        return me;
    })();
    xs.extend(xs, {
        define: xs.ClassManager.define
    });
})(window, 'xs');