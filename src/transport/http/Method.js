/**
 * Enum, that specifies request Http methods
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @private
 *
 * @class xs.transport.http.Method
 */
xs.define(xs.Enum, 'xs.transport.http.Method', {
    OPTIONS: 'OPTIONS',
    GET: 'GET',
    HEAD: 'HEAD',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
});