/* jshint node: true */
'use strict';

var macfromip = exports;

var cp = require('child_process');
var os = require('os');

var MACADDRESS_LENGTH = 17;

macfromip.isEmpty = function(value){
  return ((value === null) || (typeof value === 'undefined') || 0 === value.length);
};

macfromip.isString = function(value){
  if(macfromip.isEmpty(value)){
    throw new Error('Expected a not null value');
  }

  if (typeof value === 'string') {
    return true;
  }

  return false;
};

macfromip.isIpAddress = function(ipaddress){
  if(!macfromip.isString(ipaddress)){
    throw new Error('Expected a string');
  }

  /* Thanks to http://www.w3resource.com/javascript/form/ip-address-validation.php#sthash.kBJql3HS.dpuf */
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress.trim())){
    return (true);
  }
  return (false);
};

macfromip.getOwnMacAddress = function(ipaddress){
    var ifaces = os.networkInterfaces();
    var selfIps = new Array();

    Object.keys(ifaces).forEach(function (ifname) {
      var alias = 0;
      ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          return;
        }
        selfIps.push(iface);
      });
    });

    var index;
    for (index = 0; index < selfIps.length; ++index) {
        if(selfIps[index].address === ipaddress){
            return selfIps[index].mac;
        }
    }

    return false;
};

macfromip.getMacInLinux = function(ipAddress, callback){
  // OSX requires -c switch first
  var ls = cp.exec('ping  -c 1 ' + ipAddress,
    function(error, stdout, stderr) {
      if (error !== null) {
        callback('IP address unreachable', 'exec error: ' + error);
        return;
      }
      if (stderr !== null && stderr !== '') {
        callback('IP address unreachable', 'stderr: ' + stderr);
        return;
      }

      var ls2 = cp.exec('arp -a',
        function(error2, stdout2, stderr2) {
          if (error2 !== null) {
            callback('IP address unreachable', 'exec error: ' + error2);
            return;
          }
          if (stderr2 !== null && stderr2 !== '') {
            callback('IP address unreachable', 'stderr: ' + stderr2);
            return;
          }

          stdout2 = (stdout2.substring(stdout2.indexOf(ipAddress) + (ipAddress.length + 5))).substring(MACADDRESS_LENGTH, 0);
          callback(false, stdout2);
          return;
        });
    });
};

macfromip.getMacInWin32 = function(ipAddress, callback){
    var ls = cp.exec('ping  ' + ipAddress + ' -n 1',
      function(error, stdout, stderr) {
        if (error !== null) {
          callback('IP address unreachable', 'exec error: ' + error);
          return;
        }
        if (stderr !== null && stderr !== '') {
          callback('IP address unreachable', 'stderr: ' + stderr);
          return;
        }

        var ls2 = cp.exec('arp -a',
          function(error2, stdout2, stderr2) {
            if (error2 !== null) {
              callback('IP address unreachable', 'exec error: ' + error2);
              return;
            }
            if (stderr2 !== null && stderr2 !== '') {
              callback('IP address unreachable', 'stderr: ' + stderr2);
              return;
            }

            var offset = 22 - ipAddress.length;

            stdout2 = (stdout2.substring(stdout2.indexOf(ipAddress) + (ipAddress.length + offset))).substring(MACADDRESS_LENGTH, 0);
            callback(false, stdout2);
            return;
          });
      });
};

macfromip.getMac = function(ipAddress, callback) {

  if(!macfromip.isIpAddress(ipAddress)) {
    throw new Error("The value you entered is not a valid IP address");
  }

  var ownMacAddress = macfromip.getOwnMacAddress(ipAddress)

  if (ownMacAddress) {
      callback(false, ownMacAddress)
  } else {
      macfromip.getRemoteMac(ipAddress, callback)
  }
};

macfromip.getRemoteMac = function(ipAddress, callback) {
  switch(os.platform()){
      case 'linux':
          macfromip.getMacInLinux(ipAddress, function(err, mac){
              callback(err, mac);
          });
      break;

      case 'win32':
          macfromip.getMacInWin32(ipAddress, function(err, mac){
              callback(err, mac);
          });
      break;
      // OSX
      case 'darwin':
          macfromip.getMacInLinux(ipAddress, function(err, mac){
              callback(err, mac);
          });
          break;

      default:
          callback('Unsupported platform: ' + os.platform(), null);
      break;
  }
};
