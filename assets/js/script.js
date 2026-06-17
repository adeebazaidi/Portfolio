'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });




// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input fields
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}



// -----------------------------------------------
// Certificate lightbox
// -----------------------------------------------

const certLightbox = document.querySelector("[data-cert-lightbox]");
const certLightboxOverlay = document.querySelector("[data-cert-lightbox-overlay]");
const certLightboxClose = document.querySelector("[data-cert-lightbox-close]");
const certLightboxImg = document.getElementById("certLightboxImg");
const certTiles = document.querySelectorAll(".cert-tile");

const openCertLightbox = function (imgSrc) {
  certLightboxImg.src = imgSrc;
  certLightbox.classList.add("active");
  document.body.style.overflow = "hidden";
};

const closeCertLightbox = function () {
  certLightbox.classList.remove("active");
  document.body.style.overflow = "";
  // clear src after transition so image doesn't flash
  setTimeout(function () { certLightboxImg.src = ""; }, 300);
};

certTiles.forEach(function (tile) {
  tile.addEventListener("click", function () {
    const imgSrc = this.dataset.certImg;
    if (imgSrc) openCertLightbox(imgSrc);
  });
});

if (certLightboxClose) certLightboxClose.addEventListener("click", closeCertLightbox);
if (certLightboxOverlay) certLightboxOverlay.addEventListener("click", closeCertLightbox);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && certLightbox && certLightbox.classList.contains("active")) {
    closeCertLightbox();
  }
});



// -----------------------------------------------
// Highlights → Certificate lightbox
// -----------------------------------------------

const highlightItems = document.querySelectorAll(".highlight-clickable[data-cert-link]");

highlightItems.forEach(function (item) {
  item.addEventListener("click", function () {
    const imgSrc = this.dataset.certLink;
    if (imgSrc) openCertLightbox(imgSrc);
  });
});