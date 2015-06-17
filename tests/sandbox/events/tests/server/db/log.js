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
        console.log('stack contains', stack.length, 'items. adding');
        stack.push(message);

        if (!isProcessing) {
            console.log('start stack processing');
            isProcessing = true;
            db = new sqlite3.Database(database.name);
            process();
        } else {
            console.log('stack is already processing');
        }
    };

    var process = function () {
        if (stack.length) {
            console.log('stack is not empty, write next message');
            write(stack.shift(), process);
        } else {
            console.log('stack processing ended');
            isProcessing = false;
            db.close();
        }
    };

    var write = function (data, callback) {
        console.log('check existing data');
        db.get('SELECT COUNT(*) AS count FROM log WHERE user=$user AND device=$device AND category=$category AND name=$name AND userAgent=$userAgent', {
            $user: data.user,
            $device: data.device,
            $category: data.category,
            $name: data.name,
            $userAgent: data.userAgent.userAgent
        }, function (err, row) {
            console.log('fetched count:', row.count);

            if (row && row.count >= 10) {

                console.log('too much data. end');
                callback();

                return;
            }

            console.log('add new log entry', {
                $user: data.user,
                $device: data.device,
                $category: data.category,
                $name: data.name,
                $userAgent: data.userAgent.userAgent
            });
            var sql = 'INSERT INTO log VALUES (' + Object.keys(database.log.fields).map(function (name) {
                    return '$' + name;
                }).join(', ') + ')';
            db.run(sql, {
                $user: data.user,
                $device: data.device,
                $time: data.time,
                $category: data.category,
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
                console.log('new log entry added. end');
                callback();
            });
        });
    };

    return me;
})(database);