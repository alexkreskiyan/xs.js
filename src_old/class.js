/**
 This file is module of xs.js 0.1

 Copyright (c) 2013-2014, Coos Inc

 Contact:  http://coos.me/contact

 GNU General Public License Usage
 This file may be used under the terms of the GNU General Public License version 3.0 as
 published by the Free Software Foundation and appearing in the file LICENSE included in the
 packaging of this file.

 Please review the following information to ensure the GNU General Public License version 3.0
 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

 If you are unsure which license is appropriate for your use, please contact the sales department
 at http://coos.me/contact.

 */
(function (namespace) {
    //define module
    this[namespace].module({
        //module name
        name: 'class',
        //module init function
        //context - module object
        //config - this config
        init: function (config) {
            console.log('this', this);
            console.log('config', config);
        }
    });
}).call(window, 'xs');