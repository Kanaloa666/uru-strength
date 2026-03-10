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
    { weight: pct(max, 0.40), reps: 5 },
    { weight: pct(max, 0.50), reps: 3 },
    { weight: pct(max, 0.60), reps: 2 }
  );

  return warmups;
}

function buildSetList(max, pattern) {
  return pattern.map(set => ({
    pct: set.pct,
    reps: set.reps,
    weight: pct(max, set.pct)
  }));
}

const BIG_LIFT_PATTERNS = {
  week1Ascent: [
    { pct: 0.65, reps: 6 },
    { pct: 0.70, reps: 5 },
    { pct: 0.75, reps: 5 },
    { pct: 0.775, reps: 4 },
    { pct: 0.80, reps: 4 }
  ],
  week2RegularPyramid: [
    { pct: 0.70, reps: 5 },
    { pct: 0.75, reps: 4 },
    { pct: 0.80, reps: 4 },
    { pct: 0.825, reps: 3 },
    { pct: 0.85, reps: 3 }
  ],
  week2InvertedPyramid: [
    { pct: 0.85, reps: 3 },
    { pct: 0.825, reps: 3 },
    { pct: 0.80, reps: 4 },
    { pct: 0.75, reps: 5 },
    { pct: 0.70, reps: 6 }
  ],
  week3PowerAscent: [
    { pct: 0.725, reps: 3 },
    { pct: 0.80, reps: 3 },
    { pct: 0.85, reps: 2 },
    { pct: 0.875, reps: 2 },
    { pct: 0.90, reps: 1 }
  ],
  week3PowerWave: [
    { pct: 0.75, reps: 3 },
    { pct: 0.825, reps: 2 },
    { pct: 0.875, reps: 1 },
    { pct: 0.825, reps: 2 },
    { pct: 0.775, reps: 3 }
  ],
  week4Deload: [
    { pct: 0.60, reps: 5 },
    { pct: 0.65, reps: 5 },
    { pct: 0.70, reps: 4 },
    { pct: 0.70, reps: 4 },
    { pct: 0.725, reps: 3 }
  ],
  week4BenchTempo: [
    { pct: 0.60, reps: 5 },
    { pct: 0.65, reps: 5 },
    { pct: 0.65, reps: 5 },
    { pct: 0.70, reps: 4 },
    { pct: 0.70, reps: 4 }
  ],
  week4BenchTempoSecondary: [
    { pct: 0.60, reps: 6 },
    { pct: 0.65, reps: 6 },
    { pct: 0.65, reps: 5 },
    { pct: 0.675, reps: 5 },
    { pct: 0.70, reps: 4 }
  ]
};

function createBigLift(liftName, max, pattern, options = {}) {
  return {
    lift: liftName,
    basedOnMax: max,
    tempo: options.tempo || "",
    pause: options.pause || "",
    warmups: buildWarmups(max, liftName),
    sets: buildSetList(max, pattern)
  };
}

function createAccessory(name, prescription, notes = "") {
  return {
    name,
    prescription,
    notes
  };
}

function createThrusterLadder(weekNumber) {
  const ladders = {
    1: {
      name: "Landmine Thruster Ladder",
      reps: [2, 4, 6, 8, 10],
      notes: "Foundation ladder — smooth reps and aggressive bracing."
    },
    2: {
      name: "Landmine Thruster Ladder",
      reps: [3, 5, 7, 9],
      notes: "Strength ladder — slightly heavier, stay crisp."
    },
    3: {
      name: "Landmine Thruster Ladder",
      reps: [5, 5, 5, 5, 5],
      notes: "Power ladder — explosive intent on every rep."
    },
    4: {
      name: "Landmine Thruster Ladder",
      reps: [3, 3, 3, 3, 3],
      notes: "Deload ladder — light, controlled, clean movement."
    }
  };

  return ladders[weekNumber];
}

