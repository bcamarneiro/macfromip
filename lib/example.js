"use strict";

var _macfromip = _interopRequireDefault(require("./macfromip"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _macfromip["default"])("192.168.208.122", function (err, data) {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
});