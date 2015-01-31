macfromip
=========

##Description
*   Nodejs script;
*   Gets a MAC address from a LAN IP address;
*   Only works on linux, OSX and win32 platforms;

##TODO List:
Complete list on [Trello](https://trello.com/c/0sNva5rq/1-write-a-better-reademe)

##Usage
```
var macfromip = require('./macfromip.js');

macfromip.getMac('192.168.2.169', function(data){
    console.log(data);
});
```
