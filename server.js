var server = require('http').createServer();
var io = require('socket.io')(server);

server.listen(8080);

io.on('connection', function (socket) {
  socket.on('note played', function (data, room) {
    socket.broadcast.emit(room + ' played', data);
  });
});