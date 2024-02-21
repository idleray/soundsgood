document.addEventListener('selectionchange', () => {
    console.log('Selection changed');
    const selection = document.getSelection();
    if (selection && !selection.isCollapsed) {
      const iconElement = document.createElement('div');
      iconElement.classList.add('tts-icon');
      
      /* Add click event listener for the icon */
      iconElement.addEventListener('click', () => {
        // Code to send selected text to server and handle speech playback
      });
      selection.anchorNode.parentElement.appendChild(iconElement);
    } else {
      // Remove icons if no text is selected
      const existingIcons = document.querySelectorAll('.tts-icon');
      for (const icon of existingIcons) {
        icon.remove();
      }
    }
});