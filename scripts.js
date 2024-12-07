// Function to show an alert
function showAlert() {
  alert('Hello! This is a JavaScript alert from the external file.');
}

// Add event listener for button
document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.button');
  if (button) {
    button.addEventListener('click', showAlert);
  }
});
