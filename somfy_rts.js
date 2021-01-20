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
  this.records = {};
};

somfyRts.prototype = Object.create(events.EventEmitter.prototype);

somfyRts.prototype.init = function()
{
  let _this = this

  _this.rfLinkHandle.on('RTS-data', function(dataStr){
    let number = 0

    // Parse line
    if(dataStr.startsWith("RTS Record")){
      _this.emit('rts-record-raw', dataStr)
      dataArray = dataStr.split(": ")
      number = dataArray[1].slice(0, dataArray[1].indexOf(" "))

      _this.records[number] = {
        number: number,
        address: dataArray[2].slice(0, dataArray[2].indexOf(" ")),
        rollingCode: dataArray[3]
      }
    }

    if(number === "15"){
      let recordsKeys = Object.keys(_this.records)
      recordsArray = []
      recordsKeys.forEach(recordKey => {
        recordsArray.push(_this.records[recordKey])
      });
      _this.emit("rts-records", recordsArray)
    }
  });

}

somfyRts.prototype.readConfiguration = function()
{
  this.rfLinkHandle.writeRaw(SOMFY_RTS_READ)
}

somfyRts.prototype.send = function(cmd, index)
{
  // Build command
  // 10;RTS;0F0F0F;0412;3;PAIR;
  let rollingCode = this.records[index].rollingCode
  let address = this.records[index].address
  if(cmd === "PAIR"){
    rollingCode = (0x4000 + index).toString(16)
    address = (0xAABB00 + index).toString(16)
  }
  let frame = `${SMOFY_RTS_WRITE}${address};${rollingCode};${index};${cmd};`
  console.log(frame)
  this.rfLinkHandle.writeRaw(frame)
}

somfyRts.prototype.handleCommand = function(request){
  console.log(request)
  if(request.command === "READ"){
    this.readConfiguration();
  }else{
    this.send(request.command, request.index);
  }
}



module.exports = somfyRts;