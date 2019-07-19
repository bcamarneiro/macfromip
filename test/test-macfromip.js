var macfromip = require("../lib/macfromip.js");

exports["isIpAddress"] = function(test) {
  test.equal(macfromip.isIpAddress("127.0.0.1"), true);
  test.equal(macfromip.isIpAddress("255.255.255.255"), true);
  test.equal(macfromip.isIpAddress("0.0.0.0"), true);
  test.equal(macfromip.isIpAddress("asdasdasdghdsgsdg"), false);
  test.equal(macfromip.isIpAddress("192.168.2.5a"), false);

  test.done();
};
