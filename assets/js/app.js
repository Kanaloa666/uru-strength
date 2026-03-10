const state = loadAppData();

const profileForm = document.getElementById("profile-form");
const dailyLogForm = document.getElementById("daily-log-form");
const scorecardForm = document.getElementById("scorecard-form");
const programOutput = document.getElementById("program-output");
const logHistory = document.getElementById("log-history");
const scorecardHistory = document.getElementById("scorecard-history");

function renderProgram() {
  if (!state.program || !state.program.weeks) {
    programOutput.innerHTML = "<p>No cycle generated yet.</p>";
    return;
  }

  programOutput.innerHTML = `
    <h3>${state.program.cycleName}</h3>
    ${state.program.weeks.map(renderWeekCard).join("")}
  `;
}

function renderWeekCard(week) {
  return `
    <div class="card">
      <h3>Week ${week.number} — ${week.name}</h3>
      <p>${week.focus}</p>
      ${week.days.map(renderDayCard).join("")}
    </div>
  `;
}

function renderDayCard(day) {
  if (day.infinityForge) {
    return renderInfinityForge(day.infinityForge);
  }

  return `
    <div class="card">
      <h4>${day.title}</h4>
      ${day.bigLifts.map(renderBigLift).join("")}

      <div style="margin-top:10px;">
        <strong>Forge Movement:</strong><br>
        ${day.forgeMovement.name} — ${day.forgeMovement.prescription}<br>
        <em>${day.forgeMovement.notes || ""}</em>
      </div>

      <div style="margin-top:10px;">
        <strong>${day.thrusterLadder.name}:</strong><br>
        ${day.thrusterLadder.reps.join(" / ")}<br>
        <em>${day.thrusterLadder.notes || ""}</em>
      </div>

      <div style="margin-top:10px;">
        <strong>Optional:</strong><br>
        ${day.optional.name} — ${day.optional.prescription}
      </div>
    </div>
  `;
}

function renderBigLift(bigLift) {
  return `
    <div style="margin-bottom:16px;">
      <strong>${bigLift.lift}</strong><br>
      <span>Based on max: ${bigLift.basedOnMax} lb</span><br>
      ${bigLift.tempo ? `<span><em>${bigLift.tempo}</em></span><br>` : ""}
      ${bigLift.pause ? `<span><em>${bigLift.pause}</em></span><br>` : ""}

      <div style="margin-top:8px;">
        <strong>Warmups</strong><br>
        ${bigLift.warmups.map(renderWarmup).join("<br>")}
      </div>

      <div style="margin-top:8px;">
        <strong>Work Sets</strong><br>
        ${bigLift.sets.map(renderSet).join("<br>")}
      </div>
    </div>
  `;
}

function renderWarmup(warmup) {
  if (warmup.label) {
    return `${warmup.label} x ${warmup.reps}`;
  }
  return `${warmup.weight} x ${warmup.reps}`;
}

function renderSet(set) {
  return `${set.weight} x ${set.reps} <span style="color:#9fb0cf;">(${Math.round(set.pct * 1000) / 10}%)</span>`;
}

function renderInfinityForge(boss) {
  return `
    <div class="card">
      <h4>${boss.title}</h4>
      <p>${boss.subtitle}</p>

      ${boss.bigLifts.map(renderBigLift).join("")}

      <div style="margin-top:10px;">
        <strong>Forge Movement:</strong><br>
        ${boss.forgeMovement.name} — ${boss.forgeMovement.prescription}<br>
        <em>${boss.forgeMovement.notes || ""}</em>
      </div>

      <div style="margin-top:10px;">
        <strong>Titan Circuit</strong><br>
        ${boss.titanCircuit.map(item => `${item.name} — ${item.prescription}`).join("<br>")}
      </div>

      <div style="margin-top:10px;">
        <strong>Scorecard Fields</strong><br>
        ${boss.scorecardFields.join("<br>")}
      </div>
    </div>
  `;
}

function renderLogs() {
  if (!state.logs.length) {
    logHistory.innerHTML = "<p>No logs yet.</p>";
    return;
  }

  logHistory.innerHTML = state.logs
    .slice()
    .reverse()
    .map(log => `
      <div class="card">
        <strong>${log.date}</strong> — ${log.workout}<br>
        Bodyweight: ${log.bodyweight || "-"}<br>
        Notes: ${log.notes || ""}
      </div>
    `)
    .join("");
}

function renderScorecards() {
  if (!state.scorecards.length) {
    scorecardHistory.innerHTML = "<p>No scorecards yet.</p>";
    return;
  }

  scorecardHistory.innerHTML = state.scorecards
    .slice()
    .reverse()
    .map(card => `
      <div class="card">
        <strong>${card.date}</strong><br>
        Bodyweight: ${card.bodyweight}<br>
        Bench top: ${card.benchTop}<br>
        SGDL top: ${card.sgdlTop}<br>
        Thruster load: ${card.thrusterLoad}<br>
        Thruster time: ${card.thrusterTime}<br>
        Circuit rounds: ${card.circuitRounds}<br>
        Notes: ${card.notes}
      </div>
    `)
    .join("");
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
  saveAppData(state);
  renderProgram();
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

  state.scorecards.push(createScorecardEntry({
    date: document.getElementById("score-date").value,
    bodyweight: document.getElementById("score-bodyweight").value,
    benchTop: document.getElementById("score-bench-top").value,
    sgdlTop: document.getElementById("score-sgdl-top").value,
    thrusterLoad: document.getElementById("score-thruster-load").value,
    thrusterTime: document.getElementById("score-thruster-time").value,
    circuitRounds: document.getElementById("score-circuit-rounds").value,
    notes: document.getElementById("score-notes").value
  }));

  saveAppData(state);
  renderScorecards();
  scorecardForm.reset();
});

setTimeout(() => {
  const loading = document.getElementById("loading-screen");
  if (loading) loading.style.display = "none";
}, 1200);

renderProgram();
renderLogs();
renderScorecards();
