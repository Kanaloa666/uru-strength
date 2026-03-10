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
  return pattern.map((set) => ({
    pct: set.pct,
    reps: set.reps,
    weight: pct(max, set.pct)
  }));
}

const PATTERNS = {
  week1Ascent: [
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
  week4TempoBench: [
    { pct: 0.60, reps: 5 },
    { pct: 0.65, reps: 5 },
    { pct: 0.65, reps: 5 },
    { pct: 0.70, reps: 4 },
    { pct: 0.70, reps: 4 }
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

function createAccessory(name, prescription, notes = "") {
  return {
    name,
    prescription,
    notes
  };
}

function createThrusterLadder(weekNumber) {
  const map = {
    1: {
      name: "Landmine Thruster Ladder",
      reps: [2, 4, 6, 8, 10],
      notes: "Smooth reps. Hard brace. Establish the pattern."
    },
    2: {
      name: "Landmine Thruster Ladder",
      reps: [3, 5, 7, 9],
      notes: "Climb harder. Stay crisp under pressure."
    },
    3: {
      name: "Landmine Thruster Ladder",
      reps: [5, 5, 5, 5, 5],
      notes: "Explosive intent. Drive like a war machine."
    },
    4: {
      name: "Landmine Thruster Ladder",
      reps: [3, 3, 3, 3, 3],
      notes: "Control the movement. Save the violence for the boss fight."
    }
  };

  return map[weekNumber];
}

function createInfinityForge(maxes) {
  return {
    title: "Infinity Forge",
    subtitle: "Final Boss — max out, record the numbers, reforge the cycle.",
    flavor: "The forge does not ask what you were. It reveals what remains.",
    bigLifts: [
      {
        lift: "Bench Press",
        basedOnMax: maxes.bench,
        notes: "Work up to a true top set. This becomes your new bench number.",
        warmups: buildWarmups(maxes.bench, "Bench Press"),
        sets: [
          { pct: 0.65, reps: 5, weight: pct(maxes.bench, 0.65) },
          { pct: 0.75, reps: 3, weight: pct(maxes.bench, 0.75) },
          { pct: 0.85, reps: 2, weight: pct(maxes.bench, 0.85) },
          { pct: 0.90, reps: 1, weight: pct(maxes.bench, 0.90) },
          { pct: 1.00, reps: 1, weight: "MAX OUT" }
        ]
      },
      {
        lift: "Snatch Grip Deadlift",
        basedOnMax: maxes.sgdl,
        notes: "Work up to a true top set. This becomes your new SGDL and deadlift number.",
        warmups: buildWarmups(maxes.sgdl, "Snatch Grip Deadlift"),
        sets: [
          { pct: 0.65, reps: 5, weight: pct(maxes.sgdl, 0.65) },
          { pct: 0.75, reps: 3, weight: pct(maxes.sgdl, 0.75) },
          { pct: 0.85, reps: 2, weight: pct(maxes.sgdl, 0.85) },
          { pct: 0.90, reps: 1, weight: pct(maxes.sgdl, 0.90) },
          { pct: 1.00, reps: 1, weight: "MAX OUT" }
        ]
      }
    ],
    forgeMovement: createAccessory(
      "Landmine Thruster Ladder",
      "2 / 4 / 6 / 8 / 10 / 12",
      "Score the load and total completion time."
    ),
    titanCircuit: [
      createAccessory("Meadows Row", "3 x 10 / side"),
      createAccessory("Kettlebell Swings", "3 x 20"),
      createAccessory("Landmine Full Contact Twist", "3 x 12 / side")
    ]
  };
}

function generateProgram(maxes) {
  return {
    cycleName: "URU Forge Cycle",
    currentWeek: 1,
    weeks: [
      {
        number: 1,
        name: "Uru Awakening",
        focus: "Build the frame. Own the pattern. Start the forging.",
        days: [
          {
            title: "Directive: Uru Awakens",
            flavor: "The metal remembers the first strike.",
            bigLifts: [
              createBigLift("Bench Press", maxes.bench, PATTERNS.week1Ascent),
              createBigLift("Snatch Grip Deadlift", maxes.sgdl, PATTERNS.week1Ascent)
            ],
            forgeMovement: createAccessory(
              "Half-Kneeling Landmine Press",
              "3 x 8 / side",
              "Aggressive brace. Do not leak through the torso."
            ),
            thrusterLadder: createThrusterLadder(1),
            optional: createAccessory("Meadows Row", "3 x 10 / side")
          },
          {
            title: "Directive: Warpath Ignition",
            flavor: "A frame is not built gently.",
            bigLifts: [
              createBigLift("Back Squat", maxes.squat, PATTERNS.week1Ascent),
              createBigLift("Close Grip Bench", maxes.bench, PATTERNS.week1Ascent)
            ],
            forgeMovement: createAccessory(
              "Landmine Reverse Suitcase Lunge",
              "3 x 8 / leg",
              "Offset load should challenge the core hard."
            ),
            thrusterLadder: createThrusterLadder(1),
            optional: createAccessory("Hammer Curl", "3 x 10")
          },
          {
            title: "Directive: Chromium Drive",
            flavor: "Engineered pressure. Reinforced intent.",
            bigLifts: [
              createBigLift("Deadlift", maxes.deadlift, PATTERNS.week1Ascent),
              createBigLift("Wide Grip Bench", maxes.bench, PATTERNS.week1Ascent)
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
        number: 2,
        name: "Mad Titan Ascent",
        focus: "Climb heavier. Sharpen the weapon through pyramids.",
        days: [
          {
            title: "Directive: Mad Titan Protocol",
            flavor: "Pressure reveals what survives the climb.",
            bigLifts: [
              createBigLift("Bench Press", maxes.bench, PATTERNS.week2Regular),
              createBigLift("Snatch Grip Deadlift", maxes.sgdl, PATTERNS.week2Regular)
            ],
            forgeMovement: createAccessory(
              "Landmine Shoulder-to-Shoulder Press",
              "3 x 8 / side",
              "Move across the body without losing position."
            ),
            thrusterLadder: createThrusterLadder(2),
            optional: createAccessory("Meadows Row", "3 x 8 / side")
          },
          {
            title: "Directive: Gravity Breaker",
            flavor: "Weight bends. You do not.",
            bigLifts: [
              createBigLift("Paused Back Squat", maxes.squat, PATTERNS.week2Inverted, "2 sec pause in the hole"),
              createBigLift("Paused Bench", maxes.bench, PATTERNS.week2Inverted, "1 sec pause on chest")
            ],
            forgeMovement: createAccessory(
              "Landmine Reverse Suitcase Lunge",
              "3 x 8 / leg",
              "Stay stacked and own the eccentric."
            ),
            thrusterLadder: createThrusterLadder(2),
            optional: createAccessory("Barbell Curl", "4 x 6")
          },
          {
            title: "Directive: War Engine",
            flavor: "March is over. Now the machine starts moving.",
            bigLifts: [
              createBigLift("Deadlift", maxes.deadlift, PATTERNS.week2Regular),
              createBigLift("Close Grip Bench", maxes.bench, PATTERNS.week2Regular)
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
        number: 3,
        name: "Doom Engine",
        focus: "High force. Low hesitation. Violent intent with controlled power.",
        days: [
          {
            title: "Directive: Doom Engine Prime",
            flavor: "The hammer strikes harder with every cycle.",
            bigLifts: [
              createBigLift("Bench Press", maxes.bench, PATTERNS.week3PowerAscent),
              createBigLift("Snatch Grip Deadlift", maxes.sgdl, PATTERNS.week3PowerAscent)
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
            title: "Directive: Titan Breaker",
            flavor: "Break the weight before it breaks you.",
            bigLifts: [
              createBigLift("Back Squat", maxes.squat, PATTERNS.week3PowerWave),
              createBigLift("Tempo Bench", maxes.bench, PATTERNS.week3PowerWave, "3 sec eccentric")
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
            title: "Directive: Infinity Pressure",
            flavor: "Strength bends reality when the brace holds.",
            bigLifts: [
              createBigLift("Deadlift", maxes.deadlift, PATTERNS.week3PowerAscent),
              createBigLift("Wide Grip Bench", maxes.bench, PATTERNS.week3PowerAscent)
            ],
            forgeMovement: createAccessory(
              "Landmine Full Contact Twist",
              "3 x 8 / side",
              "Snap the hips, control the finish."
            ),
            thrusterLadder: createThrusterLadder(3),
            optional: createAccessory("Kettlebell Swings", "3 x 15")
          }
        ]
      },
      {
        number: 4,
        name: "Reforging Phase",
        focus: "Reduce fatigue. Refine mechanics. Prepare for the final forging.",
        days: [
          {
            title: "Directive: Controlled Reforging",
            flavor: "Precision before destruction.",
            bigLifts: [
              createBigLift("Bench Press", maxes.bench, PATTERNS.week4TempoBench, "3 sec eccentric"),
              createBigLift("Snatch Grip Deadlift", maxes.sgdl, PATTERNS.week4Deload, "2 sec pause below knee")
            ],
            forgeMovement: createAccessory(
              "Half-Kneeling Landmine Press",
              "2 x 10 / side",
              "3 sec eccentric"
            ),
            thrusterLadder: createThrusterLadder(4),
            optional: createAccessory("Recovery priority", "Skip extra work if fatigue is high")
          },
          {
            title: "Directive: Tempered Iron",
            flavor: "The blade cools before it cuts again.",
            bigLifts: [
              createBigLift("Pause Back Squat", maxes.squat, PATTERNS.week4Deload, "2 sec pause in the hole"),
              createBigLift("Tempo Bench", maxes.bench, PATTERNS.week4TempoBench, "3 sec eccentric")
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
            title: "Directive: Infinity Forge",
            infinityForge: createInfinityForge(maxes)
          }
        ]
      }
    ]
  };
}
