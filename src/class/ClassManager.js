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
     * Private internal stack class
     *
     * Stack is used to store ordered list of processors
     *
     * @class xs.ClassManager
     *
     * @singleton
     *
     * @private
     */
    xs.ClassManager = (function () {

        var registry = {};

        var defined = function (name) {
            return xs.hasKey(registry, name);
        };

        var define = function (name, descFn, createdFn) {
            //throw new Error if trying to redefine
            if (defined(name)) {
                throw new Error('Class "' + name + '" is already defined');
            }

            //createdFn is function anyway
            xs.isFunction(createdFn) || (createdFn = xs.emptyFn);

            //create Class and save it to registry
            xs.Class.create(descFn, function (Class) {

                //assign real name as label
                xs.const(Class, 'label', name);

                //save Class in registry by name
                set(name, Class);

                //call user-defined createdFn
                createdFn(Class);
            });
        };

        var unset = function (name) {
            //throw new Error if trying to unset undefined
            if (!defined(name)) {
                throw new Error('Class "' + name + '" is not defined');
            }

            //get short name of Class
            var label = getName(name);

            //get Class namespace by path
            var namespace = namespace(root, getPath(name));

            //unset Class from namespace
            delete namespace[label];

            //unset Class from registry
            delete registry[name];
        };

        //return Class from registry if defined
        var get = function (name) {
            return defined(name) ? registry[name] : undefined;
        };

        var set = function (name, Class) {
            //get short name of Class
            var label = getName(name);

            //get Class namespace by path
            var namespace = namespace(root, getPath(name));

            //save Class to namespace
            namespace[label] = Class;

            //save Class to registry
            registry[name] = Class;
        };

        var getName = function (name) {
            return name.split('.').slice(-1).join('.');
        };

        var getPath = function (name) {
            return name.split('.').slice(0, -1).join('.');
        };

        var namespace = function (root, name) {
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

                return namespace(root[part], parts.join('.'));
            } else {

                return root[part];
            }
        };

        var is = function (object, target) {
            //if object is equal to target - return true
            if (object === target) {

                return true;
            }

            //if target is constructor and object is it's instance - return true
            if (xs.isFunction(target) && object instanceof target) {

                return true;
            }

            //if target is string, try to compare object to Class which label is target
            if (xs.isString(target)) {
                return is(object, get(target));
            }

            //return false otherwise
            return false;
        };

        return {
            define:  define,
            defined: defined,
            unset:   unset,
            get:     get,
            is:      is
        }
    });
    xs.extend(xs, xs.ClassManager);
})(window, 'xs');