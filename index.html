const state = loadAppData();

const profileForm = document.getElementById("profile-form");
const dailyLogForm = document.getElementById("daily-log-form");
const scorecardForm = document.getElementById("scorecard-form");
const programOutput = document.getElementById("program-output");
const logHistory = document.getElementById("log-history");
const scorecardHistory = document.getElementById("scorecard-history");
const todayWorkout = document.getElementById("today-workout");
const prevWorkoutBtn = document.getElementById("prev-workout");
const nextWorkoutBtn = document.getElementById("next-workout");
const resetWorkoutChecksBtn = document.getElementById("reset-workout-checks");

function getTrackingKey(section, weekIndex, dayIndex, liftIndex, setType, setIndex) {
  return `${section}|w${weekIndex}|d${dayIndex}|l${liftIndex}|${setType}|s${setIndex}`;
}

function ensureTracking() {
  if (!state.setTracking) {
    state.setTracking = {};
  }
}

function getTrackedSet(key) {
  ensureTracking();
  return state.setTracking[key] || { checked: false, note: "" };
}

function updateTrackedSet(key, updates) {
  ensureTracking();
  const current = getTrackedSet(key);
  state.setTracking[key] = {
    ...current,
    ...updates
  };
  saveAppData(state);
}

function clearCurrentWorkoutTracking() {
  ensureTracking();

  const weekIndex = state.currentWorkout?.weekIndex || 0;
  const dayIndex = state.currentWorkout?.dayIndex || 0;
  const prefixA = `today|w${weekIndex}|d${dayIndex}|`;
  const prefixB = `program|w${weekIndex}|d${dayIndex}|`;

  Object.keys(state.setTracking).forEach((key) => {
    if (key.startsWith(prefixA) || key.startsWith(prefixB)) {
      delete state.setTracking[key];
    }
  });

  saveAppData(state);
}

function renderTrackedSetLine(label, key) {
  const tracked = getTrackedSet(key);

  return `
    <div class="set-row">
      <input
        class="set-check"
        type="checkbox"
        data-track-key="${key}"
        ${tracked.checked ? "checked" : ""}
      />
      <div class="set-label">${label}</div>
      <input
        class="set-note ${tracked.note ? "saved-note" : ""}"
        type="text"
        data-note-key="${key}"
        value="${tracked.note || ""}"
        placeholder="notes / actual reps"
      />
    </div>
  `;
}

function renderWarmupLabel(warmup) {
  if (warmup.label) return `${warmup.label} x ${warmup.reps}`;
  return `${warmup.weight} x ${warmup.reps}`;
}

function renderSetLabel(set) {
  if (typeof set.weight === "string") {
    return `${set.weight} x ${set.reps}`;
  }
  return `${set.weight} x ${set.reps} (${Math.round(set.pct * 1000) / 10}%)`;
}

function renderBigLift(bigLift) {
  return `
    <div class="lift-block">
      <strong>${bigLift.lift}</strong>
      <p class="lift-meta">Based on max: ${bigLift.basedOnMax} lb</p>
      ${bigLift.notes ? `<p class="lift-meta"><em>${bigLift.notes}</em></p>` : ""}

      <div class="block-title">Warmups</div>
      ${bigLift.warmups.map(warmup => `<div class="set-line">${renderWarmupLabel(warmup)}</div>`).join("")}

      <div class="block-title">Work Sets</div>
      ${bigLift.sets.map(set => `<div class="set-line">${renderSetLabel(set)}</div>`).join("")}
    </div>
  `;
}

function renderBigLiftTracked(bigLift, weekIndex, dayIndex, liftIndex, sectionPrefix) {
  const warmupsHtml = bigLift.warmups.map((warmup, warmupIndex) => {
    const key = getTrackingKey(sectionPrefix, weekIndex, dayIndex, liftIndex, "warmup", warmupIndex);
    return renderTrackedSetLine(renderWarmupLabel(warmup), key);
  }).join("");

  const setsHtml = bigLift.sets.map((set, setIndex) => {
    const key = getTrackingKey(sectionPrefix, weekIndex, dayIndex, liftIndex, "work", setIndex);
    return renderTrackedSetLine(renderSetLabel(set), key);
  }).join("");

  return `
    <div class="nested-card">
      <strong>${bigLift.lift}</strong>
      ${bigLift.notes ? `<p class="lift-meta"><em>${bigLift.notes}</em></p>` : ""}
      <div class="block-title">Warmups</div>
      ${warmupsHtml}
      <div class="block-title">Work Sets</div>
      ${setsHtml}
    </div>
  `;
}

