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
const formResponse = document.querySelector("[data-form-response]");

// add event to all form input fields (real-time validation)
if (form && formBtn) {
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

  // Handle Web3Forms Submission via Javascript Fetch API
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Double check form validation before submit
    if (!form.checkValidity()) {
      return;
    }

    // Cache original button elements and states
    const btnText = formBtn.querySelector("span");
    const btnIcon = formBtn.querySelector("ion-icon");
    const originalText = btnText ? btnText.textContent : "Send Message";
    const originalIconName = btnIcon ? btnIcon.getAttribute("name") : "paper-plane";

    // Show loading state
    formBtn.setAttribute("disabled", "");
    formBtn.classList.add("loading");
    if (btnText) btnText.textContent = "Sending...";
    if (btnIcon) {
      btnIcon.setAttribute("name", "refresh-outline");
    }

    // Reset message box
    if (formResponse) {
      formResponse.className = "form-response";
      formResponse.textContent = "";
    }

    // Prepare form data
    const formData = new FormData(form);
    const jsonObject = Object.fromEntries(formData.entries());
    const jsonString = JSON.stringify(jsonObject);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: jsonString
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Success behavior
        if (formResponse) {
          formResponse.classList.add("success");
          formResponse.textContent = result.message || "Thank you! Your message has been sent successfully.";
        }
        form.reset();
        
        // Re-disable the submit button since the form is now empty/reset
        formBtn.setAttribute("disabled", "");
      } else {
        // API Error behavior
        throw new Error(result.message || "Failed to submit form. Please check your credentials.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      if (formResponse) {
        formResponse.classList.add("error");
        formResponse.textContent = error.message || "An error occurred while sending your message. Please check your connection.";
      }
      
      // Re-enable button on error so the user can try again
      formBtn.removeAttribute("disabled");
    } finally {
      // Revert loading state
      formBtn.classList.remove("loading");
      if (btnText) btnText.textContent = originalText;
      if (btnIcon) btnIcon.setAttribute("name", originalIconName);
    }
  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const targetPage = this.innerHTML.toLowerCase().trim();

    for (let i = 0; i < pages.length; i++) {
      if (targetPage === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

    if (targetPage === "coding" || targetPage === "projects") {
      if (typeof loadStats === "function") {
        loadStats(false);
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
  setTimeout(function () { certLightboxImg.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; }, 300);
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

// Preloader fade-out (enforcing at least 800ms visibility)
const preloaderStartTime = Date.now();

window.addEventListener("load", function () {
  const preloader = document.querySelector("[data-preloader]");
  if (preloader) {
    const elapsed = Date.now() - preloaderStartTime;
    const remainingTime = Math.max(0, 800 - elapsed);
    
    setTimeout(function () {
      preloader.classList.add("loaded");
    }, remainingTime);
  }
});

// Fallback to hide preloader after 3 seconds
setTimeout(function () {
  const preloader = document.querySelector("[data-preloader]");
  if (preloader && !preloader.classList.contains("loaded")) {
    preloader.classList.add("loaded");
  }
}, 3000);



// -----------------------------------------------
// Hero CTA Button Navigation
// -----------------------------------------------

const heroCTABtns = document.querySelectorAll("[data-hero-nav]");
heroCTABtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    const targetPage = this.dataset.heroNav;
    const navLinks = document.querySelectorAll("[data-nav-link]");
    navLinks.forEach(function (link) {
      if (link.textContent.trim().toLowerCase() === targetPage) {
        link.click();
      }
    });
  });
});



// -----------------------------------------------
// Interactive Tech Stack Cards (mobile toggle)
// -----------------------------------------------

const techCards = document.querySelectorAll(".itc");
techCards.forEach(function (card) {
  card.addEventListener("click", function () {
    const isActive = card.classList.contains("active");
    techCards.forEach(function (c) { c.classList.remove("active"); });
    if (!isActive) card.classList.add("active");
  });

  card.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      card.click();
    }
  });

  // Prevent card from getting stuck open on desktop
  card.addEventListener("mouseleave", function () {
    card.classList.remove("active");
  });
});



// -----------------------------------------------
// Count-up Animation Helper
// -----------------------------------------------

