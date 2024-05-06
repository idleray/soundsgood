// popup.js

// Listen for changes in the region input
var regionInput = document.getElementById('region');
regionInput.addEventListener('change', onRegionChanged);

// Function to handle region change
function onRegionChanged() {
  var region = regionInput.value;
  // Perform any necessary actions based on the selected region
  console.log('Selected region:', region);

  // Save the selected region to local storage
  chrome.storage.local.set({ 'region': region }, function() {
    console.log('Region saved to local storage');
  });
}