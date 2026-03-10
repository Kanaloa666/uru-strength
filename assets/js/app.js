const state = loadAppData()

const profileForm = document.getElementById("profile-form")
const dailyLogForm = document.getElementById("daily-log-form")
const scorecardForm = document.getElementById("scorecard-form")

const programOutput = document.getElementById("program-output")
const logHistory = document.getElementById("log-history")
const scorecardHistory = document.getElementById("scorecard-history")

const todayWorkout = document.getElementById("today-workout")

const prevWorkoutBtn = document.getElementById("prev-workout")
const nextWorkoutBtn = document.getElementById("next-workout")
const resetWorkoutChecksBtn = document.getElementById("reset-workout-checks")

function renderProgram(){

if(!state.program){

programOutput.innerHTML="<p>No cycle forged yet.</p>"

return

}

programOutput.innerHTML=state.program.weeks.map(week=>`

<div class="nested-card">

<h3>Week ${week.number} — ${week.name}</h3>

<p class="muted-text">${week.focus}</p>

</div>

`).join("")

}

function renderTodayWorkout(){

if(!state.program){

todayWorkout.innerHTML="<p>No directive loaded yet.</p>"

return

}

const weekIndex=state.currentWorkout?.weekIndex||0
const dayIndex=state.currentWorkout?.dayIndex||0

const week=state.program.weeks[weekIndex]
const day=week.days[dayIndex]

todayWorkout.innerHTML=`

<h3 class="today-title">Cycle Phase: ${week.name}</h3>

<p class="today-subtitle">${day.title}</p>

<p class="muted-text">${week.focus}</p>

`

}

function moveWorkout(direction){

let weekIndex=state.currentWorkout?.weekIndex||0
let dayIndex=state.currentWorkout?.dayIndex||0

if(direction===1){

dayIndex++

if(dayIndex>=state.program.weeks[weekIndex].days.length){

dayIndex=0
weekIndex++

}

}else{

dayIndex--

if(dayIndex<0){

weekIndex--
dayIndex=0

}

}

state.currentWorkout={weekIndex,dayIndex}

saveAppData(state)

renderTodayWorkout()

}

profileForm?.addEventListener("submit",(e)=>{

e.preventDefault()

const profile={

name:document.getElementById("name").value,

bodyweight:Number(document.getElementById("bodyweight").value||0),

maxes:{

bench:Number(document.getElementById("bench").value||0),

squat:Number(document.getElementById("squat").value||0),

deadlift:Number(document.getElementById("deadlift").value||0),

sgdl:Number(document.getElementById("sgdl").value||0)

}

}

state.profile=profile

state.program=generateProgram(profile.maxes)

state.currentWorkout={weekIndex:0,dayIndex:0}

saveAppData(state)

renderProgram()

renderTodayWorkout()

})

dailyLogForm?.addEventListener("submit",(e)=>{

e.preventDefault()

state.logs.push({

date:document.getElementById("log-date").value,

bodyweight:document.getElementById("log-bodyweight").value,

workout:document.getElementById("log-workout").value,

notes:document.getElementById("log-notes").value

})

saveAppData(state)

renderLogs()

dailyLogForm.reset()

})

scorecardForm?.addEventListener("submit",(e)=>{

e.preventDefault()

const newCard=createScorecardEntry({

date:document.getElementById("score-date").value,

bodyweight:document.getElementById("score-bodyweight").value,

benchTop:document.getElementById("score-bench-top").value,

sgdlTop:document.getElementById("score-sgdl-top").value,

thrusterLoad:document.getElementById("score-thruster-load").value,

thrusterTime:document.getElementById("score-thruster-time").value,

circuitRounds:document.getElementById("score-circuit-rounds").value,

notes:document.getElementById("score-notes").value

})

state.scorecards.push(newCard)

applyNewMaxesFromScorecard(state,newCard)

saveAppData(state)

})

prevWorkoutBtn?.addEventListener("click",()=>moveWorkout(-1))
nextWorkoutBtn?.addEventListener("click",()=>moveWorkout(1))

setTimeout(()=>{

const loading=document.getElementById("loading-screen")

if(loading)loading.style.display="none"

},1000)

renderProgram()
renderTodayWorkout()
