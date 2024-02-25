document.addEventListener('DOMContentLoaded', function() {
    var saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', function(event) {
      event.preventDefault();

      // Get the selected service and subscription key values
      var serviceSelect = document.getElementById('service');
      var selectedService = serviceSelect.value;

      var apiKeyInput = document.getElementById('apiKey');
      var subscriptionKey = apiKeyInput.value;

      // Perform any necessary actions with the selected values
      console.log('Selected Service:', selectedService);
      console.log('Subscription Key:', subscriptionKey);

      // Save the values to local storage
      chrome.storage.local.set({ 'selectedService': selectedService, 'subscriptionKey': subscriptionKey }, function() {
        console.log('Values saved to local storage');
      });
    });
});