function renderInfinityForge(boss) {
  return `
    <div class="nested-card">
      <h4>${boss.title}</h4>
      <p class="muted-text">${boss.subtitle}</p>
      ${boss.flavor ? `<p class="lift-meta"><em>${boss.flavor}</em></p>` : ""}

      ${boss.bigLifts.map(renderBigLift).join("")}

      <div class="lift-block">
        <div class="block-title">Forge Movement</div>
        <div>${boss.forgeMovement.name} — ${boss.forgeMovement.prescription}</div>
        ${boss.forgeMovement.notes ? `<p class="lift-meta"><em>${boss.forgeMovement.notes}</em></p>` : ""}
      </div>

      <div class="lift-block">
        <div class="block-title">Titan Circuit</div>
        ${boss.titanCircuit.map(item => `<div class="set-line">${item.name} — ${item.prescription}</div>`).join("")}
      </div>
    </div>
  `;
}

function renderInfinityForgeTracked(boss, weekIndex, dayIndex) {
  return `
    <div class="nested-card">
      <h4>${boss.title}</h4>
      <p class="muted-text">${boss.subtitle}</p>
      ${boss.flavor ? `<p class="lift-meta"><em>${boss.flavor}</em></p>` : ""}

      ${boss.bigLifts.map((bigLift, liftIndex) => renderBigLiftTracked(bigLift, weekIndex, dayIndex, liftIndex, "today")).join("")}

      <div class="nested-card">
        <div class="block-title">Forge Movement</div>
        <div>${boss.forgeMovement.name} — ${boss.forgeMovement.prescription}</div>
        ${boss.forgeMovement.notes ? `<p class="lift-meta"><em>${boss.forgeMovement.notes}</em></p>` : ""}
      </div>

      <div class="nested-card">
        <div class="block-title">Titan Circuit</div>
        ${boss.titanCircuit.map(item => `<div class="set-line">${item.name} — ${item.prescription}</div>`).join("")}
      </div>
    </div>
  `;
}

function renderDay(day) {
  if (day.infinityForge) {
    return `
      <div class="nested-card">
        <h4>${day.title}</h4>
        ${renderInfinityForge(day.infinityForge)}
      </div>
    `;
  }

  return `
    <div class="nested-card">
      <h4>${day.title}</h4>
      ${day.flavor ? `<p class="lift-meta"><em>${day.flavor}</em></p>` : ""}

      ${day.bigLifts.map(renderBigLift).join("")}

      <div class="lift-block">
        <div class="block-title">Forge Movement</div>
        <div>${day.forgeMovement.name} — ${day.forgeMovement.prescription}</div>
        ${day.forgeMovement.notes ? `<p class="lift-meta"><em>${day.forgeMovement.notes}</em></p>` : ""}
      </div>

      <div class="lift-block">
        <div class="block-title">${day.thrusterLadder.name}</div>
        <div>${day.thrusterLadder.reps.join(" / ")}</div>
        ${day.thrusterLadder.notes ? `<p class="lift-meta"><em>${day.thrusterLadder.notes}</em></p>` : ""}
      </div>

      <div class="lift-block">
        <div class="block-title">Optional</div>
        <div>${day.optional.name} — ${day.optional.prescription}</div>
      </div>
    </div>
  `;
}

function renderWeek(week) {
  return `
    <div class="card">
      <h3>Week ${week.number} — ${week.name}</h3>
      <p class="muted-text">${week.focus}</p>
      ${week.days.map(renderDay).join("")}
    </div>
  `;
}

