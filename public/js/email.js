// Email form event listeners
document.getElementById('email-open').addEventListener('click', () => {
  document.getElementById('email-popup').style.display = 'block';
});

document.getElementById('email-cancel').addEventListener('click', () => {
  // clear text
  document.getElementById('email-address').value = '';
  document.getElementById('email-subject').value = '';
  document.getElementById('email-body').value = '';
  document.getElementById('email-popup').style.display = 'none';
});