const animateCountUp = function (el, from, to, duration) {
  if (!el || isNaN(to) || to === 0) { if (el) el.textContent = to; return; }
  const start = performance.now();
  const run = function (ts) {
    const p = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(from + (to - from) * eased);
    if (p < 1) requestAnimationFrame(run);
    else el.textContent = to;
  };
  requestAnimationFrame(run);
};



// -----------------------------------------------
// Live Statistics Synchronization (GitHub, LeetCode, LinkedIn & Local DOM)
// -----------------------------------------------

const CACHE_KEY = "pf_stats_cache_v4"; // v4: added LeetCode streak support
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache validity

// Animate the LeetCode difficulty ring chart
const updateLeetCodeChart = function (lc) {
  if (!lc) return;

  const CIRC = 2 * Math.PI * 50; // ≈ 314.16
  const total  = lc.solved  || 0;
  const easy   = lc.easy    || 0;
  const medium = lc.medium  || 0;
  const hard   = lc.hard    || 0;

  // Update ring center total
  const ringTotalEl = document.getElementById("lcRingTotal");
  if (ringTotalEl) animateCountUp(ringTotalEl, parseInt(ringTotalEl.textContent) || 0, total, 900);

  // Update hero total
  const heroTotalEl = document.getElementById("lcHeroTotal");
  if (heroTotalEl) animateCountUp(heroTotalEl, parseInt(heroTotalEl.textContent) || 0, total, 900);

  // Update difficulty count labels
  const easyCountEl   = document.getElementById("lcCountEasy");
  const medCountEl    = document.getElementById("lcCountMedium");
  const hardCountEl   = document.getElementById("lcCountHard");
  if (easyCountEl)  animateCountUp(easyCountEl,  parseInt(easyCountEl.textContent)  || 0, easy,   800);
  if (medCountEl)   animateCountUp(medCountEl,   parseInt(medCountEl.textContent)   || 0, medium, 800);
  if (hardCountEl)  animateCountUp(hardCountEl,  parseInt(hardCountEl.textContent)  || 0, hard,   800);

  // Update progress bars (percentage of total solved)
  const safeTotal = total || 1;
  const barEasy   = document.getElementById("lcBarEasy");
  const barMedium = document.getElementById("lcBarMedium");
  const barHard   = document.getElementById("lcBarHard");
  if (barEasy)   setTimeout(function () { barEasy.style.width   = (easy   / safeTotal * 100).toFixed(1) + "%"; }, 200);
  if (barMedium) setTimeout(function () { barMedium.style.width = (medium / safeTotal * 100).toFixed(1) + "%"; }, 300);
  if (barHard)   setTimeout(function () { barHard.style.width   = (hard   / safeTotal * 100).toFixed(1) + "%"; }, 400);

  // Animate SVG ring arcs (stroke-dasharray: arc gap)
  // Drawing order: easy on bottom, medium on top, hard topmost
  // Each arc's dashoffset is offset by the preceding arcs
  const easyLen   = (easy   / safeTotal) * CIRC;
  const medLen    = (medium / safeTotal) * CIRC;
  const hardLen   = (hard   / safeTotal) * CIRC;

  const easyArc   = document.getElementById("lcRingEasy");
  const medArc    = document.getElementById("lcRingMedium");
  const hardArc   = document.getElementById("lcRingHard");

  const GAP = 2; // small gap between segments

  // Easy segment starts at 0 (we rotate the SVG -90deg in CSS)
  if (easyArc) {
    setTimeout(function () {
      easyArc.style.strokeDasharray  = (easyLen - GAP) + " " + (CIRC - (easyLen - GAP));
      easyArc.style.strokeDashoffset = "0";
    }, 150);
  }
  // Medium segment starts after easy
  if (medArc) {
    setTimeout(function () {
      medArc.style.strokeDasharray  = (medLen - GAP) + " " + (CIRC - (medLen - GAP));
      medArc.style.strokeDashoffset = -easyLen + "";
    }, 200);
  }
  // Hard segment starts after easy + medium
  if (hardArc) {
    setTimeout(function () {
      hardArc.style.strokeDasharray  = (hardLen - GAP) + " " + (CIRC - (hardLen - GAP));
      hardArc.style.strokeDashoffset = -(easyLen + medLen) + "";
    }, 250);
  }
};

