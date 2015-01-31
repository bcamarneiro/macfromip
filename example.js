var macfromip = require('./macfromip.js');

macfromip.getMac('192.168.2.147', function(data){
    console.log(data);
});
