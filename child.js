var loadBalancer = require('./loadBalancer.js');

process.on('message', function(data, room, socket) {
  if(room) {
    socket.broadcast.emit(room + ' played', data);
    loadBalancer.removeLoadFromProcess(room);
  }
});