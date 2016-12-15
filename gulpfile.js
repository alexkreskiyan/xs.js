'use strict';

const fs = require('fs');
const path = require('path');

const gulp = require('gulp');

const options = {
    gulp,
    del: require('del'),
    concat: require('gulp-concat'),
    merge: require('gulp-merge'),
    uglify: require('gulp-uglify'),
    get sources() {
        return require('./make/sources')()
    },
    pure: require('./make/pureFunctions'),
    outputName: 'xs.js',
};

const tasksDir = path.resolve(__dirname, 'make', 'tasks');

const registerTask = name => {
    const taskPath = path.resolve(tasksDir, name);
    const taskName = path.basename(taskPath, '.js');

    const task = require(taskPath)(options);
    if (Array.isArray(task) && task[task.length - 1] instanceof Function)
        gulp.task.apply(gulp, [taskName].concat(task));
    else
        gulp.task(taskName, task);
}

fs.readdirSync(tasksDir).forEach(registerTask);

gulp.task('default', ['all']);