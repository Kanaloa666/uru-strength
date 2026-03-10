const state = loadAppData()

const profileForm = document.getElementById("profile-form")
const dailyLogForm = document.getElementById("daily-log-form")
const scorecardForm = document.getElementById("scorecard-form")

const programOutput = document.getElementById("program-output")
const logHistory = document.getElementById("log-history")
const scorecardHistory = document.getElementById("scorecard-history")

const todayWorkout = document.getElementById("today-workout")
const forgeHud = document.getElementById("forge-hud")

const prevWorkoutBtn = document.getElementById("prev-workout")
const nextWorkoutBtn = document.getElementById("next-workout")
const resetWorkoutChecksBtn = document.getElementById("reset-workout-checks")
const toggleArchiveBtn = document.getElementById("toggle-archive")

const loadingText = document.getElementById("loading-text")
const loadingBar = document.getElementById("loading-bar")

let archiveExpanded = false

function renderLiftPreview(bigLift) {
  const setLines = bigLift.sets
    .map((set) => {
      if (typeof set.weight === "string") {
        return `<div class="directive-line">${set.weight} x ${set.reps}</div>`
      }
      return `<div class="directive-line">${set.weight} x ${set.reps}</div>`
    })
    .join("")

  return `
    <div class="directive-block">
      <div class="directive-label">${bigLift.lift}</div>
      ${bigLift.notes ? `<div class="muted-text">${bigLift.notes}</div>` : ""}
      ${setLines}
    </div>
  `
}

function renderDirectiveBody(day) {
  if (day.infinityForge) {
    const boss = day.infinityForge

    return `
      <div class="boss-warning">FINAL BOSS ACTIVE — Record top sets. These become your new numbers.</div>

      <div class="directive-stack">
        ${boss.bigLifts.map(renderLiftPreview).join("")}

        <div class="directive-block">
          <div class="directive-label">Forge Movement</div>
          <div class="directive-line">${boss.forgeMovement.name} — ${boss.forgeMovement.prescription}</div>
          ${boss.forgeMovement.notes ? `<div class="muted-text">${boss.forgeMovement.notes}</div>` : ""}
        </div>

        <div class="directive-block">
          <div class="directive-label">Titan Circuit</div>
          ${boss.titanCircuit.map(item => `<div class="directive-line">${item.name} — ${item.prescription}</div>`).join("")}
        </div>
      </div>
    `
  }

  return `
    <div class="directive-stack">
      ${day.bigLifts.map(renderLiftPreview).join("")}

      <div class="directive-block">
        <div class="directive-label">Forge Movement</div>
        <div class="directive-line">${day.forgeMovement.name} — ${day.forgeMovement.prescription}</div>
        ${day.forgeMovement.notes ? `<div class="muted-text">${day.forgeMovement.notes}</div>` : ""}
      </div>

      <div class="directive-block">
        <div class="directive-label">${day.thrusterLadder.name}</div>
        <div class="directive-line">${day.thrusterLadder.reps.join(" / ")}</div>
        ${day.thrusterLadder.notes ? `<div class="muted-text">${day.thrusterLadder.notes}</div>` : ""}
      </div>

      <div class="directive-block">
        <div class="directive-label">Optional</div>
        <div class="directive-line">${day.optional.name} — ${day.optional.prescription}</div>
      </div>
    </div>
  `
}

function renderProgram() {
  if (!state.program) {
    programOutput.innerHTML = "<p>No cycle forged yet.</p>"
    return
  }

  programOutput.className = archiveExpanded ? "archive-expanded" : "archive-collapsed"

  programOutput.innerHTML = state.program.weeks.map((week) => `
    <div class="nested-card">
      <h3>Week ${week.number} — ${week.name}</h3>
      <p class="muted-text">${week.focus}</p>
      ${week.days.map((day) => `
        <div class="directive-block">
          <div class="directive-label">${day.title}</div>
          <div class="directive-line">${day.flavor || week.focus}</div>
        </div>
      `).join("")}
    </div>
  `).join("")

  if (toggleArchiveBtn) {
    toggleArchiveBtn.textContent = archiveExpanded ? "Collapse Archive" : "Expand Archive"
  }
}

