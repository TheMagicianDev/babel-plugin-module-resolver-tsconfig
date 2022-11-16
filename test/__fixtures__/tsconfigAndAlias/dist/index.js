"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = hello;
var _logger = _interopRequireDefault(require("./utils/logger"));
var _someSpecialBanana = require("./hooks/someSpecialBanana");
function hello() {
  var _process$env;
  var msg = (_process$env = process.env) !== null && _process$env !== void 0 && _process$env.secret ? "Hellooooooo, ".concat(process.env.secret) : 'Hello world!';
  var notReactHookBanana = (0, _someSpecialBanana.useSpecialBanana)(Math.random() * 10);
  _logger["default"].info(msg);
  if (notReactHookBanana.access) {
    _logger["default"].info("Here your ".concat(notReactHookBanana.size, " size Special Banana"));
  } else {
    _logger["default"].info('HOLD ON. You still have energy. Have your Banana later');
  }
  return msg;
}