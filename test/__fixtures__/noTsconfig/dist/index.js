"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = hello;
var _logger = _interopRequireDefault(require("./utils/logger"));
function hello() {
  var _process$env;
  var msg = (_process$env = process.env) !== null && _process$env !== void 0 && _process$env.secret ? "Hellooooooo, ".concat(process.env.secret) : 'Hello world!';
  _logger["default"].info(msg);
  return msg;
}