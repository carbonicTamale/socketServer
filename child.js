process.on('message', function(data, room, socket) {
  if(room) {
    socket.broadcast.emit(room + ' event', data);
    loadBalancer.removeLoadFromProcess(room);
  }
});