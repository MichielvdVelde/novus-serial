
var Component = require('novus-component');

var serialport = require("serialport");
var Parser = require('./lib/Parser');

var component, serialPort;

// Function to process serial data
var processSerialData = function(data) {
	var parsedData = Parser.parse(data);
	for(var key in parsedData) {
		if(key == 'DEVID') continue;
		if(!component.get('sensors', {}).hasOwnProperty(key)) return console.log('Unknown sensor: ', key);
		var transformed = component.get('sensors', {})[key];
		var payload = {
			'sensor': transformed.name,
			'value': parsedData[key],
			'datetime': (new Date()).toLocaleString()
		};
		component.mqtt.publish(component.componentId + '/sensor/' + payload.sensor, JSON.stringify(payload), { 'retain': transformed.retain });
		console.log('MQTT: Sent %s: %s', payload.sensor, payload.value);
	}
};

// Function to process MQTT data
var processMQTTData = function(packet) {
	if(!serialPort.isOpen()) return console.log('SERIAL: ERROR: serial port not open');
	var command = 'S ' + packet.json.groupId + packet.json.switchId;
	command += (packet.json.command == 'on') ? '1' : '0';
	serialPort.write(command);
	console.log('SERIAL: Sent command: %s', command);

	var status = {
		'status': packet.json.command,
		'source': packet.json.source,
		'datetime': (new Date()).toLocaleString()
	};
	component.mqtt.publish(component.componentId + '/switch/' + packet.json.groupId +'/' + packet.json.switchId + '/status', JSON.stringify(status), { 'retain': true });
};

// Create a new component
component = new Component('serialtomqtt2-component', { 'settings': [ 'switch_topic', 'sensors' ] });

// Component ready handler
component.on('ready', function() {

	// MQTT setup
	component.mqtt.subscribe(component.get('switch_topic'));

	// Set up serial port interface
	serialPort = new serialport.SerialPort(process.env.ARDUINO1_COM, {
		bufferSize: 512,
		parser: serialport.parsers.readline("\n")
	});

	serialPort.on('open', function() {
		serialPort.on('data', processSerialData);
	});

});

// Set message handler
component.on('message', processMQTTData);
