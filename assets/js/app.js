const state = loadAppData()

// Screens
const screenProfile = document.getElementById("screen-profile")
const screenDashboard = document.getElementById("screen-dashboard")

// Loading
const loadingText = document.getElementById("loading-text")
const loadingBar = document.getElementById("loading-bar")

// Forms
const profileForm = document.getElementById("profile-form")
const dailyLogForm = document.getElementById("daily-log-form")
const scorecardForm = document.getElementById("scorecard-form")

// Dashboard UI
const forgeHud = document.getElementById("forge-hud")
const todayWorkout = document.getElementById("today-workout")
const programOutput = document.getElementById("program-output")
const toggleArchiveBtn = document.getElementById("toggle-archive")
const prevWorkoutBtn = document.getElementById("prev-workout")
const nextWorkoutBtn = document.getElementById("next-workout")
const btnEditProfile = document.getElementById("btn-edit-profile")
const resetWorkoutChecksBtn = document.getElementById("reset-workout-checks")

// Logs
const logHistory = document.getElementById("log-history")
const scorecardHistory = document.getElementById("scorecard-history")

let archiveExpanded = false

// ---------------------
// Set tracking store
// ---------------------
function ensureTracking() {
  if (!state.setTracking) state.setTracking = {}
}

function trackKey(weekIndex, dayIndex, liftIndex, setType, setIndex) {
  return `w${weekIndex}|d${dayIndex}|l${liftIndex}|${setType}|s${setIndex}`
}

function getTracked(key) {
  ensureTracking()
  return state.setTracking[key] || { checked: false, note: "" }
}

function setTracked(key, updates) {
  ensureTracking()
  const curr = getTracked(key)
  state.setTracking[key] = { ...curr, ...updates }
  saveAppData(state)
}

function clearDirectiveTracking(weekIndex, dayIndex) {
  ensureTracking()
  const prefix = `w${weekIndex}|d${dayIndex}|`
  Object.keys(state.setTracking).forEach(k => {
    if (k.startsWith(prefix)) delete state.setTracking[k]
  })
  saveAppData(state)
}

// Quick actions (called from inline buttons)
window.applyNote = function applyNote(key, text) {
  const curr = getTracked(key)
  let note = (curr.note || "").trim()

  // toggle behavior: if tag exists, remove it; else add it
  if (note.includes(text)) {
    note = note.replace(text, "").replace(/\s+/g, " ").trim()
  } else {
    note = (note + " " + text).replace(/\s+/g, " ").trim()
  }

  setTracked(key, { note })
  renderDirective() // re-render to reflect note + saved styling
}

window.applyActual = function applyActual(key, reps) {
  const r = String(reps || "").trim()
  if (!r) return

  const curr = getTracked(key)
  let note = (curr.note || "").trim()

  // remove previous "Actual X" if present
  note = note.replace(/Actual\s+\d+/gi, "").replace(/\s+/g, " ").trim()

  // add new
  note = (note + ` Actual ${r}`).replace(/\s+/g, " ").trim()

  setTracked(key, { note })
  renderDirective()
}

// ---------------------
// UI helpers
// ---------------------
function showScreen(name){
  if (name === "profile"){
    screenProfile.classList.remove("hidden")
    screenDashboard.classList.add("hidden")
  } else {
    screenProfile.classList.add("hidden")
    screenDashboard.classList.remove("hidden")
  }
}

function runLoadingSequence(){
  const lines = [
    "Initializing forge...",
    "Binding Uru protocols...",
    "Calibrating directive archive...",
    "Tempering warpath...",
    "Forge online."
  ]
  const widths = ["15%","35%","58%","82%","100%"]

  let i = 0
  if (loadingText) loadingText.textContent = lines[0]
  if (loadingBar) loadingBar.style.width = widths[0]

  const interval = setInterval(() => {
    i++
    if (i < lines.length){
      if (loadingText) loadingText.textContent = lines[i]
      if (loadingBar) loadingBar.style.width = widths[i]
    } else {
      clearInterval(interval)
    }
  }, 260)

  setTimeout(() => {
    const loading = document.getElementById("loading-screen")
    if (loading) loading.style.display = "none"

    if (state.profile?.maxes && state.program?.weeks?.length){
      showScreen("dashboard")
      renderAll()
    } else {
      showScreen("profile")
    }
  }, 1300)
}

function getCurrent(){
  if (!state.program?.weeks?.length) return null
  const wi = state.currentWorkout?.weekIndex ?? 0
  const di = state.currentWorkout?.dayIndex ?? 0
  const week = state.program.weeks[wi]
  const day = week?.days?.[di]
  if (!week || !day) return null
  return { week, day, wi, di }
}

