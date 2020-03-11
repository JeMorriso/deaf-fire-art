// this function wasn't working as a callback
// function openForm() {
//   document.getElementById("email-popup").style.display = "block";
// }

document.getElementById("open-button").addEventListener("click", () => {
  document.getElementById("email-popup").style.display = "block";
});

document.getElementById("cancel-button").addEventListener("click", () => {
  document.getElementById("email-popup").style.display = "none";
  // clear text
  document.getElementById("email-address").value = "";
  document.getElementById("email-subject").value = "";
  document.getElementById("email-body").value = "";
});

var imageIcons = document.getElementsByClassName("email-icon");
var toggle = "block";

for(let i = 0; i < imageIcons.length; i++) {
  imageIcons[i].addEventListener("click", function() {
    var itemDescription = imageIcons[i].parentElement.previousElementSibling.innerText;
    document.getElementById("email-popup").style.display = toggle;
    toggle = toggle === "block" ? "none" : "block";
    document.getElementById("email-subject").value = itemDescription;
  })
}

// only exists if admin logged in
var deleteIcons = document.getElementsByClassName("delete-image");

for (let i = 0; i < deleteIcons.length; i++) {
  deleteIcons[i].addEventListener("click", () => {
    if (window.getComputedStyle(document.getElementById("delete-button")).getPropertyValue("display") === "none") {
      document.getElementById("delete-button").style.display = "inline-block";
    }
    if (window.getComputedStyle(document.getElementById("cancel-delete")).getPropertyValue("display") === "none") {
      document.getElementById("cancel-delete").style.display = "inline-block";
    }
    deleteIcons[i].parentElement.style.display = "none";
  })
}

document.getElementById("cancel-delete").addEventListener("click", () => {
  var galleryImages = document.getElementsByClassName("gallery-image");
  for (let i = 0; i < galleryImages.length; i++) {
    galleryImages[i].style.display = "block";    
  }
})

document.getElementById("delete-button").addEventListener("click", () => {

  // stores all the files that are to be deleted on the backend
  const data = [];

  //const data2 = {hello: 'governor'};

  var galleryImages = document.getElementsByClassName("gallery-image");
  for (let i = 0; i < galleryImages.length; i++) {
    // if display is set to none, add file name to be deleted on backend
    if (galleryImages[i].style.display === "none") {
      data.push(galleryImages[i].dataset.filename);
      console.log(data);
    }
  }

  fetch('/gallery/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log('Success:', data);
      //alert("Images successfully deleted!")
    }).catch((error) => {
      console.error('Error:', error);
    });
});

// function openFormWithDescription(itemDescription) {
//   document.getElementById("email-popup").style.display = "block";
//   document.getElementById("email-subject").value = itemDescription;
// }
// }