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
xs.define(xs.Class, 'xs.Ajax', {
    extend: 'xs.data.Connection',
    singleton: true,
    properties: {
        /**
         * @property requestId {Integer} counter
         */
        requestId: 0,
        /**
         * @property requests {Object} pending requests
         */
        requests: {},
        /**
         * @property cors {Boolean} means, that request is cross-domain by default
         */
        cors: true//TODO
    }
});
