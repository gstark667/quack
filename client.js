var fs = require('fs');
var osenv = require('osenv');
var net = require('net');

var user = {};
var servers = [];
var friends = [];

var config_path = osenv.home() + '/.quack/client-config.json';

function load_config() {
   var config = JSON.parse(fs.readFileSync(osenv.home() + '/.quack/client-config.json', 'utf-8'));
   user = config.user;

   for (x in config.servers) {
      if (servers.indexOf(config.servers[x]) == -1) {
         servers.push(config.servers[x]);
      }
   }

   for (x in config.friends) {
      if (friends.indexOf(config.friends[x]) == -1) {
         friends.push(config.friends[x]);
      }
   }
}

function save_config() {
   fs.writeFileSync(config_path, JSON.stringify({"user": user, "friends": friends, "servers": servers}));
}

function is_friend(name) {
   for (x in friends) {
      if (friends[x].name == name)
         return true;
   }
   return false;
}

function add_friend(name) {
   friends.push({"name": name});
   save_config();
}

var client = new net.Socket();
client.connect(6667, '127.0.0.1', function() {
   client.write('user_connect:' + user['name']);
   console.log('Connected');
});

client.on('data', function(data) {
   console.log('Received: ' + data.toString());

   values = data.toString().split(':');
   if (values[0] == 'is_friend')
   {
      var return_value = "n";
      if (is_friend(values[1]))
      {
         return_value = "y";
      }
      client.write(return_value);
   }
   else if(values[0] == 'recv_message')
   {
      console.log(values[2]);
   }
});

client.on('close', function() {
   console.log('Connection Closed');
});

function quit() {
   client.destroy();
   save_config();
}

load_config();
client.write('user_connect:' + user['name']);
client.write('send_message:octalus:hello world\:test');
