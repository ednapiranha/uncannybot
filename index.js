'use strict';

const RtmClient = require('@slack/client').RtmClient;
const RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const nconf = require('nconf');

nconf.argv().env().file({ file: 'config.json' });

const rtm = new RtmClient(nconf.get('slackKey'));

let channels = {};
let uid;

rtm.start();

function sendResponse(data) {
  if (data.text.match(/(lo{1,}l|haha|hehe)/gi)) {
    rtm.sendMessage('lol!', data.channel);
    return;
  }

  if (data.text.match(/wonky/gi) || data.text.indexOf('@' + uid) > -1) {
    if (data.text.match(/thanks/gi)) {
      rtm.sendMessage("You're welcome :D", data.channel);
      return;
    }

    if (data.text.match(/you’re weird/gi)) {
      rtm.sendMessage('I am the walrus', data.channel);
      return;
    }

    rtm.sendMessage('Are you talking to me? I am waiting for Godot.', data.channel);
    return;
  }
}

function checkMessageType(data) {
  if (data.subtype) {
    switch (data.subtype) {
      case 'channel_join':
        channels[data.channel] = data.channel;
        rtm.sendMessage("Hi, I'm just saying hi that's all. Ok.", data.channel);
        break;

      default:
        break;
    }

    return;
  }

  if (data.text) {
    sendResponse(data);
  }
}

rtm.on(RTM_CLIENT_EVENTS.RTM.AUTHENTICATED, (data) => {
  uid = data.self.id;
  console.log('connected');
});

rtm.on(RTM_EVENTS.MESSAGE, (data) => {
  switch (data.type) {
    case 'message':
      checkMessageType(data);
      break;

    default:
      break;
  }
});

rtm.on(RTM_EVENTS.REACTION_ADDED, (data) => {
  switch (data.type) {
    case 'reaction_added':
      console.log('noted reaction ', data.item.ts);
      break;

    default:
      break;
  }
});