// Dynamic local DOM calculations for Projects, Certifications, and Internships
const updateUIStats = function (statsData) {
  // DOM-derived counts
  const totalProjects = document.querySelectorAll(".project-item").length || 10;
  const totalCerts = document.querySelectorAll(".cert-tile").length || 17;
  
  // Dynamic internship detection from Resume Timeline
  const timelineTitles = document.querySelectorAll(".timeline-item-title");
  let totalInternships = 0;
  timelineTitles.forEach(function (el) {
    const text = el.textContent.toLowerCase();
    if (text.includes("intern") || text.includes("internship")) {
      totalInternships++;
    }
  });
  if (totalInternships === 0) totalInternships = 3; // Robust fallback

  // Update Project Analytics Dashboard counts
  const statsProjectsCountEl = document.getElementById("statsProjectsCount");
  const statsCertsCountEl = document.getElementById("statsCertsCount");
  const statsInternshipsCountEl = document.getElementById("statsInternshipsCount");
  const githubCommitsCountEl = document.getElementById("githubCommitsCount");

  if (statsProjectsCountEl) statsProjectsCountEl.textContent = totalProjects;
  if (statsCertsCountEl) statsCertsCountEl.textContent = totalCerts;
  if (statsInternshipsCountEl) statsInternshipsCountEl.textContent = totalInternships;

  // Update LinkedIn Card counts (Ensures 100% cross-tab consistency)
  const cpLiInternshipsEl = document.getElementById("cpLiInternships");
  const cpLiCertsEl = document.getElementById("cpLiCerts");

  if (cpLiInternshipsEl) cpLiInternshipsEl.textContent = totalInternships;
  if (cpLiCertsEl) cpLiCertsEl.textContent = totalCerts + "+";

  // Update GitHub stats
  if (statsData && statsData.github) {
    const gh = statsData.github;
    const cpGhReposEl = document.getElementById("cpGhRepos");
    const cpGhFollowersEl = document.getElementById("cpGhFollowers");
    const cpGhStarsEl = document.getElementById("cpGhStars");

    if (cpGhReposEl) animateCountUp(cpGhReposEl, parseInt(cpGhReposEl.textContent) || 0, gh.repos, 1000);
    if (cpGhFollowersEl) animateCountUp(cpGhFollowersEl, parseInt(cpGhFollowersEl.textContent) || 0, gh.followers, 1000);
    if (cpGhStarsEl) animateCountUp(cpGhStarsEl, parseInt(cpGhStarsEl.textContent) || 0, gh.stars, 1000);

    if (githubCommitsCountEl) animateCountUp(githubCommitsCountEl, parseInt(githubCommitsCountEl.textContent) || 0, gh.contributions, 1000);

    // Refresh GitHub streak image
    const ghStreakImg = document.getElementById("ghStreakImg");
    if (ghStreakImg) {
      let currentSrc = ghStreakImg.src;
      const tsMatch = currentSrc.match(/&_t=\d+/);
      const newTs = "&_t=" + Date.now();
      if (tsMatch) {
        ghStreakImg.src = currentSrc.replace(tsMatch[0], newTs);
      } else {
        ghStreakImg.src = currentSrc + newTs;
      }
    }
  } else {
    // Basic estimations/defaults if cached data or fetch fails
    if (githubCommitsCountEl) githubCommitsCountEl.textContent = "160+";
  }

  // Update LeetCode stats
  if (statsData && statsData.leetcode) {
    const lc = statsData.leetcode;
    const lcSolvedEl = document.getElementById("lcSolved");
    const lcEasyEl = document.getElementById("lcEasy");
    const lcMediumEl = document.getElementById("lcMedium");
    const lcHardEl = document.getElementById("lcHard");

    if (lcSolvedEl) animateCountUp(lcSolvedEl, parseInt(lcSolvedEl.textContent) || 0, lc.solved, 900);
    if (lcEasyEl) animateCountUp(lcEasyEl, parseInt(lcEasyEl.textContent) || 0, lc.easy, 900);
    if (lcMediumEl) animateCountUp(lcMediumEl, parseInt(lcMediumEl.textContent) || 0, lc.medium, 900);
    if (lcHardEl) animateCountUp(lcHardEl, parseInt(lcHardEl.textContent) || 0, lc.hard || 0, 900);

    // Drive the full LeetCode chart
    updateLeetCodeChart(lc);

    // Update LeetCode Streak SVG
    if (lc.calendar) {
      updateLeetCodeStreakSVG(lc.calendar);
    }
  }
};

