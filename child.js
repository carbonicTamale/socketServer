process.on('message', function(m, data, room, socket) {
  if(m === 'socket') {
    console.log(m, data, room, socket)
    socket.broadcast.emit(room + ' event', data);
  }
});