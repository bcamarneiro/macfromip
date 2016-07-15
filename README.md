[![Build Status](https://travis-ci.org/bcamarneiro/macfromip.svg?branch=master)](https://travis-ci.org/bcamarneiro/macfromip)

macfromip
=========

## Synopsis

*   Nodejs script;
*   Gets a MAC address from a LAN IP address;
*   Only works on linux, OSX and win32 platforms;

## Code Example

```
var macfromip = require('macfromip');

macfromip.getMac('192.168.2.169', function(err, data){
    if(err){
    	console.log(err);
	}
    console.log(data);
});
```

## Installation

```
npm install macfromip
```

## TODO List:
Complete list on [Trello](https://trello.com/b/B1WM4gbZ/macfromip)