// ---------------------
// Forge HUD
// ---------------------
function renderForgeHud(){
  if (!forgeHud) return

  if (!state.program?.weeks?.length){
    forgeHud.innerHTML = "<p>No cycle forged yet.</p>"
    return
  }

  const current = getCurrent()
  if (!current){
    forgeHud.innerHTML = "<p>No directive loaded yet.</p>"
    return
  }

  const total = state.program.weeks.reduce((sum,w)=>sum + w.days.length, 0)

  let count = 0
  let found = false
  for (let i=0;i<state.program.weeks.length;i++){
    for (let j=0;j<state.program.weeks[i].days.length;j++){
      count++
      if (i===current.wi && j===current.di){
        found = true
        break
      }
    }
    if (found) break
  }

  const pct = Math.round((count/total)*100)
  const isBoss = (current.day.title || "").toLowerCase().includes("infinity forge")

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
        <div class="hud-label">Count</div>
        <div class="hud-value">${count} / ${total}</div>
      </div>
      <div class="hud-item">
        <div class="hud-label">Progress</div>
        <div class="hud-value">${pct}%</div>
      </div>
    </div>

    <div class="progress-shell">
      <div class="progress-fill" style="width:${pct}%"></div>
    </div>

    ${isBoss ? `<div class="boss-warning">FINAL BOSS ACTIVE — Save Reforging Record to set new numbers.</div>` : ""}
  `
}

// ---------------------
// Directive rendering with tracking UI
// ---------------------
function renderSetRow(label, key) {
  const t = getTracked(key)

  return `
    <div class="set-row">
      <input class="set-check" type="checkbox" data-track-key="${key}" ${t.checked ? "checked" : ""}/>
      <div class="set-text">${label}</div>
      <div>
        <input
          class="set-note ${t.note ? "saved-note" : ""}"
          type="text"
          data-note-key="${key}"
          value="${t.note || ""}"
          placeholder="notes / actual reps"
        />
        <div class="note-chip-row">
          <button type="button" class="note-chip" onclick="applyNote('${key}','PR')">PR</button>
          <button type="button" class="note-chip" onclick="applyNote('${key}','RPE9')">RPE9</button>
          <button type="button" class="note-chip" onclick="applyNote('${key}','FAIL')">FAIL</button>
          <span class="actual-label">Actual</span>
          <input class="actual-input" type="number" min="0" placeholder="reps"
            onchange="applyActual('${key}', this.value)" />
        </div>
      </div>
    </div>
  `
}

function liftBlockWithTracking(bigLift, wi, di, liftIndex) {
  const warmups = (bigLift.warmups || []).map((w, idx) => {
    const label = w.label ? `${w.label} x ${w.reps}` : `${w.weight} x ${w.reps}`
    return renderSetRow(label, trackKey(wi, di, liftIndex, "warmup", idx))
  }).join("")

  const sets = (bigLift.sets || []).map((s, idx) => {
    const label = (typeof s.weight === "string")
      ? `${s.weight} x ${s.reps}`
      : `${s.weight} x ${s.reps}`
    return renderSetRow(label, trackKey(wi, di, liftIndex, "work", idx))
  }).join("")

  return `
    <div class="directive-block">
      <div class="directive-label">${bigLift.lift}</div>
      ${bigLift.notes ? `<div class="muted-text">${bigLift.notes}</div>` : ""}

      <div class="mini-title">Warmups</div>
      ${warmups || `<div class="muted-text">—</div>`}

      <div class="mini-title">Work Sets</div>
      ${sets || `<div class="muted-text">—</div>`}
    </div>
  `
}

function attachTrackingListeners() {
  document.querySelectorAll("[data-track-key]").forEach(el => {
    el.addEventListener("change", (e) => {
      const key = e.target.getAttribute("data-track-key")
      setTracked(key, { checked: !!e.target.checked })
    })
  })

  document.querySelectorAll("[data-note-key]").forEach(el => {
    const save = () => {
      const key = el.getAttribute("data-note-key")
      const val = (el.value || "").trim()
      setTracked(key, { note: val })
      el.classList.toggle("saved-note", !!val)
    }
    el.addEventListener("change", save)
    el.addEventListener("blur", save)
  })
}

function renderDirective(){
  if (!todayWorkout) return

  const current = getCurrent()
  if (!current){
    todayWorkout.innerHTML = "<p>No directive loaded yet.</p>"
    return
  }

  const { week, day, wi, di } = current

  if (day.infinityForge){
    const boss = day.infinityForge
    todayWorkout.innerHTML = `
      <h3>Cycle Phase: ${week.name}</h3>
      <p class="muted-text">${week.focus}</p>
      <div class="boss-warning">FINAL BOSS — log top sets in Reforging Record.</div>

      <div class="directive-stack">
        ${boss.bigLifts.map((lift, idx) => liftBlockWithTracking(lift, wi, di, idx)).join("")}

        <div class="directive-block">
          <div class="directive-label">Forge Movement</div>
          <div class="directive-line">${boss.forgeMovement.name} — ${boss.forgeMovement.prescription}</div>
          ${boss.forgeMovement.notes ? `<div class="muted-text">${boss.forgeMovement.notes}</div>` : ""}
        </div>

        <div class="directive-block">
          <div class="directive-label">Titan Circuit</div>
          ${boss.titanCircuit.map(i => `<div class="directive-line">${i.name} — ${i.prescription}</div>`).join("")}
        </div>
      </div>
    `
    attachTrackingListeners()
    return
  }

  todayWorkout.innerHTML = `
    <h3>Cycle Phase: ${week.name}</h3>
    <p><strong>${day.title}</strong></p>
    <p class="muted-text">${day.flavor || week.focus}</p>

    <div class="directive-stack">
      ${day.bigLifts.map((lift, idx) => liftBlockWithTracking(lift, wi, di, idx)).join("")}

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
  attachTrackingListeners()
}

