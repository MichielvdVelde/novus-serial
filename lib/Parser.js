

exports.parse = module.exports.parse = function(payload) {
	payload = payload.replace(/^\s+|\s+$/g,'');
	payload = payload.replace(/\n/g, ' ');
	payload = payload.replace(/\s{2,}/g, ' ');
	payload = payload.split(' ');
	payload = exports.decompilePayload(payload);

	return payload;
};

exports.decompilePayload = module.exports.decompilePayload = function(payload) {
	var parsed = {};
	var last = '';
	for(var i in payload) {
		if(payload[i] === ' ' || payload[i] === '' || payload[i] === undefined || payload[i] === null)
			payload.splice(i, 1);
	}
	for(i in payload) {
		if(i % 2)
			parsed[last] = payload[i];
		last = payload[i];
	}
	return parsed;
};
