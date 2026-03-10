function roundTo5(num) {
  return Math.round(num / 5) * 5;
}

function pct(max, percent) {
  return roundTo5(max * percent);
}

function buildWarmups(max, liftName) {
  const warmups = [];

  if (liftName.toLowerCase().includes("bench")) {
    warmups.push({ label: "Bar", reps: 10 });
  }

  warmups.push(
    { weight: pct(max, 0.4), reps: 5 },
    { weight: pct(max, 0.5), reps: 3 },
    { weight: pct(max, 0.6), reps: 2 }
  );

  return warmups;
}

function buildSetList(max, pattern) {
  return pattern.map((set) => ({
    pct: set.pct,
    reps: set.reps,
    weight: pct(max, set.pct)
  }));
}

const PATTERNS = {
  week1: [
    { pct: 0.65, reps: 6 },
    { pct: 0.70, reps: 5 },
    { pct: 0.75, reps: 5 },
    { pct: 0.775, reps: 4 },
    { pct: 0.80, reps: 4 }
  ],
  week2Regular: [
    { pct: 0.70, reps: 5 },
    { pct: 0.75, reps: 4 },
    { pct: 0.80, reps: 4 },
    { pct: 0.825, reps: 3 },
    { pct: 0.85, reps: 3 }
  ],
  week2Inverted: [
    { pct: 0.85, reps: 3 },
    { pct: 0.825, reps: 3 },
    { pct: 0.80, reps: 4 },
    { pct: 0.75, reps: 5 },
    { pct: 0.70, reps: 6 }
  ],
  week3: [
    { pct: 0.725, reps: 3 },
    { pct: 0.80, reps: 3 },
    { pct: 0.85, reps: 2 },
    { pct: 0.875, reps: 2 },
    { pct: 0.90, reps: 1 }
  ],
  week4: [
    { pct: 0.60, reps: 5 },
    { pct: 0.65, reps: 5 },
    { pct: 0.70, reps: 4 },
    { pct: 0.70, reps: 4 },
    { pct: 0.725, reps: 3 }
  ]
};

function createBigLift(lift, max, pattern, notes = "") {
  return {
    lift,
    basedOnMax: max,
    notes,
    warmups: buildWarmups(max, lift),
    sets: buildSetList(max, pattern)
  };
}