function renderProgram() {
  if (!state.program || !state.program.weeks) {
    programOutput.innerHTML = "<p>No cycle forged yet.</p>";
    return;
  }

  programOutput.innerHTML = `
    <h3>${state.program.cycleName}</h3>
    ${state.program.weeks.map(renderWeek).join("")}
  `;
}

function renderTodayWorkout() {
  if (!state.program || !state.program.weeks || !todayWorkout) {
    if (todayWorkout) todayWorkout.innerHTML = "<p>No directive loaded yet.</p>";
    return;
  }

  const weekIndex = state.currentWorkout?.weekIndex || 0;
  const dayIndex = state.currentWorkout?.dayIndex || 0;
  const week = state.program.weeks[weekIndex];
  const day = week?.days[dayIndex];

  if (!week || !day) {
    todayWorkout.innerHTML = "<p>No directive loaded yet.</p>";
    return;
  }

  if (day.infinityForge) {
    todayWorkout.innerHTML = `
      <h3 class="today-title">Cycle Phase: ${week.name}</h3>
      <p class="today-subtitle"><strong>${day.title}</strong></p>
      <p class="lift-meta"><em>${week.focus}</em></p>
      ${renderInfinityForgeTracked(day.infinityForge, weekIndex, dayIndex)}
    `;
    attachTrackingListeners();
    return;
  }

  todayWorkout.innerHTML = `
    <h3 class="today-title">Cycle Phase: ${week.name}</h3>
    <p class="today-subtitle"><strong>${day.title}</strong></p>
    <p class="lift-meta"><em>${day.flavor || week.focus}</em></p>

    ${day.bigLifts.map((bigLift, liftIndex) =>
      renderBigLiftTracked(bigLift, weekIndex, dayIndex, liftIndex, "today")
    ).join("")}

    <div class="nested-card">
      <div class="block-title">Forge Movement</div>
      <div>${day.forgeMovement.name} — ${day.forgeMovement.prescription}</div>
      ${day.forgeMovement.notes ? `<p class="lift-meta"><em>${day.forgeMovement.notes}</em></p>` : ""}
    </div>

    <div class="nested-card">
      <div class="block-title">${day.thrusterLadder.name}</div>
      <div>${day.thrusterLadder.reps.join(" / ")}</div>
      ${day.thrusterLadder.notes ? `<p class="lift-meta"><em>${day.thrusterLadder.notes}</em></p>` : ""}
    </div>

    <div class="nested-card">
      <div class="block-title">Optional</div>
      <div>${day.optional.name} — ${day.optional.prescription}</div>
    </div>
  `;

  attachTrackingListeners();
}

function attachTrackingListeners() {
  document.querySelectorAll("[data-track-key]").forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const key = event.target.getAttribute("data-track-key");
      updateTrackedSet(key, { checked: event.target.checked });
    });
  });

  document.querySelectorAll("[data-note-key]").forEach((input) => {
    input.addEventListener("change", (event) => {
      const key = event.target.getAttribute("data-note-key");
      updateTrackedSet(key, { note: event.target.value.trim() });
      event.target.classList.toggle("saved-note", !!event.target.value.trim());
    });

    input.addEventListener("blur", (event) => {
      const key = event.target.getAttribute("data-note-key");
      updateTrackedSet(key, { note: event.target.value.trim() });
      event.target.classList.toggle("saved-note", !!event.target.value.trim());
    });
  });
}

function renderLogs() {
  if (!state.logs.length) {
    logHistory.innerHTML = "<p>No war logs yet.</p>";
    return;
  }

  logHistory.innerHTML = state.logs
    .slice()
    .reverse()
    .map(log => `
      <div class="nested-card">
        <strong>${log.date}</strong> — ${log.workout}<br>
        Bodyweight: ${log.bodyweight || "-"}<br>
        Notes: ${log.notes || ""}
      </div>
    `)
    .join("");
}

