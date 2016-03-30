module.exports = function(io, rooms) {
  io.of('/roomlist').on('connection', function(socket) {
    console.log('Connection est on server');
    socket.emit('roomupdate', JSON.stringify(rooms));

    socket.on('newroom', function(data) {
      console.log(data);
      rooms.push(data);
      socket.broadcast.emit('roomupdate', JSON.stringify(rooms));
      socket.emit('roomupdate', JSON.stringify(rooms))
    });
  });
}