const updateLeetCodeStreakSVG = function (calendar) {
  let totalSubmissions = 0;
  let timestamps = Object.keys(calendar).map(Number).sort((a, b) => a - b);
  
  if (timestamps.length === 0) return;

  const DAY_IN_SEC = 86400;
  
  let longestStreak = 0;
  let longestStreakStart = null;
  let longestStreakEnd = null;
  
  let currentStreak = 0;
  let currentStreakStart = null;
  let currentStreakEnd = null;
  
  let tempStreak = 0;
  let tempStreakStart = timestamps[0];
  let prevDay = null;
  
  timestamps.forEach(ts => {
    totalSubmissions += calendar[ts];
    
    if (prevDay === null) {
      tempStreak = 1;
      tempStreakStart = ts;
    } else {
      if (ts === prevDay + DAY_IN_SEC) {
        tempStreak++;
      } else {
        tempStreak = 1;
        tempStreakStart = ts;
      }
    }
    
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
      longestStreakStart = tempStreakStart;
      longestStreakEnd = ts;
    }
    
    prevDay = ts;
  });

  const nowSec = Math.floor(Date.now() / 1000);
  const todayUTC = Math.floor(nowSec / DAY_IN_SEC) * DAY_IN_SEC;
  
  if (prevDay >= todayUTC - DAY_IN_SEC) {
    currentStreak = tempStreak;
    currentStreakStart = tempStreakStart;
    currentStreakEnd = prevDay;
  }
  
  const formatDate = (ts) => {
    if (!ts) return '';
    const d = new Date(ts * 1000);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).replace(/, \d{4}/, '');
  };
  
  const formatDateYear = (ts) => {
    if (!ts) return '';
    const d = new Date(ts * 1000);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const formatDateRange = (start, end) => {
    if (!start || !end) return '';
    const s = new Date(start * 1000);
    const e = new Date(end * 1000);
    if (s.getFullYear() !== e.getFullYear()) {
      return `${formatDateYear(start)} - ${formatDateYear(end)}`;
    }
    if (start === end) {
      return formatDateYear(start);
    }
    return `${formatDate(start)} - ${formatDateYear(end)}`;
  };

  const streakStats = {
    total: totalSubmissions,
    current: currentStreak,
    longest: longestStreak,
    totalRange: formatDateRange(timestamps[0], todayUTC),
    currentRange: currentStreak > 0 ? formatDateRange(currentStreakStart, currentStreakEnd) : '',
    longestRange: longestStreak > 0 ? formatDateRange(longestStreakStart, longestStreakEnd) : ''
  };

  const lcStreakSVGContainer = document.getElementById("lcStreakSVGContainer");
  if (lcStreakSVGContainer) {
    lcStreakSVGContainer.innerHTML = `
      <svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' style='isolation: isolate' viewBox='0 0 495 195' width='100%' height='100%' direction='ltr'>
          <style>
              @keyframes currstreak {
                  0% { font-size: 3px; opacity: 0.2; }
                  80% { font-size: 34px; opacity: 1; }
                  100% { font-size: 28px; opacity: 1; }
              }
              @keyframes fadein {
                  0% { opacity: 0; }
                  100% { opacity: 1; }
              }
          </style>
          <defs>
              <clipPath id='outer_rectangle'>
                  <rect width='495' height='195' rx='4.5'/>
              </clipPath>
              <mask id='mask_out_ring_behind_fire'>
                  <rect width='495' height='195' fill='white'/>
                  <ellipse id='mask-ellipse' cx='247.5' cy='32' rx='13' ry='18' fill='black'/>
              </mask>
          </defs>
          <g clip-path='url(#outer_rectangle)'>
              <g style='isolation: isolate'>
                  <rect stroke='#000000' stroke-opacity='0' fill='#ffffff' fill-opacity='0' rx='4.5' x='0.5' y='0.5' width='494' height='194'/>
              </g>
              <g style='isolation: isolate'>
                  <line x1='165' y1='28' x2='165' y2='170' vector-effect='non-scaling-stroke' stroke-width='1' stroke='#E4E2E2' stroke-linejoin='miter' stroke-linecap='square' stroke-miterlimit='3'/>
                  <line x1='330' y1='28' x2='330' y2='170' vector-effect='non-scaling-stroke' stroke-width='1' stroke='#E4E2E2' stroke-linejoin='miter' stroke-linecap='square' stroke-miterlimit='3'/>
              </g>
              <g style='isolation: isolate'>
                  <g transform='translate(82.5, 48)'>
                      <text x='0' y='32' stroke-width='0' text-anchor='middle' fill='#151515' stroke='none' font-family='"Segoe UI", Ubuntu, sans-serif' font-weight='700' font-size='28px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 0.6s'>
                          ${streakStats.total}
                      </text>
                  </g>
                  <g transform='translate(82.5, 84)'>
                      <text x='0' y='32' stroke-width='0' text-anchor='middle' fill='#151515' stroke='none' font-family='"Segoe UI", Ubuntu, sans-serif' font-weight='400' font-size='14px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 0.7s'>
                          Total Submissions
                      </text>
                  </g>
                  <g transform='translate(82.5, 114)'>
                      <text x='0' y='32' stroke-width='0' text-anchor='middle' fill='#464646' stroke='none' font-family='"Segoe UI", Ubuntu, sans-serif' font-weight='400' font-size='12px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 0.8s'>
                          ${streakStats.totalRange}
                      </text>
                  </g>
              </g>
              <g style='isolation: isolate'>
                  <g transform='translate(247.5, 108)'>
                      <text x='0' y='32' stroke-width='0' text-anchor='middle' fill='#b82e62' stroke='none' font-family='"Segoe UI", Ubuntu, sans-serif' font-weight='700' font-size='14px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 0.9s'>
                          Current Streak
                      </text>
                  </g>
                  <g transform='translate(247.5, 145)'>
                      <text x='0' y='21' stroke-width='0' text-anchor='middle' fill='#464646' stroke='none' font-family='"Segoe UI", Ubuntu, sans-serif' font-weight='400' font-size='12px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 0.9s'>
                          ${streakStats.currentRange}
                      </text>
                  </g>
                  <g mask='url(#mask_out_ring_behind_fire)'>
                      <circle cx='247.5' cy='71' r='40' fill='none' stroke='#b82e62' stroke-width='5' style='opacity: 0; animation: fadein 0.5s linear forwards 0.4s'></circle>
                  </g>
                  <g transform='translate(247.5, 19.5)' stroke-opacity='0' style='opacity: 0; animation: fadein 0.5s linear forwards 0.6s'>
                      <path d='M -12 -0.5 L 15 -0.5 L 15 23.5 L -12 23.5 L -12 -0.5 Z' fill='none'/>
                      <path d='M 1.5 0.67 C 1.5 0.67 2.24 3.32 2.24 5.47 C 2.24 7.53 0.89 9.2 -1.17 9.2 C -3.23 9.2 -4.79 7.53 -4.79 5.47 L -4.76 5.11 C -6.78 7.51 -8 10.62 -8 13.99 C -8 18.41 -4.42 22 0 22 C 4.42 22 8 18.41 8 13.99 C 8 8.6 5.41 3.79 1.5 0.67 Z M -0.29 19 C -2.07 19 -3.51 17.6 -3.51 15.86 C -3.51 14.24 -2.46 13.1 -0.7 12.74 C 1.07 12.38 2.9 11.53 3.92 10.16 C 4.31 11.45 4.51 12.81 4.51 14.2 C 4.51 16.85 2.36 19 -0.29 19 Z' fill='#b82e62' stroke-opacity='0'/>
                  </g>
                  <g transform='translate(247.5, 48)'>
                      <text x='0' y='32' stroke-width='0' text-anchor='middle' fill='#151515' stroke='none' font-family='"Segoe UI", Ubuntu, sans-serif' font-weight='700' font-size='28px' font-style='normal' style='animation: currstreak 0.6s linear forwards'>
                          ${streakStats.current}
                      </text>
                  </g>
              </g>
              <g style='isolation: isolate'>
                  <g transform='translate(412.5, 48)'>
                      <text x='0' y='32' stroke-width='0' text-anchor='middle' fill='#151515' stroke='none' font-family='"Segoe UI", Ubuntu, sans-serif' font-weight='700' font-size='28px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 1.2s'>
                          ${streakStats.longest}
                      </text>
                  </g>
                  <g transform='translate(412.5, 84)'>
                      <text x='0' y='32' stroke-width='0' text-anchor='middle' fill='#151515' stroke='none' font-family='"Segoe UI", Ubuntu, sans-serif' font-weight='400' font-size='14px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 1.3s'>
                          Longest Streak
                      </text>
                  </g>
                  <g transform='translate(412.5, 114)'>
                      <text x='0' y='32' stroke-width='0' text-anchor='middle' fill='#464646' stroke='none' font-family='"Segoe UI", Ubuntu, sans-serif' font-weight='400' font-size='12px' font-style='normal' style='opacity: 0; animation: fadein 0.5s linear forwards 1.4s'>
                          ${streakStats.longestRange}
                      </text>
                  </g>
              </g>
          </g>
      </svg>
    `;
  }
};

