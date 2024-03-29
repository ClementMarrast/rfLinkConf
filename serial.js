var util = require("util");
var SerialPort = require("serialport");
var events = require('events');


function serial(port, baud)
{
  events.EventEmitter.call(this);
  this.port = port;
  this.baudrate = baud;
};

serial.prototype = Object.create(events.EventEmitter.prototype);

serial.prototype.init = function()
{
 var _this = this;

  // Serial port init
  _this.connect();
}

serial.prototype.write = function(msg){
  var _this = this;
  // console.log(msg)
  _this.serialPort.write(msg+"\r\n", "ascii");
}

serial.prototype.connect = function(){
  var _this = this;
  console.log('Open ' + _this.port);
  _this.serialPort = new SerialPort(_this.port, {
    baudRate: _this.baudrate
  });
  _this.Readline = SerialPort.parsers.Readline;
  _this.parser = _this.serialPort.pipe(new _this.Readline({ delimiter: Buffer.from('\r\n', 'ascii'), encoding: 'ascii' }));
  _this.parser.on('data', function(data) {
        
    // Get LOG data
    var dataStr = data.toString();
    
    console.log(dataStr);
    // Raising receive event
    _this.emit('receive', dataStr);
  });

  //Serial port events
  _this.serialPort.on("open", function () {
    console.log('serial opened ' + _this.port);
  });

  _this.serialPort.on("error", function (err) {
    console.log('serial error ' + _this.port + ' err ' + err);
    _this.reconnect();
  });

  _this.serialPort.on("close", function () {
    console.log('serial closed ' + _this.port);
    _this.reconnect();
  });

  //Subscribe for FirstEvent
  _this.on('FirstEvent', function (data) {
    console.log('First subscriber: ' + data);
  });
}

// check for connection errors or drops and reconnect
serial.prototype.reconnect = function () {
  var _this = this;
  console.log('INITIATING RECONNECT');
  setTimeout(function(){
    console.log('RECONNECTING...');
    _this.connect();
  }, 2000);
};

module.exports = serial;