var server = require('http').createServer();
var io = require('socket.io')(server);

var loadBalancer = require('./loadBalancer.js')

io.on('connection', function (socket) {
  socket.on('note played', function (data, room) {
    // check load balancer, determine which sub process to delegate
    // emit to
    loadBalancer.emit(data, room, socket);
    return;
  });
});

server.listen(8080);

//do something when app is closing
process.on('exit', loadBalancer.closeAllProcesses());

//catches ctrl+c event
process.on('SIGINT', loadBalancer.closeAllProcesses());

//catches uncaught exceptions
process.on('uncaughtException', loadBalancer.closeAllProcesses());