// Fetch live statistics from official GitHub & LeetCode APIs + unofficial Contributions scraper API
const fetchAllStatsAPI = async function () {
  const stats = {
    github: { repos: 0, followers: 0, stars: 0, contributions: 0 },
    leetcode: { solved: 0, easy: 0, medium: 0, hard: 0 }
  };

  try {
    // 1. Fetch GitHub user and repo statistics
    const [userRes, reposRes] = await Promise.all([
      fetch("https://api.github.com/users/adeebazaidi"),
      fetch("https://api.github.com/users/adeebazaidi/repos?per_page=100")
    ]);

    if (userRes.ok) {
      const user = await userRes.json();
      stats.github.repos = user.public_repos;
      stats.github.followers = user.followers;

      if (reposRes.ok) {
        const repos = await reposRes.json();
        stats.github.stars = repos.reduce(function (s, r) { return s + r.stargazers_count; }, 0);
      }
    }
  } catch (err) {
    console.warn("GitHub API error:", err.message);
  }

  try {
    // 3. Fetch GitHub total contributions
    const contribRes = await fetch("https://github-contributions-api.jogruber.de/v4/adeebazaidi");
    if (contribRes.ok) {
      const data = await contribRes.json();
      if (data.total) {
        let total = 0;
        Object.values(data.total).forEach(function (val) {
          total += val;
        });
        stats.github.contributions = total;
      }
    }
  } catch (err) {
    console.warn("GitHub contributions API error:", err.message);
  }

  try {
    // 4. Fetch LeetCode statistics using the /solved endpoint (gives easy+medium+hard)
    const lcRes = await fetch("https://alfa-leetcode-api.onrender.com/adeeba_27/solved");
    if (lcRes.ok) {
      const data = await lcRes.json();
      // Response: { solvedProblem, easySolved, mediumSolved, hardSolved, ... }
      stats.leetcode.solved = data.solvedProblem !== undefined ? data.solvedProblem : (data.totalSolved !== undefined ? data.totalSolved : stats.leetcode.solved);
      stats.leetcode.easy   = data.easySolved !== undefined ? data.easySolved : stats.leetcode.easy;
      stats.leetcode.medium = data.mediumSolved !== undefined ? data.mediumSolved : stats.leetcode.medium;
      stats.leetcode.hard   = data.hardSolved !== undefined ? data.hardSolved : stats.leetcode.hard;
    } else {
      // Fallback: try the userProfile endpoint
      const lcRes2 = await fetch("https://alfa-leetcode-api.onrender.com/userProfile/adeeba_27");
      if (lcRes2.ok) {
        const data2 = await lcRes2.json();
        stats.leetcode.solved = data2.totalSolved !== undefined ? data2.totalSolved : stats.leetcode.solved;
        stats.leetcode.easy   = data2.easySolved !== undefined ? data2.easySolved : stats.leetcode.easy;
        stats.leetcode.medium = data2.mediumSolved !== undefined ? data2.mediumSolved : stats.leetcode.medium;
        stats.leetcode.hard   = data2.hardSolved !== undefined ? data2.hardSolved : stats.leetcode.hard;
      }
    }
  } catch (err) {
    console.warn("LeetCode API error:", err.message);
  }

  try {
    // 5. Fetch LeetCode calendar for streak stats
    const lcCalRes = await fetch("https://alfa-leetcode-api.onrender.com/adeeba_27/calendar");
    if (lcCalRes.ok) {
      const data = await lcCalRes.json();
      if (data.submissionCalendar) {
        stats.leetcode.calendar = JSON.parse(data.submissionCalendar);
      }
    }
  } catch (err) {
    console.warn("LeetCode Calendar error:", err.message);
  }

  return stats;
};