function createInfinityForge(maxes) {
  return {
    title: "Infinity Forge",
    subtitle: "Final Boss Scorecard Session",
    bigLifts: [
      createBigLift("Bench Press", maxes.bench, [
        { pct: 0.65, reps: 5 },
        { pct: 0.75, reps: 3 },
        { pct: 0.85, reps: 2 },
        { pct: 0.90, reps: 1 },
        { pct: 0.90, reps: 1 }
      ]),
      createBigLift("Snatch Grip Deadlift", maxes.sgdl, [
        { pct: 0.65, reps: 5 },
        { pct: 0.75, reps: 3 },
        { pct: 0.85, reps: 2 },
        { pct: 0.85, reps: 2 },
        { pct: 0.85, reps: 1 }
      ])
    ],
    forgeMovement: createAccessory(
      "Landmine Thruster Ladder",
      "2, 4, 6, 8, 10, 12",
      "Run this hard but stay clean. Score the load and total completion time."
    ),
    titanCircuit: [
      createAccessory("Meadows Row", "3 x 10 / side"),
      createAccessory("Kettlebell Swings", "3 x 20"),
      createAccessory("Landmine Full Contact Twist", "3 x 12 / side")
    ],
    scorecardFields: [
      "Date",
      "Bodyweight",
      "Bench top set",
      "SGDL top set",
      "Thruster load",
      "Thruster ladder time",
      "Circuit rounds completed",
      "Notes"
    ]
  };
}

