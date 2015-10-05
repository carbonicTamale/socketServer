var loadBalancer = require('./loadBalancer.js')
var cluster = require("cluster");
var http = require("http");
var numCPUs = require("os").cpus().length;

var io = require('socket.io')(3000);
var redis = require('socket.io-redis');
io.adapter(redis({ host: 'localhost', port: 6379 }));

if(cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("listening", function(worker, address) {
    console.log("worker " + worker.process.pid + " is now connected to " + address.address + ":" + address.port);
  });

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  var server = require('http').createServer();
  var io = require('socket.io')(server);

  io.on('connection', function (socket) {
    console.log('asdf');

    socket.on('note event', function (data, room) {
      console.log('yay');
      // loadBalancer.emit(data, room, socket);
      socket.broadcast.emit(room + ' event', data);
      return;
    });
  });

  server.listen(8080);
}