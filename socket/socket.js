module.exports = function(io, rooms) {
    io.of('/roomlist').on('connection', function(socket) {
      //console.log('Connection est on server');
      socket.emit('roomupdate', JSON.stringify(rooms));

      socket.on('newroom', function(data) {
        console.log(data);
        rooms.push(data);
        socket.broadcast.emit('roomupdate', JSON.stringify(rooms));
        socket.emit('roomupdate', JSON.stringify(rooms))
      });
    });

    // messages soc
    io.of('/messages').on('connection', function(socket) {
      console.log('Connection est on server');
      socket.on('joinroom', function(data) {
        socket.userName = data.userName;
        socket.userPhoto = data.userPhoto;
        socket.join(data.roomNum);
      });


      socket.on('newMsg', function(data) {
        console.log('USER DATA**********: ', data)
        socket.broadcast.to(data.roomNum).emit('msgFeed', JSON.stringify(data));
      });


      io.of('/messages').clients(function(error, clients) {
        if (error) throw error;
        console.log(clients); // => [PZDoMHjiu8PYfRiKAAAF, Anw2LatarvGVVXEIAAAD]
      });

      // code in question
      function updateUsers(room) {
        console.log('data');
        var numPresent = io.of('/messages').server.engine.clientsCount;
        console.log(numPresent);

        // Rooms became actual types with a .length property in 1.4
        // var userList = [];
        // for (var i in getUsers) {
        //   if (object.hasOwnProperty(i)) {
        //     userList.push({
        //       user: getUsers[i].userName,
        //       userPhoto: getUsers[i].userPhoto
        //     });
        //   }
        // }
        // socket.to(room).emit('updateUserList', JSON.stringify(userList));
      }

      socket.on('updateList', function(data) {
        console.log('got updateList event now calling updateUsers', data);
        updateUsers(data.room);
      });
    });
  }
  // code in question
