const plugin = require("./dist/plugin.js");
const parser = require("./dist/parser.js");

module.exports = {
    parse: parser.parse,
    plugin
};
