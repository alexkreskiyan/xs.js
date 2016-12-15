'use strict';

module.exports = options => () => {
    const buildPath = 'build/source';

    //remove old files
    options.del(buildPath);

    //get core stream
    var core = options.sources().core;

    //save build
    return core.pipe(options.gulp.dest(buildPath));
};