'use strict';

var irc = require('irc');
var nconf = require('nconf');

nconf.argv().env().file({ file: 'config.json' });

var client = new irc.Client(nconf.get('server'), nconf.get('botName'), {
  channels: nconf.get('channels'),
});

nconf.get('channels').forEach(function (channel) {
  client.join(channel, function () {
    console.log('connected to ', channel);
    client.say('NickServ', 'IDENTIFY ' + nconf.get('password'));
  });
});

client.addListener('registered', function (message) {
  console.log('registered ', message);
});

client.addListener('message', function (from, to, message) {
  if (message.match(/jbuck/i)) {
    client.say(to, 'WE WILL BUILD A WALL AND MAKE JBUCK PAY FOR IT.');
  }
});

client.addListener('error', function (message) {
  console.error('error: ', message);
});
