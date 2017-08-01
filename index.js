'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const token = process.env.FB_PAGE_ACCESS_TOKEN
var apiAiClient = require('apiai')(process.env.APIAI_SMALLTALK_TOKEN)

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
	res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// message webhook
app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
          //processMessage(event); // this is using api.ai ... but switching to wit.ai
        } else if (event.postback) {
          receivedPostback(event);
        }
      });
    });
    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});


// using api_ai small talk as intro, continue to refine small talk here...note that functionality is not that great - not using it for now so I can focus on wit.ai
// function processMessage(event) {
// 	const senderId = event.sender.id;
// 	const message = event.message.text;

// 	const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'fred-talks'});

// 	apiaiSession.on('response', (response) => {
// 		const result = response.result.fulfillment.speech;
// 		sendTextMessage(senderId, result);
// 	});

// 	apiaiSession.on('error', (error) => {
// 		console.log(error);
// 	});
// 	apiaiSession.end();
// }

function firstEntity(nlp, name, senderID) {
  return nlp && nlp.entities[name];
}

function handleMessage(senderID, message) {
	
    // check greeting is here and is confident
    const greeting = firstEntity(message.nlp, 'greetings', senderID);
    sendTextMessage(senderID, JSON.stringify((message.nlp).entities));

    // sendTextMessage(senderID, JSON.stringify(greeting.confidence));
    // sendTextMessage(senderID, JSON.stringify(greeting.value));
    // const location = firstEntity(message.nlp, 'location', senderID);
    //sendTextMessage(senderID, 'Check to see if this works ' + (JSON.stringify(greeting)));
    // if (greeting && greeting.confidence > 0.8) {
    //   sendTextMessage(senderID, 'Hi there!');
    // } else { 
    //  // default logic
    //  sendTextMessage(senderID, 'Can you say that again?');
    // }
	// if (intent && intent.confidence > 0.8) {
	// 	sendTextMessage(senderID, 'this went through');
	// 	const location = firstEntity(message.nlp, 'location');
	// 	if (location && location.confidence > 0.8)
	// 		sendTextMessage(senderID, 'You are searching for');
	// 		//sendTextMessage(senderID, 'The location of ' + location.value + 'is https://www.google.com/maps/place/' + location.value);
	// 	else
	// 		sendTextMessage(senderID, 'Failed to recognize command, try again');
	// }
	// else sendTextMessage(senderID, 'Your query failed');

}


function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (messageText) {
      case 'generic':
        sendGenericMessage(senderID);
        break;

      default:
        handleMessage(senderID, message);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function sendGenericMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",               
            image_url: "http://messengerdemo.parseapp.com/img/rift.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",               
            image_url: "http://messengerdemo.parseapp.com/img/touch.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };  

  callSendAPI(messageData);
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

// Calling send API 
function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: token},
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}

// What to do after receiving the Postback
function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback 
  // button for Structured Messages. 
  var payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " + 
    "at %d", senderID, recipientID, payload, timeOfPostback);

  // If payload is Princeton, use princeton bot
  if (payload == "PRINCETON") {
  	apiAiClient = require('apiai')(process.env.APIAI_PRINCETON_TOKEN)
  }
  else if (payload == "GENERIC") {
  	apiAiClient = require('apiai')(process.env.APIAI_SMALLTALK_TOKEN)
  }
  else if (payload == "GET_STARTED_PAYLOAD") {
  	sendTextMessage(senderID, "Get started by chatting with me, or choosing something from the menu")
  }
  sendTextMessage(senderID, "Postback called. Proceed with chat");
}





// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})