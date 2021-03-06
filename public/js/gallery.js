// check if the user is logged in
// TODO: use AJAX call instead
let isLoggedIn = false;
if (document.getElementsByClassName('card-admin').length > 0) {
  isLoggedIn = true;
}

// Email image icon event listeners
const emailIcons = document.getElementsByClassName('card-email');
// let toggle = 'block';

for (let i = 0; i < emailIcons.length; i++) {
  emailIcons[i].addEventListener('click', (e) => {
    const itemDescription =
      e.target.parentElement.previousElementSibling.innerText;
    document.getElementById('email-subject').value = itemDescription;

    // Not correct! style.display only get style that has been defined inline using style attribute
    // const popupDisplay = document.getElementById('email-popup').style.display;

    // Retrieves all styles, including those defined in CSS
    const popupDisplay = window.getComputedStyle(
      document.getElementById('email-popup'),
    ).display;
    document.getElementById('email-popup').style.display =
      popupDisplay === 'block' ? 'none' : 'block';
  });
}

// drag functions
let dragElement;
const grid = document.getElementsByClassName('grid')[0];
const cards = document.getElementsByClassName('card');
const order = {};

const onDragOver = (e) => {
  // if event fired somewhere in grid gaps
  if (e.target.closest('.card') === null) {
    return;
  }

  // by default, resets drag operation to 'none', preventing the ability to drop onto the target
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';

  const targetCard = e.target.closest('.card');

  if (targetCard !== dragElement) {
    // getBoundinClientRect contains location-info about the element (relative to the viewport)
    const targetPos = targetCard.getBoundingClientRect();
    // checking that dragEl is dragged over half the target y-axis or x-axis. (therefor the .5)
    const next =
      (e.clientY - targetPos.top) / (targetPos.bottom - targetPos.top) > 0.5 ||
      (e.clientX - targetPos.left) / (targetPos.right - targetPos.left) > 0.5;
    grid.insertBefore(
      dragElement,
      (next && targetCard.nextSibling) || targetCard,
    );
  }
};

const onDragEnd = (e) => {
  // MDN says default action varies
  e.preventDefault();

  const targetCard = e.target.closest('.card');
  targetCard.classList.remove('drag-ghost');

  grid.removeEventListener('dragover', onDragOver);
  grid.removeEventListener('dragend', onDragEnd);

  // update the order of the cards
  const newCards = document.getElementsByClassName('card');
  [...newCards].forEach((card, i) => {
    const dbId = card.querySelector('.card-top a').dataset.id;
    order[dbId] = i;
  });
};

// Admin event listeners
if (isLoggedIn) {
  // document.getElementsByClassName() returns HTMLCollectionOf which needs to be converted to an array to use forEach
  [...cards].forEach((card, i) => {
    const dbId = card.querySelector('.card-top a').dataset.id;
    order[dbId] = i;

    card.setAttribute('draggable', true);
    card.classList.add('draggable');
  });

  // draggable card listeners
  grid.addEventListener('dragstart', (e) => {
    console.log('drag!');

    // show the 'delete' and 'cancel' buttons if they aren't already showing
    document.getElementById('update-btn').style.display = 'inline-block';
    document.getElementById('cancel-btn').style.display = 'inline-block';

    // currentTarget always refers to the event to which the listener was attached, no matter if you click on a child element. Does not change as the event bubbles.
    // dragElement = e.currentTarget;

    // get the clicked element's card ancestor
    dragElement = e.target.closest('.card');

    // the data being dragged will be moved
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/x-moz-node', dragElement);

    grid.addEventListener('dragover', onDragOver);
    grid.addEventListener('dragend', onDragEnd);

    // inside setTimeOut so that dragged card does not also become blank
    setTimeout(() => {
      dragElement.classList.add('drag-ghost');
    }, 0);
  });

  // card delete icon listeners
  const deleteIcons = document.getElementsByClassName('card-delete');

  for (let i = 0; i < deleteIcons.length; i++) {
    deleteIcons[i].addEventListener('click', (e) => {
      // show the 'delete' and 'cancel' buttons if they aren't already showing
      document.getElementById('update-btn').style.display = 'inline-block';
      document.getElementById('cancel-btn').style.display = 'inline-block';

      // Hide the image
      e.target.closest('.card').style.display = 'none';
    });
  }

  // cancel button listener
  document.getElementById('cancel-btn').addEventListener('click', () => {
    const cards = document.getElementsByClassName('card');
    for (const card of cards) {
      card.style.display = 'block';
    }

    // Hide delete / cancel buttons
    document.getElementById('update-btn').style.display = 'none';
    document.getElementById('cancel-btn').style.display = 'none';
  });

  // upodate button listener
  document.getElementById('update-btn').addEventListener('click', () => {
    // stores all the files that are to be deleted / updated on the backend
    const files = { toDelete: [], toUpdate: order };

    const cards = document.getElementsByClassName('card');
    for (const card of cards) {
      // if display is set to none, add file name to be deleted on backend
      if (card.style.display === 'none') {
        const dbId = card.querySelector('.card-top a').dataset.id;
        files.toDelete.push(dbId);
      }
    }

    fetch('/gallery/update', {
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

    // add window to avoid ESLint no-unrestricted-globals error
    window.location.reload();
  });
}
