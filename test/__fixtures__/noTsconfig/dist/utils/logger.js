"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Logger = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var Logger = /*#__PURE__*/function () {
  function Logger() {
    (0, _classCallCheck2["default"])(this, Logger);
  }
  (0, _createClass2["default"])(Logger, [{
    key: "info",
    value: function info(msg) {
      console.log(msg);
    }
  }]);
  return Logger;
}();
exports.Logger = Logger;
var _default = new Logger();
exports["default"] = _default;