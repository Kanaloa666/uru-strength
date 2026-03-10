(() => {
  const screens = {
    loading: document.getElementById("loading-screen"),
    profile: document.getElementById("profile-screen"),
    hud: document.getElementById("hud-screen")
  };

  const els = {
    loadingBarFill: document.getElementById("loading-bar-fill"),
    loadingStatus: document.getElementById("loading-status"),

    profileForm: document.getElementById("profile-form"),
    name: document.getElementById("name"),
    cycleName: document.getElementById("cycleName"),
    benchMax: document.getElementById("benchMax"),
    squatMax: document.getElementById("squatMax"),
    deadliftMax: document.getElementById("deadliftMax"),
    profileNotes: document.getElementById("profileNotes"),

    hudTitle: document.getElementById("hud-title"),
    directiveTitle: document.getElementById("directive-title"),
    directiveSubtitle: document.getElementById("directive-subtitle"),
    warmupList: document.getElementById("warmup-list"),
    workingList: document.getElementById("working-list"),
    dailyNotes: document.getElementById("daily-notes"),
    saveNotesBtn: document.getElementById("save-notes-btn"),

    statCycle: document.getElementById("stat-cycle"),
    statBench: document.getElementById("stat-bench"),
    statSquat: document.getElementById("stat-squat"),
    statDeadlift: document.getElementById("stat-deadlift"),

    logExercise: document.getElementById("log-exercise"),
    logWeight: document.getElementById("log-weight"),
    logReps: document.getElementById("log-reps"),
    saveLiftBtn: document.getElementById("save-lift-btn"),

    recentLifts: document.getElementById("recent-lifts"),
    archiveProfileNotes: document.getElementById("archive-profile-notes"),
    archiveDailyNotes: document.getElementById("archive-daily-notes"),

    archiveToggle: document.getElementById("archive-toggle"),
    archiveContent: document.getElementById("archive-content"),
    archiveToggleIcon: document.getElementById("archive-toggle-icon"),

    editProfileBtn: document.getElementById("edit-profile-btn"),
    resetAllBtn: document.getElementById("reset-all-btn")
  };

  let appData = window.UruStorage.getData();

  const loadingSteps = [
    { pct: 18, text: "Powering core..." },
    { pct: 38, text: "Syncing forge profile..." },
    { pct: 62, text: "Loading directive engine..." },
    { pct: 84, text: "Unlocking archive..." },
    { pct: 100, text: "Forge online." }
  ];

  function showScreen(screenName) {
    Object.values(screens).forEach((screen) => {
      if (screen) screen.classList.remove("active");
    });

    if (screens[screenName]) {
      screens[screenName].classList.add("active");
    }
  }

  function hasProfile() {
    return Boolean(appData?.profile?.name?.trim());
  }

  function roundToNearest5(value) {
    return Math.round(value / 5) * 5;
  }

  function generateDirective(profile) {
    const bench = Number(profile?.benchMax) || 225;
    const deadlift = Number(profile?.deadliftMax) || 285;

    const benchTop = roundToNearest5(bench * 0.85);
    const benchBackoff = roundToNearest5(bench * 0.75);
    const sgdlTop = roundToNearest5(deadlift * 0.8);
    const sgdlBackoff = roundToNearest5(deadlift * 0.7);

    return {
      title: "Heavy Bench / Pull / Arms",
      subtitle: "Sub-hour strength push with barbell focus and actual set tracking.",
      warmups: [
        "5 min movement prep",
        "Band shoulder activation x 15",
        "Hip opener / adductor rockback x 8 each side",
        "Bench ramp: bar x 15, 95 x 8, 135 x 5, 165 x 3",
        "Snatch-grip deadlift ramp: 95 x 5, 135 x 5, 185 x 3"
      ],
      working: [
        `Bench Press — ${benchTop} x 3 for 3 sets`,
        `Bench Backoff — ${benchBackoff} x 6 for 2 sets`,
        `Snatch-Grip Deadlift — ${sgdlTop} x 5 for 3 sets`,
        `SGDL Backoff — ${sgdlBackoff} x 6 for 2 sets`,
        "Barbell Curl — challenging 8 to 12 reps for 3 sets"
      ]
    };
  }

  function renderDirective() {
    if (!els.directiveTitle || !els.directiveSubtitle || !els.warmupList || !els.workingList) {
      return;
    }

    const directive = generateDirective(appData.profile);

    els.directiveTitle.textContent = directive.title;
    els.directiveSubtitle.textContent = directive.subtitle;

    els.warmupList.innerHTML = "";
    directive.warmups.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      els.warmupList.appendChild(li);
    });

    els.workingList.innerHTML = "";
    directive.working.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      els.workingList.appendChild(li);
    });
  }

  function renderStats() {
    const profile = appData.profile || {};
    const name = profile.name?.trim() || "Operator";

    if (els.hudTitle) els.hudTitle.textContent = `Welcome back, ${name}`;
    if (els.statCycle) els.statCycle.textContent = profile.cycleName || "Cycle 01";
    if (els.statBench) els.statBench.textContent = profile.benchMax || 0;
    if (els.statSquat) els.statSquat.textContent = profile.squatMax || 0;
    if (els.statDeadlift) els.statDeadlift.textContent = profile.deadliftMax || 0;
  }

  function setArchiveState(isOpen) {
    appData.archiveOpen = Boolean(isOpen);

    if (els.archiveContent) {
      els.archiveContent.classList.toggle("collapsed", !isOpen);
    }

    if (els.archiveToggle) {
      els.archiveToggle.setAttribute("aria-expanded", String(isOpen));
    }

    if (els.archiveToggleIcon) {
      els.archiveToggleIcon.textContent = isOpen ? "−" : "+";
    }

    window.UruStorage.saveData(appData);
  }

  function renderArchive() {
    if (els.archiveProfileNotes) {
      els.archiveProfileNotes.textContent =
        appData.profile?.profileNotes?.trim() || "No forge notes saved yet.";
    }

    if (els.archiveDailyNotes) {
      els.archiveDailyNotes.textContent =
        appData.dailyNotes?.trim() || "No directive notes saved yet.";
    }

    if (els.recentLifts) {
      els.recentLifts.innerHTML = "";

      if (!appData.logs.length) {
        const empty = document.createElement("p");
        empty.className = "muted";
        empty.textContent = "No logged sets yet.";
        els.recentLifts.appendChild(empty);
      } else {
        appData.logs.slice(0, 8).forEach((log) => {
          const div = document.createElement("div");
          div.className = "log-item";
          div.innerHTML = `
            <div class="top">${log.exercise}</div>
            <div class="bottom">${log.weight} lbs x ${log.reps} reps</div>
          `;
          els.recentLifts.appendChild(div);
        });
      }
    }

    setArchiveState(appData.archiveOpen);
  }

  function renderHud() {
    renderStats();
    renderDirective();

    if (els.dailyNotes) {
      els.dailyNotes.value = appData.dailyNotes || "";
    }

    renderArchive();
  }

  function fillProfileForm() {
    const profile = appData.profile || {};

    if (els.name) els.name.value = profile.name || "";
    if (els.cycleName) els.cycleName.value = profile.cycleName || "";
    if (els.benchMax) els.benchMax.value = profile.benchMax || "";
    if (els.squatMax) els.squatMax.value = profile.squatMax || "";
    if (els.deadliftMax) els.deadliftMax.value = profile.deadliftMax || "";
    if (els.profileNotes) els.profileNotes.value = profile.profileNotes || "";
  }

  function saveProfileFromForm() {
    appData.profile = {
      name: els.name ? els.name.value.trim() : "",
      cycleName: els.cycleName ? els.cycleName.value.trim() || "Cycle 01 // Base Build" : "Cycle 01 // Base Build",
      benchMax: els.benchMax ? Number(els.benchMax.value) || 0 : 0,
      squatMax: els.squatMax ? Number(els.squatMax.value) || 0 : 0,
      deadliftMax: els.deadliftMax ? Number(els.deadliftMax.value) || 0 : 0,
      profileNotes: els.profileNotes ? els.profileNotes.value.trim() : ""
    };

    window.UruStorage.saveData(appData);
  }

  function bootLoadingSequence() {
    showScreen("loading");

    let index = 0;

    function step() {
      const current = loadingSteps[index];

      if (els.loadingBarFill) {
        els.loadingBarFill.style.width = `${current.pct}%`;
      }

      if (els.loadingStatus) {
        els.loadingStatus.textContent = current.text;
      }

      index += 1;

      if (index < loadingSteps.length) {
        setTimeout(step, 320);
      } else {
        setTimeout(() => {
          if (hasProfile()) {
            renderHud();
            showScreen("hud");
          } else {
            fillProfileForm();
            showScreen("profile");
          }
        }, 350);
      }
    }

    setTimeout(step, 250);
  }

  function bindEvents() {
    if (els.profileForm) {
      els.profileForm.addEventListener("submit", (event) => {
        event.preventDefault();
        saveProfileFromForm();
        renderHud();
        showScreen("hud");
      });
    }

    if (els.saveNotesBtn) {
      els.saveNotesBtn.addEventListener("click", () => {
        appData.dailyNotes = els.dailyNotes ? els.dailyNotes.value.trim() : "";
        window.UruStorage.saveData(appData);
        renderArchive();
      });
    }

    if (els.saveLiftBtn) {
      els.saveLiftBtn.addEventListener("click", () => {
        const exercise = els.logExercise ? els.logExercise.value : "";
        const weight = els.logWeight ? Number(els.logWeight.value) : 0;
        const reps = els.logReps ? Number(els.logReps.value) : 0;

        if (!exercise || !weight || !reps) return;

        appData.logs.unshift({
          exercise,
          weight,
          reps,
          timestamp: Date.now()
        });

        appData.logs = appData.logs.slice(0, 20);
        window.UruStorage.saveData(appData);

        if (els.logWeight) els.logWeight.value = "";
        if (els.logReps) els.logReps.value = "";

        renderArchive();
      });
    }

    if (els.archiveToggle) {
      els.archiveToggle.addEventListener("click", () => {
        setArchiveState(!appData.archiveOpen);
      });
    }

    if (els.editProfileBtn) {
      els.editProfileBtn.addEventListener("click", () => {
        fillProfileForm();
        showScreen("profile");
      });
    }

    if (els.resetAllBtn) {
      els.resetAllBtn.addEventListener("click", () => {
        const confirmed = window.confirm(
          "Reset the full forge? This clears profile, notes, and logged sets."
        );

        if (!confirmed) return;

        appData = window.UruStorage.resetData();
        fillProfileForm();
        showScreen("profile");
      });
    }
  }

  bindEvents();
  bootLoadingSequence();
})();
