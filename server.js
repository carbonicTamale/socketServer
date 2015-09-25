var server = require('http').createServer();
var io = require('socket.io')(server);

var child_process = require('child_process');

var proc1 = child_process.fork('child.js');
var proc2 = child_process.fork('child.js')

io.on('connection', function (socket) {
  addSocketToLoadBalancer(socket);

  socket.on('note played', function (data, room) {
    // check load balancer, determine which sub process to delegate
    // emit to
    socket.broadcast.emit(room + ' played', data);
  });
});

server.listen(8080);