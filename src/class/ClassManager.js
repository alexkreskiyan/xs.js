/**
 This file is core of xs.js 0.1

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
'use strict';
(function (root, ns) {

    //framework shorthand
    var xs = root[ns];

    xs.ClassManager = new (function () {

        var storage = {};

        var Manager = {};

        var define = function (name, data, createdFn) {
            if (defined(name)) {
                return;
            }

            if (xs.isFunction(data)) {
                data = data();
            } else if (!xs.isObject(data)) {
                data = data || {};
            }
            xs.isFunction(createdFn) || (createdFn = xs.emptyFn);

            data.label = name;
            xs.Class(data, function (Class, data, hooks) {
                set(name, Class);
                createdFn(Class, data, hooks);
            });
        };
        var undefine = function (name) {
            if (!defined(name)) {
                return;
            }
            var namespace = getNamespace(root, getNamespaceName(name));
            delete namespace[name];
            delete storage[name];
        };
        var defined = function (name) {
            return storage.hasOwnProperty(name);
        };
        var get = function (name) {
            return storage.hasOwnProperty(name) ? storage[name] : false;
        };
        var set = function (name, Class) {
            var label = getClassName(name);
            //create namespace for class
            var namespace = createNamespace(root, getNamespaceName(name));
            storage[name] = namespace[label] = Class;
            Class.label = name;
        };
        var getName = function (object) {
            //if instance
            if (object.self) {
                return object.self.label;
                //if class
            } else if (object.label) {
                return object.label;
            } else {
                return undefined;
            }
        };
        var getClassName = function (name) {
            return name.split('.').slice(-1).join('.');
        };
        var getNamespaceName = function (name) {
            return name.split('.').slice(0, -1).join('.');
        };
        var getNamespace = function (root, namespace) {
            //explode name to parts
            var names = namespace.split('.');
            //get parent name part
            var name = names.shift();
            //downcall if not leave
            if (names.length) {
                //downcall
                return getNamespace(root[name], names.join('.'));
            } else {
                return root[name];
            }
        };
        var createNamespace = function (root, namespace) {
            //explode name to parts
            var names = namespace.split('.');
            //get parent name part
            var name = names.shift();
            //create namespace if doesn't exist
            xs.isFunction(root[name]) || xs.isObject(root[name]) || (root[name] = {});
            //downcall if not leave
            if (names.length) {
                //downcall
                return createNamespace(root[name], names.join('.'));
            } else {
                return root[name];
            }
        };
        var deleteNamespace = function (root, namespace) {
            //explode name to parts
            var names = namespace.split('.');
            //get parent name part
            var name = names.shift();
            //downcall if not leave
            if (names.length) {
                //downcall
                deleteNamespace(root[namespace], names.join('.'));
            }
            //create namespace if doesn't exist
            delete root[name];
        };
        var createNamespaces = function () {
            var namespaces = xs.Array.union(xs.Array.clone(arguments));
            xs.Array.each(namespaces, function (namespace) {
                createNamespace(root, namespace);
            });
        };
        var create = function (name) {
            var Class,
                instance;
            if (!defined(name)) {
                throw 'class "' + name + '" doesn\'t exist';
            }

            //create instance
            Class = get(name);
            instance = new Class(xs.Array.clone(arguments).slice(1));

            //return created instance
            return instance;
        };

        xs.extend(Manager, {
            define: define,
            defined: defined,
            undefine: undefine,
            get: get,
            set: set,
            getName: getName,
            getClassName: getClassName,
            getNamespaceName: getNamespaceName,
            getNamespace: function (namespace) {
                return getNamespace(root, namespace);
            },
            createNamespace: function (namespace) {
                return createNamespace(root, namespace);
            },
            deleteNamespace: function (namespace) {
                return deleteNamespace(root, namespace);
            },
            createNamespaces: createNamespaces,
            create: create
        });
        return Manager;
    });
    xs.extend(xs, {
        define: xs.ClassManager.define,
        defined: xs.ClassManager.defined,
        undefine: xs.ClassManager.undefine,
        getClass: xs.ClassManager.get,
        getClassName: xs.ClassManager.getName,
        create: xs.ClassManager.create
    })
})(window, 'xs');