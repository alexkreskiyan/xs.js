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

        xs.log('xs.class.preprocessors.namespace');
        var namespace = (xs.isString(descriptor.namespace) && descriptor.namespace.length) ? descriptor.namespace : undefined;
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
})(window, 'xs');