// ---------------------
// Archive / Logs / Scorecards
// ---------------------
function renderArchive(){
  if (!programOutput) return

  if (!state.program?.weeks?.length){
    programOutput.innerHTML = "<p class='muted-text'>No archive yet.</p>"
    return
  }

  programOutput.className = archiveExpanded ? "archive-expanded" : "archive-collapsed"

  programOutput.innerHTML = state.program.weeks.map(week => `
    <div class="nested-card">
      <h3>Week ${week.number} — ${week.name}</h3>
      <p class="muted-text">${week.focus}</p>
      ${week.days.map(day => `
        <div class="directive-block">
          <div class="directive-label">${day.title}</div>
          <div class="directive-line">${day.flavor || week.focus}</div>
        </div>
      `).join("")}
    </div>
  `).join("")

  if (toggleArchiveBtn){
    toggleArchiveBtn.textContent = archiveExpanded ? "Collapse" : "Expand"
  }
}

function renderLogs(){
  if (!logHistory) return
  if (!state.logs?.length){
    logHistory.innerHTML = "<p class='muted-text'>No war logs yet.</p>"
    return
  }
  logHistory.innerHTML = state.logs.slice().reverse().map(l => `
    <div class="nested-card">
      <strong>${l.date}</strong> — ${l.workout}<br>
      Bodyweight: ${l.bodyweight || "-"}<br>
      Notes: ${l.notes || ""}
    </div>
  `).join("")
}

function renderScorecards(){
  if (!scorecardHistory) return
  if (!state.scorecards?.length){
    scorecardHistory.innerHTML = "<p class='muted-text'>No reforging records yet.</p>"
    return
  }
  scorecardHistory.innerHTML = state.scorecards.slice().reverse().map(c => `
    <div class="nested-card">
      <strong>${c.date}</strong><br>
      Bodyweight: ${c.bodyweight}<br>
      Bench top: ${c.benchTop}<br>
      SGDL top: ${c.sgdlTop}<br>
      Thruster load: ${c.thrusterLoad}<br>
      Thruster time: ${c.thrusterTime}<br>
      Circuit rounds: ${c.circuitRounds}<br>
      Notes: ${c.notes}
    </div>
  `).join("")
}

function renderAll(){
  renderForgeHud()
  renderDirective()
  renderArchive()
  renderLogs()
  renderScorecards()
}

// ---------------------
// Navigation
// ---------------------
function moveWorkout(dir){
  if (!state.program?.weeks?.length) return

  let wi = state.currentWorkout?.weekIndex ?? 0
  let di = state.currentWorkout?.dayIndex ?? 0

  if (dir === 1){
    di++
    if (di >= state.program.weeks[wi].days.length){
      di = 0
      wi++
      if (wi >= state.program.weeks.length){
        wi = state.program.weeks.length - 1
        di = state.program.weeks[wi].days.length - 1
      }
    }
  } else {
    di--
    if (di < 0){
      wi--
      if (wi < 0){
        wi = 0
        di = 0
      } else {
        di = state.program.weeks[wi].days.length - 1
      }
    }
  }

  state.currentWorkout = { weekIndex: wi, dayIndex: di }
  saveAppData(state)
  renderForgeHud()
  renderDirective()
}

// ---------------------
// Events
// ---------------------
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

  ensureTracking()
  saveAppData(state)

  showScreen("dashboard")
  renderAll()
})

btnEditProfile?.addEventListener("click", () => {
  showScreen("profile")
})

prevWorkoutBtn?.addEventListener("click", () => moveWorkout(-1))
nextWorkoutBtn?.addEventListener("click", () => moveWorkout(1))

toggleArchiveBtn?.addEventListener("click", () => {
  archiveExpanded = !archiveExpanded
  renderArchive()
})

dailyLogForm?.addEventListener("submit", (e) => {
  e.preventDefault()
  state.logs = state.logs || []
  state.logs.push({
    date: document.getElementById("log-date").value,
    bodyweight: Number(document.getElementById("log-bodyweight").value || 0),
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

  state.scorecards = state.scorecards || []
  state.scorecards.push(newCard)

  applyNewMaxesFromScorecard(state, newCard)

  if (state.profile?.maxes){
    state.program = generateProgram(state.profile.maxes)
    state.currentWorkout = { weekIndex: 0, dayIndex: 0 }
  }

  saveAppData(state)
  showScreen("dashboard")
  renderAll()
  scorecardForm.reset()
})

// Reset checks clears ONLY current directive
resetWorkoutChecksBtn?.addEventListener("click", () => {
  const cur = getCurrent()
  if (!cur) return
  clearDirectiveTracking(cur.wi, cur.di)
  renderDirective()
})

runLoadingSequence()