function getCurrentWeekAndDay() {
  if (!state.program) return null

  const weekIndex = state.currentWorkout?.weekIndex || 0
  const dayIndex = state.currentWorkout?.dayIndex || 0

  const week = state.program.weeks?.[weekIndex]
  const day = week?.days?.[dayIndex]

  if (!week || !day) return null

  return { week, day, weekIndex, dayIndex }
}

function renderForgeHud() {
  if (!state.program || !forgeHud) {
    if (forgeHud) forgeHud.innerHTML = "<p>No cycle forged yet.</p>"
    return
  }

  const current = getCurrentWeekAndDay()
  if (!current) {
    forgeHud.innerHTML = "<p>No directive loaded yet.</p>"
    return
  }

  const totalDirectives = state.program.weeks.reduce((sum, week) => sum + week.days.length, 0)

  let currentDirectiveNumber = 0
  let found = false

  for (let i = 0; i < state.program.weeks.length; i++) {
    for (let j = 0; j < state.program.weeks[i].days.length; j++) {
      currentDirectiveNumber++
      if (i === current.weekIndex && j === current.dayIndex) {
        found = true
        break
      }
    }
    if (found) break
  }

  const progressPercent = Math.round((currentDirectiveNumber / totalDirectives) * 100)

  const bossWarning = current.day.title?.toLowerCase().includes("infinity forge")
    ? `<div class="boss-warning">FINAL BOSS ACTIVE — Reforging Record will set your next cycle maxes.</div>`
    : ""

  forgeHud.innerHTML = `
    <div class="hud-grid">
      <div class="hud-item">
        <div class="hud-label">Cycle Phase</div>
        <div class="hud-value">${current.week.name}</div>
      </div>

      <div class="hud-item">
        <div class="hud-label">Directive</div>
        <div class="hud-value">${current.day.title}</div>
      </div>

      <div class="hud-item">
        <div class="hud-label">Directive Count</div>
        <div class="hud-value">${currentDirectiveNumber} / ${totalDirectives}</div>
      </div>

      <div class="hud-item">
        <div class="hud-label">Progress</div>
        <div class="hud-value">${progressPercent}%</div>
      </div>
    </div>

    <div class="progress-shell">
      <div class="progress-fill" style="width:${progressPercent}%"></div>
    </div>

    ${bossWarning}
  `
}

function renderTodayWorkout() {
  if (!state.program) {
    todayWorkout.innerHTML = "<p>No directive loaded yet.</p>"
    return
  }

  const current = getCurrentWeekAndDay()
  if (!current) {
    todayWorkout.innerHTML = "<p>No directive loaded yet.</p>"
    return
  }

  const { week, day } = current

  todayWorkout.innerHTML = `
    <h3 class="today-title">Cycle Phase: ${week.name}</h3>
    <p class="today-subtitle">${day.title}</p>
    <p class="muted-text">${day.flavor || week.focus}</p>
    ${renderDirectiveBody(day)}
  `
}

function moveWorkout(direction) {
  if (!state.program || !state.program.weeks) return

  let weekIndex = state.currentWorkout?.weekIndex || 0
  let dayIndex = state.currentWorkout?.dayIndex || 0

  if (direction === 1) {
    dayIndex++
    if (dayIndex >= state.program.weeks[weekIndex].days.length) {
      dayIndex = 0
      weekIndex++
      if (weekIndex >= state.program.weeks.length) {
        weekIndex = state.program.weeks.length - 1
        dayIndex = state.program.weeks[weekIndex].days.length - 1
      }
    }
  } else {
    dayIndex--
    if (dayIndex < 0) {
      weekIndex--
      if (weekIndex < 0) {
        weekIndex = 0
        dayIndex = 0
      } else {
        dayIndex = state.program.weeks[weekIndex].days.length - 1
      }
    }
  }

  state.currentWorkout = { weekIndex, dayIndex }
  saveAppData(state)
  renderTodayWorkout()
  renderForgeHud()
}

