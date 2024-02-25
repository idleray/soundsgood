document.getElementById('configButton').addEventListener('click', function() {
  chrome.tabs.create({ url: 'options.html' });
});