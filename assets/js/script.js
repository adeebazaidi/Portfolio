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

const CACHE_KEY = "pf_stats_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache validity

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

    if (lcSolvedEl) animateCountUp(lcSolvedEl, parseInt(lcSolvedEl.textContent) || 0, lc.solved, 900);
    if (lcEasyEl) animateCountUp(lcEasyEl, parseInt(lcEasyEl.textContent) || 0, lc.easy, 900);
    if (lcMediumEl) animateCountUp(lcMediumEl, parseInt(lcMediumEl.textContent) || 0, lc.medium, 900);
  }
};

// Fetch live statistics from official GitHub & LeetCode APIs + unofficial Contributions scraper API
const fetchAllStatsAPI = async function () {
  const stats = {
    github: { repos: 31, followers: 15, stars: 4, contributions: 160 },
    leetcode: { solved: 10, easy: 9, medium: 1 }
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

      const repos = reposRes.ok ? await reposRes.json() : [];
      stats.github.stars = repos.reduce(function (s, r) { return s + r.stargazers_count; }, 0);
    }
  } catch (err) {
    console.warn("GitHub API error:", err.message);
  }

  try {
    // 2. Fetch GitHub total contributions
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
    // 3. Fetch LeetCode statistics
    const lcRes = await fetch("https://alfa-leetcode-api.onrender.com/userProfile/adeeba_27");
    if (lcRes.ok) {
      const data = await lcRes.json();
      stats.leetcode.solved = data.totalSolved || 10;
      stats.leetcode.easy = data.easySolved || 9;
      stats.leetcode.medium = data.mediumSolved || 1;
    }
  } catch (err) {
    console.warn("LeetCode API error:", err.message);
  }

  return stats;
};

// Unified loader supporting local storage cache and forced sync
const loadStats = async function (forceRefresh = false) {
  const syncIndicator = document.getElementById("syncIndicator");
  const syncStatusText = document.getElementById("syncStatusText");
  const syncNowBtn = document.getElementById("syncNowBtn");

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
      if (syncNowBtn) syncNowBtn.classList.remove("spinning");
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
    if (syncNowBtn) syncNowBtn.classList.remove("spinning");
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




