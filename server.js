var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var socket = require('socket.io');
var rfLink = require('./rfLink');

// Arguments
var rfLinkObj = new rfLink(process.argv[2]);
console.log('Params: main COM = ' + process.argv[2]);

// Variables 

// APP configuration
app.set('view engine', 'pug');
app.use(express.urlencoded())
app.use(express.static(path.join(__dirname, '/views')));

server.listen(4000, '0.0.0.0');

// Communication configuration
var io = socket(server);
io.origins('*:*');

var viewSock = null;
io.on("connection", function(clientSocket){
    console.log("user connected " + clientSocket.id);
    viewSock = clientSocket;
    clientSocket.on('command', function (data) {
        console.log('Command: ' + data);
        rfLinkObj.write(data);
    });
});

// Website pages
app.get('/',function(req,res)
{
    console.log('Connect, server ip: ' + req.socket.address().address);
    res.render('index',
        {title:'RfLinkConf', message:'Welcome to RFLink configuration', ip:req.socket.address().address});
});

rfLinkObj.on('receiveRawData', function(dataStr){
    // Send LOGs
    if(null != viewSock){
        viewSock.emit('data', dataStr);
    }
});


rfLinkObj.init();

