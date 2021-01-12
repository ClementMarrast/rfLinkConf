var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var socket = require('socket.io');
var rfLink = require('./rfLink');
var somfyRts = require('./somfy_rts')

// Arguments
var rfLinkObj = new rfLink(process.argv[2]);
var somfyRtsObj = new somfyRts(rfLinkObj)
console.log('Params: main COM = ' + process.argv[2]);

// Variables 

// APP configuration
app.set('view engine', 'pug');
app.use(express.urlencoded())
app.use(express.static(path.join(__dirname, '/views')));

server.listen(4000, '0.0.0.0');

// Communication configuration
var io = socket(server);
// io.origins('*:*');

var viewSock = null;
io.on("connection", function(clientSocket){
    console.log("user connected " + clientSocket.id);
    viewSock = clientSocket;
    clientSocket.on('command', function (data) {
        console.log('Command: ' + data);
        rfLinkObj.writeRaw(data);
    });
    
    clientSocket.on('somfy-rts', function (data) {
        console.log("somfy-rts -- " + JSON.stringify(data))
        somfyRtsObj.handleCommand(data)
    });
});

// Website pages
app.get('/',function(req,res)
{
    console.log('Connect, server ip: ' + req.socket.address().address);
    res.render('uart',
        {title:'RfLinkConf', message:'Welcome to RFLink configuration', ip:req.socket.address().address});
});
app.get('/somfy-rts',function(req,res)
{
    console.log('Connect, server ip: ' + req.socket.address().address);
    res.render('somfy-rts',
        {title:'RfLinkConf', message:'Welcome to RFLink configuration', ip:req.socket.address().address});
});

rfLinkObj.on('rawData', function(dataStr){
    // Send LOGs
    if(null != viewSock){
        viewSock.emit('data', dataStr + "\r\n");
    }
});

somfyRtsObj.on('rts-record-raw', function(dataStr){
    // Send LOGs
    if(null != viewSock){
        viewSock.emit('rts-record-raw', dataStr + "\r\n");
    }
});
somfyRtsObj.on('rts-record', function(record){
    // Send LOGs
    if(null != viewSock){
        viewSock.emit('rts-record', record);
    }
});



rfLinkObj.init();
somfyRtsObj.init();
