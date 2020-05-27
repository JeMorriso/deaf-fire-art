// check if the user is logged in
let isLoggedIn = false;
if (document.getElementsByClassName('admin').length > 0) {
  isLoggedIn = true;
}

// Email form event listeners
document.getElementById('open-button').addEventListener('click', () => {
  document.getElementById('email-popup').style.display = 'block';
});

document.getElementById('cancel-button').addEventListener('click', () => {
  document.getElementById('email-popup').style.display = 'none';
  // clear text
  document.getElementById('email-address').value = '';
  document.getElementById('email-subject').value = '';
  document.getElementById('email-body').value = '';
});

// Email image icon event listeners
const emailIcons = document.getElementsByClassName('card-email');
// let toggle = 'block';

for (let i = 0; i < emailIcons.length; i++) {
  emailIcons[i].addEventListener('click', function () {
    const itemDescription =
      emailIcons[i].parentElement.previousElementSibling.innerText;
    document.getElementById('email-subject').value = itemDescription;

    // Not correct! style.display only get style that has been defined inline using style attribute
    // const popupDisplay = document.getElementById('email-popup').style.display;

    // Retrieves all styles, including those defined in CSS
    const popupDisplay = window.getComputedStyle(
      document.getElementById('email-popup'),
    ).style.display;
    // Creates inline style
    document.getElementById('email-popup').style.display =
      popupDisplay === 'block' ? 'none' : 'block';
  });
}

// Admin event listeners
if (isLoggedIn) {
  const deleteIcons = document.getElementsByClassName('card-delete');

  for (let i = 0; i < deleteIcons.length; i++) {
    deleteIcons[i].addEventListener('click', () => {
      // show the 'delete' and 'cancel' buttons if they aren't already showing
      const deleteDisplay = window.getComputedStyle(
        document.getElementById('delete-btn'),
      ).style.display;
      document.getElementById('delete-btn').style.display =
        deleteDisplay === 'inline-block' ? 'none' : 'inline-block';

      const cancelDisplay = window.getComputedStyle(
        document.getElementById('cancel-btn'),
      ).style.display;
      document.getElementById('cancel-btn').style.display =
        cancelDisplay === 'inline-block' ? 'none' : 'inline-block';

      // Hide the image
      deleteIcons[i].parentElement.parentElement.style.display = 'none';
    });
  }

  document.getElementById('cancel-btn').addEventListener('click', () => {
    const galleryImages = document.getElementsByClassName('gallery-image');
    for (let i = 0; i < galleryImages.length; i++) {
      galleryImages[i].style.display = 'block';
    }
  });

  document.getElementById('delete-btn').addEventListener('click', () => {
    // stores all the files that are to be deleted on the backend
    const files = [];

    const galleryImages = document.getElementsByClassName('gallery-image');
    for (let i = 0; i < galleryImages.length; i++) {
      // if display is set to none, add file name to be deleted on backend
      if (galleryImages[i].style.display === 'none') {
        files.push(galleryImages[i].dataset.filename);
        console.log(files);
      }
    }

    fetch('/gallery/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(files),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });
}
