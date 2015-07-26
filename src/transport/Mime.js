/**
 * Mime types
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.transport.Mime
 *
 * @extends xs.enum.Base
 */
xs.define(xs.Enum, 'xs.transport.Mime', {
    ApplicationAtom: 'application/atom+xml', //Atom
    ApplicationJson: 'application/json', //JSON
    ApplicationJavascript: 'application/javascript', //JavaScript
    ApplicationOctetStream: 'application/octet-stream', //binary file without specified format
    ApplicationOgg: 'application/ogg', //Ogg
    ApplicationPdf: 'application/pdf', //Portable Document Format, PDF
    ApplicationPostScript: 'application/postscript', //PostScript
    ApplicationSoap: 'application/soap+xml', //SOAP
    ApplicationXhtml: 'application/xhtml+xml', //XHTML
    ApplicationXmlDtd: 'application/xml-dtd', //DTD
    ApplicationZip: 'application/zip', //ZIP
    AudioMp4: 'audio/mp4', //MP4
    AudioMpeg: 'audio/mpeg', //MP3 or other MPEG
    AudioOgg: 'audio/ogg', //Ogg Vorbis, Speex, Flac or other audio
    AudioVorbis: 'audio/vorbis', //Vorbis
    AudioVma: 'audio/x-ms-wma',//Windows Media Audio
    AudioWav: 'audio/vnd.wave', //WAV
    AudioWebm: 'audio/webm', //WebM
    ImageGif: 'image/gif', //GIF
    ImageJpeg: 'image/jpeg', //JPEG
    ImagePng: 'image/png', //Portable Network Graphics, PNG
    ImageSvg: 'image/svg+xml', //SVG
    ImageTiff: 'image/tiff', //TIFF
    ImageIco: 'image/vnd.microsoft.icon', //ICO
    ImageBmp: 'image/vnd.wap.wbmp', //BMP
    MessageHttp: 'message/http', //http message
    MessageImdn: 'message/imdn+xml', //IMDN
    MessagePartial: 'message/partial', //E-mail
    ModelExample: 'model/example', //example model
    ModelIges: 'model/iges', //IGS files, IGES files
    ModelMesh: 'model/mesh', //MSH files, MESH files, SILO files
    ModelVrml: 'model/vrml', //WRL files, VRML files
    ModelX3DBinary: 'model/x3d+binary', //X3D ISO 3d computer graphics standart, X3DB files
    ModelX3DVrml: 'model/x3d+vrml', //X3D ISO 3d computer graphics standart, X3DV VRML files
    ModelX3DXml: 'model/x3d+xml', //X3D ISO 3d computer graphics standart, X3D XML files
    MultipartMixed: 'multipart/mixed', //MIME E-mail
    MultipartAlternative: 'multipart/alternative', //MIME E-mail
    MultipartRelated: 'multipart/related', //MIME E-mail, MHTML (HTML mail)
    MultipartFormData: 'multipart/form-data', //MIME Webform
    MultipartSigned: 'multipart/signed',
    MultipartEncrypted: 'multipart/encrypted',
    TextCmd: 'text/cmd', //commands
    TextCss: 'text/css', //Cascading Style Sheets, CSS
    TextCsv: 'text/csv', //CSV
    TextHtml: 'text/html', //HTML
    TextPlain: 'text/plain', //text data
    TextXml: 'text/xml', //Extensible Markup Language, XML
    VideoMpeg: 'video/mpeg', //MPEG-1
    VideoMp4: 'video/mp4', //MP4
    VideoOgg: 'video/ogg', //Ogg Theora or other video
    VideoQuicktime: 'video/quicktime', //QuickTime
    VideoWebm: 'video/webm', //WebM
    VideoWmv: 'video/x-ms-wmv', //Windows Media Video
    VideoFlv: 'video/x-flv', //FLV
    ApplicationVndOpenDocumentText: 'application/vnd.oasis.opendocument.text', //OpenDocument text
    ApplicationVndOpenDocumentSpreadSheet: 'application/vnd.oasis.opendocument.spreadsheet', //OpenDocument spreadsheet
    ApplicationVndOpenDocumentPresentation: 'application/vnd.oasis.opendocument.presentation', //OpenDocument presentation
    ApplicationVndOpenDocumentGraphics: 'application/vnd.oasis.opendocument.graphics', //OpenDocument graphics
    ApplicationVndOfficeDocumentSpreadSheetSheet: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', //office spreadsheet document
    ApplicationVndOfficeDocumentSpreadSheetTemplate: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template', //office spreadsheet template
    ApplicationVndOfficeDocumentPresentationSlideShow: 'application/vnd.openxmlformats-officedocument.presentationml.slideshow', //office presentation slideshow
    ApplicationVndOfficeDocumentPresentationPresentation: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', //office presentation
    ApplicationVndOfficeDocumentPresentationSlide: 'application/vnd.openxmlformats-officedocument.presentationml.slide', //office presentation slide
    ApplicationVndOfficeDocumentPresentationTemplate: 'application/vnd.openxmlformats-officedocument.presentationml.template', //office presentation template
    ApplicationVndOfficeDocumentWordDocument: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', //office word document
    ApplicationVndOfficeDocumentWordTemplate: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template', //office word template
    ApplicationVndMicrosoftExcel: 'application/vnd.ms-excel', //Microsoft Excel files
    ApplicationVndMicrosoftPowerPoint: 'application/vnd.ms-powerpoint', //Microsoft Powerpoint files
    ApplicationVndMicrosoftWord: 'application/msword', //Microsoft Word files
    ApplicationVndMozillaXul: 'application/vnd.mozilla.xul+xml', //Mozilla XUL files
    ApplicationVndGoogleEarthKml: 'application/vnd.google-earth.kml+xml', //KML files
    ApplicationXBittorent: 'application/x-bittorrent ', //BitTorrent
    ApplicationXDvi: 'application/x-dvi', //DVI
    ApplicationXGzip: 'application/x-gzip', //Gzip
    ApplicationXJavascript: 'application/x-javascript',
    ApplicationXTtf: 'application/x-font-ttf', //TrueType
    ApplicationXFlash: 'application/x-shockwave-flash', //Adobe Flash
    ApplicationXRar: 'application/x-rar-compressed', //RAR
    ApplicationXTar: 'application/x-tar', //Tarball
    ApplicationXFormUrlEncoded: 'application/x-www-form-urlencoded', //Form Encoded Data
    ApplicationXWoff: 'application/x-woff', //Web Open Font Format
    ApplicationXPkcs12: 'application/x-pkcs12', //p12 files, pfx files
    ApplicationXPkcs7Certificate: 'application/x-pkcs7-certificates', //p7b files, spc files
    ApplicationXPkcs7RequestResponse: 'application/x-pkcs7-certreqresp', //p7r files
    ApplicationXPkcs7Mime: 'application/x-pkcs7-mime', //p7c files, p7m files
    ApplicationXPkcs7Signature: 'application/x-pkcs7-signature' //p7s files
});