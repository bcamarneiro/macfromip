"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getMac;

var _constats = require("./constats");

var cp = require("child_process");

var os = require("os");

function isIpAddress(ipAddress) {
  if (!ipAddress || typeof ipAddress !== "string") {
    throw new Error("Expected a string");
  }
  /* Thanks to http://www.w3resource.com/javascript/form/ip-address-validation.php#sthash.kBJql3HS.dpuf */


  return _constats.IP_V4_ADDRESS_REGEX.test(ipAddress.trim());
}

function getOwnMacAddress(ipAddress) {
  var ifaces = os.networkInterfaces();
  var selfIps = [];
  Object.keys(ifaces).forEach(function (ifname) {
    ifaces[ifname].forEach(function (iface) {
      if (iface.family !== "IPv4") {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      selfIps.push(iface);
    });
  });
  var ownMacAddress = selfIps.filter(function (_ref) {
    var address = _ref.address;
    return address === ipAddress;
  }).map(function (selfIp) {
    return selfIp.mac;
  });
  return ownMacAddress && ownMacAddress.length ? ownMacAddress[0] : false;
}

function getMacInLinux(ipAddress, callback) {
  cp.exec("ping -c 1 " + ipAddress, function (error, stdout, stderr) {
    if (error || stderr) {
      callback("IP address unreachable", "".concat(error ? "exec error" : "stderr", ": ").concat(error || stderr));
      return;
    }

    cp.exec("arp -a", function (error, stdout, stderr) {
      if (error || stderr) {
        callback("IP address unreachable", "".concat(error ? "exec error" : "stderr", ": ").concat(error || stderr));
        return;
      }

      stdout = stdout.substring(stdout.indexOf(ipAddress) + (ipAddress.length + 5)).substring(_constats.MAC_ADDRESS_LENGTH, 0);
      callback(false, stdout);
      return;
    });
  });
}

function getMacInWin32(ipAddress, callback) {
  cp.exec("ping  ".concat(ipAddress, " -n 1"), function (error, stdout, stderr) {
    if (error || stderr) {
      callback("IP address unreachable", "".concat(error ? "exec error" : "stderr", ": ").concat(error || stderr));
      return;
    }

    cp.exec("arp -a", function (error, stdout, stderr) {
      if (error || stderr) {
        callback("IP address unreachable", "".concat(error ? "exec error" : "stderr", ": ").concat(error || stderr));
        return;
      }

      var offset = 22 - ipAddress.length;
      stdout = stdout.substring(stdout.indexOf(ipAddress) + (ipAddress.length + offset)).substring(_constats.MAC_ADDRESS_LENGTH, 0);
      callback(false, stdout);
      return;
    });
  });
}

function getRemoteMac(ipAddress, callback) {
  switch (os.platform()) {
    case "linux":
      getMacInLinux(ipAddress, function (err, mac) {
        return callback(err, mac);
      });
      break;

    case "win32":
      getMacInWin32(ipAddress, function (err, mac) {
        return callback(err, mac);
      });
      break;

    case "darwin":
      getMacInLinux(ipAddress, function (err, mac) {
        return callback(err, mac);
      });
      break;

    default:
      callback("Unsupported platform: " + os.platform(), null);
      break;
  }
}

function getMac(ipAddress, callback) {
  if (!isIpAddress(ipAddress)) {
    throw new Error("The value you entered is not a valid IP address");
  }

  var ownMacAddress = getOwnMacAddress(ipAddress);

  if (ownMacAddress) {
    callback(false, ownMacAddress);
  } else {
    getRemoteMac(ipAddress, callback);
  }
}