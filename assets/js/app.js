const state = loadAppData();

const profileForm = document.getElementById("profile-form");
const dailyLogForm = document.getElementById("daily-log-form");
const scorecardForm = document.getElementById("scorecard-form");
const programOutput = document.getElementById("program-output");
const logHistory = document.getElementById("log-history");
const scorecardHistory = document.getElementById("scorecard-history");

function renderProgram() {
  if (!state.program) {
    programOutput.innerHTML = "<p>No cycle generated yet.</p>";
    return;
  }

  programOutput.innerHTML = `
    <h3>${state.program.cycleName}</h3>
    <p>Bench 70%: ${state.program.preview.bench70} lb</p>
    <p>Squat 70%: ${state.program.preview.squat70} lb</p>
    <p>SGDL 65%: ${state.program.preview.sgdl65} lb</p>
    <ul>
      ${state.program.weeks.map(week => `<li><strong>${week.name}</strong> — ${week.focus}</li>`).join("")}
    </ul>
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
