var loadBalancer = require('loadBalancer.js');

process.on('message', function(m, socket) {
  if (m) {
    socket.broadcast.emit(room + ' played', data);
    loadBalancer.removeLoadFromProcess(m);
  }
});