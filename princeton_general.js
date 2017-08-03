// Practice with modular files to handle various states


// parses message.nlp to yield confidence and value
function firstEntity(nlp, name) {
  return nlp && nlp.entities && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
}

// interprets the generic question by analyzing confidence for various entitites
exports.interpretGeneric = function(senderID, message) {
	const social = firstEntity(message.nlp, 'princeton-general-social');
	const admission = firstEntity(message.nlp, 'location-general-admission');
	const general = firstEntity(message.nlp, 'princeton-general');
	if (general && general.confidence > 0.8) {
		if (social && social.confidence > 0.8)
			return sendTextMessage(senderID, "If you are interested in social life on campus, please select the social life tab on the menu.");
		if (admission && admission.confidence > 0.8) {
			return sendTextMessage(senderID, "For admission information...");
		}
	}


}


// generic princeton questions
exports.answerGeneric = function(senderID, message) {
	return sendTextMessage(senderID, "Message received");
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

  return messageData;
}