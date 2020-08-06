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

  
};

rfLink.prototype = Object.create(events.EventEmitter.prototype);

rfLink.prototype.readConfiguration = function()
{

}



module.exports = rfLink;