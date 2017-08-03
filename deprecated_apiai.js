// var apiAiClient = require('apiai')(process.env.APIAI_SMALLTALK_TOKEN)


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
