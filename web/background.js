let phishingData;
chrome.runtime.onMessage.addListener(function (request, sender = "content.js", sendResponse) {
  if (request.action === 'analyzePage') {
    const data = request.data;
    // Call the function to initiate analysis with the received data
    initiateAnalysis(data, sendResponse);
  }
  return true;
});

function initiateAnalysis(data, sendResponse) {
  // Making a request to localhost machine learning model
  const modelEndpoint = 'http://127.0.0.1:5000/predict';

  fetch(modelEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.text()) // Assuming the ML model sends a JSON string
    .then(jsonString => {
      try {
        const result = JSON.parse(jsonString);

        if (typeof result.my_integer === 'number') {
          const phishingScore = result.my_integer;
          chrome.storage.local.set({ 'phishingScore': phishingScore }, function () {
            sendResponse({ phishingScore: phishingScore });
          });
        } else {
          console.error('Error: ML model response does not contain a valid "my_integer" field.');
          sendResponse({ phishingScore: 0 });
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        sendResponse({ phishingScore: 0 });
      }
    })
    .catch(error => {
      console.error('Error analyzing page:', error);
      sendResponse({ phishingScore: 0 });
    });
}
chrome.runtime.onMessage.addListener(function (request, sender = "popup.js", sendResponse) {
  if (request.action === 'initiateAnalysis') {
    initiateAnalysis(phishingData, sendResponse);
    sendResponse({ message: "Action perfomed" });
  }
  return true;
});