function generateProgram(maxes) {
  const weeks = [
    {
      name: "Foundation",
      focus: "Ascent week — volume, positions, work capacity",
      number: 1,
      days: [
        {
          title: "Day 1 — Bench / SGDL",
          bigLifts: [
            createBigLift("Bench Press", maxes.bench, BIG_LIFT_PATTERNS.week1Ascent),
            createBigLift("Snatch Grip Deadlift", maxes.sgdl, BIG_LIFT_PATTERNS.week1Ascent)
          ],
          forgeMovement: createAccessory(
            "Half-Kneeling Landmine Press",
            "3 x 8 / side",
            "Brace hard and do not let the torso leak."
          ),
          thrusterLadder: createThrusterLadder(1),
          optional: createAccessory("Meadows Row", "3 x 10 / side")
        },
        {
          title: "Day 2 — Squat / Close Grip",
          bigLifts: [
            createBigLift("Back Squat", maxes.squat, BIG_LIFT_PATTERNS.week1Ascent),
            createBigLift("Close Grip Bench", maxes.bench, BIG_LIFT_PATTERNS.week1Ascent)
          ],
          forgeMovement: createAccessory(
            "Landmine Reverse Suitcase Lunge",
            "3 x 8 / leg",
            "Offset load should challenge anti-lateral flexion."
          ),
          thrusterLadder: createThrusterLadder(1),
          optional: createAccessory("Hammer Curl", "3 x 10")
        },
        {
          title: "Day 3 — Deadlift / Wide Grip",
          bigLifts: [
            createBigLift("Deadlift", maxes.deadlift, BIG_LIFT_PATTERNS.week1Ascent),
            createBigLift("Wide Grip Bench", maxes.bench, BIG_LIFT_PATTERNS.week1Ascent)
          ],
          forgeMovement: createAccessory(
            "Landmine Full Contact Twist",
            "3 x 10 / side",
            "Controlled rotation, not sloppy speed."
          ),
          thrusterLadder: createThrusterLadder(1),
          optional: createAccessory("Kettlebell Swings", "3 x 20")
        }
      ]
    },
    {
      name: "Strength",
      focus: "Pyramid week — regular and inverted loading",
      number: 2,
      days: [
        {
          title: "Day 1 — Regular Pyramid",
          bigLifts: [
            createBigLift("Bench Press", maxes.bench, BIG_LIFT_PATTERNS.week2RegularPyramid),
            createBigLift("Snatch Grip Deadlift", maxes.sgdl, BIG_LIFT_PATTERNS.week2RegularPyramid)
          ],
          forgeMovement: createAccessory(
            "Landmine Shoulder-to-Shoulder Press",
            "3 x 8 / side",
            "Move across the body without losing bracing."
          ),
          thrusterLadder: createThrusterLadder(2),
          optional: createAccessory("Meadows Row", "3 x 8 / side")
        },
        {
          title: "Day 2 — Inverted Pyramid",
          bigLifts: [
            createBigLift("Paused Back Squat", maxes.squat, BIG_LIFT_PATTERNS.week2InvertedPyramid, {
              pause: "2 sec pause in the hole"
            }),
            createBigLift("Paused Bench", maxes.bench, BIG_LIFT_PATTERNS.week2InvertedPyramid, {
              pause: "1 sec pause on chest"
            })
          ],
          forgeMovement: createAccessory(
            "Landmine Reverse Suitcase Lunge",
            "3 x 8 / leg",
            "Slow down the eccentric and own the core."
          ),
          thrusterLadder: createThrusterLadder(2),
          optional: createAccessory("Barbell Curl", "4 x 6")
        },
        {
          title: "Day 3 — Regular Pyramid",
          bigLifts: [
            createBigLift("Deadlift", maxes.deadlift, BIG_LIFT_PATTERNS.week2RegularPyramid),
            createBigLift("Close Grip Bench", maxes.bench, BIG_LIFT_PATTERNS.week2RegularPyramid)
          ],
          forgeMovement: createAccessory(
            "Landmine Squat to Rotational Press",
            "3 x 8 / side",
            "Drive from the hips and keep the trunk locked."
          ),
          thrusterLadder: createThrusterLadder(2),
          optional: createAccessory("Kettlebell Swings", "4 x 15")
        }
      ]
    },
    {
      name: "Power",
      focus: "Higher percent, lower reps, ascent and descent waves",
      number: 3,
      days: [
        {
          title: "Day 1 — Power Ascent",
          bigLifts: [
            createBigLift("Bench Press", maxes.bench, BIG_LIFT_PATTERNS.week3PowerAscent),
            createBigLift("Snatch Grip Deadlift", maxes.sgdl, BIG_LIFT_PATTERNS.week3PowerAscent)
          ],
          forgeMovement: createAccessory(
            "Half-Kneeling Landmine Press",
            "3 x 6 / side",
            "Explosive up, controlled down."
          ),
          thrusterLadder: createThrusterLadder(3),
          optional: createAccessory("Meadows Row", "3 x 8 / side")
        },
        {
          title: "Day 2 — Power Wave",
          bigLifts: [
            createBigLift("Back Squat", maxes.squat, BIG_LIFT_PATTERNS.week3PowerWave),
            createBigLift("Tempo Bench", maxes.bench, BIG_LIFT_PATTERNS.week3PowerWave, {
              tempo: "3 sec eccentric"
            })
          ],
          forgeMovement: createAccessory(
            "Landmine Reverse Suitcase Lunge",
            "3 x 6 / leg",
            "Stay stacked and move with intent."
          ),
          thrusterLadder: createThrusterLadder(3),
          optional: createAccessory("Hammer Curl", "3 x 10")
        },
        {
          title: "Day 3 — Power Ascent",
          bigLifts: [
            createBigLift("Deadlift", maxes.deadlift, BIG_LIFT_PATTERNS.week3PowerAscent),
            createBigLift("Wide Grip Bench", maxes.bench, BIG_LIFT_PATTERNS.week3PowerAscent)
          ],
          forgeMovement: createAccessory(
            "Landmine Full Contact Twist",
            "3 x 8 / side",
            "Snap the hips but own the path."
          ),
          thrusterLadder: createThrusterLadder(3),
          optional: createAccessory("Kettlebell Swings", "3 x 15")
        }
      ]
    },
    {
      name: "Deload",
      focus: "Tempo, pause, eccentric control, reduced fatigue",
      number: 4,
      days: [
        {
          title: "Day 1 — Bench Control",
          bigLifts: [
            createBigLift("Bench Press", maxes.bench, BIG_LIFT_PATTERNS.week4BenchTempo, {
              tempo: "3 sec eccentric"
            }),
            createBigLift("Snatch Grip Deadlift", maxes.sgdl, BIG_LIFT_PATTERNS.week4Deload, {
              pause: "2 sec pause below knee"
            })
          ],
          forgeMovement: createAccessory(
            "Half-Kneeling Landmine Press",
            "2 x 10 / side",
            "3 sec eccentric"
          ),
          thrusterLadder: createThrusterLadder(4),
          optional: createAccessory("Skip optional work if fatigue is high", "—")
        },
        {
          title: "Day 2 — Squat Control",
          bigLifts: [
            createBigLift("Pause Back Squat", maxes.squat, BIG_LIFT_PATTERNS.week4Deload, {
              pause: "2 sec pause in the hole"
            }),
            createBigLift("Tempo Bench", maxes.bench, BIG_LIFT_PATTERNS.week4BenchTempoSecondary, {
              tempo: "3 sec eccentric"
            })
          ],
          forgeMovement: createAccessory(
            "Landmine Reverse Suitcase Lunge",
            "2 x 8 / leg",
            "3 sec eccentric"
          ),
          thrusterLadder: createThrusterLadder(4),
          optional: createAccessory("Mobility / walk / recovery", "10–15 min easy")
        },
        {
          title: "Day 3 — Final Boss",
          infinityForge: createInfinityForge(maxes)
        }
      ]
    }
  ];

  return {
    cycleName: "URU Forge Cycle",
    currentWeek: 1,
    weeks
  };
}
