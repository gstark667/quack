var net = require('net');
var clients = {};

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

         socket.user = values[1];
         clients[values[1]] = socket;
      }
      else if (values[0] == 'send_message')
      {
         console.log(socket.user + ' sent message: ' + values[2]);
         clients[values[1]].write('recv_message:' + socket.user + ':' + values[2]);
      }
   });

   socket.on('close', function(data) {
      delete clients[socket.user];
      console.log('User Disconnecting');
   });
});

server.listen(6667, '127.0.0.1');
