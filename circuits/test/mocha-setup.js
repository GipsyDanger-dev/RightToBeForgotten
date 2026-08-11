// Mocha global setup: expose chai's `expect` for circuit tests.
// Loaded via mocha --require (see circuits/package.json "test" script).
const chai = require('chai');

global.expect = chai.expect;
