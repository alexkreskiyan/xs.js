/**
 * Enum, that specifies web socket connection states
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @private
 *
 * @class xs.transport.xhr.State
 */
xs.define(xs.Enum, 'xs.transport.websocket.State', {
    Connecting: 0x1,
    Opened: 0x2,
    Closing: 0x4,
    Closed: 0x8
});