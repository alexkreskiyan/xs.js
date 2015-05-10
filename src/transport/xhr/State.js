/**
 * Enum, that specifies request states
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @private
 *
 * @class xs.transport.xhr.State
 */
xs.define(xs.Enum, 'xs.transport.xhr.State', {
    Unsent: 0x1,
    UploadStarted: 0x2,
    Uploading: 0x4,
    Uploaded: 0x8,
    HeadersReceived: 0x10,
    Loading: 0x20,
    Loaded: 0x40,
    Aborted: 0x80,
    Crashed: 0x100,
    TimedOut: 0x200
});