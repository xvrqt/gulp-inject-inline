'use strict';
/* Dependencies */
const fs = require('fs');
const through = require('through2').obj;
const PluginError = require('plugin-error');

/* Magic Vars */
const package_name = 'gulp-inject-inline';

module.exports = function() {

    /* Looks like: [ inject-inline myFile.css ]
     * Captures "myFile.css" as the first capture group.
    */
    const regex = /\[\s*inject-inline\s*(.*?)\s*\]/gi;

    function injectInline(file, _enc, cb) {

        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('warn', new PluginError(package_name, `Streams not supported. File ${file.basename} skipped.`));
            this.push(file);
            return cb();
        }

        /* We only deal with buffered files */
        if (file.isBuffer()) {
            let contents = String(file.contents);
            
            /* Search and replace */
            contents = contents.replace(regex, function(_match, src) {
                /* If the path begins with '/' assume absolute path. */
                let path = file.dirname + '/' + src;
                if(src.length > 0 && src[0] === '/') {
                    path = src;
                }
                return String(fs.readFileSync(path));
            });

            /* Update the file */
            file.contents = new Buffer.from(contents);
            this.push(file);
            return cb();
        }

        return cb();
        }

    return through(injectInline);
};