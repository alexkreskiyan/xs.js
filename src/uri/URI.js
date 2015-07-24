/**
 * Uri Object notation abstract class. Provides basics for all Uri scheme-specific implementations
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.uri.Uri
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Uri', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.uri';

    Class.abstract = true;

    /**
     * Regular expression for basic Uri parsing
     *
     * @ignore
     *
     * @type {RegExp}
     */
    var parseRe = /^(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/;

    /**
     * Uri object constructor
     *
     * @constructor
     *
     * @param {String} [uri] Uri, object is created from, or undefined, if starting from the beginning
     */
    Class.constructor = function (uri) {
        var me = this;

        //assert, that uri is either undefined or string
        self.assert.ok(!arguments.length || xs.isString(uri), 'constructor - given URI `$uri` is not a string', {
            $uri: uri
        });

        //convert undefined to empty string
        if (!uri) {
            uri = '';
        }

        //save raw parsing info
        var data = parseRe.exec(decodeURI(uri));

        self.assert.array(data, 'constructor - given string `$uri` is correct URI', {
            $uri: uri
        });

        me.private.raw = {
            scheme: data[ 1 ],
            namespace: data[ 2 ],
            path: data[ 3 ],
            query: data[ 4 ],
            hash: data[ 5 ]
        };
    };

});