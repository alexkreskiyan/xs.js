'use strict';

var database = require('./db');
var Promise = require('promise');
var pool = require('./pool');

var add = function (data) {
    return new Promise(function (resolve, reject) {
        pool.run(data.dbName, 'get', 'SELECT COUNT(*) AS count FROM log WHERE user=$user AND device=$device AND test=$test AND stage=$stage AND name=$name AND userAgent=$userAgent', {
            $user: data.user,
            $device: data.device,
            $test: data.test,
            $stage: data.stage,
            $name: data.name,
            $userAgent: data.userAgent.userAgent
        }).then(function (row) {

            if (row.count >= 3) {

                return reject('too many data');
            }

            var sql = 'INSERT INTO log VALUES (' + Object.keys(database.log.fields).map(function (name) {
                    return '$' + name;
                }).join(', ') + ')';
            pool.run(data.dbName, 'run', sql, {
                $user: data.user,
                $device: data.device,
                $time: data.time,
                $test: data.test,
                $stage: data.stage,
                $name: data.name,
                $userAgent: data.userAgent.userAgent,
                $browserName: String(data.userAgent.browser.name),
                $browserVersion: String(data.userAgent.browser.version),
                $browserMajor: Number(data.userAgent.browser.major),
                $browserMinor: Number(data.userAgent.browser.minor),
                $cpu: String(data.userAgent.cpu.architecture),
                $engineName: String(data.userAgent.engine.name),
                $engineVersion: String(data.userAgent.engine.version),
                $engineMajor: Number(data.userAgent.engine.major),
                $engineMinor: Number(data.userAgent.engine.minor),
                $osName: String(data.userAgent.os.name),
                $osVersion: String(data.userAgent.os.version),
                $event: JSON.stringify(data.event)
            }).then(resolve, reject);
        }, reject);
    });

};

module.exports = {
    add: add
};