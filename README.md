# carbone-connect

This package allows you to use a remote carbone server like the one provided by [carbone-docker](https://hub.docker.com/r/fleebzz/carbone).

# Installation

```bash
yarn add carbone-connect
```
Or

```bash
npm install --save carbone-connect
```

Then in your code :
```javascript
const carbone = require(`carbone-connect`)(`http://carbone-docker-container`);

// Use carbone as usual...
```

# Usage

This package exposes the same API than the original [Carbone.io package](https://carbone.io/api-reference.html#carbone-js-api) with some additions.

## Additions

### Promise addition
If no callback is provided to `carbone.render()` then a Promise is returned

**Legacy usage**
```javascript
carbone.render(templatePath, data, options, (err, report) => {
  // Do some stuff
}));
```

**Promise usage**
```javascript
carbone.render(templatePath, data, options)
.then(report => {
  // Do some stuff with the report
})
.catch(err => {
  // ...
});
```

**`async/await` usage**
```javascript
const report = await carbone.render(templatePath, data, options);
```

### Stream addition
When you use *Express* and want to return the generated report you can speedup the process by using `carbone.renderStream()` method.

**Example**
```javascript
app.get(`/report`, (req, res) => {
  carbone.renderStream(templatePath, data, options).pipe(res);
});
```
