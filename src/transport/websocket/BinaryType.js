/**
 * Enum, that specifies supported web socket binary types
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @private
 *
 * @class xs.transport.xhr.State
 */
xs.define(xs.Enum, 'xs.transport.websocket.BinaryType', {
    ArrayBuffer: 'arraybuffer',
    Blob: 'blob'
});