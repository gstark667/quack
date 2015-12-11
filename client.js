var fs = require('fs');
var osenv = require('osenv');
var net = require('net');

var friends = [];
var servers = [];
var user = {};

function load_config() {
   var config = JSON.parse(fs.readFileSync(osenv.home() + '/.duckling/client-config.json', 'utf-8'));
   user['name'] = config.user['name'];

   for (x in config.friends) {
      if (friends.indexOf(config.friends[x]) == -1) {
         friends.push(config.friends[x]);
      }
   }

   for (x in config.servers) {
      if (servers.indexOf(config.servers[x]) == -1) {
         servers.push(config.servers[x]);
      }
   }
}

function is_friend(name) {
   for (x in friends) {
      if (friends[x].name == name)
         return true;
   }
   return false;
}

var client = new net.Socket();
client.connect(6667, '127.0.0.1', function() {
   client.write('user_connect:' + user['name']);
   console.log('Connected');
});

client.on('data', function(data) {
   console.log('Received: ' + data.toString());

   values = data.toString().split(':');
   console.log(values[1]);
   if (values[0] == 'is_friend')
   {
      var return_value = "n";
      if (is_friend(values[1]))
      {
         return_value = "y";
      }
      client.write(return_value);
   }

});

client.on('close', function() {
   console.log('Connection Closed');
});

load_config();
client.write('send_message:hello world\:test');
