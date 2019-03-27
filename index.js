'use strict';

const path = require(`path`);
const fs = require(`fs`);
const req = require(`request`);

module.exports = url => ({
  render(templatePath, data = {}, options = {}) {
    templatePath = path.resolve(templatePath);
    data = JSON.stringify(data);
    options = JSON.stringify(options);

    const template = fs.createReadStream(templatePath);

    return req.post(`${url}/render`, {
      formData: { template, data, options },
    });
  },
});
