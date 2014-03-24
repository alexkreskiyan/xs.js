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
/**
 A Deferred is typically used within the body of a function that performs an
 asynchronous operation. When that operation succeeds, the Deferred should be
 resolved; if that operation fails, the Deferred should be rejected.

 Once a Deferred has been resolved or rejected, it is considered to be complete
 and subsequent calls to resolve() or reject() are ignored.

 Deferreds are the mechanism used to create new Promises. A Deferred has a
 single associated Promise that can be safely returned to external consumers
 to ensure they do not interfere with the resolution or rejection of the deferred
 operation.
 */
'use strict';

xs.define('xs.promise.Deferred', {
    requires: ['xs.promise.Resolver'],
    statics: {
        methods: {
            /**
             * Returns a new {@link xs.promise.Promise} that resolves immediately with the specified value.
             *
             * @param {*} value The resolved future value.
             * @return {xs.promise.Promise} Promise resolved with the specified value.
             */
            resolve: function (value) {
                var deferred;
                deferred = xs.create('xs.promise.Deferred');
                deferred.resolve(value);
                return deferred.promise;
            },
            /**
             * Returns a new {@link xs.promise.Promise} that rejects immediately with the specified reason.
             *
             * @param {Error} reason The rejection reason.
             * @return {xs.promise.Promise} Promise rejected with the specified reason.
             */
            reject: function (reason) {
                var deferred;
                deferred = xs.create('xs.promise.Deferred');
                deferred.reject(reason);
                return deferred.promise;
            }
        }
    },
    constructor: function () {
        this.resolver = xs.create('xs.promise.Resolver');
        this.promise = this.resolver.promise;
    },
    properties: {
        /**
         * @property {xs.promise.Promise}
         * The {@link xs.promise.Promise Promise} of a future value associated with this Deferred.
         */
        promise: null,
        /**
         * @property {xs.promise.Resolver}
         * internal resolver object
         */
        resolver: null
    },
    methods: {
        /**
         * Resolves this Deferred's {@link xs.promise.Promise Promise} with the specified value.
         *
         * @param {*} value The resolved future value.
         */
        resolve: function (value) {
            return this.resolver.resolve(value);
        },
        /**
         * Rejects this Deferred's {@link xs.promise.Promise Promise} with the specified reason.
         *
         * @param {Error} reason The rejection reason.
         */
        reject: function (reason) {
            return this.resolver.reject(reason);
        },
        /**
         * Updates progress for this Deferred's {@link xs.promise.Promise Promise}, if it is still pending.
         *
         * @param {*} progress The progress value.
         */
        progress: function (progress) {
            return this.resolver.progress(progress);
        }
    }
});