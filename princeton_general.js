// Practice with modular files to handle various states



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