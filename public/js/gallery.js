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

for(let i = 0; i < imageIcons.length; i++) {
  imageIcons[i].addEventListener("click", function() {
    var itemDescription = imageIcons[i].parentElement.previousElementSibling.innerText;
    document.getElementById("email-popup").style.display = "block";
    document.getElementById("email-subject").value = itemDescription;
  })
}

// function openFormWithDescription(itemDescription) {
//   document.getElementById("email-popup").style.display = "block";
//   document.getElementById("email-subject").value = itemDescription;
// }
// }