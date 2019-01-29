# Gulp Inject Inline

![build](https://example.gitlab.com/amy/inject-inline-npm-module/badges/master/build.svg)

This plugin searches the files it is given for a control sequence in the format:
`[ inject-inline file.css ]`

It will remove and replace the control sequence with the contents of `file.css`. 

## Example

`gulpfile.js`
```javascript
const inject_inline = require('gulp-inject-inline');

gulp.task('inject:css', () => {
	gulp.src("src/components/**/*.js")
		.pipe(inject_inline())
		.pipe(gulp.dest("dist/components"));
});
```

`src/components/myComponent.js`
```javascript
export class MyComponent extends HTMLElement {
    private shadow: DocumentFragment;

    /* CSS */
    private static styles: string = `
        [ inject-css myComponent.css ]
    `;

    constructor() {
        super();
        /* Attach shadow root */
        this.shadow = this.attachShadow({mode: 'open'});

        /* Add the styling to the page */
        const style = document.createElement('style');
        style.innerHTML = MyComponent.styles;
        this.shadow.appendChild(style);
    }
}

window.customElements.define("my-component", MyComponent);
```

`src/components/myComponent.css`
```css
:host {
	width: 150px;
	height: 200px;
	display: block;
}

h1 {
	color: #FFF;
}
```

Would become:
`dist/components/myComponent.js`
```javascript
export class MyComponent extends HTMLElement {
    private shadow: DocumentFragment;

    /* CSS */
    private static styles: string = `
        :host {
	width: 150px;
	height: 200px;
	display: block;
}

h1 {
	color: #FFF;
}
    `;

    constructor() {
        super();
        /* Attach shadow root */
        this.shadow = this.attachShadow({mode: 'open'});

        /* Add the styling to the page */
        const style = document.createElement('style');
        style.innerHTML = MyComponent.styles;
        this.shadow.appendChild(style);
    }
}

window.customElements.define("my-component", MyComponent);
```

## GitLab
Submit issues, request features, check out the repo here: [https://git.xvrqt.com/amy/inject-inline-npm-module](https://git.xvrqt.com/amy/inject-inline-npm-module)

## White Space
It will not preserve whitespace.

`index.html`
```html
<html>
	<head>
		<style>
			[ inject-inline mystyles.css ]
		</style>
	</head>
	<body>
		<h1>Hello girls!</h1>
	</body>
</html>
```

`mystyles.css`
```css
body {
	background-color: #333;
}

h1 {
	color: #EEE;
}
```

Will produce:

`output.html`
```html
<html>
	<head>
		<style>
			body {
	background-color: #333;
}

h1 {
	color: #EEE;
}
		</style>
	</head>
	<body>
		<h1>Hello girls!</h1>
	</body>
</html>
```
