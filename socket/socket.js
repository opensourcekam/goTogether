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

    io.of('/messages').on('connection', function(socket) {
        console.log('Connection est on server');
        socket.on('joinroom', function(data) {
          socket.userName = data.userName;
          socket.userPhoto = data.userPhoto;
          socket.join(data.roomNum);
        });

        socket.on('newMsg', function(data){
          console.log(data)
          socket.broadcast.to(data.roomNum).emit('msgFeed', JSON.stringify(data));
        });

      });


    }
