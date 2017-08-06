// Practice with modular files to handle various states
const admissionLink = "www.admission.princeton.edu/"

// parses message.nlp to yield confidence and value
function firstEntity(nlp, name) {
  return nlp && nlp.entities && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
}

// interprets the generic question by analyzing confidence for various entitites
exports.interpretGeneric = function(senderID, message) {
	const social = firstEntity(message.nlp, 'princeton_general_social');
	const admission = firstEntity(message.nlp, 'princeton_general_admission');
	const classes = firstEntity(message.nlp, 'princeton_general_classes')
	const general = firstEntity(message.nlp, 'princeton_general');
	console.log(social);
	console.log(admission);
	console.log(general);
	if (general && general.confidence > 0.8) {
		if (social && social.confidence > 0.8)
			return sendTextMessage(senderID, "If you are interested in social life on campus, please select the social life tab on the menu.");
		if (admission && admission.confidence > 0.8)
			return sendTextMessage(senderID, "For admission information, please see " + admissionLink);
		if (classes && classes.confidence > 0.8)
			return sendTextMessage(senderID, "If you are interested in social life on campus, please select the social life tab on the menu.");
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