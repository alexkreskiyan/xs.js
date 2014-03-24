/**
 This file is core of xs.js 0.1

 Copyright (c) 2013-2014, Annium Inc

 Contact:  http://annium.com/contact

 GNU General Public License Usage
 This file may be used under the terms of the GNU General Public License version 3.0 as
 published by the Free Software Foundation and appearing in the file LICENSE included in the
 packaging of this file.

 Please review the following information to ensure the GNU General Public License version 3.0
 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

 If you are unsure which license is appropriate for your use, please contact the sales department
 at http://annium.com/contact.

 */
/**
 * @class xs.Ajax
 * @singleton
 * @markdown

 A singleton instance of an {@link xs.data.Connection}. This class
 is used to communicate with your server side code. It can be used as follows:

 xs.Ajax.request({
        url: 'page.php',
        params: {
            id: 1
        },
    });

 Default options for all requests can be set by changing a property on the xs.Ajax class:

 xs.Ajax.timeout = 60000; // 60 seconds

 Any options specified in the request method for the Ajax request will override any
 defaults set on the xs.Ajax class. In the code sample below, the timeout for the
 request will be 60 seconds.

 xs.Ajax.timeout = 120000; // 120 seconds
 xs.Ajax.request({
        url: 'page.aspx',
        timeout: 60000
    });

 In general, this class will be used for all Ajax requests in your application.
 The main reason for creating a separate {@link xs.data.Connection} is for a
 series of requests that share common settings that are different to all other
 requests in the application.

 */
xs.define('xs.Ajax', {
    extend: 'xs.data.Connection',
    singleton: true,

    /**
     * @cfg {Object} extraParams @hide
     */
    /**
     * @cfg {Object} defaultHeaders @hide
     */
    /**
     * @cfg {String} method @hide
     */
    /**
     * @cfg {Number} timeout @hide
     */
    /**
     * @cfg {Boolean} autoAbort @hide
     */
    /**
     * @cfg {Boolean} disableCaching @hide
     */

    /**
     * @property {Boolean} disableCaching
     * True to add a unique cache-buster param to GET requests. Defaults to true.
     */
    /**
     * @property {String} url
     * The default URL to be used for requests to the server.
     * If the server receives all requests through one URL, setting this once is easier than
     * entering it on every request.
     */
    /**
     * @property {Object} extraParams
     * An object containing properties which are used as extra parameters to each request made
     * by this object. Session information and other data that you need
     * to pass with each request are commonly put here.
     */
    /**
     * @property {Object} defaultHeaders
     * An object containing request headers which are added to each request made by this object.
     */
    /**
     * @property {String} method
     * The default HTTP method to be used for requests. Note that this is case-sensitive and
     * should be all caps (if not set but params are present will use
     * <tt>"POST"</tt>, otherwise will use <tt>"GET"</tt>.)
     */
    /**
     * @property {Number} timeout
     * The timeout in milliseconds to be used for requests. Defaults to 30000.
     */

    /**
     * @property {Boolean} autoAbort
     * Whether a new request should abort any pending requests.
     */
    properties: {
        autoAbort: false
    }
});