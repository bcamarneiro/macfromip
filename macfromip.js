/* jshint node: true */
'use strict';

var macfromip = exports;

var cp = require('child_process');

macfromip.getMac = function(ipAddress, callback) {
  var ls = cp.exec('ping  ' + ipAddress + ' -c 1',
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

          stdout2 = (stdout2.substring(stdout2.indexOf(ipAddress) + 18)).substring(17, 0);
          callback(stdout2);
        });
    });
};
