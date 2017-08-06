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
	const classes = firstEntity(message.nlp, 'princeton_general_classes');
	const difficulty = firstEntity(message.nlp, 'princeton_general_difficulty');
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
			return sendTextMessage(senderID, "If you are interested in how classes are, please select the classes tab on the menu.");
		if (difficulty && difficulty.confidence > 0.8) {
			if (difficulty.value == 'easy' || difficulty.value == 'simple')
				sendTextMessage(senderID, "Princeton will be harder than you expect! Don't underestimate the difficulty of classes");
			else if (difficulty.value == 'hard' || difficulty.value == 'difficult' || difficulty.value = 'strenuous')
				sendTextMessage(senderID, "Yes, Princeton is hard. Yet don't be worred! Check the classes tab for more information about how to prepare.")
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