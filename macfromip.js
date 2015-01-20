/* jshint node: true */
'use strict';

var macfromip = exports;

var cp = require('child_process');
var os = require('os');

var MACADDRESS_LENGTH = 17;

macfromip.getMacInLinux = function(ipAddress, callback){
    // OSX requires -c switch first
    var ls = cp.exec('ping  -c 1 ' + ipAddress,
      function(error, stdout, stderr) {
        if (error !== null) {
          callback('exec error: ' + error);
        }
        if (stderr !== null && stderr !== '') {
          callback('stderr: ' + stderr);
        }

        var ls2 = cp.exec('arp -a',
          function(error2, stdout2, stderr2) {
            if (error2 !== null) {
              callback('exec error: ' + error2);
            }
            if (stderr2 !== null && stderr2 !== '') {
              callback('stderr: ' + stderr2);
            }

            stdout2 = (stdout2.substring(stdout2.indexOf(ipAddress) + (ipAddress.length + 5))).substring(MACADDRESS_LENGTH, 0);
            callback(stdout2);
          });
      });
};

macfromip.getMacInWin32 = function(ipAddress, callback){
    var ls = cp.exec('ping  ' + ipAddress + ' -n 1',
      function(error, stdout, stderr) {
        if (error !== null) {
          callback('exec error: ' + error);
        }
        if (stderr !== null && stderr !== '') {
          callback('stderr: ' + stderr);
        }

        var ls2 = cp.exec('arp -a',
          function(error2, stdout2, stderr2) {
            if (error2 !== null) {
              callback('exec error: ' + error2);
            }
            if (stderr2 !== null && stderr2 !== '') {
              callback('stderr: ' + stderr2);
            }

            var offset = 22 - ipAddress.length;

            stdout2 = (stdout2.substring(stdout2.indexOf(ipAddress) + (ipAddress.length + offset))).substring(MACADDRESS_LENGTH, 0);
            callback(stdout2);
          });
      });
};

macfromip.getMac = function(ipAddress, callback) {
    switch(os.platform()){
        case 'linux':
            macfromip.getMacInLinux(ipAddress, function(mac){
                callback(mac);
            });
        break;

        case 'win32':
            macfromip.getMacInWin32(ipAddress, function(mac){
                callback(mac);
            });
        break;
        // OSX
        case 'darwin':
            macfromip.getMacInLinux(ipAddress, function(mac){
                callback(mac);
            });
            break;

        default:
            callback('Unsupported platform: ' + os.platform());
        break;
    }

};
