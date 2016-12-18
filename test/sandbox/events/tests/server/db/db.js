'use strict';

var sqlite3 = require('sqlite3').verbose();

module.exports = {
    names: [
        'domEventsTests',
        'xsEventsTests'
    ],
    getDbPath: function (name) {
        return 'tmp/' + name + '.db';
    }
};

module.exports.names.forEach(function (name) {
    var db = new sqlite3.Database(module.exports.getDbPath(name));

    //create tests table in db
    (function (db, exports) {
        var fields = {
            user: 'TEXT',
            device: 'TEXT',
            userAgent: 'TEXT',
            test: 'TEXT',
            stages: 'TEXT'
        };
        exports.tests = {
            fields: fields
        };
        db.run('CREATE TABLE if not exists tests (' + Object.keys(fields).map(function (name) {
                return name + ' ' + fields[ name ];
            }) + ')');
    })(db, module.exports);

    //create log table in db
    (function (db, exports) {
        var fields = {
            user: 'TEXT',
            device: 'TEXT',
            time: 'TEXT',
            test: 'TEXT',
            stage: 'TEXT',
            name: 'TEXT',
            userAgent: 'TEXT',
            browserName: 'TEXT',
            browserVersion: 'TEXT',
            browserMajor: 'INTEGER',
            browserMinor: 'INTEGER',
            cpu: 'INTEGER',
            engineName: 'TEXT',
            engineVersion: 'TEXT',
            engineMajor: 'INTEGER',
            engineMinor: 'INTEGER',
            osName: 'TEXT',
            osVersion: 'INTEGER',
            event: 'TEXT'
        };
        exports.log = {
            fields: fields
        };
        db.run('CREATE TABLE if not exists log (' + Object.keys(fields).map(function (name) {
                return name + ' ' + fields[ name ];
            }) + ')');
    })(db, module.exports);

    db.close();
});