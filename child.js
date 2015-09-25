process.on('message', function(m, data, room, socket) {
  if(m === 'socket') {
    socket.broadcast.emit(room + ' event', data);
  }
});