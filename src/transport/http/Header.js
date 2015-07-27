/**
 * Mime types' common groups
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.transport.http.Header
 *
 * @extends xs.enum.Base
 */
xs.define(xs.Enum, 'xs.transport.http.Header', {
    /**
     * request header
     * list of allowed resource formats
     * Accept: text/plain
     */
    Accept: 'Accept',
    /**
     * request header
     * list of supported resource encodings
     * Accept-Charset: utf-8
     */
    AcceptCharset: 'Accept-Charset',
    /**
     * request header
     * list of supported entity encoding variants
     * Accept-Encoding: <compress | gzip | deflate | sdch | identity>
     */
    AcceptEncoding: 'Accept-Encoding',
    /**
     * request header
     * list of supported languages
     * Accept-Language: ru
     */
    AcceptLanguage: 'Accept-Language',
    /**
     * response header
     * list of supported range uints
     * Accept-Ranges: bytes
     */
    AcceptRanges: 'Accept-Ranges',
    /**
     * response header
     * resource last modification timeout in seconds
     */
    Age: 'Age',
    /**
     * response entity header
     * list of supported methods
     * Allow: OPTIONS, GET, HEAD
     */
    Allow: 'Allow',
    /**
     * response header
     * direction to other resource presentation abilities
     */
    Alternates: 'Alternates',
    /**
     * request header
     * authorization data
     * Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
     */
    Authorization: 'Authorization',
    /**
     * general header
     * main cache manipulation directives
     * Cache-Control: no-cache,
     * Cache-Control: no-store,
     * Cache-Control: max-age=3600,
     * Cache-Control: max-stale=0,
     * Cache-Control: min-fresh=0,
     * Cache-Control: no-transform,
     * Cache-Control: only-if-cached,
     * Cache-Control: cache-extension
     */
    CacheControl: 'Cache-Control',
    /**
     * general header
     * connection management data
     * example: Connection: close
     */
    Connection: 'Connection',
    /**
     * request and response header
     * defines entities' placement in message
     * Content-Disposition: form-data; name="MessageTitle",
     * Content-Disposition: form-data; name="AttachedFile1"; filename="photo-1.jpg"
     */
    ContentDisposition: 'Content-Disposition',
    /**
     * request and response entity header
     * defines entity encoding method
     */
    ContentEncoding: 'Content-Encoding',
    /**
     * request entity header
     * list of entity native language
     * Content-Language: en, ase, ru
     */
    ContentLanguage: 'Content-Language',
    /**
     * request entity header
     * entity size in octets
     * Content-Length: 1348
     */
    ContentLength: 'Content-Length',
    /**
     * request entity and response entity header
     * alternate entity content location
     */
    ContentLocation: 'Content-Location',
    /**
     * request entity and response entity header
     * md5-hash for entity content
     * Content-MD5: Q2hlY2sgSW50ZWdyaXR5IQ==
     */
    ContentMD5: 'Content-MD5',
    /**
     * request entity and response entity header
     * byte ranges of passed entity for given fragment
     * Content-Range: bytes 88080384-160993791/160993792
     */
    ContentRange: 'Content-Range',
    /**
     * request entity and response entity header
     * format and entity presentation type
     * Content-Type: text/html;charset=utf-8
     */
    ContentType: 'Content-Type',
    /**
     * request entity and response entity header
     * entity current version information
     */
    ContentVersion: 'Content-Version',
    /**
     * general header
     * response generation time
     * Date: Tue, 15 Nov 1994 08:12:31 GMT
     */
    Date: 'Date',
    /**
     * response and response entity header
     * unique tag of entity, used in caching
     * ETag: "56d-9989200-1132c580"
     */
    ETag: 'ETag',
    /**
     * request header
     * tells server, that client awaits additional action
     * Expect: 100-continue
     */
    Expect: 'Expect',
    /**
     * request and response entity header
     * date of expected entity expiration
     * Expires: Tue, 31 Jan 2012 15:02:53 GMT
     */
    Expires: 'Expires',
    /**
     * request header
     * email address of person in charge
     * From: user@example.com
     */
    From: 'From',
    /**
     * request header
     * domain name and port of requested resource; is required to verify virtual hosting
     * Host: ru.wikipedia.org
     */
    Host: 'Host',
    /**
     * request header
     * list of entity versions tags. method is executed if some of them exists
     * If-Match: "737060cd8c284d8af7ad3082f209582d"
     */
    IfMatch: 'If-Match',
    /**
     * request header
     * method is executed if entity was change since given date
     * If-Modified-Since: Sat, 29 Oct 1994 19:43:31 GMT
     */
    IfModifiedSince: 'If-Modified-Since',
    /**
     * request header
     * list of entity versions tags. method is executed if none of them exists
     * If-None-Match: "737060cd8c284d8af7ad3082f209582d"
     */
    IfNoneMatch: 'If-None-Match',
    /**
     * request header
     * list of entity versions tags or date for specified fragment
     * If-Range: "737060cd8c284d8af7ad3082f209582d"
     */
    IfRange: 'If-Range',
    /**
     * request header
     * method is executed if entity was not changed since given date
     * If-Unmodified-Since: Sat, 29 Oct 1994 19:43:31 GMT
     */
    IfUnmodifiedSince: 'If-Unmodified-Since',
    /**
     * request entity and response entity
     * entity last modification date
     */
    LastModified: 'Last-Modified',
    /**
     * request entity and response entity header
     * targets logically linked resource
     */
    Link: 'Link',
    /**
     * response header
     * uri, client must follow to or uri, that was created
     * Location: http://example.com/about.html#contacts
     */
    Location: 'Location',
    /**
     * request header
     * maximum allowed count of proxy forwards
     * Max-Forwards: 10
     */
    MaxForwards: 'Max-Forwards',
    /**
     * general header
     * mime version, that was used to form message
     */
    MimeVersion: 'MIME-Version',
    /**
     * general header
     * special operation options
     * Pragma: no-cache
     */
    Pragma: 'Pragma',
    /**
     * response header
     * proxy authentication params
     */
    ProxyAuthenticate: 'Proxy-Authenticate',
    /**
     * request header
     * proxy authorization params
     * Proxy-Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
     */
    ProxyAuthorization: 'Proxy-Authorization',
    /**
     * response header
     * list of allowed methods for whole server
     */
    Public: 'Public',
    /**
     * request header
     * byte range to request resource fragments
     * Range: bytes=50000-99999,250000-399999,500000-
     */
    Range: 'Range',
    /**
     * request header
     * resource uri, client came from to this resource
     * Referer: http://en.wikipedia.org/wiki/Main_Page
     */
    Referer: 'Referer',
    /**
     * response header
     * date or time interval to retry request after
     */
    RetryAfter: 'Retry-After',
    /**
     * response header
     * web server and it's components' names
     * Server: Apache/2.2.17 (Win32) PHP/5.3.5
     */
    Server: 'Server',
    /**
     * request entity and response entity header
     * entity title
     */
    Title: 'Title',
    /**
     * request header
     * list of extended coding methods
     * TE: trailers, deflate
     */
    TE: 'TE',
    /**
     * general header
     * list of fields, related to message encoding
     */
    Trailer: 'Trailer',
    /**
     * general header
     * list of encoding methods, that were applied to message
     * Transfer-Encoding: chunked
     */
    TransferEncoding: 'Transfer-Encoding',
    /**
     * general header
     * list of protocols, suggested by client. server returns one protocol
     * Upgrade: HTTP/2.0, SHTTP/1.3, IRC/6.9, RTA/x11
     */
    Upgrade: 'Upgrade',
    /**
     * request header
     * list of names and versions of client
     * User-Agent: Mozilla/5.0 (X11; Linux i686; rv:2.0.1) Gecko/20100101 Firefox/4.0.1
     */
    UserAgent: 'User-Agent',
    /**
     * response header
     * list of request's resource describing fields, that were payed attention to
     */
    Vary: 'Vary',
    /**
     * general header
     * list of protocol versions, proxy-servers' names and versions, that processed message
     * Via: 1.0 fred, 1.1 nowhere.com (Apache/1.1)
     */
    Via: 'Via',
    /**
     * general header
     * critical situation info: code, agent, message and date
     * Warning: 199 Miscellaneous warning
     */
    Warning: 'Warning',
    /**
     * response header
     * authentication params for method execution to specified resource
     */
    WwwAuthenticate: 'WWW-Authenticate'
});