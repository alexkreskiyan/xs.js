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
 * @class xs.Loader
 * @singleton
 * @markdown

 1. sync load
 - cls1 ... clsN
 - [cls1 ... clsN]
 2. async load:
 - cls1 ... clsN
 - [cls1 ... clsN]
 : deferred
 3. xs.create => sync.load
 4. disableCache & disableCacheParam - global properties
 5. preserveScripts - leave scripts in document
 6. garbageCollect - prepare async script tag for garbage collection
 7. paths - classes paths
 8. scriptChainDelay
 9. scriptCharset

 static.history - history of loaded/loading classes???

 getPath - gets class path

 setPath - as to args, or config

 loadScript - loads script

 require - requires a set of classes

 syncRequire

 queue && refreshQueue

 */

