var macfromip = require('../macfromip.js');

exports['isIpAddress'] = function (test) {
	test.equal(macfromip.isEmpty('0'), false);
	test.equal(macfromip.isEmpty('      '), false);
	test.equal(macfromip.isEmpty(''), true);
	test.equal(macfromip.isEmpty(null), true);
	test.equal(macfromip.isEmpty(), true);

	test.equal(macfromip.isString(false), false);
	test.equal(macfromip.isString(1233536), false);
	test.equal(macfromip.isString('1233536'), true);
	test.equal(macfromip.isString('#$%&asda3445'), true);

    test.equal(macfromip.isIpAddress('127.0.0.1'), true);
    test.equal(macfromip.isIpAddress('255.255.255.255'), true);
    test.equal(macfromip.isIpAddress('0.0.0.0'), true);
    test.equal(macfromip.isIpAddress('asdasdasdghdsgsdg'), false);
    test.equal(macfromip.isIpAddress('192.168.2.5a'), false);    

    test.done();
};