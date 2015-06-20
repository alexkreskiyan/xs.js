'use strict';

var database = require('./db');
var Promise = require('promise');
var sqlite3 = require('sqlite3').verbose();

var pool;

var add = function (data) {
    return new Promise(function (resolve) {
        pool.add(data);
        setTimeout(function () {
            resolve();
        }, 0);
    });
};
module.exports = {
    add: add
};

pool = (function (database) {
    var me = {};
    var db;
    var isProcessing = false;
    var stack = [];

    me.add = function (message) {
        if (database.names.indexOf(message.dbName) < 0) {
            throw new Error('unknown database');
        }

        stack.push(message);

        if (!isProcessing) {
            isProcessing = true;
            db = new sqlite3.Database(database.getDbPath(message.dbName));
            process();
        }
    };

    var process = function () {
        if (stack.length) {
            write(stack.shift(), process);
        } else {
            isProcessing = false;
            db.close();
        }
    };

    var write = function (data, callback) {
        db.get('SELECT COUNT(*) AS count FROM log WHERE user=$user AND device=$device AND test=$test AND stage=$stage AND userAgent=$userAgent', {
            $user: data.user,
            $device: data.device,
            $test: data.test,
            $stage: data.stage,
            $userAgent: data.userAgent.userAgent
        }, function (err, row) {

            if (row && row.count >= 100) {

                callback();

                return;
            }

            var sql = 'INSERT INTO log VALUES (' + Object.keys(database.log.fields).map(function (name) {
                    return '$' + name;
                }).join(', ') + ')';
            db.run(sql, {
                $user: data.user,
                $device: data.device,
                $time: data.time,
                $test: data.test,
                $stage: data.stage,
                $name: data.name,
                $userAgent: data.userAgent.userAgent,
                $browserName: data.userAgent.browser.name,
                $browserVersion: data.userAgent.browser.version,
                $browserMajor: data.userAgent.browser.major,
                $browserMinor: data.userAgent.browser.minor,
                $cpu: data.userAgent.cpu.architecture,
                $engineName: data.userAgent.engine.name,
                $engineVersion: data.userAgent.engine.version,
                $engineMajor: data.userAgent.engine.major,
                $engineMinor: data.userAgent.engine.minor,
                $osName: data.userAgent.os.name,
                $osVersion: data.userAgent.os.version,
                $event: JSON.stringify(data.event)
            }, function () {
                callback();
            });
        });
    };

    return me;
})(database);