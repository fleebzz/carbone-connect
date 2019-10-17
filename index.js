'use strict';

const path = require(`path`);
const fs = require(`fs`);
const req = require(`request`);
const telejson = require(`telejson`);

const FORMATTERS = {};

module.exports = url => ({
  $render(templatePath, data = {}, options = {}) {
    templatePath = path.resolve(templatePath);
    data = JSON.stringify(data);
    options = JSON.stringify(options);

    const template = fs.createReadStream(templatePath);
    const formatters = telejson.stringify(FORMATTERS);

    return req.post(`${url}/render`, {
      formData: { template, data, options, formatters },
    });
  },
  renderStream(...args) {
    return this.$render(...args);
  },
  render(templatePath, data, options, callback) {
    let promiseEnded = false;
    const renderPromise = new Promise((resolve, reject) => {
      const carboneRender = this.$render(templatePath, data, options);

      carboneRender.on(`error`, error => {
        if (promiseEnded) { return; }
        promiseEnded = true;
        reject(error);
      });

      const buffers = [];
      carboneRender.on(`data`, b => buffers.push(b));
      carboneRender.on(`end`, () => {
        const buffer = Buffer.concat(buffers);
        if (promiseEnded) { return; }
        promiseEnded = true;
        resolve(buffer);
      });
    });

    if (typeof callback !== `function`) {
      return renderPromise;
    }

    return renderPromise
    .then(res => callback(null, res))
    .catch(err => callback(err, null));
  },
  addFormatters(formatters) {
    Object.keys(formatters).forEach(name => {
      FORMATTERS[name] = formatters[name];
    });
  },
});