let isSyncing = false;
// Unified loader supporting local storage cache and forced sync
const loadStats = async function (forceRefresh = false) {
  if (isSyncing) return;
  
  const syncIndicator = document.getElementById("syncIndicator");
  const syncStatusText = document.getElementById("syncStatusText");
  const syncNowBtn = document.getElementById("syncNowBtn");

  isSyncing = true;
  if (syncNowBtn) syncNowBtn.disabled = true;

  // Show visual sync indicator state
  if (syncIndicator) {
    syncIndicator.classList.remove("active");
    syncIndicator.style.background = "#eab308"; // yellow
    syncIndicator.style.boxShadow = "0 0 8px #eab308";
  }
  if (syncStatusText) syncStatusText.textContent = "Syncing...";
  if (syncNowBtn) syncNowBtn.classList.add("spinning");

  let cachedData = null;
  try {
    const rawCache = localStorage.getItem(CACHE_KEY);
    if (rawCache) {
      cachedData = JSON.parse(rawCache);
    }
  } catch (e) {
    console.warn("Failed to read stats cache", e);
  }

  const now = Date.now();
  const isCacheValid = cachedData && cachedData.timestamp && (now - cachedData.timestamp < CACHE_DURATION);

  if (isCacheValid && !forceRefresh) {
    // Load from cache instantly
    updateUIStats(cachedData.data);
    
    setTimeout(function () {
      if (syncIndicator) {
        syncIndicator.classList.add("active");
        syncIndicator.style.background = "";
        syncIndicator.style.boxShadow = "";
      }
      if (syncStatusText) {
        const mins = Math.floor((now - cachedData.timestamp) / 60000);
        syncStatusText.textContent = mins === 0 ? "Synced: Just now" : `Synced: ${mins}m ago`;
      }
      if (syncNowBtn) {
        syncNowBtn.classList.remove("spinning");
        syncNowBtn.disabled = false;
      }
      isSyncing = false;
    }, 400);
    return;
  }

  // Pre-load from cache if available while requesting fresh data
  if (cachedData && cachedData.data) {
    updateUIStats(cachedData.data);
  } else {
    updateUIStats(null); // Triggers base DOM updates first
  }

  // Fetch live API statistics
  const freshStats = await fetchAllStatsAPI();

  // Cache stats
  try {
    const cacheObj = { timestamp: Date.now(), data: freshStats };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObj));
  } catch (e) {
    console.warn("Failed to save stats cache", e);
  }

  // Update UI elements with fresh data
  updateUIStats(freshStats);

  setTimeout(function () {
    if (syncIndicator) {
      syncIndicator.classList.add("active");
      syncIndicator.style.background = "";
      syncIndicator.style.boxShadow = "";
    }
    if (syncStatusText) syncStatusText.textContent = "Synced: Just now";
    if (syncNowBtn) {
      syncNowBtn.classList.remove("spinning");
      syncNowBtn.disabled = false;
    }
    isSyncing = false;
  }, 400);
};