function generateProgram(maxes) {
  return {
    cycleName: "URU Forge Cycle",
    currentWeek: 1,
    weeks: [
      {
        number: 1,
        name: "Foundation",
        focus: "Ascent week",
        days: [
          {
            title: "Day 1",
            bigLifts: [
              createBigLift("Bench Press", maxes.bench, PATTERNS.week1),
              createBigLift("Snatch Grip Deadlift", maxes.sgdl, PATTERNS.week1)
            ],
            forgeMovement: {
              name: "Half-Kneeling Landmine Press",
              prescription: "3 x 8 / side"
            },
            thrusterLadder: {
              name: "Landmine Thruster Ladder",
              reps: [2, 4, 6, 8, 10]
            }
          },
          {
            title: "Day 2",
            bigLifts: [
              createBigLift("Back Squat", maxes.squat, PATTERNS.week1),
              createBigLift("Close Grip Bench", maxes.bench, PATTERNS.week1)
            ],
            forgeMovement: {
              name: "Landmine Reverse Suitcase Lunge",
              prescription: "3 x 8 / leg"
            },
            thrusterLadder: {
              name: "Landmine Thruster Ladder",
              reps: [2, 4, 6, 8, 10]
            }
          },
          {
            title: "Day 3",
            bigLifts: [
              createBigLift("Deadlift", maxes.deadlift, PATTERNS.week1),
              createBigLift("Wide Grip Bench", maxes.bench, PATTERNS.week1)
            ],
            forgeMovement: {
              name: "Landmine Full Contact Twist",
              prescription: "3 x 10 / side"
            },
            thrusterLadder: {
              name: "Landmine Thruster Ladder",
              reps: [2, 4, 6, 8, 10]
            }
          }
        ]
      },
      {
        number: 2,
        name: "Strength",
        focus: "Regular + inverted pyramids",
        days: [
          {
            title: "Day 1",
            bigLifts: [
              createBigLift("Bench Press", maxes.bench, PATTERNS.week2Regular),
              createBigLift("Snatch Grip Deadlift", maxes.sgdl, PATTERNS.week2Regular)
            ],
            forgeMovement: {
              name: "Landmine Shoulder-to-Shoulder Press",
              prescription: "3 x 8 / side"
            },
            thrusterLadder: {
              name: "Landmine Thruster Ladder",
              reps: [3, 5, 7, 9]
            }
          },
          {
            title: "Day 2",
            bigLifts: [
              createBigLift("Paused Back Squat", maxes.squat, PATTERNS.week2Inverted, "2 sec pause in the hole"),
              createBigLift("Paused Bench", maxes.bench, PATTERNS.week2Inverted, "1 sec pause on chest")
            ],
            forgeMovement: {
              name: "Landmine Reverse Suitcase Lunge",
              prescription: "3 x 8 / leg"
            },
            thrusterLadder: {
              name: "Landmine Thruster Ladder",
              reps: [3, 5, 7, 9]
            }
          },
          {
            title: "Day 3",
            bigLifts: [
              createBigLift("Deadlift", maxes.deadlift, PATTERNS.week2Regular),
              createBigLift("Close Grip Bench", maxes.bench, PATTERNS.week2Regular)
            ],
            forgeMovement: {
              name: "Landmine Squat to Rotational Press",
              prescription: "3 x 8 / side"
            },
            thrusterLadder: {
              name: "Landmine Thruster Ladder",
              reps: [3, 5, 7, 9]
            }
          }
        ]
      },
      {
        number: 3,
        name: "Power",
        focus: "Higher percent, lower reps",
        days: [
          {
            title: "Day 1",
            bigLifts: [
              createBigLift("Bench Press", maxes.bench, PATTERNS.week3),
              createBigLift("Snatch Grip Deadlift", maxes.sgdl, PATTERNS.week3)
            ],
            forgeMovement: {
              name: "Half-Kneeling Landmine Press",
              prescription: "3 x 6 / side"
            },
            thrusterLadder: {
              name: "Landmine Thruster Ladder",
              reps: [5, 5, 5, 5, 5]
            }
          },
          {
            title: "Day 2",
            bigLifts: [
              createBigLift("Back Squat", maxes.squat, PATTERNS.week3),
              createBigLift("Tempo Bench", maxes.bench, PATTERNS.week3, "3 sec eccentric")
            ],
            forgeMovement: {
              name: "Landmine Reverse Suitcase Lunge",
              prescription: "3 x 6 / leg"
            },
            thrusterLadder: {
              name: "Landmine Thruster Ladder",
              reps: [5, 5, 5, 5, 5]
            }
          },
          {
            title: "Day 3",
            bigLifts: [
              createBigLift("Deadlift", maxes.deadlift, PATTERNS.week3),
              createBigLift("Wide Grip Bench", maxes.bench, PATTERNS.week3)
            ],
            forgeMovement: {
              name: "Landmine Full Contact Twist",
              prescription: "3 x 8 / side"
            },
            thrusterLadder: {
              name: "Landmine Thruster Ladder",
              reps: [5, 5, 5, 5, 5]
            }
          }
        ]
      },
      {
        number: 4,
        name: "Deload",
        focus: "Tempo, pauses, recovery",
        days: [
          {
            title: "Day 1",
            bigLifts: [
              createBigLift("Bench Press", maxes.bench, PATTERNS.week4, "3 sec eccentric"),
              createBigLift("Snatch Grip Deadlift", maxes.sgdl, PATTERNS.week4, "2 sec pause below knee")
            ],
            forgeMovement: {
              name: "Half-Kneeling Landmine Press",
              prescription: "2 x 10 / side"
            },
            thrusterLadder: {
              name: "Landmine Thruster Ladder",
              reps: [3, 3, 3, 3, 3]
            }
          },
          {
            title: "Day 2",
            bigLifts: [
              createBigLift("Pause Back Squat", maxes.squat, PATTERNS.week4, "2 sec pause in the hole"),
              createBigLift("Tempo Bench", maxes.bench, PATTERNS.week4, "3 sec eccentric")
            ],
            forgeMovement: {
              name: "Landmine Reverse Suitcase Lunge",
              prescription: "2 x 8 / leg"
            },
            thrusterLadder: {
              name: "Landmine Thruster Ladder",
              reps: [3, 3, 3, 3, 3]
            }
          },
          {
            title: "Day 3 — Infinity Forge",
            infinityForge: true
          }
        ]
      }
    ]
  };
}
