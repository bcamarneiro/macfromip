var macfromip = require('./macfromip.js');

macfromip.getMac('192.168.2.136', function(data){
    console.log(data);
});
