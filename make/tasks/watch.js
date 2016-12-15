'use strict';

module.exports = options => [
    ['source'],
    () => { options.gulp.watch('src/**/*', ['source']) }
];