function renderLogs() {
  if (!state.logs.length) {
    logHistory.innerHTML = "<p>No war logs yet.</p>"
    return
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
    .join("")
}

function renderScorecards() {
  if (!state.scorecards.length) {
    scorecardHistory.innerHTML = "<p>No reforging records yet.</p>"
    return
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
    .join("")
}

function runLoadingSequence() {
  const lines = [
    "Initializing forge...",
    "Binding Uru protocols...",
    "Calibrating directive archive...",
    "Tempering warpath...",
    "Forge online."
  ]

  const widths = ["15%", "35%", "58%", "82%", "100%"]

  let i = 0
  if (loadingText) loadingText.textContent = lines[0]
  if (loadingBar) loadingBar.style.width = widths[0]

  const interval = setInterval(() => {
    i++
    if (i < lines.length) {
      if (loadingText) loadingText.textContent = lines[i]
      if (loadingBar) loadingBar.style.width = widths[i]
    } else {
      clearInterval(interval)
    }
  }, 320)

  setTimeout(() => {
    const loading = document.getElementById("loading-screen")
    if (loading) loading.style.display = "none"
  }, 1800)
}

profileForm?.addEventListener("submit", (e) => {
  e.preventDefault()

  const profile = {
    name: document.getElementById("name").value,
    bodyweight: Number(document.getElementById("bodyweight").value || 0),
    maxes: {
      bench: Number(document.getElementById("bench").value || 0),
      squat: Number(document.getElementById("squat").value || 0),
      deadlift: Number(document.getElementById("deadlift").value || 0),
      sgdl: Number(document.getElementById("sgdl").value || 0)
    }
  }

  state.profile = profile
  state.program = generateProgram(profile.maxes)
  state.currentWorkout = { weekIndex: 0, dayIndex: 0 }

  saveAppData(state)

  renderProgram()
  renderTodayWorkout()
  renderForgeHud()
})

dailyLogForm?.addEventListener("submit", (e) => {
  e.preventDefault()

  state.logs.push({
    date: document.getElementById("log-date").value,
    bodyweight: document.getElementById("log-bodyweight").value,
    workout: document.getElementById("log-workout").value,
    notes: document.getElementById("log-notes").value
  })

  saveAppData(state)
  renderLogs()
  dailyLogForm.reset()
})

scorecardForm?.addEventListener("submit", (e) => {
  e.preventDefault()

  const newCard = createScorecardEntry({
    date: document.getElementById("score-date").value,
    bodyweight: document.getElementById("score-bodyweight").value,
    benchTop: document.getElementById("score-bench-top").value,
    sgdlTop: document.getElementById("score-sgdl-top").value,
    thrusterLoad: document.getElementById("score-thruster-load").value,
    thrusterTime: document.getElementById("score-thruster-time").value,
    circuitRounds: document.getElementById("score-circuit-rounds").value,
    notes: document.getElementById("score-notes").value
  })

  state.scorecards.push(newCard)
  applyNewMaxesFromScorecard(state, newCard)

  if (state.profile?.maxes) {
    state.program = generateProgram(state.profile.maxes)
    state.currentWorkout = { weekIndex: 0, dayIndex: 0 }
  }

  saveAppData(state)

  renderProgram()
  renderTodayWorkout()
  renderForgeHud()
  renderScorecards()

  scorecardForm.reset()
})

prevWorkoutBtn?.addEventListener("click", () => moveWorkout(-1))
nextWorkoutBtn?.addEventListener("click", () => moveWorkout(1))

resetWorkoutChecksBtn?.addEventListener("click", () => {
  state.currentWorkout = { weekIndex: 0, dayIndex: 0 }
  saveAppData(state)
  renderTodayWorkout()
  renderForgeHud()
})

toggleArchiveBtn?.addEventListener("click", () => {
  archiveExpanded = !archiveExpanded
  renderProgram()
})

runLoadingSequence()
renderProgram()
renderTodayWorkout()
renderForgeHud()
renderLogs()
renderScorecards()
