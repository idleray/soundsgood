let iconDisplayed = false;
let subscriptionKey = ""
const region = 'eastus';
const endpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;

// document.addEventListener('selectionchange1', () => {
//     console.log('Selection changed');
//     const selection = document.getSelection();
//     if (selection && !selection.isCollapsed) {
//       const iconElement = document.createElement('div');
//       iconElement.classList.add('tts-icon');

//       const range = selection.getRangeAt(0);
//       const selectedText = range.toString();
//       if(selectedText) {
//         console.log(range)
//         const rect = range.getBoundingClientRect();
//         // iconElement.style.right = `${containerRect.right + 5}px`; // Adjust offset
//         iconElement.style.top = `${rect.top}px`;
//         iconElement.style.left = `${rect.right}px`;
//       }
      
      
      
//       /* Add click event listener for the icon */
//       iconElement.addEventListener('click', () => {
//         // Code to send selected text to server and handle speech playback
//       });
//       selection.anchorNode.parentElement.appendChild(iconElement);
//       const ttsIcon = document.querySelector('.tts-icon');
//       console.log(ttsIcon.style)
//       const a = chrome.runtime.getURL('assets/babe.jpeg')
//       const b = `url('${a}')`
//       console.log(b)
// ttsIcon.style.backgroundImage = b;
//     } else {
//       // Remove icons if no text is selected
//       const existingIcons = document.querySelectorAll('.tts-icon');
//       for (const icon of existingIcons) {
//         icon.remove();
//       }
//     }
// });

// Add click event listener for all icon elements (outside of mouseup handler)
// document.addEventListener('click', (event) => {
//   console.log("click")
//   const target = event.target;
//   if (target.classList.contains('tts-icon')) {
//     console.log("tts-icon clicked")
//     const selection = document.getSelection();
//     const text = selection.toString().trim();
//     if (text) {
//       sendTextToTTSAPI(text);
//     }
//   }
// });

init()

document.addEventListener('mouseup1', (event) => {
  console.log("mouseup");
    const selection = document.getSelection();
    if (selection && !selection.isCollapsed) {
      const iconElement = document.createElement('div');
      iconElement.classList.add('tts-icon');

      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      if(selectedText) {
        console.log(range)
        const rect = range.getBoundingClientRect();
        console.log(rect)
        // iconElement.style.right = `${containerRect.right + 5}px`; // Adjust offset
        iconElement.style.top = `${rect.top}px`;
        iconElement.style.left = `${rect.right}px`;
      }
      
      
      
      /* Add click event listener for the icon */
      iconElement.addEventListener('click', (event) => {
        
        console.log("clicked")
        // Code to send selected text to server and handle speech playback
        const selection = document.getSelection();
        // const text = selection.toString().trim();
        if (text) {
          sendTextToTTSAPI(text);
        }
      });
      document.body.appendChild(iconElement);
      // selection.anchorNode.parentElement.appendChild(iconElement);

//       const ttsIcon = document.querySelector('.tts-icon');
//       console.log(ttsIcon.style)
//       const a = chrome.runtime.getURL('assets/babe.jpeg')
//       const b = `url('${a}')`
//       console.log(b)
// ttsIcon.style.backgroundImage = b;
    } else {
      // Remove icons if no text is selected
      // const existingIcons = document.querySelectorAll('.tts-icon');
      // for (const icon of existingIcons) {
      //   icon.remove();
      // }
    }
});

function init() {
  readSubscriptionKey();
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'play_audio') {
      const selection = document.getSelection();
      const text = selection.toString().trim();
      if (text) {
        sendTextToTTSAPI(text);
      }
  
    }
  });
  
  // Add a listener for changes to the local storage
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) {
      if (key === 'subscriptionKey') {
        var storageChange = changes[key];
        console.log('Subscription Key in namespace "%s" changed. Old value was "%s", new value is "%s".',
                    namespace,
                    storageChange.oldValue,
                    storageChange.newValue);
        // Trigger any action based on the updated subscription key
        subscriptionKey = storageChange.newValue;
      }
    }
  });
}

// Function to send text to Azure TTS API
async function sendTextToTTSAPI(text) {
  console.log("sendTextToTTSAPI")
  if(!subscriptionKey) {
    console.log("subscriptionKey not found")
    return
  }
  // console.log("subscriptionKey: ", subscriptionKey)
  const url = endpoint;

  const headers = {
    'Ocp-Apim-Subscription-Key': subscriptionKey,
    'Content-Type': 'application/ssml+xml',
    // 'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3'
    'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm'
  };

  const body = `<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Female' name='en-US-AriaNeural'>${text}</voice></speak>`;

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: body
  });

  if (response.ok) {
    // Handle successful response
    const audioBlob = await response.blob();
    // Do something with the audio blob (e.g., play it, save it, etc.)
    const audio = new Audio();
    audio.addEventListener('ended', () => {
      // Audio playback ended
      URL.revokeObjectURL(audio.src); // Release the blob URL
    });

    // Set the audio source to the blob URL
    audio.src = URL.createObjectURL(audioBlob);

    // Play the audio
    audio.play();
  } else {
    // Handle error response
    console.error('Error:', response.status, response.statusText);
  }
}



async function readSubscriptionKey() {
  subscriptionKey = await readLocalStorage('subscriptionKey');
  console.log(subscriptionKey)
}

async function readLocalStorage(key) {
  // Read the value from the local storage
  const result = await chrome.storage.local.get(key)

  if (result[key]) {
    return result[key]
  }
}