let state = loadAppData();

const loadingScreen = document.getElementById("loading-screen");
const loadingText = document.getElementById("loading-text");
const loadingBar = document.getElementById("loading-bar");

const profileScreen = document.getElementById("screen-profile");
const dashboardScreen = document.getElementById("screen-dashboard");

const profileForm = document.getElementById("profile-form");

function showProfileScreen() {
  if (loadingScreen) loadingScreen.style.display = "none";
  if (dashboardScreen) dashboardScreen.classList.add("hidden");
  if (profileScreen) profileScreen.classList.remove("hidden");
}

function showDashboardScreen() {
  if (loadingScreen) loadingScreen.style.display = "none";
  if (profileScreen) profileScreen.classList.add("hidden");
  if (dashboardScreen) dashboardScreen.classList.remove("hidden");
}

function bootApp() {
  let progress = 0;

  const steps = [
    { at: 20, text: "Heating uru..." },
    { at: 45, text: "Tempering steel..." },
    { at: 70, text: "Forging directive..." },
    { at: 90, text: "Preparing HUD..." }
  ];

  const timer = setInterval(() => {
    progress += 10;

    if (loadingBar) {
      loadingBar.style.width = `${progress}%`;
    }

    const step = steps.find((item) => item.at === progress);
    if (step && loadingText) {
      loadingText.textContent = step.text;
    }

    if (progress >= 100) {
      clearInterval(timer);

      setTimeout(() => {
        if (state.profile) {
          showDashboardScreen();
        } else {
          showProfileScreen();
        }
      }, 250);
    }
  }, 120);
}

function readProfileForm() {
  return {
    name: document.getElementById("name")?.value.trim() || "",
    bodyweight: Number(document.getElementById("bodyweight")?.value) || 0,
    bench: Number(document.getElementById("bench")?.value) || 0,
    squat: Number(document.getElementById("squat")?.value) || 0,
    deadlift: Number(document.getElementById("deadlift")?.value) || 0,
    sgdl: Number(document.getElementById("sgdl")?.value) || 0
  };
}

function handleProfileSubmit(event) {
  event.preventDefault();

  const profile = readProfileForm();

  state.profile = profile;
  saveAppData(state);

  showDashboardScreen();
}

if (profileForm) {
  profileForm.addEventListener("submit", handleProfileSubmit);
}

window.addEventListener("load", bootApp);
