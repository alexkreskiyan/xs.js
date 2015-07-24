/**
 * Enum, that specifies response status codes' groups
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @private
 *
 * @class xs.transport.xhr.Status
 */
xs.define(xs.Enum, 'xs.transport.xhr.StatusGroup', {
    Information: 100,
    Ok: 200,
    Redirect: 300,
    ClientError: 400,
    ServerError: 500
});