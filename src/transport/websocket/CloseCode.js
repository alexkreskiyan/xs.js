/**
 * Enum, that specifies web socket connection close codes
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @private
 *
 * @class xs.transport.xhr.State
 */
xs.define(xs.Enum, 'xs.transport.websocket.CloseCode', {
    Normal: 1000,
    GoingAway: 1001,
    ProtocolError: 1002,
    Unsupported: 1003,
    NoStatus: 1005,
    Abort: 1006,
    BadData: 1007,
    PolicyViolation: 1008,
    TooLargeData: 1009,
    ExtensionsMegotiationFailed: 1010,
    ServerHandlingFailed: 1011,
    TLSHandshakeFailed: 1015
});