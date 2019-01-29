const fs = require('fs');
const es = require('event-stream');
const should = require('should');
const vinyl = require('vinyl');
const inject_inline = require('../index.js');

describe('gulp-inject-inline', () => {
	it("Should inject styles/styles.css into test.html, making it equal to expected.html", (done) => {
		const test_html = new vinyl({
			path: 'test/resources/test.html',
			base: 'test/resources/',
			contents: fs.readFileSync('test/resources/test.html')
		});

		const expected_html = new vinyl({
			path: 'test/expected.html',
			base: 'test/',
			contents: fs.readFileSync('test/expected.html')
		});

		const stream = inject_inline();

		/* We should error if under some conditions, such as passed a stream
		 * and not a buffer.
		*/
		stream.on('error', (error) => {
			should.exist(error);
			done(error);
		});

		/* On data, check that the file was injectd correctly */
		stream.on('data', (file) => {
			should.exist(file);
			should.exist(file.contents);

			const contents = String(file.contents);
			contents.should.equal(String(expected_html.contents));
			done();
		});

		stream.write(test_html);
		stream.end();
	});

	/* Check that errors are handled correctly */
	it("Should error when passed a stream", (done) => {
		const test_html = new vinyl({
			cwd:  'test/',
			path: 'test/resources/test.html',
			base: 'test/resources/',
			contents: fs.createReadStream('test/resources/test.html')
		});

		const stream = inject_inline();

		/* We should error if under some conditions, such as passed a stream
		 * and not a buffer.
		*/
		stream.on('error', (error) => {
			should.exist(error);
			done(error);
		});

		/* On data, check that the file was injectd correctly */
		stream.on('data', (file) => {
			file.contents.pipe(es.wait((error) => {
				done(error);
			}));
		});

		stream.write(test_html);
		stream.end();
	});
});