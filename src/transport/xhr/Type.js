/**
 * Enum, that specifies response types
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @private
 *
 * @class xs.transport.xhr.Type
 */
xs.define(xs.Enum, 'xs.transport.xhr.Type', {
    Text: '',
    ArrayBuffer: 'arraybuffer',
    Blob: 'blob',
    Document: 'document',
    JSON: 'json'
});