/*
 * This function displays the modal for adding a photo to a user page.
 */
function displayAddPhotoModal() {

  var backdropElem = document.getElementById('modal-backdrop');
  var addPhotoModalElem = document.getElementById('add-photo-modal');

  // Show the modal and its backdrop.
  backdropElem.classList.remove('hidden');
  addPhotoModalElem.classList.remove('hidden');

}


/*
 * This function closes the modal for adding a photo to a user page, clearing
 * the values in its input elements.
 */
function closeAddPhotoModal() {

  var backdropElem = document.getElementById('modal-backdrop');
  var addPhotoModalElem = document.getElementById('add-photo-modal');

  // Hide the modal and its backdrop.
  backdropElem.classList.add('hidden');
  addPhotoModalElem.classList.add('hidden');

  clearPhotoInputValues();

}


/*
 * This function clears the values of all input elements in the photo modal.
 */
function clearPhotoInputValues() {

  var inputElems = document.getElementsByClassName('photo-input-element');
  for (var i = 0; i < inputElems.length; i++) {
    var input = inputElems[i].querySelector('input, textarea');
    input.value = '';
  }

}


/*
 * Small function to get a person's identifier from the current URL.
 */
function getPersonIDFromLocation() {
  var pathComponents = window.location.pathname.split('/');
  if (pathComponents[0] !== '' && pathComponents[1] !== 'people') {
    return null;
  }
  return pathComponents[2];
}


/*
 * This function uses Handlebars on the client side to generate HTML for a
 * person photo and adds that person photo HTML into the DOM.
 */
function insertNewPhoto() {

  var photoURL = document.getElementById('photo-url-input').value || '';
  var photoCaption = document.getElementById('photo-caption-input').value || '';

  if (photoURL.trim()) {

    var personID = getPersonIDFromLocation();
    if (personID) {
      console.log("== Person ID:", personID);

      storePersonPhoto(personID, photoURL, photoCaption, function (err) {

        if (err) {
          alert("Unable to save person's photo.  Got this error:\n\n" + err);
        } else {

          var photoCardTemplate = Handlebars.templates.photoCard;
          var templateArgs = {
            url: photoURL,
            caption: photoCaption
          };

          var photoCardHTML = photoCardTemplate(templateArgs);
          // console.log(photoCardHTML);

          var photoCardContainer = document.querySelector('.photo-card-container');
          photoCardContainer.insertAdjacentHTML('beforeend', photoCardHTML);

        }

      });

    }

    closeAddPhotoModal();

  } else {

    alert('You must specify a value for the "URL" field.');

  }

}


/*
 * This function will communicate with our server to store the specified
 * photo for a given person.
 */
function storePersonPhoto(personID, url, caption, callback) {

  var postURL = "/people/" + personID + "/addPhoto";

  var postRequest = new XMLHttpRequest();
  postRequest.open('POST', postURL);
  postRequest.setRequestHeader('Content-Type', 'application/json');

  postRequest.addEventListener('load', function (event) {
    var error;
    if (event.target.status !== 200) {
      error = event.target.response;
    }
    callback(error);
  });

  var postBody = {
    url: url,
    caption: caption
  };
  postRequest.send(JSON.stringify(postBody));

}


// Wait until the DOM content is loaded to hook up UI interactions, etc.
window.addEventListener('DOMContentLoaded', function (event) {

  var addPhotoButton = document.getElementById('add-photo-button');
  if (addPhotoButton) {
    addPhotoButton.addEventListener('click', displayAddPhotoModal);
  }

  var modalCloseButton = document.querySelector('#add-photo-modal .modal-close-button');
  if (modalCloseButton) {
    modalCloseButton.addEventListener('click', closeAddPhotoModal);
  }

  var modalCancalButton = document.querySelector('#add-photo-modal .modal-cancel-button');
  if (modalCancalButton) {
    modalCancalButton.addEventListener('click', closeAddPhotoModal);
  }

  var modalAcceptButton = document.querySelector('#add-photo-modal .modal-accept-button');
  if (modalAcceptButton) {
    modalAcceptButton.addEventListener('click', insertNewPhoto);
  }

});