// Bind Sync button and execute initial stats load
setTimeout(function () {
  const syncNowBtn = document.getElementById("syncNowBtn");
  if (syncNowBtn) {
    syncNowBtn.addEventListener("click", function () {
      loadStats(true);
    });
  }
  loadStats(false);
}, 100);



// -----------------------------------------------
// Visitor Counter (localStorage)
// -----------------------------------------------

(function () {
  var BASE = 1243;
  var now  = new Date();
  var today = now.toISOString().slice(0, 10);
  var month = now.toISOString().slice(0, 7);

  // Total
  var total = parseInt(localStorage.getItem("pf_total") || BASE, 10);
  if (!sessionStorage.getItem("pf_sess")) {
    total++;
    localStorage.setItem("pf_total", total);
    sessionStorage.setItem("pf_sess", "1");
  }

  // Today
  var todayKey   = localStorage.getItem("pf_today_key");
  var todayCount = parseInt(localStorage.getItem("pf_today_cnt") || "0", 10);
  if (todayKey !== today) {
    todayCount = 1;
    localStorage.setItem("pf_today_key", today);
    localStorage.setItem("pf_today_cnt", "1");
    sessionStorage.setItem("pf_today_sess", "1");
  } else if (!sessionStorage.getItem("pf_today_sess")) {
    todayCount++;
    localStorage.setItem("pf_today_cnt", todayCount);
    sessionStorage.setItem("pf_today_sess", "1");
  }

  // Monthly
  var monthKey   = localStorage.getItem("pf_month_key");
  var monthCount = parseInt(localStorage.getItem("pf_month_cnt") || "0", 10);
  if (monthKey !== month) {
    monthCount = 1;
    localStorage.setItem("pf_month_key", month);
    localStorage.setItem("pf_month_cnt", "1");
    sessionStorage.setItem("pf_month_sess", "1");
  } else if (!sessionStorage.getItem("pf_month_sess")) {
    monthCount++;
    localStorage.setItem("pf_month_cnt", monthCount);
    sessionStorage.setItem("pf_month_sess", "1");
  }

  // Render counts after short delay so DOM is ready
  setTimeout(function () {
    var totalEl   = document.getElementById("totalVisitors");
    var todayEl   = document.getElementById("todayVisitors");
    var monthlyEl = document.getElementById("monthlyVisitors");
    if (totalEl)   animateCountUp(totalEl,   0, total,      1500);
    if (todayEl)   animateCountUp(todayEl,   0, todayCount,  800);
    if (monthlyEl) animateCountUp(monthlyEl, 0, monthCount, 1000);
  }, 600);
})();



