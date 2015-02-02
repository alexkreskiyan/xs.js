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

    var logger = new xs.log.Logger('xs.class.preprocessors.namespace');

    /**
     * Directive namespace
     *
     * Is used to work with class namespace.
     * Allows to setup class' namespace before it is registered by contracts manager and processed by other preprocessors.
     * Actually, allows to specify namespace, class is defined within, to use relative names of other classes.
     *
     * Namespace directive is optional. If not specified, global namespace is used
     *
     * For example:
     *
     *     xs.define(xs.Class, 'ns.Customer', function(self) { //relative path too. Actually, class will be declared as 'app.start.login.SystemUser'
     *
     *         'use strict';
     *
     *         this.namespace = 'app.start.login'; //relative path root namespace. Suggest, that it represents login form
     *
     *         this.imports = ['ns.store.Users']; //Some used store. Resolved globally as 'app.start.login.store.Users'.
     *                                            //Perhaps, it is store of Users, that have accessed to system earlier from this machine
     *
     *         this.extends = 'ns.User'; //Extended base model class. Resolved as app.start.login.User
     *
     *         this.mixins.CanBuy = 'ns.mixins.CanBuy'; //Name of some used mixin. Perhaps, mixin 'app.start.login.mixins.CanBuy'
     *                                                  //allows Customer to buy something
     *
     *         this.implements = ['ns.IUser'];   //Name of implemented interface, app.start.login.IUser
     *
     *     });
     *
     * @member xs.class.preprocessors
     *
     * @private
     *
     * @abstract
     *
     * @property namespace
     */
    xs.class.preprocessors.add('namespace', function () {

        return true;
    }, function (Class, descriptor, dependencies, ready) {

        logger.trace('');
        var namespace;

        //if namespace specified, it must be valid
        if (xs.isDefined(descriptor.namespace)) {
            xs.assert.ok(xs.ContractsManager.isName(descriptor.namespace), 'given namespace "$namespace" is not a valid name', {
                $namespace: descriptor.namespace
            }, NamespaceError);

            namespace = descriptor.namespace;
        }

        //save namespace
        Class.descriptor.resolveName = function (path) {

            //simply return path, if namespace is empty
            if (!namespace) {

                return path;
            }

            //if name starts from namespace - resolve it
            if (path.substring(0, 3) === 'ns.') {

                return namespace + path.substring(2);
            }

            //else - simply return path
            return path;
        };

        //continue on next tick to allow ContractsManager check class name
        xs.nextTick(ready);

        //return false to sign async processor
        return false;
    });

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class NamespaceError
     */
    function NamespaceError(message) {
        this.message = 'xs.class.preprocessors.namespace::' + message;
    }

    NamespaceError.prototype = new Error();
})(window, 'xs');