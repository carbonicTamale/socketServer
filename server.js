//var loadBalancer = require('./loadBalancer.js')
// var cluster = require("cluster");
// var http = require("http");
// var numCPUs = require("os").cpus().length;

// var io = require('socket.io')(3000);
// var redis = require('socket.io-redis');
// io.adapter(redis({ host: 'localhost', port: 6379 }));

// if(cluster.isMaster) {
//   // Fork workers.
//   for (var i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on("listening", function(worker, address) {
//     console.log("worker " + worker.process.pid + " is now connected to " + address.address + ":" + address.port);
//   });

//   cluster.on('exit', function(worker, code, signal) {
//     console.log('worker ' + worker.process.pid + ' died');
//   });
// } else {
//   var server = require('http').createServer();
//   var io = require('socket.io')(server);

//   io.on('connection', function (socket) {
//     console.log('asdf');

//     socket.on('note event', function (data, room) {
//       console.log('yay');
//       // loadBalancer.emit(data, room, socket);
//       socket.broadcast.emit(room + ' event', data);
//       return;
//     });
//   });

//   server.listen(8080);
// }

var cluster  = require('cluster'),
    _portSocket  = 8080,
    _portRedis   = 6379,
    _HostRedis   = 'localhost';

if (cluster.isMaster) {
  var server = require('http').createServer(),
      socketIO = require('socket.io').listen(server),
      redis = require('socket.io-redis');

  socketIO.adapter(redis({ host: _HostRedis, port: _portRedis }));

  var numberOfCPUs = require('os').cpus().length;

  for (var i = 0; i < numberOfCPUs; i++) {
    cluster.fork();
  }

  cluster.on('fork', function(worker) {
  });
  cluster.on('online', function(worker) {
  });
  cluster.on('listening', function(worker, addr) {
  });
  cluster.on('disconnect', function(worker) {
  });
  cluster.on('exit', function(worker, code, signal) {
  });
}

if (cluster.isWorker) {

  var http = require('http');

  http.globalAgent.maxSockets = Infinity;

  var server = http.createServer().listen(_portSocket),
      socketIO = require('socket.io').listen(server),
      redis = require('socket.io-redis');

  socketIO.adapter(redis({ host: _HostRedis, port: _portRedis }));

  socketIO.sockets.on('connection', function(socket, pseudo) {

    socket.setNoDelay(true);

    console.log('nice');

    socket.on('note event', function (data, room) {
      console.log('yay');
      // loadBalancer.emit(data, room, socket);
      socket.broadcast.emit(room + ' event', data);
      return;
    });
    socket.on('exit', function(data) { socket.close();});
  });
}

// //do something when app is closing
// process.on('exit', loadBalancer.closeAllProcesses());

// //catches ctrl+c event
// process.on('SIGINT', loadBalancer.closeAllProcesses());

// //catches uncaught exceptions
// process.on('uncaughtException', loadBalancer.closeAllProcesses());