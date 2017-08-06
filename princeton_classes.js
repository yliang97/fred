const threshold = 0.8;
const academic_areas = "https://www.princeton.edu/academics/areas-of-study"
// parses message.nlp to yield confidence and value
function firstEntity(nlp, name) {
  return nlp && nlp.entities && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
}

exports.interpretClasses = function(senderID, message) {
	const general = firstEntity(message.nlp, 'princeton_classes');
	if (general && general.confidence > threshold) {
		const describe = firstEntity(message.nlp, 'princeton_classes_description');
		if (describe && describe.confidence > threshold) {
			return sendTextMessage(senderID, `Classes at Princeton range from a wide variety of subjects. Princeton offers 36 majors as well as many more certificates (minors), 
				ranging from Computer Science to Portuguese. For more information, check out ` + academic_areas + `. You can also type in a subject, like "Computer Science
				or "Portuguese" to learn more`);

		}
	}
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