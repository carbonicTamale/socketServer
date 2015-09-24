var http = require('http');
var socket = require('socket.io');

var server = http.createServer(function(req, res){

});

var io = socket(server);

server.listen(8080);

io.on('connection', function (socket) {
  socket.on('note played', function (data, room) {
    socket.broadcast.emit(room + ' played', data);
  });
});