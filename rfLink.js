var serial = require('./serial');
var events = require('events');

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
  let _this = this;

  // rfLink port init
  _this.rfLinkCom.connect();

  _this.rfLinkCom.on('receive', function(data){

    _this.emit('rawData', data);
    // Parse data
    if(data.startsWith("20;")){
      let dataObj = data.split(";")
      dataObj.pop() // remove last empty item

      let rfLinkObj = {
        nodeNumber: dataObj[0],
        packetCounter: dataObj[1],
        name: dataObj[2],
        dataArray: []
      }

      dataObj.forEach((devData, idx) => {
        if(idx > 2){
          devDataArray = devData.split("=")
          rfLinkObj.dataArray.push({
            name: devDataArray[0],
            value: devDataArray[1]
          })
        }
      });
      
      // console.log(rfLinkObj)
      _this.emit('data', rfLinkObj);  
    }else if(data.startsWith("RTS Record")){
      console.log("rflink to somfy")
      _this.emit("RTS-data", data)
    }

    
  });
}

rfLink.prototype.writeRaw = function(data)
{
  let _this = this;

  // rfLink port write
  _this.rfLinkCom.write(data);
}

module.exports = rfLink;