// -----------------------------------------------
// Three-Theme Cycle: light → gradient → dark → …
// -----------------------------------------------

const themeBtn  = document.querySelector("[data-theme-btn]");
const THEMES    = ["light", "gradient", "dark"];

// icons inside the button for each theme state
const themeMoonIcon   = themeBtn ? themeBtn.querySelector(".moon")    : null;
const themeSunIcon    = themeBtn ? themeBtn.querySelector(".sun")     : null;
const themePaletteIcon = themeBtn ? themeBtn.querySelector(".palette"): null;

// GitHub streak image URLs
const GH_STREAK_LIGHT = "https://streak-stats.demolab.com?user=adeebazaidi&theme=default&hide_border=true&date_format=M%20j%5B%2C%20Y%5D&background=FFFFFF00&ring=B82E62&fire=B82E62&currStreakLabel=B82E62";
const GH_STREAK_DARK  = "https://streak-stats.demolab.com?user=adeebazaidi&theme=dark&hide_border=true&date_format=M%20j%5B%2C%20Y%5D&background=00000000&ring=B82E62&fire=B82E62&currStreakLabel=B82E62&sideNums=FFFFFF&sideLabels=cccccc&dates=888888&stroke=B82E62";

function applyTheme(theme) {
  document.body.classList.remove("dark-theme", "gradient-theme");
  if (theme === "dark")     document.body.classList.add("dark-theme");
  if (theme === "gradient") document.body.classList.add("gradient-theme");
  localStorage.setItem("theme", theme);

  // Swap GitHub streak image src so ring/fire stay #b82e62 in all themes
  const ghStreakImg = document.getElementById("ghStreakImg");
  if (ghStreakImg) {
    ghStreakImg.src = (theme === "dark" || theme === "gradient") ? GH_STREAK_DARK : GH_STREAK_LIGHT;
  }

  // swap icon
  if (themeMoonIcon && themeSunIcon && themePaletteIcon) {
    themeMoonIcon.style.display    = theme === "dark"     ? "block" : "none";
    themeSunIcon.style.display     = theme === "light"    ? "block" : "none";
    themePaletteIcon.style.display = theme === "gradient" ? "block" : "none";
  }

  if (themeBtn) themeBtn.setAttribute("aria-label", `Switch theme (current: ${theme})`);
}

// Load saved theme (default: light)
const savedTheme = localStorage.getItem("theme");
applyTheme(THEMES.includes(savedTheme) ? savedTheme : "light");

if (themeBtn) {
  themeBtn.addEventListener("click", function () {
    const current = localStorage.getItem("theme") || "light";
    const nextIdx = (THEMES.indexOf(current) + 1) % THEMES.length;
    applyTheme(THEMES[nextIdx]);
  });
}






