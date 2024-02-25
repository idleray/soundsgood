chrome.commands.onCommand.addListener((command) => {
    if (command === 'play_audio') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'play_audio' });
      });
      // chrome.tts.speak('Hello, world.');
    }
});