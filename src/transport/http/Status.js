/**
 * Enum, that specifies response status codes
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @private
 *
 * @class xs.transport.http.Status
 */
xs.define(xs.Enum, 'xs.transport.http.Status', {
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NoContent: 204,
    BadRequest: 400,
    Unauthorized: 401,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    Conflict: 409,
    RequestEntityTooLarge: 413,
    RequestUriTooLarge: 414,
    UnsupportedMediaType: 415,
    RequestedRangeNotSatisfiable: 416,
    ServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504
});