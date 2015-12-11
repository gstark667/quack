var net = require('net');
var clients = [];

var server = net.createServer(function(socket) {
   socket.user = -1;
   socket.on('data', function(data) {
      var values = data.toString().split(':');
      if (values[0] == 'user_connect')
      {
         if (socket.user != -1)
         {
            console.log('user already connected');
            return;
         }

         socket.user = clients.length;
         clients.push({"name": values[1], "socket": socket});
         console.log(clients);
      }
      else if (values[0] == 'send_message')
      {
         console.log(values);
      }
      console.log(clients[socket.user] + ':' + data.toString());
   });

   socket.on('close', function(data) {
      clients.pop(socket.user);
      console.log('User Disconnecting');
   });
});

server.listen(6667, '127.0.0.1');