function renderScorecards() {
  if (!state.scorecards.length) {
    scorecardHistory.innerHTML = "<p>No reforging records yet.</p>";
    return;
  }

  scorecardHistory.innerHTML = state.scorecards
    .slice()
    .reverse()
    .map(card => `
      <div class="nested-card">
        <strong>${card.date}</strong><br>
        Bodyweight: ${card.bodyweight}<br>
        Bench top: ${card.benchTop}<br>
        SGDL / Deadlift top: ${card.sgdlTop}<br>
        Thruster load: ${card.thrusterLoad}<br>
        Thruster time: ${card.thrusterTime}<br>
        Circuit rounds: ${card.circuitRounds}<br>
        Notes: ${card.notes}
      </div>
    `)
    .join("");
}

function moveWorkout(direction) {
  if (!state.program || !state.program.weeks) return;

  let weekIndex = state.currentWorkout?.weekIndex || 0;
  let dayIndex = state.currentWorkout?.dayIndex || 0;

  if (direction === 1) {
    dayIndex += 1;
    if (dayIndex >= state.program.weeks[weekIndex].days.length) {
      dayIndex = 0;
      weekIndex += 1;
      if (weekIndex >= state.program.weeks.length) {
        weekIndex = state.program.weeks.length - 1;
        dayIndex = state.program.weeks[weekIndex].days.length - 1;
      }
    }
  } else {
    dayIndex -= 1;
    if (dayIndex < 0) {
      weekIndex -= 1;
      if (weekIndex < 0) {
        weekIndex = 0;
        dayIndex = 0;
      } else {
        dayIndex = state.program.weeks[weekIndex].days.length - 1;
      }
    }
  }

  state.currentWorkout = { weekIndex, dayIndex };
  saveAppData(state);
  renderTodayWorkout();
}

profileForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const profile = {
    name: document.getElementById("name").value,
    bodyweight: Number(document.getElementById("bodyweight").value || 0),
    maxes: {
      bench: Number(document.getElementById("bench").value || 0),
      squat: Number(document.getElementById("squat").value || 0),
      deadlift: Number(document.getElementById("deadlift").value || 0),
      sgdl: Number(document.getElementById("sgdl").value || 0)
    }
  };

  state.profile = profile;
  state.program = generateProgram(profile.maxes);
  state.currentWorkout = { weekIndex: 0, dayIndex: 0 };
  state.setTracking = {};

  saveAppData(state);
  renderProgram();
  renderTodayWorkout();
});

dailyLogForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  state.logs.push({
    date: document.getElementById("log-date").value,
    bodyweight: Number(document.getElementById("log-bodyweight").value || 0),
    workout: document.getElementById("log-workout").value,
    notes: document.getElementById("log-notes").value
  });

  saveAppData(state);
  renderLogs();
  dailyLogForm.reset();
});

scorecardForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const newCard = createScorecardEntry({
    date: document.getElementById("score-date").value,
    bodyweight: document.getElementById("score-bodyweight").value,
    benchTop: document.getElementById("score-bench-top").value,
    sgdlTop: document.getElementById("score-sgdl-top").value,
    thrusterLoad: document.getElementById("score-thruster-load").value,
    thrusterTime: document.getElementById("score-thruster-time").value,
    circuitRounds: document.getElementById("score-circuit-rounds").value,
    notes: document.getElementById("score-notes").value
  });

  state.scorecards.push(newCard);
  applyNewMaxesFromScorecard(state, newCard);

  if (state.profile?.maxes) {
    state.program = generateProgram(state.profile.maxes);
    state.currentWorkout = { weekIndex: 0, dayIndex: 0 };
    state.setTracking = {};
  }

  saveAppData(state);
  renderProgram();
  renderTodayWorkout();
  renderScorecards();
  scorecardForm.reset();
});

prevWorkoutBtn?.addEventListener("click", () => moveWorkout(-1));
nextWorkoutBtn?.addEventListener("click", () => moveWorkout(1));

resetWorkoutChecksBtn?.addEventListener("click", () => {
  clearCurrentWorkoutTracking();
  renderTodayWorkout();
});

setTimeout(() => {
  const loading = document.getElementById("loading-screen");
  if (loading) loading.style.display = "none";
}, 1200);

renderProgram();
renderTodayWorkout();
renderLogs();
renderScorecards();
