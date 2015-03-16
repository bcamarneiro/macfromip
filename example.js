var macfromip = require('./macfromip.js');

macfromip.getMac('192.168.2.57', function(err, data){
	if(err){
		console.log(err);
	}
	else{
    	console.log(data);
    }
});
