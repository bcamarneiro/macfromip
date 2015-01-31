var macfromip = require('./macfromip.js');

macfromip.getMac('192.168.1.80', function(data){
    console.log(data);
});
