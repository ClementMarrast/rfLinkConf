var serial = require('./serial');

const rfLinkBaudrate = 57600;

function rfLink(port)
{
  events.EventEmitter.call(this);

  // Prepare serial communication
  this.port = port;
  this.baudrate = rfLinkBaudrate;
  this.rfLinkCom = new serial(this.port, this.baudrate);
};

rfLink.prototype = Object.create(events.EventEmitter.prototype);

rfLink.prototype.init = function()
{
 var _this = this;

  // rfLink port init
  _this.rfLinkCom.connect();

  _this.rfLinkCom.on('receive', function(data){
    _this.emit('receiveRawData', data);
  });
}

rfLink.prototype.writeRaw = function(data)
{
 var _this = this;

  // rfLink port write
  _this.rfLinkCom.write(data);
}

module.exports = rfLink;