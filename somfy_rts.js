var events = require('events');
const { stringify } = require('querystring');

const SOMFY_RTS_READ = '10;RTSSHOW;';
const SMOFY_RTS_WRITE = '10;RTS;';
const SOMFY_RTS_ANSWER = '20;XX;';
const SOMFY_RTS_ANSWER_ACK = '20;XX;OK;';

const SOMFY_RTS_DOWN = 'DOWN;';
const SOMFY_RTS_UP = 'UP;';
const SOMFY_RTS_STOP = 'STOP;';
const SOMFY_RTS_PAIR = 'PAIR;';


function somfyRts(rfLinkObj)
{
  events.EventEmitter.call(this);

  this.rfLinkHandle = rfLinkObj;

  this.rfLinkHandle.on('receiveRawData', function(dataStr){
    console.log("RCV --" + dataStr)
    //Parse line
    // if(dataStr.startsWith("RTS Record")){
    //   line = JSON.parse(dataStr)
    //   console.log(line)
    // }
    
});
};

somfyRts.prototype = Object.create(events.EventEmitter.prototype);

somfyRts.prototype.readConfiguration = function()
{
  this.rfLinkHandle.writeRaw(SOMFY_RTS_READ)
}

somfyRts.prototype.handleCommand = function(request){
  console.log(request)
  if(request.command === "READ"){
    console.log("READ CONF")
    this.readConfiguration();
  }
}



module.exports = somfyRts;