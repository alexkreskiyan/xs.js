/**
 * Mime types' common groups
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.transport.MimeGroup
 *
 * @extends xs.enum.Base
 */
xs.define(xs.Enum, 'xs.transport.MimeGroup', {
    Application: 'application', //internal format of some software
    Audio: 'audio', //audio format
    Image: 'image', //image format
    Message: 'message', //message
    Model: 'model', //3d models
    Multipart: 'multipart', //multiparted data
    Text: 'text', //text data
    Video: 'video', //video format
    ApplicationVnd: 'vnd', //vendor format
    ApplicationX: 'x', //non-standart application formats
    ApplicationXPcks: 'x-pcks' //public key cryptography standarts' files
});