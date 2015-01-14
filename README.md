macfromip
=========

##Description
*   Nodejs script;
*   Gets a MAC address from a LAN IP address;
*   Only works on linux, OSX and win32 platforms;

##TODO List:
*   Write a better README;
*   validate arguments;
*   Check if ip is self;

##Usage
```
var macfromip = require('./macfromip.js');

macfromip.getMac('192.168.2.169', function(data){
    console.log(data);
});
```
